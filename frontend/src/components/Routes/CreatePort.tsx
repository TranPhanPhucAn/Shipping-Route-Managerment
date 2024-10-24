"use client";
import { useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_PORT } from "@/src/graphql/mutations/Auth";
import { GET_PORTS } from "@/src/graphql/queries/query";
import styles from "@/src/styles/Modal.module.css";

interface CreatePortModalProps {
  limit: number;
  offset: number;
  sort: string;
  search: string;
  refetchPorts: (variables: {
    paginationPort: {
      limit: number;
      offset: number;
      sort: string;
      search: string;
    };
  }) => void;
}
const CreatePortModal = ({
  limit,
  offset,
  sort,
  search,
  refetchPorts,
}: CreatePortModalProps) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [createPort, { loading, error }] = useMutation(CREATE_PORT, {
    refetchQueries: [{ query: GET_PORTS }],
  });
  const [form] = Form.useForm();

  const handleCreatePort = async (values: any) => {
    if (!name || !country) {
      message.error("Please fill out all fields.");
      return;
    }
    try {
      await createPort({
        variables: {
          createPortInput: {
            name,
            country,
          },
        },
      });
      await refetchPorts({
        paginationPort: {
          limit: limit,
          offset: offset,
          sort: sort,
          search: search,
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
      <Button className={styles.submitButton} onClick={() => setVisible(true)}>
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
          className={styles.modal}
        >
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please enter Country!" }]}
          >
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter Country"
              className={styles.input}
            />
          </Form.Item>
          <Form.Item
            label="City Name"
            name="name"
            rules={[{ required: true, message: "Please enter port name!" }]}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Port Name"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              className={styles.submitButton}
              loading={loading}
            >
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
