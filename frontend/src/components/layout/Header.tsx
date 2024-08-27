"use client";
import React, { useState } from "react";
import { Menu, Layout, Drawer } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import SvgComponent from "./Logo";
import "./Header.scss";
import { useRouter, usePathname } from "next/navigation"; // Import the useRouter hook
import UserIcon from "./UserIcon";
import ProfileDropUser from "./ProfileDropUser";
const { Content, Footer } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link href={"/about"}>About Us</Link>,
    key: "/about",
  },
  {
    label: <Link href={"/contact"}>Contact Us</Link>,
    key: "/contact",
  },
];
const Header: React.FC = () => {
  const [current, setCurrent] = useState("/");
  const [openMenu, setOpenMenu] = useState(false);

  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const handleClick = (route: string) => {
    router.push(route);
  };
  const AppMenu = ({ isInline = false }) => {
    return (
      <Menu
        onClick={onClick}
        mode={isInline ? "inline" : "horizontal"}
        selectedKeys={[pathname]}
        items={items}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          fontSize: "16px",
        }}
      />
    );
  };
  return (
    <>
      <div className="headerbound">
        <Layout.Header className="header">
          <div className="logo" onClick={() => handleClick("/")}>
            <SvgComponent />
          </div>

          <span className="header-menu">
            <AppMenu />
          </span>
          {/* <AppMenu /> */}

          <Drawer
            open={openMenu}
            closable={false}
            onClose={() => {
              setOpenMenu(false);
            }}
          >
            <AppMenu isInline />
          </Drawer>
          <div className="right-header">
            <ProfileDropUser />
            {/* <span className="icon" onClick={() => handleClick("/login")}>
              <UserIcon />
            </span> */}
          </div>
          <div className="menu-icon">
            <MenuOutlined
              style={{ fontSize: "16px" }}
              onClick={() => {
                setOpenMenu(true);
              }}
            />
          </div>
        </Layout.Header>
      </div>
    </>
  );
};

export default Header;
