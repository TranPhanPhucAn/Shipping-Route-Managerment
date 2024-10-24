"use client";
import { useState, useEffect } from "react";
import { Button, Form, Modal, message, Select, DatePicker, Input } from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_PERMISSION } from "../../graphql/mutations/Auth";
import { QUERY_PERMISSIONS } from "@/src/graphql/queries/query";
import { Permission } from "@/src/graphql/types";
import styles from "@/src/styles/Modal.module.css";


interface UpdateSPermissionModalProps {
  permission: Permission;
  visible: boolean;
  onClose: () => void;
}

const UpdatePermissionModal = ({
  permission,
  visible,
  onClose,
}: UpdateSPermissionModalProps) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [updatePermission, { loading, error }] = useMutation(
    UPDATE_PERMISSION,
    {
      refetchQueries: [{ query: QUERY_PERMISSIONS }],
    }
  );
  useEffect(() => {
    if (permission) {
      console.log("aaa: ", permission);
      form.setFieldsValue({
        description: permission.description,
      });
      setDescription(permission.description);
    }
  }, [permission]);

  const handleUpdateRoleUser = async (values: { role: string }) => {
    try {
      await updatePermission({
        variables: {
          updatePermissionInput: {
            id: permission.id,
            description: description,
          },
        },
      });
      message.success("Permission updated successfully");
      onClose();
    } catch (error) {
      message.error("Failed to update permission");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Update permission description"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleUpdateRoleUser} layout="vertical" className={styles.modal}>
        <Form.Item
          name="description"
          rules={[
            {
              required: true,
              message: "Please input description!",
            },
          ]}
        >
          <Input
            placeholder="Description"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
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

export default UpdatePermissionModal;
