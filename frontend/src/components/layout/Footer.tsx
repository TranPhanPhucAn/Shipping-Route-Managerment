"use client";
import React, { useState } from "react";
import { Flex, Layout } from "antd";
import "./Footer.scss";
import SvgComponent from "./LogoFooter";
import { useRouter } from "next/navigation";
import {
  LinkedinOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  PrinterOutlined,
  XOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const { Header, Footer, Sider, Content } = Layout;
const FooterApp: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const handleClick = (route: string) => {
    router.push(route);
  };
  return (
    <div className="footerbound">
      <Footer className="footer">
        <div className="logo-com-footer">
          <span className="logofooter" onClick={() => handleClick("/")}>
            <SvgComponent />
          </span>
          <span>© CLV 2024</span>
        </div>
        <div className="list-logo">
          <a
            href="https://www.linkedin.com/company/cyberlogitec/?originalSubdomain=sg"
            className="logomedia"
            target="blank"
          >
            <LinkedinOutlined style={{ fontSize: 32 }} />
          </a>
          <a
            className="logomedia"
            href="https://www.facebook.com/cyberlogitecvietnam"
            target="blank"
          >
            <FacebookOutlined style={{ fontSize: 32 }} />
          </a>
          <a
            className="logomedia"
            target="blank"
            href="https://www.youtube.com/@cyberlogitecvietnam3023"
          >
            <YoutubeOutlined style={{ fontSize: 36 }} />
          </a>
          <a className="logomedia" target="blank" href="https://x.com/?lang=vi">
            <XOutlined style={{ fontSize: 26 }} />
          </a>
          <a
            className="logomedia"
            target="blank"
            href="https://www.instagram.com/"
          >
            <InstagramOutlined style={{ fontSize: 32 }} />
          </a>
        </div>
        <div>
          <div className="contact-infor-footer">Contact</div>
          <div>
            <HomeOutlined style={{ marginRight: 7 }} />
            Scetpa building Tân Bình, Hồ Chí Minh
          </div>
          <div>
            <MailOutlined style={{ marginRight: 7 }} />
            sales@cyberlogitec.com
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: 7 }} />
            +82-2-6350-2000
          </div>
          <div>
            <PrinterOutlined style={{ marginRight: 7 }} />
            +82-2-6350-2050
          </div>
        </div>
      </Footer>
    </div>
  );
};
export default FooterApp;
