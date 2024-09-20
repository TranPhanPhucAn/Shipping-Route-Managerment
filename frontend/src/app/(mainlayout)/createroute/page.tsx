"use client";
import { useMutation } from "@apollo/client";
import { CREATE_ROUTE } from "../../../graphql/mutations/Auth";
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import styles from "../../../styles/Auth.module.css";

const CreateRoute = () => {
  const [departurePortId, setDeparturePortId] = useState("");
  const [destinationPortId, setDestinationPortId] = useState("");
  const [distance, setDistance] = useState(null); // Initialize as null
  const [createRoute, { loading, error }] = useMutation(CREATE_ROUTE);
  const [form] = Form.useForm();
  const parsedDistance = Number(distance);

  const handleCreateRoute = async () => {
    try {
      const { data } = await createRoute({
        variables: {
          createRouteInput: {
            departurePortId,
            destinationPortId,
            distance: parsedDistance,
          },
        },
      });
      form.resetFields();
      alert("Route created successfully");
    } catch (error) {
      console.error("Error creating route:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        onFinish={handleCreateRoute}
        layout="vertical"
        className={styles.mainBox}
      >
        <h2 className={styles.title}>Create Route</h2>
        <Form.Item
          className={styles.input}
          label="Departure Port:"
          name="departurePortId"
          rules={[{ required: true, message: "Please enter Port name!" }]}
        >
          <Input
            value={departurePortId}
            onChange={(e) => setDeparturePortId(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Destination Port:"
          name="destinationPortId"
          rules={[{ required: true, message: "Please enter Port name!" }]}
        >
          <Input
            className={styles.input}
            value={destinationPortId}
            onChange={(e) => setDestinationPortId(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Distance"
          name="distance"
          rules={[{ required: true, message: "Please enter distance!" }]}
        >
          <Input
            className={styles.input}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </Form>
    </div>
  );
};
export default CreateRoute;
