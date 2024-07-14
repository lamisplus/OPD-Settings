import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import ButtonMui from "@material-ui/core/Button";
import { TiArrowBack } from "react-icons/ti";
//import Chip from '@material-ui/core/Chip';
import Divider from "@material-ui/core/Divider";
import { Button } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Col, Row } from "reactstrap";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import axios from "axios";
import { url as baseUrl, token } from "./../../../api";
import Typography from "@material-ui/core/Typography";
import CaptureBiometric from "./CaptureBiometric";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "20.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

function PatientCard(props) {
  const { classes } = props;
  const patientObj = props.patientObj;
  const [patientObj2, setpatientObj2] = useState({});
  

  const getFullPatientDetail = (value) => {
    axios
      .get(`${baseUrl}patient/${patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
      
        setpatientObj2(response.data);
      })
      .catch((error) => {
      
      });
  };
  useEffect(() => {
    //PatientCurrentStatus();
    //CheckBiometric();
    getFullPatientDetail();
  }, [props.patientObj]);

  const get_age = (dob) => {
    var today = new Date();
    var dateParts = dob.split("-");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    if (age_now === 0) {
      return m + " month(s)";
    }
    return age_now;
  };
  const calculate_age = (dob) => {
    var today = new Date();
    var dateParts = dob.split("-");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    if (age_now === 0) {
      return m + " month(s)";
    }
    return age_now + " year(s)";
  };

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Row>
            <Col md={12}>
              <Row className={"mt-1"}>
                <Col md={12} className={classes.root2}>
                  {/* <b style={{ fontSize: "25px", color: "rgb(153, 46, 98)" }}>
                    {`${patientObj.firstName} ${
                      patientObj.lastName
                        ? patientObj.lastName
                        : patientObj.surname
                    }`}
                  </b> */}
                  <Link to={"/"}>
                    <ButtonMui
                      variant="contained"
                      color="primary"
                      className=" float-end ms-2 mr-2 mt-2"
                      //startIcon={<FaUserPlus size="10"/>}
                      startIcon={<TiArrowBack />}
                      style={{
                        backgroundColor: "rgb(153, 46, 98)",
                        color: "#fff",
                        height: "35px",
                      }}
                    >
                      <span style={{ textTransform: "capitalize" }}>Back</span>
                    </ButtonMui>
                  </Link>
                </Col>
                {/* <Col md={4} className={classes.root2}>
                  <span>
                    {" "}
                    Patient ID :{" "}
                    <b style={{ color: "#0B72AA" }}>
                      {patientObj?.hospitalNumber}
                  
                    </b>
                  </span>
                </Col>

                <Col md={4} className={classes.root2}>
                  <span>
                    Date Of Birth :{" "}
                    <b style={{ color: "#0B72AA" }}>
                      {patientObj?.dateOfBirth}
                    </b>
                  </span>
                </Col>
                <Col md={4} className={classes.root2}>
                  <span>
                    {" "}
                    Age : <b style={{ color: "#0B72AA" }}>{patientObj?.age}</b>
                  </span>
                </Col>
                <Col md={4}>
                  <span>
                    {" "}
                    Gender :{" "}
                    <b style={{ color: "#0B72AA" }}>{patientObj?.gender}</b>
                  </span>
                </Col>
                <Col md={4} className={classes.root2}>
                  <span>
                    {" "}
                    Phone Number :{" "}
                    <b style={{ color: "#0B72AA" }}>
                      {patientObj2?.contactPoint?.contactPoint[0]?.value}
                    </b>
                  </span>
                </Col>
                <Col md={4} className={classes.root2}>
                  <span>
                    {" "}
                    Address :{" "}
                    <b style={{ color: "#0B72AA" }}>
                      {patientObj2?.address?.address[0]?.city}
                    </b>
                  </span>
                </Col> */}
              </Row>
            </Col>
          </Row>
        </ExpansionPanelSummary>
        <Divider />
      </ExpansionPanel>
    </div>
  );
}

PatientCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientCard);
