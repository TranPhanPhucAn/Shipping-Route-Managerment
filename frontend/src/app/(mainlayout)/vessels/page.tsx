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
import { GET_VESSELS } from "@/src/graphql/queries/query";
import { DELETE_VESSEL } from "@/src/graphql/mutations/Auth";
import { GetVesselsData, Vessel } from "@/src/graphql/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CreateVesselModal from "@/src/components/Vessels/CreateVesselModal";
import UpdateVesselModal from "@/src/components/Vessels/UpdateVesselModal";
import { useState } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { useSession } from "next-auth/react";

const VesselList = () => {
  const { data: session } = useSession();
  const permissionUser = session?.user?.permissionNames;
  const { loading, error, data, refetch } = useQuery<GetVesselsData>(GET_VESSELS);
  const vesselsData = data?.vessels || [];
  const [removeVessel, { loading: deleteLoading }] = useMutation(DELETE_VESSEL);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const handleRemove = async (id: string) => {
    try {
      await removeVessel({ variables: { id } });
      message.success("Vessel removed successfully");
      refetch();
    } catch (error) {
      message.error("Failed to remove vessel");
    }
  };

  const handleEdit = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedVessel(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Vessel, b: Vessel) => a.id.localeCompare(b.id),
    },
    {
      title: "Vessel Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Vessel, b: Vessel) => a.name.localeCompare(b.name),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a: Vessel, b: Vessel) => a.type.localeCompare(b.type),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      sorter: (a: Vessel, b: Vessel) => a.capacity - b.capacity,
    },
    {
      title: "Owner",
      dataIndex: "ownerId",
      key: "ownerId",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: Vessel) => (
        <div>
          {permissionUser?.includes("update:vessel") && (
            <Button
              type="link"
              onClick={() => handleEdit(record)}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          )}
          {permissionUser?.includes("delete:vessel") && (
            <Popconfirm
              placement="topLeft"
              title={"Are you sure to delete this vessel?"}
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
      <div className={styles.Title}>Vessels</div>
      <div className={styles.subtitle}>
        Manage and view information about all available vessels.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <div className={styles.createButton}>
        {permissionUser?.includes("create:vessel") && <CreateVesselModal />}
      </div>
      <div className={styles.container}>
        <Table
          dataSource={vesselsData}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 5 }}
          className={styles.Table}
        />
        {selectedVessel && (
          <UpdateVesselModal
            id={selectedVessel.id}
            vessel={selectedVessel}
            visible={isUpdateModalVisible}
            onClose={handleUpdateModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default VesselList;
