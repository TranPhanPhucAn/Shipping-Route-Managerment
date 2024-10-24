"use client";
import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_PORT } from "../../graphql/mutations/Auth";
import { Port } from "@/src/graphql/types";
import style from "@/src/styles/Modal.module.css";

interface UpdatePortModalProps {
  id: string;
  port: Port;
  visible: boolean;
  onClose: () => void;
}

const UpdatePortModal = ({ port, visible, onClose }: UpdatePortModalProps) => {
  const [updatePort, { loading, error }] = useMutation(UPDATE_PORT);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (port) {
      form.setFieldsValue({
        name: port.name,
        country: port.country,
        latitude: port.latitude,
        longitude: port.longitude,
      });
    }
  }, [port, form]);

  const handleUpdatePort = async (values: {
    name: string;
    country: string;
    location: string;
  }) => {
    try {
      await updatePort({
        variables: {
          id: port.id,
          updatePortInput: {
            name: values.name,
            country: values.country,
          },
        },
      });
      message.success("Port updated successfully");
      onClose();
    } catch (error) {
      message.error("Failed to update port");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Update Port"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleUpdatePort} layout="vertical" className={style.modal}>
      <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: "Please enter Country!" }]}
        >
          <Input value={country} onChange={(e) => setCountry(e.target.value)} className={style.input} />
        </Form.Item>
        <Form.Item
          label="City Name"
          name="name"
          rules={[{ required: true, message: "Please enter Port Name!" }]}
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} className={style.input} />
        </Form.Item>
        <Form.Item>
          <Button className={style.submitButton} htmlType="submit" loading={loading}>
            Update
          </Button>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePortModal;
