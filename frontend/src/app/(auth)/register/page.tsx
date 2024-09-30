"use client";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../../graphql/mutations/Auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiHomeOutline } from "react-icons/ti";
import {
  Input,
  Button,
  message,
  Row,
  Col,
  Checkbox,
  Divider,
  Form,
} from "antd";
import {
  GoogleOutlined,
  FacebookOutlined,
  LockOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import styles from "../../../styles/Auth.module.css";
import LoginImage from "./Login.png";
import Image from "next/image";
const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email) || !password || !username) {
        if (!re.test(email)) message.error("Email is not valid!");
        else if (!password) {
          message.error("Password is required");
        } else {
          message.error("Username is required");
        }
        return;
      }
      if (!agreeToTerms) {
        message.error("You must agree to the terms and conditions.");
        return;
      }
      const { data } = await registerUser({
        variables: {
          createUserInput: {
            email,
            username,
            password,
            address,
          },
        },
      });
      const activationToken = data?.createUser?.activation_token;
      if (activationToken) {
        message.success(
          "Registration successful! Please check your email for the activation code."
        );
        router.push(`/activation?token=${activationToken}`);
      }
    } catch (err: any) {
      message.error(`Login failed: ${err?.graphQLErrors[0]?.message}`);
    }
  };

  return (
      <Row className={styles.container}>
        <Col>
          <div className={styles.spBox} style={{ height: "550px" }}>
            <Image
              src={LoginImage}
              alt="Illustration"
              className={styles.illustration}
              style={{ width: "250px", height: "300px" }}
            />
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1.3rem",
                marginBottom: "1rem",
              }}
            >
              Already Having An Account?
            </p>
            <a
              style={{
                color: "gray",
                fontSize: "0.9rem",
                marginBottom: "1.2rem",
              }}
            >
              We Are Happy To Have You Back
            </a>
            <Button
              className={styles.spButton}
              style={{ marginTop: "1rem", fontWeight: "bold" }}
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        </Col>
        <Col>
          <Form name="register">
            <div className={styles.mainBox}>
              <h2 className={styles.title}>Create Account</h2>
              <p className={styles.subtitle}>
                Get started by creating your new account
              </p>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input
                  prefix={<GoogleOutlined />}
                  className={styles.input}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  className={styles.input}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your Address",
                  },
                ]}
              >
                <Input
                  prefix={<HomeOutlined />}
                  className={styles.input}
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  className={styles.input}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Should accept agreement")),
                  },
                ]}
              >
                <Checkbox onChange={() => setAgreeToTerms(!agreeToTerms)}>
                  {" "}
                  By clicking, you agree to the{" "}
                  <a href="">CLT's Terms and Conditions</a>
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  className={styles.mainButton}
                  style={{width: "100%"}}
                  loading={loading}
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </Form.Item>
              {error && <p style={{ color: "red" }}>{error.message}</p>}
              {/* <Divider style={{ borderColor: "#334155" }}>Or</Divider>
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
            </Row> */}
            </div>
          </Form>
        </Col>
      </Row>
  );
};

export default Register;
