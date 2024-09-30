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
import { GET_ROUTES, GET_PORTS } from "../../../../graphql/queries/query";
import {
  GetRoutesData,
  Route,
  GetPortsData,
  Port,
} from "../../../../graphql/types";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import CreateRouteModal from "../../../../components/Routes/CreateRouteModal";
import UpdateRouteModal from "../../../../components/Routes/UpdateRouteModal";
import { DELETE_ROUTE } from "@/src/graphql/mutations/Auth";
import { useState, useEffect } from "react";
import styles from "../../../../styles/Listpage.module.css";
import { useParams, useRouter } from "next/navigation";

const getUniqueValues = (data: any[], key: string) => {
  return Array.from(
    new Set(data.map((item) => key.split(".").reduce((o, i) => o[i], item)))
  );
};
const { Option } = Select;
const RoutesList = () => {
  const { loading, error, data, refetch } = useQuery<GetRoutesData>(GET_ROUTES);
  const routesData = data?.routes || [];
  // const { data } = useQuery<GetPortsData>(GET_PORTS);
  // const PortsData: Port[] = data?.ports || [];
  const [removeRoute, { loading: deleteLoading }] = useMutation(DELETE_ROUTE);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
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
  // const filteredRoutes = routesData.filter((route) => {
  //   const departurePortName = route.departurePort.name.toLowerCase();
  //   const destinationPortName = route.destinationPort.name.toLowerCase();
  //   const search = searchText.toLowerCase();

  //   return (
  //     departurePortName.includes(search) || destinationPortName.includes(search)
  //   );
  // });

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
            onClick={() => router.push(`/route/${record.id}`)}
            icon={<EyeOutlined />}
          >
            View
          </Button>
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
    <div className={styles.body}>
      <div className={styles.Title}>Routes</div>
      <div className={styles.subtitle}>
        Search our extensive routes to find the schedule which fits your supply
        chain.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <CreateRouteModal />
      {/* <Input.Search>
        <Select
          showSearch
          placeholder="Search by Departure Port or Destination Port"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          filterOption={(input, option) =>
            String(option?.children)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {PortsData.map((port) => (
            <Option key={port.id} value={port.id}>
              {port.name}
            </Option>
          ))}
        </Select>
      </Input.Search> */}
      <div className={styles.container}>
        <Table
          dataSource={routesData}
          columns={columns}
          className={styles.Table}
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
          />
        )}
      </div>
    </div>
  );
};

export default RoutesList;
