"use client";
import { useQuery, useMutation } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
  Divider,
} from "antd";
import { GET_PORTS } from "@/src/graphql/queries/query";
import { DELETE_PORT } from "@/src/graphql/mutations/Auth";
import { GetPortsData, Port } from "@/src/graphql/types";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import CreatePortModal from "@/src/components/Routes/CreatePort";
import UpdatePortModal from "@/src/components/Routes/UpdatePort";
import { useState } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const PortList = () => {
  const { data: session } = useSession();
  const permissionUser = session?.user?.permissionNames;
  const { loading, error, data, refetch } = useQuery<GetPortsData>(GET_PORTS);
  const portsData = data?.ports || [];
  const [removePort, { loading: deleteLoading }] = useMutation(DELETE_PORT);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const handleRemove = async (id: string) => {
    try {
      await removePort({ variables: { id } });
      message.success("Port removed successfully");
      refetch();
    } catch (error) {
      message.error("Failed to remove port");
    }
  };

  const handleEdit = (port: Port) => {
    setSelectedPort(port);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedPort(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Port, b: Port) => a.id.localeCompare(b.id),
    },
    {
      title: "Port Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Port, b: Port) => a.name.localeCompare(b.name),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: (a: Port, b: Port) => a.country.localeCompare(b.country),
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: Port) => (
        <div>
          {permissionUser?.includes("update:port") && (
            <Button
              type="link"
              onClick={() => handleEdit(record)}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          )}
          {permissionUser?.includes("delete:port") && (
            <Popconfirm
              placement="topLeft"
              title={"Are you sure to delete this port?"}
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleRemove(record.id)}
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
      <div className={styles.Title}>Ports</div>
      <div className={styles.subtitle}>
        Manage and view information about all available ports.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <div className={styles.createButton}>
        {permissionUser?.includes("create:port") && <CreatePortModal />}
      </div>
      <div className={styles.container}>
        <Table
          dataSource={portsData}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
          className={styles.Table}
        />
        {selectedPort && (
          <UpdatePortModal
            id={selectedPort.id}
            port={selectedPort}
            visible={isUpdateModalVisible}
            onClose={handleUpdateModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default PortList;
