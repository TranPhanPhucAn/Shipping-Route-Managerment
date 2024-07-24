"use client";
import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Homepage", "/", <HomeOutlined />),
  getItem("Management User", "/users", <UserOutlined />),
  getItem("Management Route", "/routes", <AppstoreOutlined />),
];
const Header: React.FC = () => {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: "100%" }}
      defaultSelectedKeys={["1"]}
      mode="horizontal"
      theme="dark"
      items={items}
    />
  );
};

export default Header;
