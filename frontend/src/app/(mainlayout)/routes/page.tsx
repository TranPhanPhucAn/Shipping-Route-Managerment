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
import { GET_ROUTES, GET_PORTS } from "@/src/graphql/queries/query";
import { GetRoutesData, Route, GetPortsData, Port } from "@/src/graphql/types";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import CreateRouteModal from "@/src/components/Routes/CreateRouteModal";
import UpdateRouteModal from "@/src/components/Routes/UpdateRouteModal";
import { DELETE_ROUTE } from "@/src/graphql/mutations/Auth";
import { useState, useEffect } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const getUniqueValues = (data: any[], key: string) => {
  return Array.from(
    new Set(data.map((item) => key.split(".").reduce((o, i) => o[i], item)))
  );
};
const { Option } = Select;
const RoutesList = () => {
  const { data: session, status, update } = useSession();
  const permissionUser = session?.user?.permissionNames;
  const { loading, error, data, refetch } = useQuery<GetRoutesData>(GET_ROUTES);
  const routesData = data?.routes || [];
  const [removeRoute, { loading: deleteLoading }] = useMutation(DELETE_ROUTE);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const params = useParams();
  const router = useRouter();

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
      <div className={styles.createButton}>
        {" "}
        {permissionUser?.includes("create:route") && <CreateRouteModal />}
      </div>
      <div className={styles.container}>
        <Table
          dataSource={routesData}
          columns={columns}
          className={styles.Table}
          pagination={{
            pageSize: 5,
          }}
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
// "use client";
// import { useMutation, useQuery } from "@apollo/client";
// import {
//   Table,
//   Button,
//   message,
//   Popconfirm,
//   TablePaginationConfig,
//   Divider,
//   Input,
//   Select,
// } from "antd";
// import { GET_ROUTE_PAGINATION, GET_PORTS } from "@/src/graphql/queries/query";
// import { GetRoutesData, Route, GetPortsData, Port } from "@/src/graphql/types";
// import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
// import CreateRouteModal from "@/src/components/Routes/CreateRouteModal";
// import UpdateRouteModal from "@/src/components/Routes/UpdateRouteModal";
// import { DELETE_ROUTE } from "@/src/graphql/mutations/Auth";
// import { useState, useEffect } from "react";
// import styles from "@/src/styles/Listpage.module.css";
// import {
//   useParams,
//   useRouter,
//   useSearchParams,
//   usePathname,
// } from "next/navigation";
// import { useSession } from "next-auth/react";

// const getUniqueValues = (data: any[], key: string) => {
//   return Array.from(
//     new Set(data.map((item) => key.split(".").reduce((o, i) => o[i], item)))
//   );
// };
// const { Option } = Select;

// const RoutesList = () => {
//   const { data: session, status, update } = useSession();
//   const permissionUser = session?.user?.permissionNames;
//   const { replace } = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const limit = 5;
//   const pageString = searchParams?.get("page");
//   const sortString = searchParams?.get("sort");
//   const page = pageString ? +pageString : 1;
//   const [search, setSearch] = useState("");

//   const { loading, error, data, refetch } = useQuery(GET_ROUTE_PAGINATION, {
//     variables: {
//       paginationRoute: {
//         limit: limit,
//         offset: (page - 1) * limit,
//         sort: sortString,
//         Portsearch: search,
//       },
//     },
//   });

//   const routesData = data?.paginationRoute?.routes || [];
//   const totalCount = data?.paginationRoute?.totalCount || 0;
//   const [removeRoute, { loading: deleteLoading }] = useMutation(DELETE_ROUTE);
//   const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
//   const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
//   const [paginationTable, setPagination] = useState<TablePaginationConfig>({
//     current: page,
//     pageSize: limit,
//   });

//   const handleRemove = async (id: string) => {
//     try {
//       await removeRoute({
//         variables: { id },
//       });
//       message.success("Route removed successfully");
//       refetch();
//     } catch (error) {
//       message.error("Failed to remove route");
//     }
//   };

//   const handleEdit = (route: Route) => {
//     setSelectedRoute(route);
//     setIsUpdateModalVisible(true);
//   };

//   const handleUpdateModalClose = () => {
//     setIsUpdateModalVisible(false);
//     setSelectedRoute(null);
//   };

//   const handleTableChange = (pagination: any, filters: any, sorter: any) => {
//     if (pagination && pagination.current !== paginationTable.current) {
//       const params = new URLSearchParams(searchParams ?? "");
//       params.set("page", pagination.current.toString());
//       setPagination({ current: pagination.current, pageSize: limit });
//       replace(`${pathname}?${params.toString()}`);
//       return;
//     }
//     if (sorter) {
//       const params = new URLSearchParams(searchParams ?? "");
//       let resultUrl = "";
//       if (Array.isArray(sorter)) {
//         resultUrl = sorter
//           .map((s) => `${s.field} ${s.order === "ascend" ? "asc" : "desc"}`)
//           .join(",");
//       } else if (sorter.order) {
//         const order = sorter.order === "ascend" ? "asc" : "desc";
//         resultUrl = `${sorter.field} ${order}`;
//       } else {
//         params.delete("sort");
//         replace(`${pathname}?${params.toString()}`);
//         return;
//       }
//       params.set("sort", resultUrl);
//       replace(`${pathname}?${params.toString()}`);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       refetch({
//         paginationRoute: {
//           limit: limit,
//           offset: (page - 1) * limit,
//           sort: sortString,
//           search: search,
//         },
//       });
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search, page, sortString, refetch]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   const columns = [
//     {
//       title: "Route",
//       dataIndex: "id",
//       key: "id",
//       render: (text: string, record: any) => {
//         const departurePortId = record.departurePort.id;
//         const destinationPortId = record.destinationPort.id;
//         return `${departurePortId} - ${destinationPortId}`;
//       },
//       sorter: true,
//     },
//     {
//       title: "Departure Port",
//       dataIndex: ["departurePort", "name"],
//       key: "departurePort",
//       sorter: true,
//       filters: getUniqueValues(routesData, "departurePort.name").map(
//         (name) => ({
//           text: name,
//           value: name,
//         })
//       ),
//       onFilter: (value: any, record: any) =>
//         record.departurePort.name === value,
//     },
//     {
//       title: "Destination Port",
//       dataIndex: ["destinationPort", "name"],
//       key: "destinationPort",
//       sorter: true,
//       filters: getUniqueValues(routesData, "destinationPort.name").map(
//         (name) => ({
//           text: name,
//           value: name,
//         })
//       ),
//       onFilter: (value: any, record: any) =>
//         record.destinationPort.name === value,
//     },
//     {
//       title: "Distance (Km)",
//       dataIndex: "distance",
//       key: "distance",
//       sorter: true,
//       filters: [
//         { text: "Less than 500 Km", value: "less500" },
//         { text: "500-1000 Km", value: "500to1000" },
//         { text: "Greater than 1000 Km", value: "greater1000" },
//       ],
//       onFilter: (value: any, record: any) => {
//         if (value === "less500") return record.distance < 500;
//         if (value === "500to1000")
//           return record.distance >= 500 && record.distance <= 1000;
//         if (value === "greater1000") return record.distance > 1000;
//         return true;
//       },
//     },
//     {
//       title: "Action",
//       dataIndex: "id",
//       key: "id",
//       render: (text: string, record: Route) => (
//         <div>
//           <Button
//             type="link"
//             onClick={() => replace(`/routedetail/${record.id}`)}
//             icon={<EyeOutlined />}
//           >
//             View
//           </Button>
//           {permissionUser?.includes("update:route") && (
//             <Button
//               type="link"
//               onClick={() => handleEdit(record)}
//               icon={<EditOutlined />}
//             >
//               Edit
//             </Button>
//           )}
//           {permissionUser?.includes("delete:route") && (
//             <Popconfirm
//               placement="topLeft"
//               title={"Are you sure to delete this route?"}
//               description={"Delete the route"}
//               okText="Yes"
//               cancelText="No"
//               onConfirm={() => handleRemove(record.id)}
//               onCancel={() => console.log("Delete canceled")}
//             >
//               <Button
//                 type="link"
//                 danger
//                 loading={deleteLoading}
//                 icon={<DeleteOutlined />}
//               >
//                 Delete
//               </Button>
//             </Popconfirm>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className={styles.body}>
//       <div className={styles.Title}>Routes</div>
//       <div className={styles.subtitle}>
//         Search our extensive routes to find the schedule which fits your supply
//         chain.
//       </div>
//       <Divider style={{ borderColor: "#334155" }}></Divider>
//       {permissionUser?.includes("create:route") && <CreateRouteModal />}
//       <div className={styles.container}>
//         <Input
//           placeholder="Search routes..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ marginBottom: 16 }}
//         />
//         <Table
//           dataSource={routesData}
//           columns={columns}
//           className={styles.Table}
//           pagination={{
//             current: paginationTable.current,
//             pageSize: limit,
//             total: totalCount,
//             showSizeChanger: false,
//             showQuickJumper: true,
//           }}
//           onChange={handleTableChange}
//         />
//         {selectedRoute && (
//           <UpdateRouteModal
//             id={selectedRoute.id}
//             route={selectedRoute}
//             visible={isUpdateModalVisible}
//             onClose={handleUpdateModalClose}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default RoutesList;
