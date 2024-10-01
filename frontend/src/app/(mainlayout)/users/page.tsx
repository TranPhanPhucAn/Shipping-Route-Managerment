"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  Table,
  Button,
  message,
  Popconfirm,
  TablePaginationConfig,
  Tag,
  Divider,
  Avatar,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { DELETE_SCHEDULE } from "@/src/graphql/mutations/Auth";
import { useState, useEffect } from "react";
import styles from "@/src/styles/Route.module.css";
import { useParams, usePathname, useRouter } from "next/navigation";
import { GET_USER_PAGINATION } from "@/src/graphql/queries/query";
import { useSearchParams } from "next/navigation";

const UserList = () => {
  //   const { loading, error, data, refetch } = useQuery(GET_USER_PAGINATION);
  //   const schedulesData = data?.schedules || [];
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [filterField, setFilterField] = useState("");

  // console.log("search: ", searchParams?.get("page"));
  const limit = 2;
  const pageString = searchParams?.get("page");
  const sortString = searchParams?.get("sort");
  console.log("alo sort: ", sortString);
  const page = pageString ? +pageString : 1;
  const { loading, error, data, refetch } = useQuery(GET_USER_PAGINATION, {
    variables: {
      paginationUser: {
        limit: limit,
        offset: page - 1,
        sort: sortString,
      },
    },
  });
  const users = data?.paginationUser?.users;
  const total = data?.paginationUser?.totalCount;
  const [paginationTable, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: limit,
  });

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    console.log("params", filters);
    console.log("sort", sorter);

    if (pagination && pagination.current != paginationTable.current) {
      const params = new URLSearchParams(searchParams ?? "");
      params.set("page", pagination.current);
      setPagination({ current: pagination.current });
      replace(`${pathname}?${params.toString()}`);
      return;
    }
    if (sorter) {
      const params = new URLSearchParams(searchParams ?? "");
      let resultUrl = "";
      if (sorter.length) {
        for (let i = 0; i < sorter.length; i++) {
          const order = sorter[i].order;
          if (order === "ascend") {
            sorter.order = "asc";
          } else if (order === "desc") {
            sorter.order = "desc";
          }
          resultUrl = resultUrl + sorter[i].field + " " + sorter[i].order;
          if (i < sorter.length - 1) {
            resultUrl += ",";
          }
        }
      } else {
        if (!sorter.order) {
          params.delete("sort");
          replace(`${pathname}?${params.toString()}`);
          return;
        }
        resultUrl = sorter.field + " " + sorter.order;
      }

      params.set("sort", resultUrl);
      replace(`${pathname}?${params.toString()}`);
      // if (sorter.order === "ascend") {
      //   sorter.order = "asc";
      // } else if (sorter.order === "desc") {
      //   sorter.order = "desc";
      // }
      // if (sortString) {
      //   if (sortString.includes(sorter.field)) {
      //     console.log("hey bro: ", sortString);
      //     let resultUrl = "";
      //     sortString.split(",").forEach((sortParam: string) => {
      //       const [field, direction] = sortParam.split(" ");
      //       if (field === sorter.field) {
      //         if (sorter.order) {
      //           if (resultUrl) {
      //             resultUrl =
      //               resultUrl + "," + sorter.field + " " + sorter.order;
      //           } else {
      //             console.log("here: ", field, direction);
      //             resultUrl = sorter.field + " " + sorter.order;
      //           }
      //         }
      //       } else {
      //         if (resultUrl) {
      //           resultUrl = resultUrl + "," + field + " " + direction;
      //         } else {
      //           resultUrl = field + " " + direction;
      //         }
      //       }
      //     });
      //     params.set("sort", resultUrl);
      //     replace(`${pathname}?${params.toString()}`);

      //     return;
      //   }
      //   params.set(
      //     "sort",
      //     sortString + "," + sorter.field + " " + sorter.order
      //   );
      //   replace(`${pathname}?${params.toString()}`);
      // } else {
      //   params.set("sort", sorter.field + " " + sorter.order);
      // }
      // replace(`${pathname}?${params.toString()}`);
    }
  };
  // useEffect(() => {
  //   if (page) {
  //     const params = new URLSearchParams(searchParams ?? "");
  //     params.set("page", page.toString());
  //     replace(`${pathname}?${params.toString()}`);
  //   }
  // }, [page]);

  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error: {error.message}</p>;
  const getFilteredData = (value: string) => {
    console.log("??? alo: ", value);
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      sorter: { multiple: 2 },
    },
    {
      title: "Full Name",
      dataIndex: "username",
      key: "username",
      sorter: { multiple: 1 },

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
        return record?.role?.name;
      },
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
      ],
      // onFilter: (value: string) => {
      //   // getFilteredData(value);
      //   return true;
      // },
    },
  ];

  return (
    <div className={styles.body}>
      <div className={styles.Title}>List Users</div>
      <div className={styles.subtitle}>
        Search our users to find the connection.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <div className={styles.container}>
        <Table
          dataSource={users ? users : []}
          columns={columns}
          className={styles.Table}
          rowKey={"id"}
          pagination={{
            current: paginationTable.current,
            pageSize: paginationTable.pageSize,
            total: total,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]}-{range[1]} on {total} rows
                </div>
              );
            },
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default UserList;
