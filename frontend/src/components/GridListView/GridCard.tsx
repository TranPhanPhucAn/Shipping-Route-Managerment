"use client";
import { Card, Col } from "antd";
import React from "react";
import "./gridcard.scss";
const { Meta } = Card;
interface Props {
  image: string;
  title: string;
  description: string;
}
const GridCard: React.FC<Props> = (props) => {
  return (
    <div>
      <Card
        hoverable
        // style={{ height: 450 }}
        className="card-antd"
        cover={
          <img
            src={props.image}
            alt="picture"
            // style={{ height: "229px", objectFit: "cover", width: "100%" }}
            className="image-card"
          />
        }
      >
        <Meta
          title={<span style={{ fontSize: "20px" }}>{props.title}</span>}
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

export default GridCard;
