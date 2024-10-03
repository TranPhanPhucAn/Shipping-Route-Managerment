"use client";
import { useMutation, useQuery } from "@apollo/client";
import { Table, Button, Popconfirm, Divider, message, Checkbox } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import styles from "@/src/styles/Listpage.module.css";
import {
  QUERY_PERMISSIONS,
  QUERY_ROLE,
  QUERY_ROLES,
} from "@/src/graphql/queries/query";
import CreateRoleModal from "@/src/components/Role/CreateRoleModal";
import { useParams, useRouter } from "next/navigation";
import { ASSIGN_PER_FOR_ROLE } from "@/src/graphql/mutations/Auth";

const RolePermission = () => {
  const { loading, error, data, refetch } = useQuery(QUERY_PERMISSIONS);
  const params = useParams();
  const {
    loading: loadingRole,
    error: errorRole,
    data: dataRole,
    refetch: refetchRole,
  } = useQuery(QUERY_ROLE, {
    variables: {
      id: params?.id,
    },
  });
  const [
    assignPerForRole,
    { loading: loadingUpdatePerRole, error: errorPerRole },
  ] = useMutation(ASSIGN_PER_FOR_ROLE);
  const permissions = data?.permissions;
  const router = useRouter();
  const permissionRole = dataRole?.role.permissions;
  const [listPer, setListPer] = useState<string[]>([]);
  useEffect(() => {
    if (permissionRole) {
      let temp = [];
      for (let per of permissionRole) {
        temp.push(per.id);
      }
      setListPer(temp);
    }
  }, [permissionRole]);

  const handleEdit = async (record: any) => {
    router.push(`/roles/${record.id}`);
  };
  const onChangeCheckbox = (checkedValues: any) => {
    console.log("checked = ", checkedValues);
    setListPer(checkedValues);
  };
  const handleUpdatePerRole = async () => {
    try {
      await assignPerForRole({
        variables: {
          assignPermissionDto: {
            roleId: params?.id,
            updatePermissions: listPer,
          },
        },
      });
      refetchRole();
      message.success("Update permission for role successfully");
    } catch (error) {
      console.error("Error update permission for role:", error);
      message.error("Failed to update permission for role");
    }
  };
  const columns = [
    {
      title: "Have",
      render: (text: string, record: any) => (
        <>
          <Checkbox value={record.id}></Checkbox>
        </>
      ),
    },
    {
      title: "Permission",
      dataIndex: "permission",
      key: "permission",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
        </>
      ),
    },
  ];

  return (
    <div className={styles.body}>
      <div className={styles.Title}>Role {dataRole?.role.name}</div>
      <div className={styles.subtitle}>Update permission for role</div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <div className={styles.container}>
        {listPer && listPer.length > 0 && (
          <Checkbox.Group onChange={onChangeCheckbox} defaultValue={listPer}>
            <Table
              dataSource={permissions ? permissions : []}
              columns={columns}
              className={styles.Table}
              rowKey={"id"}
              pagination={false}
            />
          </Checkbox.Group>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: "50px",
        }}
      >
        <Button type="primary" onClick={() => handleUpdatePerRole()}>
          Update
        </Button>
      </div>
    </div>
  );
};

export default RolePermission;
