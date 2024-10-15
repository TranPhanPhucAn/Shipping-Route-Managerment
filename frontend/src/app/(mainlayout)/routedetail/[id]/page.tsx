"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ROUTE } from "../../../../graphql/queries/query";
import { Route } from "../../../../graphql/types";
import { Button, Divider, message, Row, Col } from "antd";
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
        <Col>
          <p className={styles.Title}>Route detail / {id}</p>
        </Col>
        <Col>
          <Button onClick={() => router.back()} className={styles.backButton}>
            Back to Routes
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row className={styles.container}>
        <Col className={styles.infor}>
          <p className={styles.Title}>Information</p>
          <p className={styles.infortext}>
            Name: {route.departurePort.id} - {route.destinationPort.id}
          </p>
          <p className={styles.infortext}>
            Departure Port: {route.departurePort.name}
          </p>
          <p className={styles.infortext}>
            Destination Port: {route.destinationPort.name}
          </p>
        </Col>
        <Col className={styles.maps}>
          <PortDistanceCalculation
            departurePort={route.departurePort.name}
            destinationPort={route.destinationPort.name}
          />
        </Col>
      </Row>
    </div>
  );
};

export default RouteDetail;
