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
} from "antd";
import {
  GET_ROUTES,
  GET_PORTS,
  GET_ROUTE_PAGINATION,
} from "@/src/graphql/queries/query";
import { GetRoutesData, Route, GetPortsData, Port } from "@/src/graphql/types";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import CreateRouteModal from "@/src/components/Routes/CreateRouteModal";
import UpdateRouteModal from "@/src/components/Routes/UpdateRouteModal";
import { DELETE_ROUTE } from "@/src/graphql/mutations/Auth";
import { useState, useEffect } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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
    //  if (filters) {
    //    if (
    //      !filters.status ||
    //      !Array.isArray(filters.status) ||
    //      filters.status.length === 0
    //    ) {
    //      params.delete("status");
    //    } else {
    //      const statusUrl = filters.status.join(",");
    //      params.set("status", statusUrl);
    //    }
    //  }
    replace(`${pathname}?${params.toString()}`);
  };

  const columns = [
    {
      title: "Departure Port",
      dataIndex: ["departurePort", "name"],
      key: "departurePort",
      // sorter: (a: any, b: any) =>
      //   a.departurePort.name.localeCompare(b.departurePort.name),
      // filters: getUniqueValues(routesData, "departurePort.name").map(
      //   (name) => ({
      //     text: name,
      //     value: name,
      //   })
      // ),
      // onFilter: (value: any, record: any) =>
      //   record.departurePort.name === value,
    },
    {
      title: "Destination Port",
      dataIndex: ["destinationPort", "name"],
      key: "destinationPort",
      // sorter: (a: any, b: any) =>
      //   a.destinationPort.name.localeCompare(b.destinationPort.name),
      // filters: getUniqueValues(routesData, "destinationPort.name").map(
      //   (name) => ({
      //     text: name,
      //     value: name,
      //   })
      // ),
      // onFilter: (value: any, record: any) =>
      //   record.destinationPort.name === value,
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
        Search our extensive routes to find the schedule which fits your supply
        chain.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <div className={styles.body}>
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
        <div className={styles.container}>
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
        </div>
      </div>
    </div>
  );
};

export default RoutesList;
