"use client";
import { useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_PORT } from "@/src/graphql/mutations/Auth";
import {GET_PORTS} from "@/src/graphql/queries/query";
import styles from "@/src/styles/Auth.module.css";

const CreatePortModal = () => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [createPort, { loading, error }] = useMutation(CREATE_PORT, {
    refetchQueries: [{ query: GET_PORTS }],
  });
  const [form] = Form.useForm();

  const handleCreatePort = async (values: any) => {
    if (!id || !name|| !country) {
        message.error("Please fill out all fields.");
        return;
    }
    try {
      await createPort({
        variables: {
          createPortInput: {
            id,
            name,
            country,
          },
        },
      });
      form.resetFields();
      setVisible(false);
      message.success("Port created successfully!");
    } catch (err) {
      console.error("Error creating port:", err);
      message.error("Failed to create port");
    }
  };

  return (
    <>
      <Button className={styles.mainButton} onClick={() => setVisible(true)}>
        Add Port
      </Button>
      <Modal
        title="Create New Port"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreatePort}
          layout="vertical"
          className={styles.mainBox}
        >
            <Form.Item
            label="ID"
            name="ID"
            rules={[{ required: true, message: "Please enter port ID!" }]}
          >
            <Input 
            value = {id}
            onChange = {(e)=>setId(e.target.value)}
            placeholder="Enter Port ID" />
          </Form.Item>
          <Form.Item
            label="Port Name"
            name="name"
            rules={[{ required: true, message: "Please enter port name!" }]}
          >
            <Input 
            value = {name}
            onChange = {(e)=>setName(e.target.value)}
            placeholder="Enter Port Name" />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please enter Country!" }]}
          >
            <Input 
            value = {country}
            onChange = {(e)=>setCountry(e.target.value)}
            placeholder="Enter Country" />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>

          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form>
      </Modal>
    </>
  );
};

export default CreatePortModal;
