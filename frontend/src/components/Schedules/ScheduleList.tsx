"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
  Tag,
  Space,
  Input,
  Row,
  Col,
} from "antd";
import {
  GET_SCHEDULE_PAGINATION,
  GET_SCHEDULE_PAGINATION_BY_ID,
} from "@/src/graphql/queries/query";
import { Schedule } from "@/src/graphql/types";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CreateScheduleModal from "@/src/components/Schedules/CreateScheduleModal";
import UpdateScheduleModal from "@/src/components/Schedules/UpdateScheduleModal";
import { DELETE_SCHEDULE } from "@/src/graphql/mutations/Auth";
import { useState } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FilterDropdownProps } from "antd/es/table/interface";

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

  const pageSizeString = searchParams?.get("limit");
  const pageString = searchParams?.get("page");
  const sortString = searchParams?.get("sort");
  const statusFilter = searchParams?.get("status");
  const search = searchParams?.get("search");

  const page = pageString ? +pageString : 1;
  const pageSize = pageSizeString ? +pageSizeString : 5;

  const { loading, error, data, refetch } = useQuery(GET_SCHEDULE_PAGINATION, {
    variables: {
      paginationSchedule: {
        limit: pageSize,
        offset: page - 1,
        sort: sortString,
        statusFilter: statusFilter,
        search: search,
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
        limit: pageSize,
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
  const [paginationTable, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: pageSize,
  });
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const params = new URLSearchParams(searchParams ?? "");

    if (pagination && pagination.current != paginationTable.current) {
      params.set("page", pagination.current);
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
    }

    if (pagination && pagination.pageSize != paginationTable.pageSize) {
      params.set("limit", pagination.pageSize);
      params.set("page", "1");
      setPagination({ pageSize: pagination.pageSize, current: 1 });
    }

    if (sorter) {
      let checkSorter: boolean = true;
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
      }
    }
    if (filters) {
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
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: any
  ) => {
    confirm();
    const params = new URLSearchParams(searchParams ?? "");
    if (selectedKeys.length === 0) {
      params.delete("search");
    } else {
      params.set("search", selectedKeys[0]);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: any, searchTerm: string | null) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    defaultFilteredValue: searchTerm ? [searchTerm] : null,
  });

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
    {
      title: "Vessel",
      dataIndex: ["vessel", "name"],
      key: "vessel",
      ...getColumnSearchProps("vessel", search ? search : ""),
      render: (text: string, record: any) => {
        return record?.vessel?.name;
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
      defaultFilteredValue: statusFilter?.split(","),
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
                {permissionUser?.includes("update:schedule") &&
                  record.status !== "COMPLETED" &&
                  record.status !== "CANCELLED" && (
                    <Button
                      type="link"
                      onClick={() => handleEdit(record)}
                      icon={<EditOutlined />}
                    >
                      Edit
                    </Button>
                  )}
                {permissionUser?.includes("delete:schedule") &&
                  record.status !== "SCHEDULED" &&
                  record.status !== "IN_TRANSIT" && (
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
    <Row>
      <Col span={24}>
        <div className={styles.createButton}>
          {permissionUser?.includes("create:schedule") && (
            <CreateScheduleModal
              limit={pageSize}
              offset={page - 1}
              sort={sortString ? sortString : ""}
              statusFilter={statusFilter ? statusFilter : ""}
              refetchSchedule={refetch}
            />
          )}
        </div>

        <div>
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
              schedule={selectedSchedule}
              visible={isUpdateModalVisible}
              onClose={handleUpdateModalClose}
            />
          )}
        </div>
      </Col>
    </Row>
  );
};

export default SchedulesList;
