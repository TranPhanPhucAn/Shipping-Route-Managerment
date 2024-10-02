"use client";
import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, message, Select } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_ROUTE } from "../../graphql/mutations/Auth";
import { Route } from "../../graphql/types";
import styles from "../../styles/Listpage.module.css";
import { GetPortsData, Port } from "../../graphql/types";
import { GET_PORTS } from "@/src/graphql/queries/query";

const { Option } = Select;

interface UpdateRouteModalProps {
  id: string;
  route: Route;
  visible: boolean;
  onClose: () => void;
}

const UpdateRouteModal = ({
  route,
  visible,
  onClose,
}: UpdateRouteModalProps) => {
  const [departurePortId, setDeparturePortId] = useState("");
  const [destinationPortId, setDestinationPortId] = useState("");
  const [distance, setDistance] = useState("");
  const [updateRoute, { loading, error }] = useMutation(UPDATE_ROUTE);
  const { data } = useQuery<GetPortsData>(GET_PORTS);
  const [form] = Form.useForm();

  const PortsData: Port[] = data?.ports || [];

  useEffect(() => {
    if (route) {
      form.setFieldsValue({
        departurePortId: route.departurePort.id,
        destinationPortId: route.destinationPort.id,
        distance: route.distance,
      });
    }
  }, [route, form]);

  const handleUpdateRoute = async (values: {
    departurePortId: string;
    destinationPortId: string;
    distance: number;
  }) => {
    try {
      await updateRoute({
        variables: {
          id: route.id,
          updateRouteInput: {
            departurePortId: values.departurePortId,
            destinationPortId: values.destinationPortId,
            distance: Number(values.distance),
          },
        },
      });
      message.success("Route updated successfully");
      onClose();
    } catch (error) {
      message.error("Failed to update route");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Update Route"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleUpdateRoute} layout="vertical">
        <Form.Item
          label="Departure Port"
          name="departurePortId"
          rules={[{ required: true, message: "Please enter Departure Port!" }]}
        >
          <Select
            value={departurePortId}
            showSearch
            onChange={(value) => setDeparturePortId(value)}
            placeholder="Enter Departure Port"
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {PortsData.map((port) => (
              <Option key={port.id} value={port.id}>
                {port.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Destination Port"
          name="destinationPortId"
          rules={[
            { required: true, message: "Please enter Destination Port!" },
          ]}
        >
          <Select
            value={destinationPortId}
            showSearch
            onChange={(value) => setDestinationPortId(value)}
            placeholder="Enter Destination Port"
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {PortsData.map((port) => (
              <Option key={port.id} value={port.id}>
                {port.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Distance"
          name="distance"
          rules={[{ required: true, message: "Please enter Distance!" }]}
        >
          <Input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateRouteModal;
