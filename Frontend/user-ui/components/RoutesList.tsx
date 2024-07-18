// components/RoutesList.tsx
import { useQuery, gql } from "@apollo/client";
import { List, Spin } from "antd";

const GET_ROUTES = gql`
  query GetRoutes {
    routes {
      id
      name
      origin
      destination
    }
  }
`;

const RoutesList = () => {
  const { loading, error, data } = useQuery(GET_ROUTES);

  if (loading) return <Spin />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <List
      itemLayout="horizontal"
      dataSource={data.routes}
      renderItem={(route: any) => (
        <List.Item>
          <List.Item.Meta
            title={route.name}
            description={`From: ${route.origin} To: ${route.destination}`}
          />
        </List.Item>
      )}
    />
  );
};

export default RoutesList;
