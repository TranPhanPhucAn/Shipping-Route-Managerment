"use client";
import { useMutation, useQuery } from "@apollo/client";
import { Table, Button, Popconfirm, Divider, message, Col, Row} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import styles from "@/src/styles/Listpage.module.css";
import { QUERY_ROLES } from "@/src/graphql/queries/query";
import CreateRoleModal from "@/src/components/Role/CreateRoleModal";
import { DELETE_ROLE } from "@/src/graphql/mutations/Auth";
import { useRouter } from "next/navigation";

const Roles = () => {
  const router = useRouter();
  const { loading, error, data, refetch } = useQuery(QUERY_ROLES);
  const [removeUser, { loading: deleteLoading }] = useMutation(DELETE_ROLE);
  const roles = data?.roles;
  const handleEdit = async (record: any) => {
    router.push(`/roles/${record.id}`);
  };
  const handleRemove = async (id: string) => {
    try {
      await removeUser({
        variables: { id },
      });
      message.success("User removed successfully");
      refetch();
    } catch (error) {
      message.error("Failed to remove user");
    }
  };
  const columns = [
    {
      title: "Role title",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Role Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string, record: any) => {
        const formattedDate = new Date(record.createdAt).toLocaleDateString(
          "en-GB"
        );
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: any) => (
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
            title={"Are you sure to delete this user?"}
            description={"Delete the user"}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleRemove(record.id)}
            onCancel={() => console.log("Delete canceled")}
          >
            <Button
              type="link"
              danger
              // loading={deleteLoading}
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
      <div className={styles.Title}>List Roles</div>
      <div className={styles.subtitle}>
        Manage role and permission of roles.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <Row >
        <Col span={24}>
      <div className={styles.createButton}>
      <CreateRoleModal refetchRoles={refetch} />
      </div>
      <div className={styles.container}>
        <Table
          dataSource={roles ? roles : []}
          columns={columns}
          className={styles.Table}
          rowKey={"id"}
          pagination={false}
        />
      </div>
      </Col>
      </Row>
    </div>
  );
};

export default Roles;
