import React, { useEffect, useState } from "react";
import MatButton from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Input, Form, InputGroup } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import { useValidateForm2ValuesHook } from "../../../formSchemas/form1ValidationSchema";
import { Collapse, IconButton } from "@material-ui/core";
import { ArrowForward, ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { getCookie, setCookie } from "../../../helpers/cookieStoragehelpers";
import axios from "axios";
import { url as baseUrl, token } from "../../../../api";
import { toast } from "react-toastify";
import {
  GetOptions,
  ImportantString,
} from "../ViralHepatitisForms/DashboardForm2";
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
    "& > *": {
      margin: theme.spacing(1),
    },
    "& .card-title": {
      color: "#fff",
      fontWeight: "bold",
    },
    "& .form-control": {
      borderRadius: "0.25rem",
      height: "41px",
    },
    "& .card-header:first-child": {
      borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0",
    },
    "& .dropdown-toggle::after": {
      display: " block !important",
    },
    "& select": {
      "-webkit-appearance": "listbox !important",
    },
    "& p": {
      color: "red",
    },
    "& label": {
      fontSize: "14px",
      color: "#014d88",
      fontWeight: "bold",
    },
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
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const DiagnosisSubmitedForm = ({
  action,
  setStep,
  userStatus,
  patientObj,
  id,
  enrollmentUuid,
}) => {
  const [diagnosisInfo, setDiagnosisInfo] = useState({});
  let history = useHistory();

  const [basicInfo, setBasicInfo] = useState({
    clinicalParameters: {
      afp: "",
      alt: "",
      apriScore: "",
      ascites: "",
      ast: "",
      astValue: "",
      childPughScore: "",
      creatinine: "",
      diagnosis_result: "",
      directBiliribin: "",
      fib4: "",
      fibroscan: "",
      gradeOfEncephalopathy: "",
      liverBiopsyStage: "",
      prothrombinTimeNR: "",
      pst: "",
      severityOfAscites: "MILD",
      totalBiliRubin: "",
      ultrasoundScan: "",
      urea: "",
    },
    enrollmentUuid,
    hepatitisBTest: {
      albumin: "",
      antiHDV: "",
      comment: "",
      ctScan: "",
      dateHbvDnaTestRequested: `${diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested?.year}-${diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested?.monthValue}-${diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested?.dayOfMonth}`,
      dateHbvSampleRequested: `${diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested?.year}-${diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested?.monthValue}-${diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested?.dayOfMonth}`,
      dateHbvTestRequested: `${diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested?.year}-${diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested?.monthValue}-${diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested?.dayOfMonth}`,
      hbeAG: "",
      // attaching missing props
      dateHbvDnaResultReported: "",
      hbsAgQuantification: "",
      hbvDna: "DETECTED",
      hvbDnaValue: "",
      pmtctEligible: "",
      stagingDateOfLiverBiopsy: "",
      treatmentEligible: "",
    },
    hepatitisCTest: {
      commobidities: "",
      hcRnaValue: "",
      hcvRNA: "",
      hepatitisCoinfection: "",
      multipleInfection: "",
    },
  });

  const [errors, setErrors] = useState({});

  // handle input changes
  const handleInputChangeBasic = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    setBasicInfo({
      ...basicInfo,
      hepatitisBTest: {
        ...basicInfo.hepatitisBTest,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleInputChangeBasicForHC = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    setBasicInfo({
      ...basicInfo,
      hepatitisCTest: {
        ...basicInfo.hepatitisCTest,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleInputChangeBasicForClinic = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    setBasicInfo({
      ...basicInfo,
      clinicalParameters: {
        ...basicInfo.clinicalParameters,
        [e.target.name]: e.target.value,
      },
    });
  };

  // to capture the error
  let temp = { ...errors };
  const validate = () => {
    temp.dateHbvDnaTestRequested = basicInfo.hepatitisBTest
      .dateHbvDnaTestRequested
      ? ""
      : "Date HBV DNA test requested is required ";
    temp.dateHbvTestRequested = basicInfo.hepatitisBTest.dateHbvTestRequested
      ? ""
      : "Date HBV test requested is required";

    temp.dateHbvSampleRequested = basicInfo.hepatitisBTest
      .dateHbvSampleRequested
      ? ""
      : "Date HBV Sample requested is required";

    // temp.hvbDnaValue =
    //   basicInfo.hepatitisBTest.hvbDnaValue &&
    //   basicInfo.hepatitisBTest.hbvDna === "DETECTED"
    //     ? ""
    //     : " Input HBV DNA value is required";

    temp.commobidities = basicInfo.hepatitisCTest.commobidities
      ? ""
      : "Commobiditiesis required";
    temp.multipleInfection = basicInfo.hepatitisCTest.multipleInfection
      ? ""
      : "Multiple Infection required";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const postDataWithToken = async (data) => {
    try {
      const response = await axios.put(
        `${baseUrl}hepatitis/update-hepatitis-diagnosis/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Handle the response if needed

      toast.success("Diagnosis submitted successfully");
      history.push({
        pathname: "/patient-history",
        state: { patientObj: patientObj },
      });
      setCookie(
        "enrollmentIds",
        {
          enrollmentId: response.data?.enrollmentId,
          enrollmentUuid: response.data?.enrollmentUuid,
        },
        1
      );
      //   setStep(1);
      return response.data;
    } catch (error) {
      // Handle any errors that occurred during the request
      toast.error("Enrolment failed");
      console.error("Error posting data:", error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      postDataWithToken(basicInfo, "hepatitis/diagnosis");
    }
  };
  const onSubmitHandler = (values) => {
    window.scrollTo(0, 0);
    const enrollmentIds = getCookie("enrollmentIds");
    const restructuredDiagnosisPayload = {
      enrollmentUuid: enrollmentIds?.enrollmentUuid,
      hepatitisBTest: {
        dateHbvTestRequested: values.dateHbvTestRequested,
        dateHbvSampleRequested: values.dateHbvSampleRequested,
        dateHbvDnaTestRequested: values.dateHbvDnaTestRequested,
        stagingDateOfLiverBiopsy: values.stagingDateOfLiverBiopsy,
        hbvDna: values.hbvDna,
        hvbDnaValue: values.hvbDnaValue,
        hbsAgQuantification: values.hbsAgQuantification,
        ctScan: values.ctScan,
        albumin: values.albumin,
        hbeAG: values.hbeAG,
        antiHDV: values.antiHDV,
        treatmentEligible: values.treatmentEligible,
        pmtctEligible: values.pmtctEligible,
        comment: values.comment,
      },
      hepatitisCTest: {
        hcvRNA: values.hcvRNA,
        hcRnaValue: values.hcRnaValue,
        hepatitisCoinfection: values.hepatitisCoinfection,
        commobidities: values.commobidities,
        multipleInfection: values.multipleInfection,
      },
      clinicalParameters: {
        ast: values.ast,
        alt: values.alt,
        pst: values.plt,
        astValue: values.astValue,
        totalBiliRubin: values.totalBiliRubin,
        directBiliribin: values.directBiliribin,
        apriScore: values.apriScore,
        fib4: values.fib4,
        prothrombinTimeNR: values.prothrombinTimeNR,
        urea: values.urea,
        creatinine: values.creatinine,
        afp: values.afp,
        fibroscan: values.fibroscan,
        ultrasoundScan: values.ultrasoundScan,
        ascites: values.ascites,
        severityOfAscites: values.severityOfAscites,
        gradeOfEncephalopathy: values.gradeOfEncephalopathy,
        childPughScore: values.childPughScore,
        liverBiopsyStage: values.liverBiopsyStage,
        diagnosis_result: values.diagnosis_result,
      },
    };
    setCookie("hepatitis2", values, 1);
    setCookie("heaptitis2PayloadValue", restructuredDiagnosisPayload, 1);
    postDataWithToken(restructuredDiagnosisPayload, "hepatitis/diagnosis");
  };

  const moveBack = () => {
    window.scrollTo(0, 0);
    setStep(0);
  };
  const classes = useStyles();
  const { formik } = useValidateForm2ValuesHook(onSubmitHandler);

  const castCookieValueToForm = () => {
    const cookieValue = getCookie("hepatitis2");
    if (cookieValue) {
      formik.setValues(cookieValue);
    }
  };

  const viewHepatitisDiagnosis = (eId) => {
    axios
      .get(`${baseUrl}hepatitis/view-hepatitis-diagnosis-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDiagnosisInfo(response.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    viewHepatitisDiagnosis();
  }, []);

  useEffect(() => {
    castCookieValueToForm();

    setBasicInfo({
      clinicalParameters: {
        afp: diagnosisInfo?.clinicalParameters?.afp,
        alt: diagnosisInfo?.clinicalParameters?.alt,
        apriScore: diagnosisInfo?.clinicalParameters?.apriScore,
        ascites: diagnosisInfo?.clinicalParameters?.ascites,
        ast: diagnosisInfo?.clinicalParameters?.ast,
        astValue: diagnosisInfo?.clinicalParameters?.astValue,
        childPughScore: diagnosisInfo?.clinicalParameters?.childPughScore,
        creatinine: diagnosisInfo?.clinicalParameters?.creatinine,
        diagnosis_result: diagnosisInfo?.clinicalParameters?.diagnosis_result,
        directBiliribin: diagnosisInfo?.clinicalParameters?.directBiliribin,
        fib4: diagnosisInfo?.clinicalParameters?.fib4,
        fibroscan: diagnosisInfo?.clinicalParameters?.fibroscan,
        gradeOfEncephalopathy:
          diagnosisInfo?.clinicalParameters?.gradeOfEncephalopathy,
        liverBiopsyStage: diagnosisInfo?.clinicalParameters?.liverBiopsyStage,
        prothrombinTimeNR: diagnosisInfo?.clinicalParameters?.prothrombinTimeNR,
        pst: diagnosisInfo?.clinicalParameters?.pst,
        severityOfAscites: diagnosisInfo?.clinicalParameters?.severityOfAscites,
        totalBiliRubin: diagnosisInfo?.clinicalParameters?.totalBiliRubin,
        ultrasoundScan: diagnosisInfo?.clinicalParameters?.ultrasoundScan,
        urea: diagnosisInfo?.clinicalParameters?.urea,
      },
      enrollmentUuid: enrollmentUuid,
      hepatitisBTest: {
        albumin: diagnosisInfo?.hepatitisBTest?.albumin,
        antiHDV: diagnosisInfo?.hepatitisBTest?.antiHDV,
        comment: diagnosisInfo?.hepatitisBTest?.comment,
        ctScan: diagnosisInfo?.hepatitisBTest?.ctScan,

        dateHbvDnaTestRequested: `${
          diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested.year
        }-${
          diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested.monthValue.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested.monthValue
            : "0" +
              diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested.monthValue.toString()
                .length
        }-${
          diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested.dayOfMonth.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested.dayOfMonth
            : "0" +
              diagnosisInfo?.hepatitisBTest?.dateHbvDnaTestRequested.dayOfMonth
        }`,
        dateHbvSampleRequested: `${
          diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested.year
        }-${
          diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested.monthValue.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested.monthValue
            : "0" +
              diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested.monthValue
        }-${
          diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested.dayOfMonth.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested.dayOfMonth
            : "0" +
              diagnosisInfo?.hepatitisBTest?.dateHbvSampleRequested.dayOfMonth
        }`,
        dateHbvTestRequested: `${
          diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested.year
        }-${
          diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested.monthValue.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested.monthValue
            : "0" +
              diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested.monthValue
        }-${
          diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested.dayOfMonth.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested.dayOfMonth
            : "0" +
              diagnosisInfo?.hepatitisBTest?.dateHbvTestRequested.dayOfMonth
        }`,
        hbeAG: diagnosisInfo?.hepatitisBTest?.hbeAG,
        // attaching missing props
        dateHbvDnaResultReported: `${
          diagnosisInfo?.hepatitisBTest?.dateHbvDnaResultReported?.year
        }-${
          diagnosisInfo?.hepatitisBTest?.dateHbvDnaResultReported?.monthValue.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.dateHbvDnaResultReported
                ?.monthValue
            : "0" +
              diagnosisInfo?.hepatitisBTest?.dateHbvDnaResultReported
                ?.monthValue
        }-${
          diagnosisInfo?.hepatitisBTest?.dateHbvDnaResultReported?.dayOfMonth.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.dateHbvDnaResultReported
                ?.dayOfMonth
            : "0" +
              diagnosisInfo?.hepatitisBTest?.dateHbvDnaResultReported
                ?.dayOfMonth
        }`,
        hbsAgQuantification: diagnosisInfo?.hepatitisBTest?.hbsAgQuantification,
        hbvDna: diagnosisInfo?.hepatitisBTest?.hbvDna,
        hvbDnaValue: diagnosisInfo?.hepatitisBTest?.hvbDnaValue,
        pmtctEligible: diagnosisInfo?.hepatitisBTest?.pmtctEligible,
        stagingDateOfLiverBiopsy: `${
          diagnosisInfo?.hepatitisBTest?.stagingDateOfLiverBiopsy.year
        }-${
          diagnosisInfo?.hepatitisBTest?.stagingDateOfLiverBiopsy.monthValue.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.stagingDateOfLiverBiopsy.monthValue
            : "0" +
              diagnosisInfo?.hepatitisBTest?.stagingDateOfLiverBiopsy.monthValue
        }-${
          diagnosisInfo?.hepatitisBTest?.stagingDateOfLiverBiopsy.dayOfMonth.toString()
            .length > 1
            ? diagnosisInfo?.hepatitisBTest?.stagingDateOfLiverBiopsy.dayOfMonth
            : "0" +
              diagnosisInfo?.hepatitisBTest?.stagingDateOfLiverBiopsy.dayOfMonth
        }`,
        treatmentEligible: diagnosisInfo?.hepatitisBTest?.treatmentEligible,
      },
      hepatitisCTest: {
        commobidities: diagnosisInfo?.hepatitisCTest?.commobidities,
        hcRnaValue: diagnosisInfo?.hepatitisCTest?.hcRnaValue,
        hcvRNA: diagnosisInfo?.hepatitisCTest?.hcvRNA,
        hepatitisCoinfection:
          diagnosisInfo?.hepatitisCTest?.hepatitisCoinfection,
        multipleInfection: diagnosisInfo?.hepatitisCTest?.multipleInfection,
      },
    });
  }, [diagnosisInfo, enrollmentUuid]);

  const [isDropdownsOpen, setIsDropdownsOpen] = useState({
    hepatitisBDropdown: true,
    hepatitisCDropdown: true,
    coInfectionDropdown: true,
  });

  useEffect(() => {
    if (basicInfo.hepatitisBTest.hbvDna === "DETECTED") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisBTest: { ...prev.hepatitisBTest, hbvDna: "" },
      }));
    }
  });
  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <div className="col-xl-12 col-lg-12">
            {/* <Form onSubmit={formik.handleSubmit}> */}
            <div className="card">
              <div
                className="card-header"
                style={{
                  backgroundColor: "#014d88",
                  color: "#fff",
                  fontWeight: "bolder",
                  borderRadius: "0.2rem",
                }}
              >
                <h5 className="card-title" style={{ color: "#fff" }}>
                  Diagnosis
                </h5>
              </div>
              <div>
                <div
                  style={{
                    backgroundColor: "#d8f6ff",
                    width: "95%",
                    margin: "auto",
                    marginTop: "5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      color: "black",
                      fontSize: "15px",
                      fontWeight: "600",
                      marginLeft: "10px",
                      marginTop: "10px",
                    }}
                  >
                    Hepatitis B
                  </p>
                  <IconButton
                    onClick={() =>
                      setIsDropdownsOpen((prevState) => {
                        return {
                          ...prevState,
                          hepatitisBDropdown: !prevState.hepatitisBDropdown,
                        };
                      })
                    }
                    aria-expanded={isDropdownsOpen.hepatitisBDropdown}
                    aria-label="Expand"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>
                <div className="card-body">
                  <Collapse in={isDropdownsOpen.hepatitisBDropdown}>
                    <div
                      className="basic-form"
                      style={{ padding: "0 50px 0 50px" }}
                    >
                      <div className="row">
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="dateHbvDnaTestRequested">
                              Date HBV DNA test requested{" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              disabled={action === "view" ? true : false}
                              name="dateHbvDnaTestRequested"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              id="dateHbvDnaTestRequested"
                              value={
                                basicInfo.hepatitisBTest.dateHbvDnaTestRequested
                              }
                              onChange={handleInputChangeBasic}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateHbvDnaTestRequested !== "" ? (
                              <span className={classes.error}>
                                {errors.dateHbvDnaTestRequested}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="dateHbvTestRequested">
                              Date HBV test requested{" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              disabled={action === "view" ? true : false}
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              name="dateHbvTestRequested"
                              id="dateHbvTestRequested"
                              value={
                                basicInfo.hepatitisBTest.dateHbvTestRequested
                              }
                              onChange={handleInputChangeBasic}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateHbvTestRequested !== "" ? (
                              <span className={classes.error}>
                                {errors.dateHbvTestRequested}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="dateHbvSampleRequested">
                              Date HBV sample Requested{" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              disabled={action === "view" ? true : false}
                              name="dateHbvSampleRequested"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              id="dateHbvSampleRequested"
                              value={
                                basicInfo.hepatitisBTest.dateHbvSampleRequested
                              }
                              onChange={handleInputChangeBasic}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateHbvSampleRequested !== "" ? (
                              <span className={classes.error}>
                                {errors.dateHbvSampleRequested}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="dateHbvDnaResultReported">
                              Date of HBV DNA result reported{" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              disabled={action === "view" ? true : false}
                              name="dateHbvDnaResultReported"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              id="dateHbvDnaResultReported"
                              value={
                                basicInfo.hepatitisBTest
                                  .dateHbvDnaResultReported
                              }
                              onChange={handleInputChangeBasic}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateHbvDnaResultReported !== "" ? (
                              <span className={classes.error}>
                                {errors.dateHbvDnaResultReported}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-2 col-md-4">
                          <FormGroup>
                            <Label>
                              HBV DNA(UI/ml){" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                            <div className="radio">
                              <label>
                                <input
                                  type="radio"
                                  disabled={action === "view" ? true : false}
                                  value="DETECTED"
                                  name="hbvDna"
                                  checked={
                                    basicInfo.hepatitisBTest.hbvDna ===
                                    "DETECTED"
                                  }
                                  onChange={handleInputChangeBasic}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />{" "}
                                Detected
                              </label>
                            </div>
                            <div className="radio">
                              <label>
                                <input
                                  type="radio"
                                  value="UNDETECTED"
                                  disabled={action === "view" ? true : false}
                                  name="hbvDna"
                                  checked={
                                    basicInfo.hepatitisBTest.hbvDna ===
                                    "UNDETECTED"
                                  }
                                  // onBlur={formik.handleBlur}
                                  onChange={handleInputChangeBasic}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />{" "}
                                Undetected{" "}
                                <span style={{ color: "red" }}> *</span>{" "}
                              </label>
                            </div>
                          </FormGroup>
                        </div>
                        {basicInfo.hepatitisBTest.hbvDna === "DETECTED" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hvbDnaValue">
                                Input HBV DNA value{" "}
                                <span style={{ color: "red" }}> *</span>{" "}
                              </Label>
                              <input
                                className="form-control"
                                type="text"
                                name="hvbDnaValue"
                                disabled={action === "view" ? true : false}
                                id="hvbDnaValue"
                                value={basicInfo.hepatitisBTest.hbvDna}
                                onChange={handleInputChangeBasic}
                                // onBlur={formik.handleBlur}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {errors.hvbDnaValue !== "" ? (
                                <span className={classes.error}>
                                  {errors.hvbDnaValue}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>
                        )}
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbsAgQuantification">
                              HBsAG Quantification (IU/ml){" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              disabled={action === "view" ? true : false}
                              name="hbsAgQuantification"
                              id="hbsAgQuantification"
                              value={
                                basicInfo.hepatitisBTest.hbsAgQuantification
                              }
                              onChange={handleInputChangeBasic}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hbsAgQuantification !== "" ? (
                              <span className={classes.error}>
                                {errors.hbsAgQuantification}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbeAG">HbeAG</Label>{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="hbeAG"
                              id="hbeAG"
                              disabled={action === "view" ? true : false}
                              onChange={handleInputChangeBasic}
                              value={basicInfo.hepatitisBTest.hbeAG}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value={""}>Select</option>
                              <option value={"REACTIVE"}>Reactive</option>
                              <option value={"NON_REACTIVE"}>
                                Non Reactive
                              </option>
                            </select>
                            {errors.hbeAG !== "" ? (
                              <span className={classes.error}>
                                {errors.hbeAG}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="antiHDV">Anti-HDV</Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="antiHDV"
                              disabled={action === "view" ? true : false}
                              id="antiHDV"
                              onChange={handleInputChangeBasic}
                              value={basicInfo.hepatitisBTest.antiHDV}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value={""}>Select</option>
                              <option value={"REACTIVE"}>Reactive</option>
                              <option value={"NON_REACTIVE"}>
                                Non Reactive
                              </option>
                              <option value={"NOT_DONE"}>Not Done</option>
                            </select>
                            {errors.antiHDV !== "" ? (
                              <span className={classes.error}>
                                {errors.antiHDV}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="treatmentEligible">
                              Treatment Eligible
                            </Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="treatmentEligible"
                              id="treatmentEligible"
                              disabled={action === "view" ? true : false}
                              onChange={handleInputChangeBasic}
                              value={basicInfo.hepatitisBTest.treatmentEligible}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value={""}>Select</option>
                              <option value={"YES"}>Yes</option>
                              <option value={"NO"}>No</option>
                            </select>
                            {errors.treatmentEligible !== "" ? (
                              <span className={classes.error}>
                                {errors.treatmentEligible}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        {diagnosisInfo?.hepatitisEnrollment?.sex?.toUpperCase() ===
                          "FEMALE" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="pmtctEligible">PMTCT Eligible</Label>
                              <span style={{ color: "red" }}> *</span>{" "}
                              <select
                                className="form-control"
                                name="pmtctEligible"
                                disabled={action === "view" ? true : false}
                                id="pmtctEligible"
                                onChange={handleInputChangeBasic}
                                value={basicInfo.hepatitisBTest.pmtctEligible}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>Select</option>
                                <option value={"YES"}>Yes</option>
                                <option value={"NO"}>No</option>
                              </select>
                              {errors.pmtctEligible !== "" ? (
                                <span className={classes.error}>
                                  {errors.pmtctEligible}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>
                        )}
                        <div className="form-group mb-3 col-md-4-12">
                          <FormGroup>
                            <Label for="comment">Comment</Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <textarea
                              className="form-control"
                              name="comment"
                              id="comment"
                              disabled={action === "view" ? true : false}
                              onChange={handleInputChangeBasic}
                              value={basicInfo.hepatitisBTest.comment}
                              cols="50"
                              rows="30"
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                                height: "120px",
                              }}
                            />
                            {errors.comment !== "" ? (
                              <span className={classes.error}>
                                {errors.comment}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: "#d8f6ff",
                    width: "95%",
                    margin: "auto",
                    marginTop: "5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      color: "black",
                      fontSize: "15px",
                      fontWeight: "600",
                      marginLeft: "10px",
                      marginTop: "10px",
                    }}
                  >
                    Hepatitis C
                  </p>
                  <IconButton
                    onClick={() =>
                      setIsDropdownsOpen((prevState) => {
                        return {
                          ...prevState,
                          coInfectionDropdown: !prevState.coInfectionDropdown,
                        };
                      })
                    }
                    aria-expanded={isDropdownsOpen.coInfectionDropdown}
                    aria-label="Expand"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>
                <div className="card-body">
                  <Collapse in={isDropdownsOpen.coInfectionDropdown}>
                    <div
                      className="basic-form"
                      style={{ padding: "0 50px 0 50px" }}
                    >
                      <div className="row">
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hcvRNA">HCV RNA (IU/ml)</Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="hcvRNA"
                              id="hcvRNA"
                              disabled={action === "view" ? true : false}
                              onChange={handleInputChangeBasicForHC}
                              // onBlur={formik.handleBlur}
                              value={basicInfo.hepatitisCTest.hcvRNA}
                              style={{
                                border: "1px solid #014D88",

                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value={""}>select</option>
                              <option value={"DETECTED"}>Detected</option>
                              <option value={"UNDETECTED"}>Undetected</option>
                            </select>
                            {errors.hcvRNA !== "" ? (
                              <span className={classes.error}>
                                {errors.hcvRNA}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        {basicInfo.hepatitisCTest.hcvRNA === "DETECTED" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hcRnaValue">
                                Input HCV RNA Value (IU/ml){" "}
                                <span style={{ color: "red" }}> *</span>{" "}
                              </Label>
                              <span style={{ color: "red" }}> *</span>{" "}
                              <input
                                className="form-control"
                                type="text"
                                disabled={action === "view" ? true : false}
                                name="hcRnaValue"
                                id="hcRnaValue"
                                value={basicInfo.hepatitisCTest.hcRnaValue}
                                onChange={handleInputChangeBasicForHC}
                                // onBlur={formik.handleBlur}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {/* {errors.hcRnaValue !== "" ? (
                                <span className={classes.error}>
                                  {errors.hcRnaValue}
                                </span>
                              ) : (
                                ""
                              )} */}
                            </FormGroup>
                          </div>
                        )}

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hepatitisCoinfection">
                              Hepatitis Coinfection
                            </Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              disabled={action === "view" ? true : false}
                              multiple
                              name="hepatitisCoinfection"
                              id="hepatitisCoinfection"
                              onChange={handleInputChangeBasicForHC}
                              value={
                                basicInfo.hepatitisCTest.hepatitisCoinfection
                              }
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value={""}>Select</option>
                              <option value={"HBV_HCV"}>HBV/HCV</option>
                              <option value={"HBV_HIV"}>HBV/HIV</option>
                              <option value={"HCV_HIV"}>HCV/HIV</option>
                              <option value={"HBV_HDV"}>HBV/HDV</option>
                              <option value={"HBV_HCD_HIV"}>HBV/HCD/HIV</option>
                            </select>
                            {errors.hepatitisCoinfection !== "" ? (
                              <span className={classes.error}>
                                {errors.hepatitisCoinfection}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="commobidities">
                              Commobidities{" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              name="commobidities"
                              id="commobidities"
                              disabled={action === "view" ? true : false}
                              value={basicInfo.hepatitisCTest.commobidities}
                              onChange={handleInputChangeBasicForHC}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.commobidities !== "" ? (
                              <span className={classes.error}>
                                {errors.commobidities}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="multipleInfection">
                              Specify multiple infection{" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              disabled={action === "view" ? true : false}
                              name="multipleInfection"
                              id="multipleInfection"
                              value={basicInfo.hepatitisCTest.multipleInfection}
                              onChange={handleInputChangeBasicForHC}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.multipleInfection !== "" ? (
                              <span className={classes.error}>
                                {errors.multipleInfection}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </div>

            <div className="card">
              <div
                className="card-header"
                style={{
                  backgroundColor: "#014d88",
                  color: "#fff",
                  fontWeight: "bolder",
                  borderRadius: "0.2rem",
                }}
              >
                <h5 className="card-title" style={{ color: "#fff" }}>
                  Clinical Parameters
                </h5>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ast">AST (IU/ml)</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <select
                        className="form-control"
                        name="ast"
                        id="ast"
                        disabled={action === "view" ? true : false}
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.ast}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}>Select</option>
                        <option value={"YES"}>Yes</option>
                        <option value={"NO"}>No</option>
                      </select>
                      {errors.ast !== "" ? (
                        <span className={classes.error}>{errors.ast}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="alt">ALT (IU/ml)</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <select
                        className="form-control"
                        name="alt"
                        id="alt"
                        disabled={action === "view" ? true : false}
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.alt}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}>Select</option>
                        <option value={"YES"}>Yes</option>
                        <option value={"NO"}>No</option>
                      </select>
                      {errors.alt !== "" ? (
                        <span className={classes.error}>{errors.alt}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="pst">PST (mm3)</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <select
                        className="form-control"
                        name="pst"
                        id="pst"
                        disabled={action === "view" ? true : false}
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.pst}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}>Select</option>
                        <option value={"YES"}>Yes</option>
                        <option value={"NO"}>No</option>
                      </select>
                      {errors.pst !== "" ? (
                        <span className={classes.error}>{errors.pst}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                </div>
                <div className="row">
                  {basicInfo.ast === "YES" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="astValue">
                          Input AST value{" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="astValue"
                          id="astValue"
                          disabled={action === "view" ? true : false}
                          value={basicInfo.clinicalParameters.astValue}
                          onChange={handleInputChangeBasicForClinic}
                          // onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                      </FormGroup>
                    </div>
                  )}
                  {basicInfo.alt === "YES" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="altValue">
                          Input ALT value{" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          disabled={action === "view" ? true : false}
                          name="altValue"
                          id="altValue"
                          value={basicInfo.clinicalParameters.altValue}
                          onChange={handleInputChangeBasicForClinic}
                          // onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                      </FormGroup>
                    </div>
                  )}
                  {basicInfo.plt === "YES" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="pstValue">
                          Input PST value{" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          disabled={action === "view" ? true : false}
                          name="pstValue"
                          id="pstValue"
                          value={basicInfo.clinicalParameters.pstValue}
                          onChange={handleInputChangeBasicForClinic}
                          // onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                      </FormGroup>
                    </div>
                  )}
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="totalBiliRubin">
                        Total Bilirubin (μmol/L){" "}
                        <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <input
                        className="form-control"
                        type="text"
                        name="totalBiliRubin"
                        disabled={action === "view" ? true : false}
                        id="totalBiliRubin"
                        value={basicInfo.clinicalParameters.totalBiliRubin}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.totalBiliRubin !== "" ? (
                        <span className={classes.error}>
                          {errors.totalBiliRubin}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="directBiliribin">
                        Direct Bilirubin (μmol/L)
                      </Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="directBiliribin"
                        disabled={action === "view" ? true : false}
                        id="directBiliribin"
                        value={basicInfo.clinicalParameters.directBiliribin}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.directBiliribin !== "" ? (
                        <span className={classes.error}>
                          {errors.directBiliribin}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="albumin">Albumin (g/dl)</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="albumin"
                        disabled={action === "view" ? true : false}
                        id="albumin"
                        value={basicInfo.hepatitisBTest.albumin}
                        onChange={handleInputChangeBasic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.albumin !== "" ? (
                        <span className={classes.error}>{errors.albumin}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="apriScore">APRI score </Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        disabled={action === "view" ? true : false}
                        name="apriScore"
                        id="apriScore"
                        value={basicInfo.clinicalParameters.apriScore}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.apriScore !== "" ? (
                        <span className={classes.error}>
                          {errors.apriScore}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="fib4">FIB-4</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="fib4"
                        id="fib4"
                        disabled={action === "view" ? true : false}
                        value={basicInfo.clinicalParameters.fib4}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.fib4 !== "" ? (
                        <span className={classes.error}>{errors.fib4}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="prothrombinTimeNR">
                        Prothrombin time/INR
                      </Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        disabled={action === "view" ? true : false}
                        name="prothrombinTimeNR"
                        id="prothrombinTimeNR"
                        value={basicInfo.clinicalParameters.prothrombinTimeNR}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.prothrombinTimeNR !== "" ? (
                        <span className={classes.error}>
                          {errors.prothrombinTimeNR}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="urea">Urea (mg/dl)</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="urea"
                        disabled={action === "view" ? true : false}
                        id="urea"
                        value={basicInfo.clinicalParameters.urea}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.urea !== "" ? (
                        <span className={classes.error}>{errors.urea}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="creatinine">Creatinine (μmol/L)</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="creatinine"
                        disabled={action === "view" ? true : false}
                        id="creatinine"
                        value={basicInfo.clinicalParameters.creatinine}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.creatinine !== "" ? (
                        <span className={classes.error}>
                          {errors.creatinine}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ultrasoundScan">Ultrasound scan</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="ultrasoundScan"
                        disabled={action === "view" ? true : false}
                        id="ultrasoundScan"
                        value={basicInfo.clinicalParameters.ultrasoundScan}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.ultrasoundScan !== "" ? (
                        <span className={classes.error}>
                          {errors.ultrasoundScan}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="creatinine">AFP (ng/ml)</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        disabled={action === "view" ? true : false}
                        name="afp"
                        id="afp"
                        value={basicInfo.clinicalParameters.afp}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.afp !== "" ? (
                        <span className={classes.error}>{errors.afp}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="fibroscan">Fibroscan (Kpa)</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="fibroscan"
                        disabled={action === "view" ? true : false}
                        id="fibroscan"
                        value={basicInfo.clinicalParameters.fibroscan}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.fibroscan !== "" ? (
                        <span className={classes.error}>
                          {errors.fibroscan}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ctScan">CT scan</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        disabled={action === "view" ? true : false}
                        name="ctScan"
                        id="ctScan"
                        value={basicInfo.hepatitisBTest.ctScan}
                        onChange={handleInputChangeBasic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.ctScan !== "" ? (
                        <span className={classes.error}>{errors.ctScan}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ascites">Ascites</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <select
                        className="form-control"
                        name="ascites"
                        disabled={action === "view" ? true : false}
                        id="ascites"
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.ascites}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}>Select</option>
                        <option value={"YES"}>Yes</option>
                        <option value={"NO"}>No</option>
                      </select>
                      {errors.ascites !== "" ? (
                        <span className={classes.error}>{errors.ascites}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  {basicInfo.clinicalParameters.ascites === "YES" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="severityOfAscites">
                          Severity of ascites
                        </Label>
                        <span style={{ color: "red" }}> *</span>{" "}
                        <select
                          className="form-control"
                          name="severityOfAscites"
                          id="severityOfAscites"
                          disabled={action === "view" ? true : false}
                          onChange={handleInputChangeBasicForClinic}
                          value={basicInfo.clinicalParameters.severityOfAscites}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value={""}>Select</option>
                          <option value={"MILD"}>Mild</option>
                          <option value={"MODERATE"}>Moderate</option>
                          <option value={"MASSIVE_OR_GROSS"}>
                            Massive/Gross
                          </option>
                        </select>
                        {/* {errors.fib4 !== "" ? (
                          <span className={classes.error}>{errors.fib4}</span>
                        ) : (
                          ""
                        )} */}
                      </FormGroup>
                    </div>
                  )}

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ascitesLevel">Grade of Encephalopathy</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <select
                        className="form-control"
                        name="gradeOfEncephalopathy"
                        id="gradeOfEncephalopathy"
                        disabled={action === "view" ? true : false}
                        onChange={handleInputChangeBasicForClinic}
                        value={
                          basicInfo.clinicalParameters.gradeOfEncephalopathy
                        }
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}>Select</option>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                      {errors.gradeOfEncephalopathy !== "" ? (
                        <span className={classes.error}>
                          {errors.gradeOfEncephalopathy}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="childPughScore">Child pugh score</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="childPughScore"
                        disabled={action === "view" ? true : false}
                        id="childPughScore"
                        value={basicInfo.clinicalParameters.childPughScore}
                        onChange={handleInputChangeBasicForClinic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.childPughScore !== "" ? (
                        <span className={classes.error}>
                          {errors.childPughScore}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="liverBiopsyStage">Liver biopsy stage</Label>
                      <ImportantString str="*" />{" "}
                      <select
                        className="form-control"
                        name="liverBiopsyStage"
                        id="liverBiopsyStage"
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.liverBiopsyStage}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <GetOptions
                          options={[
                            { fldName: "Select", fldValue: "" },
                            { fldName: "No Fibrosis", fldValue: "NO_FIBROSIS" },
                            {
                              fldName: "Mild Fibrosis",
                              fldValue: "MILD_FIBROSIS",
                            },
                            {
                              fldName: "Moderate Fibrosis",
                              fldValue: "MODERATE_FIBROSIS",
                            },
                            { fldName: "Fibrosis", fldValue: "FIBROSIS" },
                            {
                              fldName: "Severe Fibrosis",
                              fldValue: "SEVERE_FIBROSIS",
                            },
                            { fldName: "Cirrhosis", fldValue: "CIRRHOSIS" },
                            { fldName: "Not Done", fldValue: "NOT_DONE" },
                          ]}
                        />
                      </select>
                      {errors.liverBiopsyStage && (
                        <span className={classes.error}>
                          {errors.liverBiopsyStage}
                        </span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="stagingDateOfLiverBiopsy">
                        Staging date of liver biopsy{" "}
                      </Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        className="form-control"
                        type="date"
                        name="stagingDateOfLiverBiopsy"
                        disabled={action === "view" ? true : false}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        id="stagingDateOfLiverBiopsy"
                        value={
                          basicInfo.hepatitisBTest.stagingDateOfLiverBiopsy
                        }
                        onChange={handleInputChangeBasic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.stagingDateOfLiverBiopsy !== "" ? (
                        <span className={classes.error}>
                          {errors.stagingDateOfLiverBiopsy}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="diagnosis_result">Diagnosis</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <select
                        className="form-control"
                        name="diagnosis_result"
                        id="diagnosis_result"
                        disabled={action === "view" ? true : false}
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.diagnosis_result}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value={""}>Select</option>
                        <option value={"NO_FIBROSIS"}> No Fibrosis</option>
                        <option value={"FIBROSIS"}>Fibrosis</option>
                        <option value={"CIRRHOSIS"}>Cirrhosis</option>
                        <option value={"HIGH_CC"}>HCC</option>
                      </select>
                      {errors.diagnosis_result !== "" ? (
                        <span className={classes.error}>
                          {errors.diagnosis_result}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
            {false ? <Spinner /> : ""}
            <br />
            {action === "update" && (
              <div className="d-flex justify-content-end">
                <MatButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<ArrowForward />}
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
                >
                  <span style={{ textTransform: "capitalize" }}>Update</span>
                </MatButton>
              </div>
            )}
            {/* </Form> */}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DiagnosisSubmitedForm;
