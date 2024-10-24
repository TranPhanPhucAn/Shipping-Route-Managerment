"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
  Divider,
  Input,
  Select,
  Row,
  Col,
  Space,
} from "antd";
import { GET_ROUTE_PAGINATION } from "@/src/graphql/queries/query";
import { Route } from "@/src/graphql/types";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CreateRouteModal from "@/src/components/Routes/CreateRouteModal";
import UpdateRouteModal from "@/src/components/Routes/UpdateRouteModal";
import { DELETE_ROUTE } from "@/src/graphql/mutations/Auth";
import { useState, useEffect } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FilterDropdownProps } from "antd/es/table/interface";

const RoutesList = () => {
  const { data: session, status, update } = useSession();
  const permissionUser = session?.user?.permissionNames;
  const [removeRoute, { loading: deleteLoading }] = useMutation(DELETE_ROUTE);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const pageSizeString = searchParams?.get("limit");
  const pageString = searchParams?.get("page");
  const sortString = searchParams?.get("sort");
  const searchDep = searchParams?.get("searchDep");
  const searchDes = searchParams?.get("searchDes");

  const page = pageString ? +pageString : 1;
  const pageSize = pageSizeString ? +pageSizeString : 5;
  const parseSortString = (sortString: string) => {
    const sortOrders: { [key: string]: "ascend" | "descend" } = {};
    if (sortString) {
      sortString.split(",").forEach((sortPart) => {
        const [field, order] = sortPart.split(" ");
        sortOrders[field] = order === "asc" ? "ascend" : "descend";
      });
    }
    return sortOrders;
  };
  const sortOrders = parseSortString(sortString ? sortString : "");

  const { loading, error, data, refetch } = useQuery(GET_ROUTE_PAGINATION, {
    variables: {
      paginationRoute: {
        limit: pageSize,
        offset: page - 1,
        sort: sortString,
        searchDep: searchDep,
        searchDes: searchDes,
      },
    },
  });
  const routesData = data?.paginationRoute?.routes || [];
  const total = data?.paginationRoute?.totalCount;
  const [paginationTable, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: pageSize,
  });
  const handleRemove = async (id: string) => {
    try {
      await removeRoute({
        variables: { id },
      });
      message.success("Route removed successfully");
      refetch();
    } catch (error) {
      message.error("Failed to remove route");
    }
  };

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedRoute(null);
  };

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
      if (dataIndex === "departurePort") params.delete("searchDep");
      else if (dataIndex === "destinationPort") params.delete("searchDes");
    } else {
      if (dataIndex === "departurePort")
        params.set("searchDep", selectedKeys[0]);
      else if (dataIndex === "destinationPort")
        params.set("searchDes", selectedKeys[0]);
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

  const columns = [
    {
      title: "Departure Port",
      dataIndex: ["departurePort", "name"],
      key: "departurePort",
      ...getColumnSearchProps("departurePort", searchDep ? searchDep : ""),
    },
    {
      title: "Destination Port",
      dataIndex: ["destinationPort", "name"],
      key: "destinationPort",
      ...getColumnSearchProps("destinationPort", searchDes ? searchDes : ""),
    },
    {
      title: "Distance (Km)",
      dataIndex: "distance",
      key: "distance",
      sorter: { multiple: 1 },
      defaultSortOrder: sortOrders["distance"],
      render: (text: string, record: any) => {
        return record.distance.toFixed(2);
      },
    },

    {
      title: "Estimated Time (day)",
      dataIndex: ["estimatedTimeDays"],
      key: "estimatedTime",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: Route) => (
        <div>
          <Button
            type="link"
            onClick={() => router.push(`/routedetail/${record.id}`)}
            icon={<EyeOutlined />}
          >
            View
          </Button>
          {permissionUser?.includes("update:route") && (
            <Button
              type="link"
              onClick={() => handleEdit(record)}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          )}
          {permissionUser?.includes("delete:route") && (
            <Popconfirm
              placement="topLeft"
              title={"Are you sure to delete this route?"}
              description={"Delete the route"}
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
  ];

  return (
    <div className={styles.body}>
      <div className={styles.Title}>Routes</div>
      <div className={styles.subtitle}>
        <div className={styles.subtitle}>
          Manage and view information about all available routes.
        </div>
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <Row>
        <Col span={24}>
          <div className={styles.createButton}>
            {" "}
            {permissionUser?.includes("create:route") && (
              <CreateRouteModal
                limit={pageSize}
                offset={page - 1}
                sort={sortString ? sortString : ""}
                refetchRoute={refetch}
              />
            )}
          </div>
          <Table
            dataSource={routesData}
            columns={columns}
            className={styles.Table}
            pagination={{
              current: paginationTable.current,
              pageSize: paginationTable.pageSize,
              total: total,
              pageSizeOptions: ["5", "10", "20"],
              showSizeChanger: true,
            }}
            onChange={handleTableChange}
          />
          {selectedRoute && (
            <UpdateRouteModal
              id={selectedRoute.id}
              route={selectedRoute}
              visible={isUpdateModalVisible}
              onClose={handleUpdateModalClose}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RoutesList;
