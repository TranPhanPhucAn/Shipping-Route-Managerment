"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ACTIVATE_ACCOUNT } from "../../../graphql/mutations/Auth";
import { Input, Button, message } from "antd";
import { useRouter } from "next/navigation";

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
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "1rem" }}>
      <h2>Activate Account</h2>
      <Input
        placeholder="Activation Code"
        value={activationCode}
        onChange={(e) => setActivationCode(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <Button
        type="primary"
        loading={loading}
        onClick={handleActivation}
        style={{ width: "100%" }}
      >
        Activate
      </Button>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};

export default Activate;
