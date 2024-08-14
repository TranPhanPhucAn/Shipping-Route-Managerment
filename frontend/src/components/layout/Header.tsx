"use client";
import React, { useState } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link href={"/"}>Home Page</Link>,
    key: "homepage",
    icon: <HomeOutlined />,
  },
  {
    label: <Link href={"/login"}>Manage Users</Link>,
    key: "users",
    icon: <UserOutlined />,
  },
  {
    label: <Link href={"/routes"}>Manage Routes</Link>,
    key: "routes",
    icon: <AppstoreOutlined />,
  },
];
const Header: React.FC = () => {
  const [current, setCurrent] = useState("homepage");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <>
      <Menu
        onClick={onClick}
        style={{ width: "100%" }}
        selectedKeys={[current]}
        mode="horizontal"
        theme="dark"
        items={items}
      />
    </>
  );
};

export default Header;
