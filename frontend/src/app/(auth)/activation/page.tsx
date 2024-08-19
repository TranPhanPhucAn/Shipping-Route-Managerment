"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ACTIVATE_ACCOUNT } from "../../../graphql/mutations/Auth";
import { Input, Button, message, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Auth.module.css";
import VacationCodeImage from "./activateCode.jpg";
import Image from "next/image";

const Activate = () => {
  const [activationToken, setActivationToken] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [activateUser, { loading, error }] = useMutation(ACTIVATE_ACCOUNT);
  const router = useRouter();

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
    } catch (err) {
      message.error(`Registration failed: ${error?.message}`);
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
        <h2 className={styles.title} style={{ paddingTop: "3rem" }}>
          Activation Code
        </h2>
        <p className={styles.subTitle}>
          We have sent the activation code to your email.
        </p>
        <Input
          placeholder="Activation Code"
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          className={styles.input}
          style={{ width: "90%" }}
        />
        <Button
          type="primary"
          loading={loading}
          onClick={handleActivation}
          className={styles.mainButton}
        >
          Submit&Continue
        </Button>
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </Col>
    </Row>
  );
};

export default Activate;
