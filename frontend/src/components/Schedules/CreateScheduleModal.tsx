"use client";
import { useState } from "react";
import { Button, Form, Modal, message, Select, DatePicker } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SCHEDULE } from "../../graphql/mutations/Auth";
import {
  GET_VESSELS,
  GET_ROUTES,
  GET_SCHEDULES,
  GET_SCHEDULE_PAGINATION,
} from "../../graphql/queries/query";
import styles from "@/src/styles/Modal.module.css";
import {
  GetVesselsData,
  GetRoutesData,
  Vessel,
  Route,
} from "../../graphql/types";

const { Option } = Select;
interface CreateScheduleModalProps {
  limit: number;
  offset: number;
  sort: string;
  statusFilter: string;
  refetchSchedule: (variables: {
    paginationSchedule: {
      limit: number;
      offset: number;
      sort: string;
      statusFilter: string;
    };
  }) => void;
}

const CreateScheduleModal = ({
  limit,
  offset,
  sort,
  statusFilter,
  refetchSchedule,
}: CreateScheduleModalProps) => {
  const [visible, setVisible] = useState(false);
  const [vesselId, setVesselId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [departure_time, setDepartureTime] = useState(null);
  const [createSchedule, { loading, error }] = useMutation(CREATE_SCHEDULE);
  const { data: vesselsData } = useQuery<GetVesselsData>(GET_VESSELS);
  const { data: routesData } = useQuery<GetRoutesData>(GET_ROUTES);
  const [form] = Form.useForm();

  const vessels: Vessel[] = vesselsData?.vessels || [];
  const routes: Route[] = routesData?.routes || [];

  const handleCreateSchedule = async () => {
    if (!vesselId || !routeId || !departure_time) {
      message.error("Please fill out all fields.");
      return;
    }

    try {
      await createSchedule({
        variables: {
          createScheduleInput: {
            vesselId,
            routeId,
            departure_time,
            status: "SCHEDULED",
          },
        },
      });
      await refetchSchedule({
        paginationSchedule: {
          limit: limit,
          offset: offset,
          sort: sort,
          statusFilter: statusFilter,
        },
      });
      form.resetFields();
      setVisible(false);
      message.success("Schedule created successfully");
    } catch (error) {
      console.error("Error creating schedule:", error);
      message.error("Failed to create schedule");
    }
  };

  return (
    <div>
      <Button className={styles.submitButton} onClick={() => setVisible(true)}>
        Add Schedule
      </Button>
      <Modal
        title="Create New Schedule"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateSchedule}
          layout="vertical"
          className={styles.modal}
        >
          <Form.Item
            label="Vessel"
            name="vesselId"
            rules={[{ required: true, message: "Please select a vessel!" }]}
          >
            <Select
              value={vesselId}
              showSearch
              onChange={(value) => setVesselId(value)}
              placeholder="Select Vessel"
              filterOption={(input, option) =>
                String(option?.children)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {vessels.map((vessel) => (
                <Option key={vessel.id} value={vessel.id}>
                  {vessel.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Route"
            name="routeId"
            rules={[{ required: true, message: "Please select a route!" }]}
          >
            <Select
              value={routeId}
              showSearch
              onChange={(value) => setRouteId(value)}
              placeholder="Select Route"
              filterOption={(input, option) =>
                String(option?.children)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {routes.map((route) => (
                <Option key={route.id} value={route.id}>
                  {`${route.departurePort.name} - ${route.destinationPort.name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Departure Time"
            name="departureTime"
            rules={[
              { required: true, message: "Please select departure time!" },
            ]}
          >
            <DatePicker
              showTime
              value={departure_time}
              onChange={(value) => setDepartureTime(value)}
              format="DD-MM-YYYY HH:mm"
              className={styles.input}
            />
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
    </div>
  );
};

export default CreateScheduleModal;
