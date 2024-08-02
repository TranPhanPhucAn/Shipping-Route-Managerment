"use client";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../graphql/mutations/Auth";

const Register = () => {
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);

  const handleRegister = async () => {
    try {
      const response = await registerUser({
        variables: {
          createUserInput: {
            email: "hothithuhoa2001@gmail.com",
            username: "Hoa",
            password: "securepassword",
            address: "123 Main St",
          },
        },
      });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <button onClick={handleRegister}>Register</button>
      {data && <p>{data.createUser.activation_token}</p>}
    </div>
  );
};

export default Register;
