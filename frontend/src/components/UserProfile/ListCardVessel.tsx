import { Col, Row } from "antd";
import React from "react";
import VesselInforCard from "./CardVesselInfor";

interface Props {
  vesselTotal: number;
  available: number;
  inTransits: number;
  underMaintance: number;
}
const ListCardVessel: React.FC<Props> = ({
  vesselTotal,
  available,
  inTransits,
  underMaintance,
}) => {
  return (
    <>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}
        style={{ marginBottom: "10px" }}
      >
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          // style={{ padding: 0 }}
        >
          <VesselInforCard count={vesselTotal} description="Total Vessels" />
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          // style={{ padding: 0 }}
        >
          <VesselInforCard count={available} description="Available vessels" />
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          // style={{ padding: 0 }}
        >
          <VesselInforCard
            count={inTransits}
            description="In transists vessels"
          />
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          // style={{ padding: 0 }}
        >
          <VesselInforCard
            count={underMaintance}
            description="Under maintance vessels"
          />
        </Col>
      </Row>
    </>
  );
};
export default ListCardVessel;
