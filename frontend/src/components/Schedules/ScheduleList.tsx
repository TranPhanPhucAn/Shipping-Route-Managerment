"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
  Tag,
} from "antd";
import {
  GET_SCHEDULE_PAGINATION,
  GET_SCHEDULE_PAGINATION_BY_ID,
} from "@/src/graphql/queries/query";
import { Schedule } from "@/src/graphql/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CreateScheduleModal from "@/src/components/Schedules/CreateScheduleModal";
import UpdateScheduleModal from "@/src/components/Schedules/UpdateScheduleModal";
import { DELETE_SCHEDULE } from "@/src/graphql/mutations/Auth";
import { useState } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const SchedulesList = () => {
  const { data: session, status, update } = useSession();
  const permissionUser = session?.user?.permissionNames;
  const [removeSchedule, { loading: deleteLoading }] =
    useMutation(DELETE_SCHEDULE);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const limit = 5;
  const pageString = searchParams?.get("page");
  const sortString = searchParams?.get("sort");
  const statusFilter = searchParams?.get("status");

  // let schedules, total;
  const page = pageString ? +pageString : 1;
  // if (permissionUser?.includes("get:schedulesPag")) {
  //   const { loading, error, data, refetch } = useQuery(
  //     GET_SCHEDULE_PAGINATION,
  //     {
  //       variables: {
  //         paginationSchedule: {
  //           limit: limit,
  //           offset: page - 1,
  //           sort: sortString,
  //           statusFilter: statusFilter,
  //         },
  //       },
  //     }
  //   );
  //   schedules = data?.paginationSchedule?.schedules;
  //   total = data?.paginationSchedule?.totalCount;
  // }

  const { loading, error, data, refetch } = useQuery(GET_SCHEDULE_PAGINATION, {
    variables: {
      paginationSchedule: {
        limit: limit,
        offset: page - 1,
        sort: sortString,
        statusFilter: statusFilter,
      },
    },
    skip: !permissionUser?.includes("get:schedulesPag"),
  });

  const {
    loading: loadingScheduleById,
    error: errorScheduleById,
    data: dataById,
    refetch: refetchById,
  } = useQuery(GET_SCHEDULE_PAGINATION_BY_ID, {
    variables: {
      paginationSchedule: {
        ownerId: session?.user?.id,
        limit: limit,
        offset: page - 1,
        sort: sortString,
        statusFilter: statusFilter,
      },
    },
    skip:
      !permissionUser?.includes("get:schedulesPagById") ||
      permissionUser?.includes("get:schedulesPag"),
  });

  let schedules, total;
  if (permissionUser?.includes("get:schedulesPag")) {
    schedules = data?.paginationSchedule?.schedules;
    total = data?.paginationSchedule?.totalCount;
  } else {
    if (permissionUser?.includes("get:schedulesPagById")) {
      schedules = dataById?.paginationScheduleById?.schedules;
      total = dataById?.paginationScheduleById?.totalCount;
    }
  }
  // const schedules = data?.paginationSchedule?.schedules;
  // const total = data?.paginationSchedule?.totalCount;
  const [paginationTable, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: limit,
  });

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    console.log("params", filters);
    console.log("sort", sorter);

    if (pagination && pagination.current != paginationTable.current) {
      const params = new URLSearchParams(searchParams ?? "");
      params.set("page", pagination.current);
      setPagination({ current: pagination.current });
      replace(`${pathname}?${params.toString()}`);
      return;
    }
    if (sorter) {
      let checkSorter: boolean = true;
      const params = new URLSearchParams(searchParams ?? "");
      let resultUrl = "";
      if (sorter.length) {
        for (let i = 0; i < sorter.length; i++) {
          let order = sorter[i].order;
          if (order === "ascend") {
            order = "asc";
          } else if (order === "descend") {
            order = "desc";
          }
          resultUrl = resultUrl + sorter[i].field + " " + order;
          if (i < sorter.length - 1) {
            resultUrl += ",";
          }
        }
      } else {
        if (!sorter.order) {
          params.delete("sort");
          replace(`${pathname}?${params.toString()}`);
          checkSorter = false;
        }
        let order = sorter.order;
        if (order === "ascend") {
          order = "asc";
        } else if (order === "descend") {
          order = "desc";
        }
        resultUrl = sorter.field + " " + order;
      }
      if (checkSorter === true) {
        params.set("sort", resultUrl);
        replace(`${pathname}?${params.toString()}`);
      }
    }
    if (filters) {
      const params = new URLSearchParams(searchParams ?? "");
      if (
        !filters.status ||
        !Array.isArray(filters.status) ||
        filters.status.length === 0
      ) {
        params.delete("status");
      } else {
        const statusUrl = filters.status.join(",");
        params.set("status", statusUrl);
      }

      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeSchedule({
        variables: { id },
      });
      message.success("Schedule removed successfully");
      if (permissionUser?.includes("get:schedulesPag")) {
        refetch();
      } else {
        if (permissionUser?.includes("get:schedulesPagById")) {
          refetchById();
        }
      }
      // refetch();
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

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Vessel",
      dataIndex: ["vessel", "name"],
      key: "vessel",
      render: (text: string, record: any) => {
        return record.vessel.name;
      },
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
      filters: [
        { text: "Scheduled", value: "Scheduled" },
        { text: "In Transit", value: "In Transit" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      // onFilter: (value: any, record: any) => record.status === value,
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

      render: (text: string, record: Schedule) => {
        const formattedDate = new Date(
          record.departure_time
        ).toLocaleDateString("en-GB", { hour: "2-digit", minute: "2-digit" });
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Arrival Time",
      dataIndex: ["arrival_time"],
      key: "arrival_time",
      render: (text: string, record: Schedule) => {
        const formattedDate = new Date(record.arrival_time).toLocaleDateString(
          "en-GB",
          { hour: "2-digit", minute: "2-digit" }
        );
        return <span>{formattedDate}</span>;
      },
    },
    ...(permissionUser?.includes("update:schedule") ||
    permissionUser?.includes("delete:schedule")
      ? [
          {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (text: string, record: Schedule) => (
              <div>
                <Button
                  type="link"
                  onClick={() => handleEdit(record)}
                  icon={<EditOutlined />}
                >
                  Edit
                </Button>
                {permissionUser?.includes("delete:schedule") && (
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
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className={styles.body}>
      <div className={styles.createButton}>
        {permissionUser?.includes("create:schedule") && <CreateScheduleModal />}
      </div>

      <div className={styles.container}>
        <Table
          dataSource={schedules ? schedules : []}
          columns={columns}
          className={styles.Table}
          rowKey={"id"}
          pagination={{
            current: paginationTable.current,
            pageSize: paginationTable.pageSize,
            total: total,
            pageSizeOptions: ["5", "10", "20"],
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
        {selectedSchedule && (
          <UpdateScheduleModal
            // id={selectedSchedule.id}
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
