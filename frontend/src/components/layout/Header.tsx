"use client";
import React, { useState } from "react";
import { Menu, Layout, Drawer } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";
import SvgComponent from "./Logo";
import "./Header.scss";
import { useRouter, usePathname } from "next/navigation";
import ProfileDropUser from "./ProfileDropUser";
import { useSession } from "next-auth/react";

// type MenuItem = Required<MenuProps>["items"][number];
type MenuItem = Required<MenuProps>["items"][number] & {
  permission?: string; // Add optional 'permission' field
};

const items: MenuItem[] = [
  {
    label: <Link href={"/about"}>About Us</Link>,
    key: "/about",
  },
  {
    label: <Link href={"/contact"}>Contact Us</Link>,
    key: "/contact",
  },
  {
    label: <Link href={"/routes"}>Routes</Link>,
    key: "/routes",
    children: [
      {
        key: "/maps",
        label: <Link href={"/maps"}>Search Your Route</Link>,
      },
      {
        key: "/routes",
        label: <Link href={"/routes"}>Routes List</Link>,
      },
    ],
  },
  {
    label: <Link href={"/schedules"}>Schedules</Link>,
    key: "/schedules",
    children: [
      {
        key: "/schedules",
        label: <Link href={"/schedules"}>Search By Port</Link>,
      },
      {
        key: "/schedulesList",
        label: <Link href={"/schedulesList"}>Schedules List</Link>,
      },
    ],
  },
  {
    label: <Link href={"/ports"}>Ports</Link>,
    key: "/ports",
  },
  {
    label: <Link href={"/vessels"}>Vessels</Link>,
    key: "/vessels",
  },
  {
    label: <Link href={"/users"}>Users</Link>,
    key: "/users",
    permission: "get:usersPag",
  },
  {
    label: <Link href={"/roles"}>Roles</Link>,
    key: "/roles",
    permission: "get:roles",
  },
];
const Header: React.FC = () => {
  const [current, setCurrent] = useState("/");
  const [openMenu, setOpenMenu] = useState(false);

  const router = useRouter();
  const pathname = usePathname() || "/";
  const { data: session, status, update } = useSession();
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  // console.log("alo: ", session?.user);
  const filteredItems = items.filter(
    (item) =>
      !item.permission ||
      session?.user?.permissionNames?.includes(item.permission)
  );
  const handleClick = (route: string) => {
    router.push(route);
  };
  const AppMenu = ({ isInline = false }) => {
    return (
      <Menu
        onClick={onClick}
        mode={isInline ? "inline" : "horizontal"}
        selectedKeys={[pathname]}
        // items={items}
        items={filteredItems}
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
