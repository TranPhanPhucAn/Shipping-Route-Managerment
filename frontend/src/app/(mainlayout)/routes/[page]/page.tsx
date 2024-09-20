"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
} from "antd";
import { GET_ROUTES } from "../../../../graphql/queries/query";
import { GetRoutesData, Route } from "../../../../graphql/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CreateRouteModal from "../../../../components/Routes/CreateRouteModal";
import UpdateRouteModal from "../../../../components/Routes/UpdateRouteModal";
import { DELETE_ROUTE } from "@/src/graphql/mutations/Auth";
import { useState, useEffect } from "react";
import styles from "../../../../styles/Route.module.css";
import { useParams, useRouter } from "next/navigation";

const getUniqueValues = (data: any[], key: string) => {
  return Array.from(
    new Set(data.map((item) => key.split(".").reduce((o, i) => o[i], item)))
  );
};

const RoutesList = () => {
  const { loading, error, data, refetch } = useQuery<GetRoutesData>(GET_ROUTES);
  const [removeRoute, { loading: deleteLoading }] = useMutation(DELETE_ROUTE);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const routesData = data?.routes || [];
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
    router.push(`/routes/${pagination.current}`);
  };
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns = [
    {
      title: "Route",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: any) => {
        const departurePortId = record.departurePort.id;
        const destinationPortId = record.destinationPort.id;
        return `${departurePortId} - ${destinationPortId}`;
      },
      sorter: (a: any, b: any) =>
        `${a.departurePort.id}-${a.destinationPort.id}`.localeCompare(
          `${b.departurePort.id}-${b.destinationPort.id}`
        ),
    },
    {
      title: "Departure Port",
      dataIndex: ["departurePort", "name"],
      key: "departurePort",
      sorter: (a: any, b: any) =>
        a.departurePort.name.localeCompare(b.departurePort.name),
      filters: getUniqueValues(routesData, "departurePort.name").map(
        (name) => ({
          text: name,
          value: name,
        })
      ),
      onFilter: (value: any, record: any) =>
        record.departurePort.name === value,
    },
    {
      title: "Destination Port",
      dataIndex: ["destinationPort", "name"],
      key: "destinationPort",
      sorter: (a: any, b: any) =>
        a.destinationPort.name.localeCompare(b.destinationPort.name),
      filters: getUniqueValues(routesData, "destinationPort.name").map(
        (name) => ({
          text: name,
          value: name,
        })
      ),
      onFilter: (value: any, record: any) =>
        record.destinationPort.name === value,
    },
    {
      title: "Distance (Km)",
      dataIndex: "distance",
      key: "distance",
      sorter: (a: any, b: any) => a.distance - b.distance,
      filters: [
        { text: "Less than 500 Km", value: "less500" },
        { text: "500-1000 Km", value: "500to1000" },
        { text: "Greater than 1000 Km", value: "greater1000" },
      ],
      onFilter: (value: any, record: any) => {
        if (value === "less500") return record.distance < 500;
        if (value === "500to1000")
          return record.distance >= 500 && record.distance <= 1000;
        if (value === "greater1000") return record.distance > 1000;
        return true;
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: Route) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
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
        </>
      ),
    },
  ];

  return (
    <div>
      <h1 className={styles.Title}>ROUTES</h1>
      <p className={styles.addButton}>
        <CreateRouteModal />
      </p>
      <div className={styles.container}>
        <Table
          dataSource={routesData}
          columns={columns}
          className={styles.routeTable}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
          }}
          onChange={handleTableChange}
        />
        {selectedRoute && (
          <UpdateRouteModal
            id={selectedRoute.id}
            route={selectedRoute}
            visible={isUpdateModalVisible}
            onClose={handleUpdateModalClose}
            // refetch={refetch}
          />
        )}
      </div>
    </div>
  );
};

export default RoutesList;
