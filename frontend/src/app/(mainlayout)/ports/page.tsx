"use client";
import { useQuery, useMutation } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
  Divider,
  Input,
  Space,
  Row,
  Col,
} from "antd";
import { GET_PORT_PAGINATION, GET_PORTS } from "@/src/graphql/queries/query";
import { DELETE_PORT } from "@/src/graphql/mutations/Auth";
import { GetPortsData, Port } from "@/src/graphql/types";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CreatePortModal from "@/src/components/Routes/CreatePort";
import UpdatePortModal from "@/src/components/Routes/UpdatePort";
import { useState } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FilterDropdownProps } from "antd/es/table/interface";

const PortList = () => {
  const { data: session } = useSession();
  const permissionUser = session?.user?.permissionNames;

  const [removePort, { loading: deleteLoading }] = useMutation(DELETE_PORT);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageSizeString = searchParams?.get("limit");
  const pageString = searchParams?.get("page");
  const sortString = searchParams?.get("sort");
  const search = searchParams?.get("search");
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

  const [paginationTable, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: pageSize,
  });
  const { loading, error, data, refetch } = useQuery(GET_PORT_PAGINATION, {
    variables: {
      paginationPort: {
        limit: pageSize,
        offset: page - 1,
        sort: sortString,
        search: search,
      },
    },
  });
  const portsData = data?.paginationPort?.ports || [];
  const total = data?.paginationPort?.totalCount;

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
    replace(`${pathname}?${params.toString()}`);
  };
  const handleRemove = async (id: string) => {
    try {
      await removePort({ variables: { id } });
      message.success("Port removed successfully");
      refetch();
    } catch (error) {
      message.error("Failed to remove port");
    }
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

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
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
      title: "Port Name",
      dataIndex: "name",
      key: "name",
      sorter: { multiple: 2 },
      defaultSortOrder: sortOrders["name"],
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: { multiple: 1 },
      defaultSortOrder: sortOrders["country"],
      ...getColumnSearchProps("country", search ? search : ""),
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
    ...(permissionUser?.includes("update:port") ||
    permissionUser?.includes("delete:port")
      ? [
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
        ]
      : []),
  ];

  return (
    <div className={styles.body}>
      <div className={styles.Title}>Ports</div>
      <div className={styles.subtitle}>
        Manage and view information about all available ports.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <Row >
        <Col span={24}>
        <div className={styles.createButton}>
          {permissionUser?.includes("create:port") && (
            <CreatePortModal
              limit={pageSize}
              offset={page - 1}
              sort={sortString ? sortString : ""}
              search={search ? search : ""}
              refetchPorts={refetch}
            />
          )}
        </div>
        
          <Table
            dataSource={portsData}
            columns={columns}
            loading={loading}
            pagination={{
              current: paginationTable.current,
              pageSize: paginationTable.pageSize,
              total: total,
              pageSizeOptions: ["5", "10", "20"],
              showSizeChanger: true,
            }}
            className={styles.Table}
            onChange={handleTableChange}
          />
          {selectedPort && (
            <UpdatePortModal
              id={selectedPort.id}
              port={selectedPort}
              visible={isUpdateModalVisible}
              onClose={handleUpdateModalClose}
            />
          )}
          </Col>
      </Row>
    </div>
  );
};

export default PortList;
