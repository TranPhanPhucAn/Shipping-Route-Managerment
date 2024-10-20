"use client";
import { useState } from "react";
import { Button, Form, Input, Modal, message, Select } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ROUTE } from "../../graphql/mutations/Auth";
import { GET_PORTS, GET_ROUTES } from "../../graphql/queries/query";
import styles from "../../styles/Auth.module.css";
import { GetPortsData, Port } from "../../graphql/types";

const { Option } = Select;
interface CreateRouteModalProps {
  limit: number;
  offset: number;
  sort: string;
  refetchRoute: (variables: {
    paginationRoute: {
      limit: number;
      offset: number;
      sort: string;
    };
  }) => void;
}

const CreateRouteModal = ({
  limit,
  offset,
  sort,
  refetchRoute,
}: CreateRouteModalProps) => {
  const [visible, setVisible] = useState(false);
  const [departurePortId, setDeparturePortId] = useState("");
  const [destinationPortId, setDestinationPortId] = useState("");
  const [createRoute, { loading, error }] = useMutation(CREATE_ROUTE, {
    refetchQueries: [{ query: GET_ROUTES }],
  });
  const { data } = useQuery<GetPortsData>(GET_PORTS);
  const [form] = Form.useForm();

  const PortsData: Port[] = data?.ports || [];

  const handleCreateRoute = async () => {
    if (!departurePortId || !destinationPortId) {
      message.error("Please fill out all fields.");
      return;
    }
    try {
      await createRoute({
        variables: {
          createRouteInput: {
            departurePortId,
            destinationPortId,
          },
        },
      });
      await refetchRoute({
        paginationRoute: {
          limit: limit,
          offset: offset,
          sort: sort,
        },
      });
      form.resetFields();
      setVisible(false);
      message.success("Route created successfully");
    } catch (error) {
      console.error("Error creating route:", error);
      message.error("Failed to create route");
    }
  };

  return (
    <>
      <Button className={styles.mainButton} onClick={() => setVisible(true)}>
        Add Route
      </Button>
      <Modal
        title="Create New Route"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateRoute}
          layout="vertical"
          className={styles.mainBox}
        >
          <Form.Item
            label="Departure Port"
            name="departurePortId"
            rules={[
              { required: true, message: "Please enter Departure Port!" },
            ]}
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
                <Option key={port.name} value={port.id}>
                  {port.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              className={styles.mainButton}
              htmlType="submit"
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

export default CreateRouteModal;
