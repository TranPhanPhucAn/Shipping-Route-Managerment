"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ROUTE } from "@/src/graphql/queries/query";
import { Route } from "@/src/graphql/types";
import { Button, message, Row, Col, Card } from "antd";
import PortDistanceCalculation from "@/src/components/Routes/PortDistanceCalculator";
import styles from "@/src/styles/Detailpage.module.css";

const RouteDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { loading, error, data } = useQuery<{ route: Route }>(GET_ROUTE, {
    variables: { id },
    skip: !id,
  });

  if (!id) {
    message.error("Route ID is missing");
    return <p>Route ID is missing</p>;
  }

  if (loading) return <p>Loading...</p>;

  if (error) {
    message.error("Failed to load route details");
    return <p>Error: {error.message}</p>;
  }

  if (!data || !data.route) {
    message.error("No route data found");
    return <p>No route data found</p>;
  }

  const { route } = data;

  return (
    <div className={styles.body}>
      <Row className={styles.container}>
        <Col span={8}>
          <Card
            title={
              <div className={styles.Title} style={{ textAlign: "center" }}>
                Route Detail
              </div>
            }
            bordered={true}
            className={styles.card}
          >
            <div className={styles.infortext}>
              <div style={{paddingBottom:"0.4rem"}}> <b>Departure Port:&nbsp;&nbsp;</b> {route.departurePort.name} </div>
              <div style={{paddingBottom:"0.4rem"}}> <b>Destination Port:&nbsp;&nbsp;</b> {route.destinationPort.name}</div>
              <div style={{paddingBottom:"0.4rem"}}>
                <b>Estimated Distance:&nbsp;&nbsp;</b> {route.distance.toFixed(1)} Km
              </div>
              <div style={{paddingBottom:"0.4rem"}}><b>Travel Time:&nbsp;&nbsp;</b> {route.estimatedTimeDays} days</div>
            </div>

            <div>
            <Button onClick={() => router.back()} className={styles.backButton}>
              Back to Routes
            </Button>
            </div>
          </Card>
        </Col>
        <Col span={14} offset={2}>
          <Card className={styles.maps}>
            <PortDistanceCalculation
              departurePort={route.departurePort.name}
              destinationPort={route.destinationPort.name}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RouteDetail;
