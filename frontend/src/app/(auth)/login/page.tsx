"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../../graphql/mutations/Auth";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  message,
  Divider,
  Row,
  Col,
  Form,
  Checkbox,
  Flex,
} from "antd";
import {
  GoogleOutlined,
  FacebookOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { LoginInput } from "../../../graphql/types";
import styles from "../../../styles/Auth.module.css";
import RegisterImage from "./Register.png";
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
                  message: "Please input your Email!",
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
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link href={"/resetpassword"} className={styles.forgotLink}>
                  Forgot Password!
                </Link>
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button
                loading={loading}
                className={styles.mainButton}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Form.Item>
            {error && <p className={styles.error}>{error.message}</p>}
            <Divider style={{ borderColor: "#334155" }}>Or</Divider>
            <Row className={styles.socialLogin}>
              <Col>
                <Button
                  icon={<GoogleOutlined />}
                  className={styles.socialButton}
                />
              </Col>
              <Col>
                <Button
                  icon={<FacebookOutlined />}
                  className={styles.socialButton}
                />
              </Col>
            </Row>
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
