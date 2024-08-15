import { Row } from "antd";
import React from "react";
import GridCard from "./GridCard";

const GridListView: React.FC = () => {
  return (
    <>
      <Row gutter={[20, 20]}>
        <GridCard
          image="/logishome/transport.jpg"
          title="Transportation Services"
          description="Learn how CLV offers small and large businesses the opportunity to grow."
        />
        <GridCard
          image="/logishome/supplychain.jpg"
          title="Supply Chain and Logistics"
          description="We focus on solving your supply chain needs from end to end, taking the complexity out of container shipping for you."
        />
        <GridCard
          image="/logishome/digital.jpg"
          title="Digital Solutions"
          description="Our tailored online services take the complexity out of shipping by letting you instantly book, manage and track shipments, submit Verified Gross Mass information and much more."
        />
      </Row>
    </>
  );
};
export default GridListView;
