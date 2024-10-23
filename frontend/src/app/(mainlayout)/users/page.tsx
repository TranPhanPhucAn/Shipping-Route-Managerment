"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Table,
  Button,
  Popconfirm,
  TablePaginationConfig,
  Tag,
  Divider,
  Avatar,
  Input,
  Space,
  message,
  Row, 
  Col,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { usePathname, useRouter } from "next/navigation";
import { GET_USER_PAGINATION, QUERY_ROLES } from "@/src/graphql/queries/query";
import { useSearchParams } from "next/navigation";
import { FilterDropdownProps } from "antd/es/table/interface";
import UpdateUserRoleModal from "@/src/components/ListUser/UpdateUserRoleModal";
import { DELETE_USER } from "@/src/graphql/mutations/Auth";
import { useSession } from "next-auth/react";

const UserList = () => {
  const { data: session, status, update } = useSession();
  const permissionUser = session?.user?.permissionNames;
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // const limit = 5;
  const pageSizeString = searchParams?.get("limit");
  const pageString = searchParams?.get("page");
  const sortString = searchParams?.get("sort");
  const genderFilter = searchParams?.get("gender");
  const roleFilter = searchParams?.get("role");
  const search = searchParams?.get("search");
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const page = pageString ? +pageString : 1;
  const pageSize = pageSizeString ? +pageSizeString : 5;

  const parseSortString = (sortString: string) => {
    const sortOrders: { [key: string]: "ascend" | "descend" } = {};
    if (sortString) {
      sortString.split(",").forEach((sortPart) => {
        const [field, order] = sortPart.split(" ");
        sortOrders[field] = order === "asc" ? "ascend" : "descend";
      });
    }
    return sortOrders;
  };
  const sortOrders = parseSortString(sortString ? sortString : "");

  const [removeUser, { loading: deleteLoading }] = useMutation(DELETE_USER);
  const { loading, error, data, refetch } = useQuery(GET_USER_PAGINATION, {
    variables: {
      paginationUser: {
        limit: pageSize,
        offset: page - 1,
        sort: sortString,
        genderFilter: genderFilter,
        roleFilter: roleFilter,
        search: search,
      },
    },
  });
  const users = data?.paginationUser?.users;
  const total = data?.paginationUser?.totalCount;
  const [paginationTable, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: pageSize,
  });
  const {
    loading: loadingRole,
    error: errorRole,
    data: dataRoles,
  } = useQuery(QUERY_ROLES);
  const roles = dataRoles?.roles;

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const params = new URLSearchParams(searchParams ?? "");

    if (pagination && pagination.current != paginationTable.current) {
      params.set("page", pagination.current);
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
    }

    if (pagination && pagination.pageSize != paginationTable.pageSize) {
      params.set("limit", pagination.pageSize);
      params.set("page", "1");
      setPagination({ pageSize: pagination.pageSize, current: 1 });
    }

    if (sorter) {
      let checkSorter: boolean = true;
      let resultUrl = "";
      if (sorter.length) {
        for (let i = 0; i < sorter.length; i++) {
          let order = sorter[i].order;
          if (order === "ascend") {
            order = "asc";
          } else if (order === "descend") {
            order = "desc";
          }
          resultUrl = resultUrl + sorter[i].field + " " + order;
          if (i < sorter.length - 1) {
            resultUrl += ",";
          }
        }
      } else {
        if (!sorter.order) {
          params.delete("sort");
          checkSorter = false;
        }
        let order = sorter.order;
        if (order === "ascend") {
          order = "asc";
        } else if (order === "descend") {
          order = "desc";
        }
        resultUrl = sorter.field + " " + order;
      }
      if (checkSorter === true) {
        params.set("sort", resultUrl);
      }
    }

    if (filters) {
      if (!filters.gender && !filters.role) {
        params.delete("gender");
        params.delete("role");
      } else {
        if (!filters.gender) {
          params.delete("gender");
        } else {
          let genderUrl = "";
          for (let i = 0; i < filters.gender.length; i++) {
            genderUrl = genderUrl + filters.gender[i];
            if (i < filters.gender.length - 1) {
              genderUrl += ",";
            }
          }
          params.set("gender", genderUrl);
        }

        if (!filters.role) {
          params.delete("role");
        } else {
          let roleUrl = "";
          for (let i = 0; i < filters.role.length; i++) {
            roleUrl = roleUrl + filters.role[i];
            if (i < filters.role.length - 1) {
              roleUrl += ",";
            }
          }
          params.set("role", roleUrl);
        }
      }
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: any
  ) => {
    confirm();
    const params = new URLSearchParams(searchParams ?? "");
    if (selectedKeys.length === 0) {
      params.delete("search");
    } else {
      params.set("search", selectedKeys[0]);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: any, searchTerm: string | null) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    defaultFilteredValue: searchTerm ? [searchTerm] : null,
  });

  const handleEdit = async (record: any) => {
    setSelectedUser(record);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedUser(null);
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
      title: "Full Name",
      dataIndex: "username",
      key: "username",
      sorter: { multiple: 1 },
      defaultSortOrder: sortOrders["username"],
      ...getColumnSearchProps("username", search ? search : ""),
      render: (text: string, record: any) => {
        if (record.image_url) {
          return (
            <span>
              <Avatar size={40} src={record.image_url}></Avatar>
              <span style={{ paddingLeft: "7px" }}>{record.username}</span>
            </span>
          );
        } else {
          return (
            <span>
              <Avatar
                size={40}
                style={{ backgroundColor: "#334155" }}
                icon={<UserOutlined />}
              />
              <span style={{ paddingLeft: "7px" }}>{record.username}</span>
            </span>
          );
        }
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text: string, record: any) => {
        if (record?.role?.name) {
          let color = "";
          if (record?.role?.name === "admin") {
            color = "blue";
          } else if (record?.role?.name === "supplier") {
            color = "red";
          } else {
            color = "#58D68D";
          }
          return (
            <Tag color={color} key={record.gender}>
              {record?.role?.name}
            </Tag>
          );
        }
        return "";
      },
      filters: roles
        ? roles.map((role: any) => ({
            text: role.name,
            value: role.name,
          }))
        : [],
      defaultFilteredValue: roleFilter?.split(","),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text: string, record: any) => {
        if (record?.gender) {
          let color = "";
          if (record.gender === "Male") {
            color = "blue";
          } else if (record.gender === "Female") {
            color = "pink";
          } else {
            color = "#58D68D";
          }
          return (
            <Tag color={color} key={record.gender}>
              {record.gender}
            </Tag>
          );
        }
        return "";
      },
      filters: [
        {
          text: "Male",
          value: "Male",
        },
        {
          text: "Female",
          value: "Female",
        },
        {
          text: "Other",
          value: "Other",
        },
      ],
      defaultFilteredValue: genderFilter?.split(","),
    },
    ...(permissionUser?.includes("assignRole:user") ||
    permissionUser?.includes("delete:user")
      ? [
          {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (text: string, record: any) => (
              <>
                {permissionUser?.includes("assignRole:user") && (
                  <Button
                    type="link"
                    onClick={() => handleEdit(record)}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                )}
                {permissionUser?.includes("delete:user") && (
                  <Popconfirm
                    placement="topLeft"
                    title={"Are you sure to delete this user?"}
                    description={"Delete the user"}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleRemove(record.id)}
                    onCancel={() => console.log("Delete canceled")}
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>
                )}
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className={styles.body}>
      <div className={styles.Title}>List Users</div>
      <div className={styles.subtitle}>
        Search our users to find the connection.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <Row>
        <Col span={24}>
        <Table
          dataSource={users ? users : []}
          columns={columns}
          className={styles.Table}
          rowKey={"id"}
          pagination={{
            current: paginationTable.current,
            pageSize: paginationTable.pageSize,
            total: total,
            pageSizeOptions: ["5", "10", "20"],
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
        {selectedUser && (
          <UpdateUserRoleModal
            user={selectedUser}
            visible={isUpdateModalVisible}
            onClose={handleUpdateModalClose}
          />
        )}
        </Col>
      </Row>
    </div>
  );
};

export default UserList;
