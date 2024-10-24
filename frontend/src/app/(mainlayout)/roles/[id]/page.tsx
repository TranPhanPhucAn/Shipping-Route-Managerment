"use client";
import { useMutation, useQuery } from "@apollo/client";
import { Table, Button, Divider, message, Checkbox, Form, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { QUERY_PERMISSIONS, QUERY_ROLE } from "@/src/graphql/queries/query";
import { useParams } from "next/navigation";
import { ASSIGN_PER_FOR_ROLE } from "@/src/graphql/mutations/Auth";
import UpdatePermissionModal from "@/src/components/Permission/UpdatePermissionModal";
import UpdateRoleModal from "@/src/components/Role/UpdateRoleModal";
import { useSession } from "next-auth/react";
import "./roledetail.scss";
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
  const { data: dataRoleBase } = useQuery(QUERY_ROLE, {
    variables: {
      id: "3",
    },
  });
  const [
    assignPerForRole,
    { loading: loadingUpdatePerRole, error: errorPerRole },
  ] = useMutation(ASSIGN_PER_FOR_ROLE);
  const permissions = data?.permissions;
  const permissionRole = dataRole?.role.permissions;
  const permissionRoleBase = dataRoleBase?.role.permissions;
  const [listPer, setListPer] = useState<string[]>([]);
  const [listPerBase, setListPerBase] = useState<string[]>([]);

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  useEffect(() => {
    if (permissionRole) {
      let temp = [];
      for (let per of permissionRole) {
        temp.push(per.id);
      }
      setListPer(temp);
    }
  }, [permissionRole, permissionRoleBase]);
  useEffect(() => {
    if (permissionRoleBase) {
      let temp = [];
      for (let per of permissionRoleBase) {
        temp.push(per.id);
      }
      setListPerBase(temp);
    }
  }, [permissionRoleBase]);

  const handleEdit = async (record: any) => {
    setSelectedPermission(record);
    setIsUpdateModalVisible(true);
  };
  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedPermission(null);
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
        <Checkbox
          value={record.id}
          disabled={
            dataRole?.role.id !== "3" && listPerBase?.includes(record.id)
          }
        ></Checkbox>
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
      <div className={styles.subtitle} style={{ marginBottom: "10px" }}>
        Update permission for role
      </div>
      {/* <div className="updateform">
        <Input
          placeholder="Role name"
          className={styles.input}
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // handleLogin();
            }
          }}
          style={{ marginRight: "20px" }}
        />
        <Input
          placeholder="Description"
          className={styles.input}
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // handleLogin();
            }
          }}
        />
      </div> */}
      {dataRole?.role && (
        <UpdateRoleModal refetchRole={refetchRole} role={dataRole?.role} />
      )}

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
            {selectedPermission && (
              <UpdatePermissionModal
                permission={selectedPermission}
                visible={isUpdateModalVisible}
                onClose={handleUpdateModalClose}
              />
            )}
          </Checkbox.Group>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "50px",
        }}
      >
        <Button className={styles.submitButton} onClick={() => handleUpdatePerRole()}>
          Update
        </Button>
      </div>
    </div>
  );
};

export default RolePermission;
