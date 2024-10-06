"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
  Tag,
  Divider,
} from "antd";
import { GET_SCHEDULES } from "../../../../graphql/queries/query";
import { GetSchedulesData, Schedule } from "../../../../graphql/types";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import CreateScheduleModal from "../../../../components/Schedules/CreateScheduleModal";
import UpdateScheduleModal from "../../../../components/Schedules/UpdateScheduleModal";
import { DELETE_SCHEDULE } from "@/src/graphql/mutations/Auth";
import { useState, useEffect } from "react";
import styles from "../../../../styles/Listpage.module.css";
import { useParams, useRouter } from "next/navigation";

const getUniqueValues = (data: any[], key: string) => {
  return Array.from(
    new Set(data.map((item) => key.split(".").reduce((o, i) => o[i], item)))
  );
};

const SchedulesList = () => {
  const { loading, error, data, refetch } =
    useQuery<GetSchedulesData>(GET_SCHEDULES);
  const [removeSchedule, { loading: deleteLoading }] =
    useMutation(DELETE_SCHEDULE);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const schedulesData = data?.schedules || [];
  const params = useParams();
  const page = params?.page ? Number(params.page) : 1;
  const router = useRouter();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: 5,
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: page,
    }));
  }, [page]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    router.push(`/schedules/${pagination.current}`);
  };

  const handleRemove = async (id: string) => {
    try {
      await removeSchedule({
        variables: { id },
      });
      message.success("Schedule removed successfully");
      refetch();
    } catch (error) {
      message.error("Failed to remove schedule");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedSchedule(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns = [
    {
      title: "Vessel",
      dataIndex: ["vessel", "name"],
      key: "vessel",
      sorter: (a: any, b: any) => a.vessel.name.localeCompare(b.vessel.name),
    },
    {
      title: "Route",
      dataIndex: ["route", "id"],
      key: "route",
      render: (text: string, record: any) => {
        const departurePort = record.route.departurePort.name;
        const destinationPort = record.route.destinationPort.name;
        return `${departurePort} - ${destinationPort}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      filters: [
        { text: "Scheduled", value: "SCHEDULED" },
        { text: "In Transit", value: "IN_TRANSIT" },
        { text: "Completed", value: "COMPLETED" },
        { text: "Cancelled", value: "CANCELLED" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (text: string, record: Schedule) => {
        let color = "white";

        if (record.status === "SCHEDULED") {
          color = "#FCDC94";
        } else if (record.status === "IN_TRANSIT") {
          color = "#85C1E9";
        } else if (record.status === "COMPLETED") {
          color = "#58D68D";
        } else {
          color = "red";
        }

        return (
          <Tag color={color} key={record.id}>
            {record.status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Depature Time",
      dataIndex: ["departure_time"],
      key: "departure_time",
      // render: (departure_time: string) => {
      //   const date = new Date(departure_time);
      //   const formattedDate = date.toLocaleDateString("en-GB", {
      //     day: "2-digit",
      //     month: "short",
      //     year: "numeric",
      //   });

      //   return `${formattedDate} `;
      // },
      render: (text: string, record: Schedule) => {
        const formattedDate = new Date(
          record.departure_time
        ).toLocaleDateString("en-GB");
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Arrival Time",
      dataIndex: ["arrival_time"],
      key: "arrival_time",
      render: (text: string, record: Schedule) => {
        const formattedDate = new Date(record.arrival_time).toLocaleDateString(
          "en-GB"
        );
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: Schedule) => (
        <>
          {/* <Button
            type="link"
            onClick={() => handleEdit(record)}
            icon={<EyeOutlined />}
          >
            View
          </Button> */}
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Popconfirm
            placement="topLeft"
            title={"Are you sure to delete this schedule?"}
            description={"Delete the schedule"}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleRemove(record.id)}
            onCancel={() => console.log("Delete canceled")}
          >
            <Button
              type="link"
              danger
              loading={deleteLoading}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className={styles.body}>
      <div className={styles.Title}>Schedules</div>
      <div className={styles.subtitle}>
        Search our extensive routes to find the schedule which fits your supply
        chain.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <CreateScheduleModal />
      <div className={styles.container}>
        <Table
          dataSource={schedulesData || []}
          columns={columns}
          className={styles.Table}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
          }}
          onChange={handleTableChange}
        />
        {selectedSchedule && (
          <UpdateScheduleModal
            schedule={selectedSchedule}
            visible={isUpdateModalVisible}
            onClose={handleUpdateModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulesList;
