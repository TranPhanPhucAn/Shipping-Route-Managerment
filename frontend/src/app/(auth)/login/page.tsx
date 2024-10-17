"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/src/graphql/mutations/Auth";
import { useRouter } from "next/navigation";
import { Input, Button, message, Divider, Row, Col, Form } from "antd";
import { FcGoogle } from "react-icons/fc";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginInput } from "@/src/graphql/types";
import styles from "@/src/styles/Auth.module.css";
import RegisterImage from "./Register.png";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import type { SignInResponse } from "next-auth/react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
  const router = useRouter();
  const handleLogin = async () => {
    try {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email) || !password) {
        if (!re.test(email)) message.error("Email is not valid!");
        else {
          message.error("Password is required");
        }
        return;
      }
      const res = (await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      })) as SignInResponse;

      console.log("response credentials: ", res);
      // const response = await loginUser({
      //   variables: {
      //     loginInput: {
      //       email,
      //       password,
      //     } as LoginInput,
      //   },
      // });
      // const { data } = response;
      // if (data?.login) {
      //   message.success("Login successful!");
      //   router.push("/");
      // }
      // console.log("alo: ", res?.status);

      if (res?.status === 200) {
        message.success("Login successful!");
        router.push("/");
      } else {
        // console.log("alo: ", res);
        message.error(`Login failed: ${res?.error}`);
      }
    } catch (err: any) {
      console.log("error client: ", err);
      // message.error(`Login failed: ${err?.graphQLErrors[0]?.message}`);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err: any) {
      console.log("error client: ", err);
      // message.error(`Login failed: ${err?.graphQLErrors[0]?.message}`);
    }
  };
  return (
    <Row className={styles.container}>
      <Col>
        <Form
          name="login"
          initialValues={{
            remember: true,
          }}
        >
          <div className={styles.mainBox}>
            <h2 className={styles.title}>Welcome Back!</h2>
            <p className={styles.subtitle}>We Are Happy To Have You Back</p>
            <Form.Item
              name="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Email is not a valid email!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
            </Form.Item>
            <Form.Item className={styles.forgotPS}>
              <Link href={"/forgot-password"} className={styles.forgotLink}>
                Forgot Password!
              </Link>
            </Form.Item>
            <Form.Item>
              <div className={styles.socialLogin}>
                <Button
                  loading={loading}
                  className={styles.mainButton}
                  style={{ width: "42%", padding: "0.6rem !important" }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </div>
            </Form.Item>
            <Divider style={{ borderColor: "#334155" }}>Or</Divider>
            <Form.Item>
              <Button
                icon={<FcGoogle />}
                className={styles.socialButton}
                onClick={handleLoginGoogle}
              >
                Login with Google
              </Button>
            </Form.Item>
            {error && <p className={styles.error}>{error.message}</p>}
          </div>
        </Form>
      </Col>
      <Col style={{ height: "400px" }}>
        <div className={styles.spBox}>
          <Image
            src={RegisterImage}
            alt="Illustration"
            className={styles.illustration}
          />
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              margin: "0 auto",
            }}
          >
            Don't Have An Account?
          </p>
          <a
            style={{
              color: "gray",
              fontSize: "0.8rem",
              marginBottom: "1rem",
            }}
            className={styles.subtitle}
          >
            Get Started By Creating Your Account
          </a>
          <Button
            className={styles.spButton}
            onClick={() => router.push("/register")}
            style={{ marginTop: "1rem" }}
          >
            Register
          </Button>
        </div>
      </Col>
    </Row>
  );
};
export default Login;
