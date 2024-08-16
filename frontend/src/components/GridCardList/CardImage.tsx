import { Card, Col } from "antd";
import React from "react";
import "./Card.scss";
interface Props {
  image: string;
  refImage: string;
}
const CardImage: React.FC<Props> = (props) => {
  return (
    <div>
      <Col>
        <Card
          hoverable
          style={{
            height: 170,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          styles={{ body: { padding: "0" } }}
          cover={
            <a
              href={props.refImage}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                overflow: "hidden",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={props.image}
                alt="picture"
                style={{
                  objectFit: "cover",
                  width: "70%",
                  // height: "100%",
                  objectPosition: "center",
                }}
              />
            </a>
          }
        ></Card>
      </Col>
    </div>
  );
};

export default CardImage;
