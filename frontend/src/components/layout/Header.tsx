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
import styles from "@/src/styles/Detailpage.module.css";
// type MenuItem = Required<MenuProps>["items"][number];
// type MenuItem = Required<MenuProps>["items"][number] & {
//   permission?: string; // Add optional 'permission' field
//   children?: MenuItem[];
// };
type MenuItem = Required<MenuProps>["items"][number] & {
  permission?: string;
  // children?: MenuItem[];
  children?: any;
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
    // label: <Link href={"/routes"}>Routes</Link>,
    label: "Routes",
    key: "/routes",
    permission: "search:route",
    children: [
      {
        key: "/maps",
        label: <Link href={"/maps"}>Search Your Route</Link>,
        // permission: "search:route",
      },
      {
        key: "/routes",
        label: <Link href={"/routes"}>Routes List</Link>,
        permission: "get:routesPag",
      },
    ],
  },
  {
    label: "Schedules",
    key: "/schedules",
    permission: "search:schedule",
    children: [
      {
        key: "/schedules",
        label: <Link href={"/schedules"}>Search By Port</Link>,
        // permission: "search:schedule",
      },
      {
        key: "/schedulesList",
        label: <Link href={"/schedulesList"}>Schedules List</Link>,
        permission: "get:schedules",
      },
    ],
  },
  {
    label: <Link href={"/ports"}>Ports</Link>,
    key: "/ports",
    permission: "get:portsPag",
  },
  {
    label: <Link href={"/vessels"}>Vessels</Link>,
    key: "/vessels",
    permission: "get:vessels",
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
const filterMenuItemsByPermission = (
  items: MenuItem[],
  permissions: string[]
) => {
  return (
    items
      .map((item) => {
        // Filter children if present
        if (item.children) {
          const filteredChildren = item.children.filter(
            (child: any) =>
              !child?.permission || permissions.includes(child.permission)
          );
          return {
            ...item,
            children:
              filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }
        return item;
      })
      // Filter parent item if permission is required
      .filter(
        (item) => !item.permission || permissions.includes(item.permission)
      )
  );
};
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
  const userPermissions = session?.user?.permissionNames || [];

  // console.log("alo: ", session?.user);
  // const filteredItems = items.filter(
  //   (item) =>
  //     !item.permission ||
  //     session?.user?.permissionNames?.includes(item.permission)
  // );
  // const filteredItems = items
  //   .map((item) => {
  //     // Check if the item has children
  //     if (item?.children) {
  //       // Filter the children based on permissions
  //       const filteredChildren = item?.children.filter(
  //         (child) =>
  //           !child?.permission ||
  //           session?.user?.permissionNames?.includes(child.permission)
  //       );
  //       // Return the item with filtered children if any children remain
  //       return {
  //         ...item,
  //         children: filteredChildren.length ? filteredChildren : undefined,
  //       };
  //     }
  //     // Return the item if it doesn't have children or no permission is required
  //     return item;
  //   })
  //   .filter(
  //     (item) =>
  //       !item.permission ||
  //       session?.user?.permissionNames?.includes(item.permission)
  //   );
  const filteredItems = filterMenuItemsByPermission(items, userPermissions);

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
          fontSize: "1rem",
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
