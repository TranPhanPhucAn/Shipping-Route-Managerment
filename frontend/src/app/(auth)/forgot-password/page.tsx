"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "../../../graphql/mutations/Auth";
import { Input, Button, message, Row, Col, Form } from "antd";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Auth.module.css";
import VacationCodeImage from "./activateCode.jpg";
import Image from "next/image";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD);
  const router = useRouter();
  const handleForgotPass = async () => {
    try {
      const { data } = await forgotPassword({
        variables: {
          forgotPasswordDto: { email },
        },
      });
      if (data?.forgotPassword) {
        message.success("Reset password link was sent to your email!.");
        router.push("/login");
      }
    } catch (err: any) {
      message.error(`Reset password failed: ${err?.graphQLErrors[0]?.message}`);
    }
  };

  return (
    <Row className={styles.container}>
      <Col className={styles.mainBox}>
        <Image
          src={VacationCodeImage}
          alt="Illustration"
          className={styles.illustration}
          style={{ width: "400px", height: "300px" }}
        />
      </Col>
      <Col className={styles.spBox} style={{ height: "330px" }}>
        <Form>
          <h2 className={styles.title} style={{ paddingTop: "3rem" }}>
            Find Your Account
          </h2>
          <p className={styles.subTitle}>Enter your email address</p>
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              style={{ width: "90%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              onClick={handleForgotPass}
              className={styles.mainButton}
            >
              Submit & Continue
            </Button>
          </Form.Item>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form>
        <div>
          Go back to <Link href={"/login"}>Login</Link>
        </div>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
