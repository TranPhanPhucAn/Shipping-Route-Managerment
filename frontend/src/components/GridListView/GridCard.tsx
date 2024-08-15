import { Card, Col } from "antd";
import React from "react";
const { Meta } = Card;
interface Props {
  image: string;
  title: string;
  description: string;
}
const GridCard: React.FC<Props> = (props) => {
  return (
    <div>
      <Col>
        <Card
          hoverable
          style={{ width: "27.79vw", height: 450 }}
          cover={
            <img
              src={props.image}
              alt="picture"
              style={{ height: "229px", objectFit: "cover", width: "100%" }}
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
      </Col>
    </div>
  );
};

export default GridCard;
