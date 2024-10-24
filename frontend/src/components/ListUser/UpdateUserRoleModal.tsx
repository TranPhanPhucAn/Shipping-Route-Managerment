"use client";
import { useState, useEffect } from "react";
import { Button, Form, Modal, message, Select, DatePicker } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import {
  ASSIGN_ROLE_FOR_USER,
  UPDATE_SCHEDULE,
} from "../../graphql/mutations/Auth";
import { QUERY_ROLES } from "@/src/graphql/queries/query";
import { User } from "@/src/graphql/types";
import styles from "@/src/styles/Modal.module.css";

const { Option } = Select;

interface UpdateUserRoleModalProps {
  user: User;
  visible: boolean;
  onClose: () => void;
}

const UpdateUserRoleModal = ({
  user,
  visible,
  onClose,
}: UpdateUserRoleModalProps) => {
  const [form] = Form.useForm();
  const [role, setRole] = useState("");
  const [assignRoleForUser, { loading, error }] =
    useMutation(ASSIGN_ROLE_FOR_USER);
  const {
    loading: loadingRole,
    error: errorRole,
    data,
    refetch,
  } = useQuery(QUERY_ROLES);
  const roles = data ? data.roles : [];
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        role: user.role.id,
      });
      setRole(user.role.id);
    }
  }, [user, form]);

  const handleUpdateRoleUser = async (values: { role: string }) => {
    try {
      await assignRoleForUser({
        variables: {
          assignRoleDto: {
            userId: user.id,
            roleId: values.role,
          },
        },
      });
      message.success("Schedule updated successfully");
      onClose();
    } catch (error) {
      message.error("Failed to update schedule");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Update Role User"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleUpdateRoleUser} layout="vertical" className={styles.modal}>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select
            value={role}
            onChange={(value) => setRole(value)}
            placeholder="Select Role"
          >
            {roles &&
              roles.length > 0 &&
              roles.map((item: any, index: any) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className={styles.submitButton} htmlType="submit" loading={loading}>
            Update
          </Button>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserRoleModal;
