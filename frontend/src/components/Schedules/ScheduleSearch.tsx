"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_BY_PORT } from "@/src/graphql/queries/query";
import {
  Input,
  DatePicker,
  Button,
  Card,
  Form,
  Space,
  message,
  Table,
  Alert,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { RiShipLine } from "react-icons/ri";
import { TbBuildingBank } from "react-icons/tb";
import { AiOutlineEnvironment } from "react-icons/ai";
import { Schedule } from "@/src/graphql/types";
import { useState, useEffect } from "react";
import moment from "moment";
import styles from "@/src/styles/Listpage.module.css";

const ScheduleSearch: React.FC = () => {
  const [country, setCountry] = useState("");
  const [portName, setPortName] = useState("");
  const [date, setDate] = useState<moment.Moment | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const { loading, error, data, refetch } = useQuery(SEARCH_BY_PORT, {
    variables: {
      country: country.trim(),
      portName: portName.trim(),
      date: date ? date.format("DD/MM/YYYY") : "",
    },
    skip: !country || !portName || !date,
    onCompleted: (data) => {
      console.log("Query completed. Data received:", data);
      if (data && data.schedulesByPort) {
        console.log("Setting schedules:", data.schedulesByPort);
        setSchedules(data.schedulesByPort);
        if (data.searchbyport.length === 0) {
          message.info("No schedules found for the given criteria.");
        }
      } else {
        console.log("No data or searchbyport in response");
      }
    },
    onError: (error) => {
      console.error("Error fetching schedules:", error);
      message.error(`Error fetching schedules: ${error.message}`);
    },
  });

  useEffect(() => {
    console.log("useEffect triggered. Current data:", data);
    if (data) {
      console.log(
        "Updating schedules from useEffect:",
        data.schedulesByPort || []
      );
      setSchedules(data.schedulesByPort || []);
    }
  }, [data]);

  const handleSearch = () => {
    if (!country.trim()) {
      message.warning("Please enter a country/region");
      return;
    }
    if (!portName.trim()) {
      message.warning("Please enter a port name");
      return;
    }
    if (!date) {
      message.warning("Please select a date");
      return;
    }

    refetch();
  };
  const columns = [
    {
      title: "",
      dataIndex: "vessel",
      key: "vessel",
      render: (text: string, record: Schedule) => (
        <Space direction="vertical">
          <span>
            <RiShipLine /> Vessel
          </span>
          <span style={{ color: "#1890ff" }}>
            {record.vessel.name} {record.vessel.type || "N/A"}
          </span>
        </Space>
      ),
    },
    {
      title: "",
      dataIndex: "terminal",
      key: "terminal",
      render: (text: string, record: Schedule) => (
        <Space direction="vertical">
          <span>
            <TbBuildingBank /> Terminal
          </span>
          <span>{record.route.departurePort.name}</span>
        </Space>
      ),
    },
    {
      title: "",
      dataIndex: "departure_time",
      key: "arrival",
      render: (text: string) => {
        const date = moment(text);
        return (
          <Space direction="vertical">
            <span>
              <AiOutlineEnvironment /> Arrival
            </span>
            <span>
              {date.format("DD MMM YYYY")} {date.format("HH:mm")}
            </span>
          </Space>
        );
      },
    },
    {
      title: "",
      dataIndex: "arrival_time",
      key: "departure",
      render: (text: string) => {
        const date = moment(text);
        return (
          <Space direction="vertical">
            <span>
              <AiOutlineEnvironment /> Departure
            </span>
            <span>
              {date.format("DD MMM YYYY")} {date.format("HH:mm")}
            </span>
          </Space>
        );
      },
    },
  ];

  return (
    <Space
      direction="horizontal"
      align="start"
      size="large"
    >
      <Card style={{ width: 350 }}>
        <Form layout="vertical" className={styles.inputForm}>
          <Form.Item
            label="Country/Region"
            name="country"
            rules={[
              {
                message: "Country/Region cannot be left blank",
              },
            ]}
          >
            <Input
              placeholder="Enter Country/Region"
              className={styles.input}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Port Name"
            name="portName"
            rules={[{ message: "Port Name cannot be left blank" }]}
          >
            <Input
              placeholder="Enter Port Name"
              className={styles.input}
              value={portName}
              onChange={(e) => setPortName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Date from" name="date">
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Select Date"
              suffixIcon={<CalendarOutlined />}
              onChange={(date) => setDate(date)}
              className={styles.datePicker}
            />
          </Form.Item>

          <Form.Item>
            <Button
              className={styles.searchButton}
              onClick={handleSearch}
              loading={loading}
            >
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table
          className={styles.dataTable}
          dataSource={schedules}
          columns={columns}
          rowKey="id"
          pagination={false}
          style={{ minWidth: "800px" }}
        />
      </Card>
    </Space>
  );
};

export default ScheduleSearch;
