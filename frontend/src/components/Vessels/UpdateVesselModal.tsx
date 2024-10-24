"use client";
import { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_VESSEL } from "@/src/graphql/mutations/Auth";
import { Vessel } from "@/src/graphql/types";
import styles from "@/src/styles/Modal.module.css";

interface UpdateVesselModalProps {
  vessel: Vessel;
  visible: boolean;
  onClose: () => void;
}

const UpdateVesselModal = ({
  vessel,
  visible,
  onClose,
}: UpdateVesselModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [status, setStatus] = useState("");
  const [updateVessel, { loading, error }] = useMutation(UPDATE_VESSEL);
  const [form] = Form.useForm();

  useEffect(() => {
    if (vessel) {
      form.setFieldsValue({
        name: vessel.name,
        type: vessel.type,
        ownerId:vessel.ownerId,
        capacity: vessel.capacity,
        status: vessel.status,
      });
    }
  }, [vessel, form]);
  console.log("ownerID: ", vessel.ownerId )

  const handleUpdateVessel = async (values: {
    name: string;
    type: string;
    ownerId : string;
    capacity: number;
    status: string;
  }) => {
    try {
      await updateVessel({
        variables: {
          id: vessel.id,
          updateVesselInput: {
            name: values.name,
            type: values.type,
            ownerId: vessel.ownerId,
            capacity: values.capacity,
            status: values.status,
          },
        },
      });
      message.success("Vessel updated successfully");
      onClose();
    } catch (err) {
      message.error("Failed to update vessel");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Update Vessel"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleUpdateVessel} layout="vertical" className={styles.modal}>
        <Form.Item
          label="Vessel Name"
          name="name"
          rules={[{ required: true, message: "Please enter Vessel Name!" }]}
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please select Vessel Type!" }]}
        >
          <Select
            value={type}
            onChange={(value) => setType(value)}
            placeholder="Select Vessel Type"
          >
            <Select.Option value="CONTAINER_SHIP">Container Ship</Select.Option>
            <Select.Option value="BULK_CARRIER">Bulk Carrier</Select.Option>
            <Select.Option value="TANKER">Tanker</Select.Option>
            <Select.Option value="RO_RO_SHIP">Ro-Ro Ship</Select.Option>
            <Select.Option value="PASSENGER_SHIP">Passenger Ship</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[{ required: true, message: "Please enter Vessel Capacity!" }]}
        >
          <Input
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select Vessel Status!" }]}
        >
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            placeholder="Select Vessel Status"
          >
            <Select.Option value="AVAILABLE">Available</Select.Option>
            {/* <Select.Option value="IN_TRANSIT">In Transit</Select.Option> */}
            <Select.Option value="UNDER_MAINTENANCE">
              Under Maintenance
            </Select.Option>
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

export default UpdateVesselModal;
