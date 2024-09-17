"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../../../graphql/mutations/Auth";
import { Input, Button, message, Row, Col, Form } from "antd";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Auth.module.css";

const ResetPassword = () => {
  const [forgotPasswordToken, setForgotPasswordToken] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("verify");
    if (token) {
      setForgotPasswordToken(token);
    }
  }, []);

  const handleResetPassword = async () => {
    try {
      const { data } = await resetPassword({
        variables: {
          resetPasswordDto: {
            password,
            forgotPasswordToken,
          },
        },
      });
      if (data?.resetPassword) {
        message.success("Reset password succeed!.");
        router.push("/login");
      }
    } catch (err: any) {
      message.error(`Reset password failed: ${err?.graphQLErrors[0]?.message}`);
      router.push("/login");
    }
  };

  return (
    <Row className={styles.container}>
      <Col className={styles.spBox} style={{ height: "330px" }}>
        <Form>
          <h2 className={styles.title} style={{ paddingTop: "3rem" }}>
            Choose a new password
          </h2>
          <p className={styles.subTitle}>
            A strong password is combination of letters, number, and punctuation
            marks
          </p>
          <Form.Item
            name="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              style={{ width: "90%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              onClick={handleResetPassword}
              className={styles.mainButton}
            >
              Submit & Continue
            </Button>
          </Form.Item>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form>
      </Col>
    </Row>
  );
};

export default ResetPassword;
