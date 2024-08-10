"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../graphql/mutations/Auth";
import { useRouter } from "next/navigation";
import { Input, Button, message } from "antd";
import { LoginInput } from "../../graphql/types";

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
  const handleForgotPassword = () => {
    router.push("/forgotpassword");
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "1rem" }}>
      <h2>Login</h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <Button
        type="primary"
        loading={loading}
        onClick={handleLogin}
        style={{ width: "100%" }}
      >
        Login
      </Button>

      <Button
        type="primary"
        loading={loading}
        onClick={handleForgotPassword}
        style={{ width: "100%" }}
      >
        ForgotPassword
      </Button>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};

export default Login;
