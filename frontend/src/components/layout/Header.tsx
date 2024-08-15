"use client";
import React, { useState } from "react";
import { Menu, Layout } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SvgComponent from "./Logo";
import "./Header.scss";
import { useRouter, usePathname } from "next/navigation"; // Import the useRouter hook
import UserIcon from "./UserIcon";
const { Content, Footer } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link href={"/about"}>About Us</Link>,
    key: "/about",
    // icon: <UserOutlined />,
  },
  {
    label: <Link href={"/contact"}>Contact Us</Link>,
    key: "/contact",
  },
];
const itemsRight: MenuItem[] = [
  {
    label: <Link href={"/login"}></Link>,
    key: "login",
    icon: <UserOutlined style={{ fontSize: "16px" }} />,
  },
];
const Header: React.FC = () => {
  const [current, setCurrent] = useState("/");
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const handleClick = (route: string) => {
    router.push(route);
  };
  return (
    <>
      <div className="headerbound">
        <Layout.Header className="header">
          <div className="logo" onClick={() => handleClick("/")}>
            <SvgComponent />
          </div>
          <Menu
            onClick={onClick}
            mode="horizontal"
            selectedKeys={[pathname]}
            items={items}
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              fontSize: "16px",
            }}
          />
          <div className="right-header">
            <span className="icon" onClick={() => handleClick("/login")}>
              <UserIcon />
            </span>
          </div>
        </Layout.Header>
      </div>
    </>
  );
};

export default Header;
