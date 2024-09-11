"use client";
import { useQuery } from "@apollo/client";
import { Table, Button } from "antd";
import { GET_ROUTES } from "../../graphql/queries/query";
import { GetRoutesData } from "../../graphql/types";
import CreateRouteModal from "./CreateRoute.Modal";
const RoutesList: React.FC = () => {
  const { loading, error, data } = useQuery<GetRoutesData>(GET_ROUTES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Departure Port",
      dataIndex: ["departurePort", "name"],
      key: "departurePort",
    },
    {
      title: "Destination Port",
      dataIndex: ["destinationPort", "name"],
      key: "destinationPort",
    },
    {
      title: "Distance (KM)",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
    },
  ];

  return (
    <div>
      <Button>Create Route</Button>
      <Table dataSource={data?.routes} columns={columns} rowKey="id"></Table>
    </div>
  );
};

export default RoutesList;
