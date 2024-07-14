import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import MatButton from "@material-ui/core/Button";
import Button from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Input, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { useForm } from "react-hook-form";
import { token, url as baseUrl } from "../../../api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getValue } from "@syncfusion/ej2-base";
import "./patient.css";
// import Form from 'react-bootstrap/Form';
import EnrolmentSubmittedForm from "./SubmittedForms/enrolmentForm";
import DiagnosisSubmitedForm from "./SubmittedForms/DiagnosisSubmittedForm";
import TreatmentSubmittedForm from "./SubmittedForms/TreatmentSubmittedForm";
import ViralHepatitisForm2 from "./ViralHepatitisForms/Form2";
library.add(faCheckSquare, faCoffee, faEdit, faTrash);

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cardBottom: {
    marginBottom: 20,
  },
  Select: {
    height: 45,
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
  error: {
    color: "#f85032",
    fontSize: "12.8px",
  },
}));

const UserRegistration = (props) => {
  const classes = useStyles();

  const location = useLocation();
  const locationState = location.state;
  const [diagnosisInfo, setDiagnosisInfo] = useState({});
  const [treatmentInfo, setTreatmentInfo] = useState({});
  const [enrollmentUuid, setEnrollmentUuid] = useState("");
  const [enrollmentUuidT, setEnrollmentUuidT] = useState("");
  const [allPatientInfo, setAllPatientInfo] = useState({});

  const viewHepatitisTreatment = (eId) => {
    axios
      .get(`${baseUrl}hepatitis/view-hepatitis-treatment/${eId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTreatmentInfo(response.data);
        setEnrollmentUuidT(response.data.id);
      })
      .catch((error) => {});
  };
  const viewHepatitisEnrollment = (value) => {
    axios
      .get(
        `${baseUrl}hepatitis/view-hepatitis-enrollment/${locationState.patientObj.personUuid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setEnrollmentUuid(response.data.uuid);
      })
      .catch((error) => {});
  };

  const getFullPatientDetail = (value) => {
    axios
      .get(`${baseUrl}patient/${locationState.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAllPatientInfo(response.data);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    viewHepatitisEnrollment();
    getFullPatientDetail();
  }, []);
  return (
    <>
      <ToastContainer autoClose={3000} hideProgressBar />
      <Card className={classes.cardBottom}>
        <CardContent>
          <Link
            to={{
              pathname: "/patient-history",
              state: { patientObj: locationState.patientObj },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className=" float-end ms-1"
              style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
              startIcon={<TiArrowBack />}
            >
              <span style={{ textTransform: "capitalize", color: "#fff" }}>
                Back{" "}
              </span>
            </Button>
          </Link>
          <br />
          <br />
          {locationState.showForm.enrollment && (
            <EnrolmentSubmittedForm
              action={locationState.actionType}
              patientObj={locationState.patientObj}
              allPatientInfo={allPatientInfo}
            />
          )}

          {locationState.showForm.diagnosis && (
            <ViralHepatitisForm2
              action={locationState.actionType}
              patientObj={locationState.patientObj}
              diagnosisInfo={diagnosisInfo}
              enrollmentUuid={enrollmentUuid}
              id={locationState?.id}
            />
          )}
          {locationState.showForm.treatment && (
            <TreatmentSubmittedForm
              action={locationState.actionType}
              patientObj={locationState.patientObj}
              treatmentInfo={treatmentInfo}
              enrollmentUuid={enrollmentUuid}
              id={locationState?.id}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default UserRegistration;
