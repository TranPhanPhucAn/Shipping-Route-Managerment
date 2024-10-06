"use client";
import { useEffect, useState } from "react";
import { Button, Form, Modal, message, Select, Input } from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_ROLE } from "../../graphql/mutations/Auth";
import { Role } from "@/src/graphql/types";

interface UpdateRoleModalProps {
  role: Role;
  refetchRole: () => void;
}
const UpdateRoleModal = ({ role, refetchRole }: UpdateRoleModalProps) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [updateRole, { loading, error }] = useMutation(UPDATE_ROLE);
  const [form] = Form.useForm();
  const handleUpdateRole = async () => {
    if (!name || !description) {
      message.error("Please fill out all fields.");
      return;
    }

    try {
      await updateRole({
        variables: {
          updateRoleInput: {
            id: role.id,
            name: name,
            description: description,
          },
        },
      });
      refetchRole();
      form.resetFields();
      setVisible(false);
      message.success("Role update successfully");
    } catch (error) {
      console.error("Error update role:", error);
      message.error("Failed to update role");
    }
  };
  useEffect(() => {
    if (role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
      });
      setName(role.name);
      setDescription(role.description);
    }
  }, [role, form]);
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Edit Role
      </Button>
      <Modal
        title="Update Role"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateRole} layout="vertical">
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

export default UpdateRoleModal;
