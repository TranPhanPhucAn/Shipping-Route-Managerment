"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ACTIVATE_ACCOUNT } from "../../../graphql/mutations/Auth";
import { Input, Button, message, Row, Col, Form, Typography } from "antd";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Auth.module.css";
import VacationCodeImage from "./activateCode.jpg";
import Image from "next/image";

const Activate = () => {
  const [activationToken, setActivationToken] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [activateUser, { loading, error }] = useMutation(ACTIVATE_ACCOUNT);
  const router = useRouter();
  const { Title } = Typography;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setActivationToken(token);
    }
  }, []);

  const handleActivation = async () => {
    try {
      const { data } = await activateUser({
        variables: {
          activationDto: {
            activationToken,
            activationCode,
          },
        },
      });
      if (data?.activateUser) {
        message.success("Activate successful!.");
        router.push("/login");
      }
    } catch (err: any) {
      message.error(`Activation failed: ${err?.graphQLErrors[0]?.message}`);
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
      <Col className={styles.spBox} style={{ height: "300px" }}>
        <Form>
          <h2 className={styles.title} style={{ paddingTop: "3rem" }}>
            Activation Code
          </h2>
          <p className={styles.subTitle}>
            We have sent the activation code to your email.
          </p>
          <Form.Item
            name="Activation Code"
            rules={[
              {
                required: true,
                message: "Please input your Activation Code you got!",
              },
            ]}
          >
            {/* <Input
              placeholder="Activation Code"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              className={styles.input}
              style={{ width: "90%" }}
            /> */}
            <Input.OTP
              value={activationCode}
              onChange={(value) => setActivationCode(value)}
              className={styles.input}
              style={{ width: "75%" }}
              length={4}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              onClick={handleActivation}
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

export default Activate;
