"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ACTIVATE_ACCOUNT } from "../../graphql/mutations/Auth";
import { Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { ActivationDto } from "@/src/graphql/types";

const Activate = () => {
  const [activationCode, setActivationCode] = useState("");
  const [activateUser, { loading, error }] = useMutation(ACTIVATE_ACCOUNT);
  const router = useRouter();

  const handleActivation = async () => {
    try {
      const { data } = await activateUser({
        variables: {
          ActivationDto: {
            activationCode,
          },
        },
      });
      if (data?.createUser?.activation_token) {
        message.success("Registration successful!.");
        router.push("/login");
      } else if (data?.createUser?.error) {
        message.error(`Registration failed: ${data.createUser.error.message}`);
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
