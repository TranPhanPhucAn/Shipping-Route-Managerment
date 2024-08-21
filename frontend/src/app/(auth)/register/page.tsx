"use client";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../../graphql/mutations/Auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, message, Row, Col, Checkbox, Divider } from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
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
      } else if (data?.createUser?.error) {
        message.error(`Registration failed: ${data.createUser.error.message}`);
      }
    } catch (err: any) {
      message.error(`Login failed: ${err?.graphQLErrors[0]?.message}`);
    }
    if (!agreeToTerms) {
      message.error("You must agree to the terms and conditions.");
      return;
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
              fontSize: "1rem",
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
        <div className={styles.mainBox}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>
            Get started by creating your new account
          </p>
          <Input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <Input
            className={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <Input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <Input
            className={styles.input}
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <Checkbox
            className={styles.checkbox}
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
          >
            By clicking, you agree to the CLT's Terms and Conditions
          </Checkbox>
          <Button
            className={styles.mainButton}
            loading={loading}
            onClick={handleRegister}
          >
            Register
          </Button>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
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
      </Col>
    </Row>
  );
};

export default Register;
