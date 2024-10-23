"use client";
import { useQuery, useMutation } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
  Divider,
  Tag,
  Input,
  Space,
  Row,
  Col,
} from "antd";
import {
  GET_VESSELS,
  GET_VESSELS_PAGINATION,
  GET_VESSELS_PAGINATION_BY_ID,
} from "@/src/graphql/queries/query";
import { DELETE_VESSEL } from "@/src/graphql/mutations/Auth";
import { GetVesselsData, Vessel } from "@/src/graphql/types";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CreateVesselModal from "@/src/components/Vessels/CreateVesselModal";
import UpdateVesselModal from "@/src/components/Vessels/UpdateVesselModal";
import { useState } from "react";
import styles from "@/src/styles/Listpage.module.css";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterDropdownProps } from "antd/es/table/interface";

const VesselList = () => {
  const { data: session } = useSession();
  const permissionUser = session?.user?.permissionNames;
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageSizeString = searchParams?.get("limit");
  const pageString = searchParams?.get("page");
  const sortString = searchParams?.get("sort");
  const search = searchParams?.get("search");
  const statusFilter = searchParams?.get("status");
  const typeFilter = searchParams?.get("type");
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

  const page = pageString ? +pageString : 1;
  const pageSize = pageSizeString ? +pageSizeString : 5;
  const [paginationTable, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: pageSize,
  });

  const { loading, error, data, refetch } = useQuery(GET_VESSELS_PAGINATION, {
    variables: {
      paginationVessels: {
        limit: pageSize,
        offset: page - 1,
        sort: sortString,
        search: search,
        statusFilter: statusFilter,
        typeFilter: typeFilter,
      },
    },
    skip: !permissionUser?.includes("get:vesselsPag"),
  });

  const {
    loading: loadingById,
    error: errorById,
    data: dataById,
    refetch: refetchById,
  } = useQuery(GET_VESSELS_PAGINATION_BY_ID, {
    variables: {
      paginationVessels: {
        ownerId: session?.user?.id,
        limit: pageSize,
        offset: page - 1,
        sort: sortString,
        search: search,
        statusFilter: statusFilter,
        typeFilter: typeFilter,
      },
    },
    skip:
      !permissionUser?.includes("get:vesselsPagById") ||
      permissionUser?.includes("get:vesselsPag"),
  });
  let vesselsData, total;
  if (permissionUser?.includes("get:vesselsPag")) {
    vesselsData = data?.paginationVessels?.vessels;
    total = data?.paginationVessels?.totalCount;
  } else {
    if (permissionUser?.includes("get:vesselsPagById")) {
      vesselsData = dataById?.paginationVesselById?.vessels;
      total = dataById?.paginationVesselById?.totalCount;
    }
  }

  // const vesselsData = data?.paginationVessels?.vessels || [];
  // const total = data?.paginationVessels?.totalCount;
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
  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedVessel(null);
  };
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
      if (!filters.status && !filters.type) {
        params.delete("status");
        params.delete("type");
      } else {
        if (!filters.status) {
          params.delete("status");
        } else {
          const statusUrl = filters.status.join(",");
          params.set("status", statusUrl);
        }

        if (!filters.type) {
          params.delete("type");
        } else {
          const typesUrl = filters.type.join(",");
          params.set("type", typesUrl);
        }
      }
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const columns = [
    {
      title: "Vessel Name",
      dataIndex: "name",
      key: "name",
      sorter: { multiple: 2 },
      ...getColumnSearchProps("name", search ? search : ""),
      defaultSortOrder: sortOrders["name"],
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "CONTAINER_SHIP", value: "CONTAINER_SHIP" },
        { text: "BULK_CARRIER", value: "BULK_CARRIER" },
        { text: "TANKER", value: "TANKER" },
        { text: "RO_RO_SHIP", value: "RO_RO_SHIP" },
        { text: "PASSENGER_SHIP", value: "PASSENGER_SHIP" },
      ],
      defaultFilteredValue: typeFilter?.split(","),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      sorter: { multiple: 1 },
      defaultSortOrder: sortOrders["capacity"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Available", value: "AVAILABLE" },
        { text: "In Transit", value: "IN_TRANSIT" },
        { text: "Under maintenance", value: "UNDER_MAINTENANCE" },
      ],
      defaultFilteredValue: statusFilter?.split(","),

      render: (text: string, record: Vessel) => {
        let color = "white";

        if (record.status === "AVAILABLE") {
          color = "#58D68D";
        } else if (record.status === "IN_TRANSIT") {
          color = "#85C1E9";
        } else if (record.status === "UNDER_MAINTENANCE") {
          color = "red";
        }

        return (
          <Tag color={color} key={record.id}>
            {record.status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: Vessel) => (
        <div>
          {permissionUser?.includes("update:vessel") &&
            record.status !== "IN_TRANSIT" && (
              <Button
                type="link"
                onClick={() => handleEdit(record)}
                icon={<EditOutlined />}
              >
                Edit
              </Button>
            )}
          {permissionUser?.includes("delete:vessel") &&
            record.status !== "IN_TRANSIT" && (
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
      <Row>
        <Col span={24}>
          <div className={styles.createButton}>
            {permissionUser?.includes("create:vessel") && (
              <CreateVesselModal
                limit={pageSize}
                offset={page - 1}
                sort={sortString ? sortString : ""}
                statusFilter={statusFilter ? statusFilter : ""}
                typeFilter={typeFilter ? typeFilter : ""}
                search={search ? search : ""}
                refetchVessel={refetch}
              />
            )}
          </div>
          <Table
            dataSource={vesselsData}
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
          {selectedVessel && (
            <UpdateVesselModal
              // id={selectedVessel.id}
              vessel={selectedVessel}
              visible={isUpdateModalVisible}
              onClose={handleUpdateModalClose}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default VesselList;
