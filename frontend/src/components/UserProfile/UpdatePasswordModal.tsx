"use client";
import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message, Select, DatePicker } from "antd";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD, UPDATE_USER } from "../../graphql/mutations/Auth";
import { useSession } from "next-auth/react";

const UpdatePasswordModal = () => {
  const { data: session, status, update } = useSession();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [recentPassword, setRecentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword, { loading, error }] = useMutation(CHANGE_PASSWORD);

  const handleUpdateUser = async () => {
    if (!recentPassword || !newPassword || !confirmPassword) {
      message.error("Let fill all fields");
      return;
    }
    if (newPassword != confirmPassword) {
      message.error("Your new password and confirm password is not the same");
      return;
    }
    try {
      const res = await changePassword({
        variables: {
          changePassword: {
            userId: session?.user?.id,
            oldPassword: recentPassword,
            newPassword: newPassword,
          },
        },
      });
      form.resetFields();
      setVisible(false);
      message.success("Change password successfully");
    } catch (err) {
      console.error("Error change password:", err);
      message.error("Failed to change password");
    }
  };
  return (
    <>
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{ marginLeft: "5px" }}
      >
        Change Password
      </Button>
      <Modal
        title="Change Password"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleUpdateUser}
          layout="vertical"
          // className={styles.mainBox}
        >
          <Form.Item
            name="recentPassword"
            rules={[
              {
                required: true,
                message: "Please input your recent password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Recent password"
              type="password"
              value={recentPassword}
              onChange={(e: any) => setRecentPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
            ]}
          >
            <Input.Password
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your confirm password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
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

export default UpdatePasswordModal;
