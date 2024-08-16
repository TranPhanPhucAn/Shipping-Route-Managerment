import { Row } from "antd";
import React from "react";
import CardImage from "./CardImage";

interface Props {
  images: string[];
  refs: string[];
}
const GridCardList: React.FC<Props> = (props) => {
  return (
    <>
      <Row gutter={[10, 10]}>
        {props &&
          props.images &&
          props.images.map((item, index) => {
            return (
              <CardImage
                image={item}
                refImage={props.refs[index]}
                key={index}
              />
            );
          })}
      </Row>
    </>
  );
};
export default GridCardList;
