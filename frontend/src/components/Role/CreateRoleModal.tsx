"use client";
import { useState } from "react";
import { Button, Form, Modal, message, Select, Input } from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_ROLE } from "../../graphql/mutations/Auth";

import styles from "../../styles/Auth.module.css";

const { Option } = Select;

const CreateRoleModal = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createRole, { loading, error }] = useMutation(CREATE_ROLE);
  const [form] = Form.useForm();
  const handleCreateRole = async () => {
    if (!name || !description) {
      message.error("Please fill out all fields.");
      return;
    }

    try {
      await createRole({
        variables: {
          createRoleInput: {
            name: name,
            description: description,
          },
        },
      });
      props.refetchRoles();
      form.resetFields();
      setVisible(false);
      message.success("Schedule created successfully");
    } catch (error) {
      console.error("Error creating schedule:", error);
      message.error("Failed to create schedule");
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Add Role
      </Button>
      <Modal
        title="Create New Role"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateRole}
          layout="vertical"
          // className={styles.mainBox}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input role name!",
              },
            ]}
          >
            <Input
              // prefix={<UserOutlined />}
              // className={styles.input}
              placeholder="Role name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please input role description!",
              },
            ]}
          >
            <Input
              // prefix={<UserOutlined />}
              // className={styles.input}
              placeholder="Role description"
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form>
      </Modal>
    </>
  );
};

export default CreateRoleModal;
