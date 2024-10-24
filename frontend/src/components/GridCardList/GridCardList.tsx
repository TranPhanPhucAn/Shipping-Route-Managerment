import { Col, Row } from "antd";
import React from "react";
import CardImage from "./CardImage";


interface Props {
  images: string[];
  refs: string[];
}
const GridCardList: React.FC<Props> = (props) => {
  return (
    <>
      <Row gutter={10}>
        {props &&
          props.images &&
          props.images.map((item, index) => {
            return (
              <Col
                xs={{ flex: "50%" }}
                sm={{ flex: "50%" }}
                md={{ flex: "33%" }}
                lg={{ flex: "20%" }}
                xl={{ flex: "20%" }}
                key={index}
              >
                <CardImage image={item} refImage={props.refs[index]} />
              </Col>
            );
          })}
      </Row>
    </>
  );
};
export default GridCardList;
