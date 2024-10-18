"use client";
import { useState } from "react";
import { Button, Form, Modal, message, Select, DatePicker } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SCHEDULE } from "../../graphql/mutations/Auth";
import {
  GET_VESSELS,
  GET_ROUTES,
  GET_SCHEDULES,
} from "../../graphql/queries/query";
import styles from "../../styles/Auth.module.css";
import {
  GetVesselsData,
  GetRoutesData,
  Vessel,
  Route,
} from "../../graphql/types";

const { Option } = Select;

const CreateScheduleModal = () => {
  const [visible, setVisible] = useState(false);
  const [vesselId, setVesselId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [departure_time, setDepartureTime] = useState(null);
  const [createSchedule, { loading, error }] = useMutation(CREATE_SCHEDULE, {
    refetchQueries: [{ query: GET_SCHEDULES }],
  });
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
      <Button className={styles.mainButton} onClick={() => setVisible(true)}>
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
          className={styles.mainBox}
        >
          <Form.Item
            label="Vessel"
            name="vesselId"
            rules={[{ required: true, message: "Please select a vessel!" }]}
          >
            <Select
              className={styles.input}
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
              className={styles.input}
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
    </div>
  );
};

export default CreateScheduleModal;
