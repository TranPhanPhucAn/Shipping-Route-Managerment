"use client";
import { useMutation, useQuery } from "@apollo/client";
import { Table, Button, message, Breadcrumb } from "antd";
import { GET_ROUTES } from "../../graphql/queries/query";
import { GetRoutesData, Route } from "../../graphql/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CreateRouteModal from "./CreateRouteModal";
import UpdateRouteModal from "./UpdateRouteModal";
import { DELETE_ROUTE } from "@/src/graphql/mutations/Auth";
import { useState } from "react";
import styles from "../../styles/Route.module.css";

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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: routesData.length,
  });

  const handleTableChange = (paginationInfo: any) => {
    setPagination(paginationInfo);
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
          <Button
            type="link"
            danger
            onClick={() => handleRemove(record.id)}
            loading={deleteLoading}
            icon={<DeleteOutlined />}
          
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* <div className={styles.buttonContainer}>
        <CreateRouteModal />
      </div> */}
      <Table
        dataSource={routesData}
        columns={columns}
        className={styles.routeTable}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{
          x: 500,
          y: 500,
        }}
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
  );
};

export default RoutesList;
