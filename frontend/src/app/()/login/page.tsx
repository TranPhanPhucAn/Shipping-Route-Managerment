"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../../graphql/mutations/Auth";
import { useRouter } from "next/navigation";
import { Input, Button, message, Divider, Row, Col } from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import { LoginInput } from "../../../graphql/types";
import styles from "../../../styles/Login.module.css";
import LoginImage from "./login.png";
import Image from "next/image";
import Link from "next/link";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data } = await loginUser({
        variables: {
          loginInput: {
            email,
            password,
          } as LoginInput,
        },
      });
      if (data?.login) {
        message.success("Login successful!");
        router.push("/");
      }
    } catch (err) {
      message.error(`Login failed: ${error?.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <Row gutter={[48, 16]}>
        <Col>
          <div className={styles.loginBox}>
            <h2 className={styles.title}>Welcome Back!</h2>
            <p className={styles.subtitle}>We Are Happy To Have You Back</p>
            <Input
              className={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            {/* <div> */}
            {/* <Checkbox
            onChange={(e) => e.target.checked}
            className={styles.checkbox}
          >
            Remember me!
          </Checkbox> */}
            <Link href={"/resetpassword"} className={styles.forgotLink}>
              Forgot Password!
            </Link>
            {/* </div> */}
            <Button
              loading={loading}
              className={styles.loginButton}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Divider style={{ borderColor: "#334155" }}>Or</Divider>
            <div className={styles.socialLogin}>
              <Button
                icon={<GoogleOutlined />}
                className={styles.socialButton}
              />
              <Button
                icon={<FacebookOutlined />}
                className={styles.socialButton}
              />
            </div>
          </div>
        </Col>
        <Col>
          <div className={styles.registerBox}>
            <Image
              src={LoginImage}
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
                marginBottom: "0.7rem",
              }}
            >
              Get Started By Creating Your Account
            </a>
            <Button
              className={styles.registerButton}
              onClick={() => router.push("/register")}
            >
              Register
            </Button>
            {error && <p className={styles.error}>{error.message}</p>}
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Login;
