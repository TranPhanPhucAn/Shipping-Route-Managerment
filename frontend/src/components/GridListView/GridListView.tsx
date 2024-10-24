import { Col, Row } from "antd";
import React from "react";
import GridCard from "./GridCard";
import styles from "@/src/styles/Detailpage.module.css";
const GridListView: React.FC = () => {
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          lg={8}
          xl={8}
          // style={{ padding: 0 }}
        >
          <GridCard
            image="/logishome/transport.jpg"
            title={<div className={styles.subTitle}>Transportation Services</div>}
            description={<div className={styles.infortext}>Learn how CLV offers small and large businesses the opportunity to grow.</div>}
          />
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          lg={8}
          xl={8}
          // style={{ padding: 0 }}
        >
          <GridCard
            image="/logishome/supplychain.jpg"
            title={<div className={styles.subTitle}>Supply Chain and Logistics</div>}
            description={<div className={styles.infortext}>We focus on solving your supply chain needs from end to end, taking the complexity out of container shipping for you.</div>}
          />
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          lg={8}
          xl={8}
          // style={{ padding: 0 }}
        >
          <GridCard
            image="/logishome/digital.jpg"
            title={<div className={styles.subTitle}>Digital Solutions</div>}
            description={<div className={styles.infortext}>Our tailored online services take the complexity out of shipping by letting you instantly book, manage and track shipments, submit Verified Gross Mass information and much more.</div>}
          />
        </Col>
      </Row>
    </>
  );
};
export default GridListView;
