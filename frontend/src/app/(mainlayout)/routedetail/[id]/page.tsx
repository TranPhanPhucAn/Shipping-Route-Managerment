"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ROUTE } from "../../../../graphql/queries/query";
import { Route } from "../../../../graphql/types";
import { Button, Divider, message, Row, Col, Card } from "antd";
import PortDistanceCalculation from "../../../../components/Routes/PortDistanceCalculator";
import styles from "../../../../styles/Detailpage.module.css";

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
        <Card
          title={
            <div className={styles.Title} style={{ textAlign: "center" }}>
              Route Detail
            </div>
          }
          bordered={true}
          className={styles.card}
        >
          <Col className={styles.infor}>
            <table >
              <tr className={styles.infortext}>
                <td>
                  <b>Route:</b>
                </td>
                <td>
                  {route.departurePort.id} - {route.destinationPort.id}
                </td>
              </tr>
              <tr className={styles.infortext}>
                <td>
                  <b> Departure Port: </b>
                </td>
                <td>{route.departurePort.name}</td>
              </tr>
              <tr className={styles.infortext}>
                <td>
                  <b> Destination Port:&nbsp; </b>
                </td>
                <td>{route.destinationPort.name}</td>
              </tr>
              <tr className={styles.infortext}>
                <td>
                  <b>Estimated Distance:&nbsp; </b>
                </td>
                <td>{route.distance} Km</td>
              </tr>
              <tr className={styles.infortext}>
                <td>
                  <b>Travel Time:&nbsp; </b>
                </td>
                <td>{route.estimatedTimeDays} days</td>
              </tr>
            </table>
          </Col>
          <Button onClick={() => router.back()} className={styles.backButton}>
            Back to Routes
          </Button>
        </Card>
        <Card style={{ width: 850 }}>
          <Col className={styles.maps}>
            <PortDistanceCalculation
              departurePort={route.departurePort.name}
              destinationPort={route.destinationPort.name}
            />
          </Col>
        </Card>
      </Row>
    </div>
  );
};

export default RouteDetail;
