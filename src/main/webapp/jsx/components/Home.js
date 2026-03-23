import React, { useState, Fragment } from "react";
import { Row, Col, Card, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { TiPlus } from "react-icons/ti";
import CheckinSettings from "./Patient/CheckinSettings";
const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = () => {
  return (
    <Fragment>
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h4>Outpatient Department</h4>
          </li>
        </ol>
      </div>
      <Link
        to={{
          pathname: "/patient-history",
          state: {
            existingPatient: "new",
            isNewVisit: true,
            isNoUpdateform: true,
          },
        }}
      >
        {" "}
        <div style={{ padding: ".2em" }}>
          <Button
            variant="contained"
            className=" float-end mb-10"
            marginLeft={"1em"}
            startIcon={<TiPlus />}
            color="secondary"
            style={{
              background: "#014d88",
            }}
          >
            Add
          </Button>
        </div>
      </Link>
      <br />
      <br />
      <br />
      <Row>
        <Col xl={12}>
          <Card style={divStyle}>
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={1}
                  className="mb-3"
                >
                  <Tab eventKey={1}>
                    <CheckinSettings />
                  </Tab>
                </Tabs>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
