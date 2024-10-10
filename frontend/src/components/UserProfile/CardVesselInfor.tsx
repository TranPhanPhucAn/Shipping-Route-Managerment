"use client";
import { Card, Col } from "antd";
import React from "react";
// import "./gridcard.scss";
const { Meta } = Card;
interface Props {
  count: number;
  description: string;
}
const VesselInforCard: React.FC<Props> = (props) => {
  return (
    <div>
      <Card
        hoverable
        // style={{ height: 450 }}
        // className="card-antd"
      >
        <Meta
          title={<span style={{ fontSize: "20px" }}>{props.count}</span>}
          description={
            <span style={{ fontSize: "16px", fontWeight: 400 }}>
              {props.description}
            </span>
          }
        />
      </Card>
    </div>
  );
};

export default VesselInforCard;
