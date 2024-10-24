"use client";
import { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_VESSEL } from "@/src/graphql/mutations/Auth";
import { GET_VESSELS, QUERY_SUPPLIERS } from "@/src/graphql/queries/query";
import styles from "@/src/styles/Modal.module.css";

//     limit: pageSize,
// offset: page - 1,
// sort: sortString,
// search: search,
// statusFilter: statusFilter,
// typeFilter: typeFilter,

const { Option } = Select;

interface CreateVesselModalProps {
  limit: number;
  offset: number;
  sort: string;
  statusFilter: string;
  typeFilter: string;
  search: string;

  refetchVessel: (variables: {
    paginationVessels: {
      limit: number;
      offset: number;
      sort: string;
      statusFilter: string;
      typeFilter: string;
      search: string;
    };
  }) => void;
}
const CreateVesselModal = ({
  limit,
  offset,
  sort,
  statusFilter,
  typeFilter,
  search,
  refetchVessel,
}: CreateVesselModalProps) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [ownerId, setOwnerId] = useState("");

  const [createVessel, { loading, error }] = useMutation(CREATE_VESSEL, {
    refetchQueries: [{ query: GET_VESSELS }],
  });

  const {
    loading: loadingSupplier,
    error: errorSuplier,
    data: dataSupplier,
    refetch: refetchSupplier,
  } = useQuery(QUERY_SUPPLIERS);
  const suppliers = dataSupplier ? dataSupplier.getSuppliers : [];

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
      await refetchVessel({
        paginationVessels: {
          limit: limit,
          offset: offset,
          sort: sort,
          statusFilter: statusFilter,
          typeFilter: typeFilter,
          search: search,
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
      <Button className={styles.submitButton} onClick={() => setVisible(true)}>
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
          className={styles.modal}
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
            rules={[{ required: true, message: "Please select owner!" }]}
          >
            <Select
              value={ownerId}
              onChange={(value) => setOwnerId(value)}
              placeholder="Select Owner"
            >
              {suppliers &&
                suppliers.length > 0 &&
                suppliers.map((item: any, index: any) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.username}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              className={styles.submitButton}
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

export default CreateVesselModal;
