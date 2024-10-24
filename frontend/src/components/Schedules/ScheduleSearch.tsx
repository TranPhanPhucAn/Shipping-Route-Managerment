"use client";
import React, { useState, useMemo } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { SEARCH_BY_PORT, GET_PORTS } from "@/src/graphql/queries/query";
import {
  DatePicker,
  Button,
  Card,
  Form,
  Row,
  Col,
  Space,
  message,
  Table,
  Select,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { RiShipLine } from "react-icons/ri";
import { TbBuildingBank } from "react-icons/tb";
import { AiOutlineEnvironment } from "react-icons/ai";
import { Schedule, Port, GetPortsData } from "@/src/graphql/types";
import moment from "moment";
import styles from "@/src/styles/Listpage.module.css";
import dayjs from "dayjs";

const ScheduleSearch: React.FC = () => {
  const [country, setCountry] = useState("");
  const [portName, setPortName] = useState("");
  const [date, setDate] = useState<moment.Moment | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { data: portsData } = useQuery<GetPortsData>(GET_PORTS);
  const ports: Port[] = portsData?.ports || [];
  const [searchSchedules, { loading }] = useLazyQuery(SEARCH_BY_PORT, {
    onCompleted: (data) => {
      if (data?.schedulesByPort) {
        setSchedules(data.schedulesByPort);
        if (data.schedulesByPort.length === 0) {
          message.info("No schedules found for the given criteria.");
        }
      }
    },
    onError: (error) => {
      console.error("Error fetching schedules:", error);
      message.error(`Error fetching schedules: ${error.message}`);
    },
  });

  // Get unique countries
  const uniqueCountries = useMemo(() => {
    const countrySet = new Set(ports.map((port) => port.country));
    return Array.from(countrySet).sort();
  }, [ports]);

  // Get ports filtered by selected country
  const filteredPorts = useMemo(() => {
    if (!country) return [];
    return ports
      .filter((port) => port.country === country)
      .map((port) => port.name)
      .sort();
  }, [ports, country]);

  const handleDate = (date: dayjs.Dayjs | null) => {
    if (date) {
      setDate(moment(date.toDate()));
    } else {
      setDate(null);
    }
  };

  const handleSearch = async () => {
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
    await searchSchedules({
      variables: {
        country: country.trim(),
        portName: portName.trim(),
        date: date.format("DD/MM/YYYY"),
      },
    });
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
      key: "departure",
      render: (text: string) => {
        const date = moment(text);
        return (
          <Space direction="vertical">
            <span>
              <AiOutlineEnvironment /> Departure timeline
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
      key: "arrival",
      render: (text: string) => {
        const date = moment(text);
        return (
          <Space direction="vertical">
            <span>
              <AiOutlineEnvironment /> Arrival timeline
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
    <Row>
      <Col span={6}>
        <Card>
          <Form layout="vertical" className={styles.inputForm}>
            <Form.Item
              label="Country/Region"
              name="country"
              rules={[{ message: "Country/Region cannot be left blank" }]}
            >
              <Select
                value={country}
                showSearch
                onChange={(value) => setCountry(value)}
                placeholder="Select Country"
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                options={uniqueCountries.map((country) => ({
                  value: country,
                  label: country,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="City Name"
              name="portName"
              rules={[{ message: "Port Name cannot be left blank" }]}
            >
              <Select
                value={portName}
                showSearch
                onChange={(value) => setPortName(value)}
                placeholder="Select city name"
                disabled={!country}
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                options={filteredPorts.map((port) => ({
                  value: port,
                  label: port,
                }))}
              />
            </Form.Item>

            <Form.Item label="Date from" name="date">
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Select Date"
                suffixIcon={<CalendarOutlined />}
                onChange={handleDate}
                className={styles.datePicker}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className={styles.searchButton}
                style={{ marginTop: "0.6rem" }}
                onClick={handleSearch}
                loading={loading}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col span={17} offset={1}>
        <Card>
          <Table
            className={styles.dataTable}
            dataSource={schedules}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ScheduleSearch;
