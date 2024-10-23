"use client";
import { useState, useEffect } from "react";
import { Button, Form, Modal, message, Select, DatePicker } from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_SCHEDULE } from "@/src/graphql/mutations/Auth";
import { Schedule, Vessel, Route } from "@/src/graphql/types";
import { GET_VESSELS, GET_ROUTES } from "@/src/graphql/queries/query";
import { useQuery } from "@apollo/client";
import styles from "@/src/styles/Modal.module.css";
// import moment from "moment";

const { Option } = Select;

interface UpdateScheduleModalProps {
  schedule: Schedule;
  visible: boolean;
  onClose: () => void;
}

const UpdateScheduleModal = ({
  schedule,
  visible,
  onClose,
}: UpdateScheduleModalProps) => {
  const [form] = Form.useForm();
  const [status, setStatus] = useState("");
  const [updateSchedule, { loading, error }] = useMutation(UPDATE_SCHEDULE);

  useEffect(() => {
    if (schedule) {
      form.setFieldsValue({
        status: schedule.status,
      });
      setStatus(schedule.status);
    }
  }, [schedule, form]);

  const handleUpdateSchedule = async (values: { status: string }) => {
    try {
      await updateSchedule({
        variables: {
          id: schedule.id,
          updateScheduleInput: {
            status: values.status,
          },
        },
      });
      message.success("Schedule updated successfully");
      onClose();
    } catch (error) {
      message.error("Failed to update schedule");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Update Schedule"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleUpdateSchedule}
        layout="vertical"
        className={styles.modal}
      >
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            placeholder="Select Status"
          >
            <Option value="IN_TRANSIT">In Transit</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            className={styles.submitButton}
            htmlType="submit"
            loading={loading}
          >
            Update
          </Button>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateScheduleModal;
