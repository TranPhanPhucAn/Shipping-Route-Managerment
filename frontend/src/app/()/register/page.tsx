"use client";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../../graphql/mutations/Auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, message } from "antd";
import styles from "../../../styles/Login.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
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
    } catch (err) {
      message.error(`Registration failed: ${error?.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.Box}>
        <h2 className={styles.title}>Welcome to Ocean Transport</h2>
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
        <Button
          className={styles.button}
          type="primary"
          loading={loading}
          onClick={handleRegister}
          style={{ width: "100%" }}
        >
          Register
        </Button>
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </div>
    </div>
  );
};

export default Register;
