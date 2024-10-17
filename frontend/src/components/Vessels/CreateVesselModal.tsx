"use client";
import { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_VESSEL } from "@/src/graphql/mutations/Auth";
import { GET_VESSELS } from "@/src/graphql/queries/query";
import styles from "@/src/styles/Auth.module.css";

const CreateVesselModal = () => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [ownerId, setOwnerId] = useState("");

  const [createVessel, { loading, error }] = useMutation(CREATE_VESSEL, {
    refetchQueries: [{ query: GET_VESSELS }],
  });
  const [form] = Form.useForm();

  const handleCreateVessel = async () => {
    if (!name || !type || !capacity || !ownerId) {
      message.error("Please fill out all fields.");
      return;
    }
    try {
      await createVessel({
        variables: {
          createVesselInput: {
            name,
            type,
            capacity,
            ownerId,
          },
        },
      });
      form.resetFields();
      setVisible(false);
      message.success("Vessel created successfully!");
    } catch (err) {
      console.error("Error creating vessel:", err);
      message.error("Failed to create vessel");
    }
  };

  return (
    <>
      <Button className={styles.mainButton} onClick={() => setVisible(true)}>
        Add Vessel
      </Button>
      <Modal
        title="Create New Vessel"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateVessel}
          layout="vertical"
          className={styles.mainBox}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter vessel name!" }]}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Vessel Name"
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select vessel type!" }]}
          >
            <Select
              value={type}
              onChange={(value) => setType(value)}
              placeholder="Select Vessel Type"
            >
              <Select.Option value="CONTAINER_SHIP">
                Container Ship
              </Select.Option>
              <Select.Option value="BULK_CARRIER">Bulk Carrier</Select.Option>
              <Select.Option value="TANKER">Tanker</Select.Option>
              <Select.Option value="RO_RO_SHIP">Ro-Ro Ship</Select.Option>
              <Select.Option value="PASSENGER_SHIP">
                Passenger Ship
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[
              { required: true, message: "Please enter vessel capacity!" },
            ]}
          >
            <InputNumber
              value={capacity}
              onChange={(value) => setCapacity(value)}
              placeholder="Enter Capacity"
              min={1}
            />
          </Form.Item>

          <Form.Item
            label="Owner ID"
            name="ownerId"
            rules={[{ required: true, message: "Please enter owner ID!" }]}
          >
            <Input
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              placeholder="Enter Owner ID"
            />
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

export default CreateVesselModal;
