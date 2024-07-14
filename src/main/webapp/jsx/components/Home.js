import React, { useState, Fragment } from "react";
import { Row, Col, Card, Tab, Tabs } from "react-bootstrap";
import PatientList from "./Patient/PatientList";
import PatientVaccinatedLIst from "./Patient/PatientVaccinatedLIst";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { FaUserPlus } from "react-icons/fa";
import HepatitisPatients from "./Patient/HepatitisPatient";
import ViralHepatitis from "./Patient/ViralHepatitisForms/Form1";
import ViralHepatitisSummaryFormContainer from "./Patient/ViralHepatitisSummaryFormContainer";
const divStyle = {
  borderRadius: "2px",
  fontSize: 14,
};

const Home = () => {
  const [key, setKey] = useState("home");

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
          pathname: "/register-patient",
          state: {
            existingPatient: "new",
          },
        }}
      >
        {" "}
        <Button
          variant="contained"
          color="primary"
          className=" float-end mb-10"
          startIcon={<FaUserPlus size="10" />}
          style={{ backgroundColor: "#014d88" }}
        >
          <span style={{ textTransform: "capitalize" }}>New Patient</span>
        </Button>
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
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab eventKey="home" title="Patients">
                    <PatientList />
                  </Tab>

                  <Tab eventKey="visualization" title="Outpatients Visits">
                    <HepatitisPatients />
                  </Tab>

                  {/* <Tab eventKey="vaccinated" title="Summary"> */}
                  {/* <PatientVaccinatedLIst /> */}
                  {/* <ViralHepatitisSummaryFormContainer /> */}
                  {/* </Tab> */}
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
