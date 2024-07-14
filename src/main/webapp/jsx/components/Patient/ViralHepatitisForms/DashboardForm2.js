import React, { useEffect, useState } from "react";
import MatButton from "@material-ui/core/Button";
import { FormGroup, Label, Spinner } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, IconButton, Collapse } from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import { useValidateForm2ValuesHook } from "../../../formSchemas/form1ValidationSchema";
import { ArrowForward, ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { getCookie, setCookie } from "../../../helpers/cookieStoragehelpers";
import axios from "axios";
import { url as baseUrl, token } from "../../../../api";
import moment from "moment";
import { toast } from "react-toastify";
library.add(faCheckSquare, faCoffee, faEdit, faTrash);

// hcRnaValue
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

export const ImportantString = ({ str }) => (
  <span style={{ color: "red" }}>{str}</span>
);

export const GetOptions = ({ options }) => (
  <React.Fragment>
    {options.map(({ fldName, fldValue }) => (
      <option key={fldName} value={fldValue}>
        {fldName}
      </option>
    ))}
  </React.Fragment>
);
export const YesOrNoSelectInput = () => (
  <GetOptions
    options={[
      { fldName: "Select", fldValue: "" },
      { fldName: "No", fldValue: "NO" },
      { fldName: "Yes", fldValue: "YES" },
    ]}
  />
);
const DashboardForm2 = ({ patientObj, setActiveContent }) => {
  const [enrollmentUuid, setEnrollmentUuid] = useState("");
  const [errors, setErrors] = useState({});
  const [childPughData, setChildPughData] = useState([]);

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
    enrollmentUuid: enrollmentUuid,
    hepatitisBTest: {
      albumin: "",
      antiHDV: "",
      comment: "",
      ctScan: "",
      dateHbvDnaTestRequested: "",
      dateHbvSampleRequested: "",
      dateHbvTestRequested: "",
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
      hepatitisCoinfection: [],
      multipleInfection: "",
    },
  });

  const fetchChildPughScore = async () => {
    const response = await axios.get(
      `${baseUrl}application-codesets/v2/CHILD_PUGH`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = response.data;
    setChildPughData(data);
  };

  const viewHepatitisEnrollment = () => {
    axios
      .get(
        `${baseUrl}hepatitis/view-hepatitis-enrollment/${patientObj?.personUuid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setEnrollmentUuid(response.data.uuid);
      })
      .catch((error) => {});
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (event) => {
    const option = event.target.value;
    if (event.target.checked) {
      setSelectedOptions((prevOptions) => {
        const updatedOptions = [...prevOptions, option];

        setErrors({ ...temp, [event.target.name]: "" });
        setBasicInfo({
          ...basicInfo,
          hepatitisCTest: {
            ...basicInfo.hepatitisCTest,
            [event.target.name]: updatedOptions,
          },
        });

        return updatedOptions;
      });
    } else {
      setSelectedOptions((prevOptions) => {
        const updatedOptions = prevOptions.filter((item) => item !== option);

        setErrors({ ...temp, [event.target.name]: "" });
        setBasicInfo({
          ...basicInfo,
          hepatitisCTest: {
            ...basicInfo.hepatitisCTest,
            [event.target.name]: updatedOptions,
          },
        });

        return updatedOptions;
      });
    }
  };

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

  let temp = { ...errors };

  const validate = () => {
    dateHbvDnaTestRequested = basicInfo.hepatitisBTest.dateHbvDnaTestRequested
      ? ""
      : "Date HBV DNA test requested is required ";
    // dateHbvTestRequested = basicInfo.hepatitisBTest.dateHbvTestRequested
    //   ? ""
    //   : "Date HBV test requested is required";

    dateHbvSampleRequested = basicInfo.hepatitisBTest.dateHbvSampleRequested
      ? ""
      : "Date HBV Sample requested is required";

    dateHbvDnaResultReported = basicInfo.hepatitisBTest.dateHbvDnaResultReported
      ? ""
      : "Date of HBV DNA result reported is required";

    hbsAgQuantification = basicInfo.hepatitisBTest.hbsAgQuantification
      ? ""
      : "HBsAG Quantification is required";

    hbeAG = basicInfo.hepatitisBTest.hbeAG ? "" : "HbeAG is required";

    antiHDV = basicInfo.hepatitisBTest.antiHDV ? "" : "Anti-HDV is required";

    treatmentEligible = basicInfo.hepatitisBTest.treatmentEligible
      ? ""
      : " Treatment Eligible is required";

    pmtctEligible = basicInfo.hepatitisBTest.pmtctEligible
      ? ""
      : " PMTCT Eligible is required";

    comment = basicInfo.hepatitisBTest.pmtctEligible
      ? ""
      : " PMTCT Eligible is required";

    ast = basicInfo.hepatitisBTest.pmtctEligible ? "" : " AST is required";
    alt = basicInfo.clinicalParameters.alt ? "" : " ALT is required";
    hcvRNA = basicInfo.hepatitisCTest.hcvRNA ? "" : "HCV RNA is required";
    // hepatitisCoinfection = basicInfo.hepatitisCTest.hepatitisCoinfection
    //   ? ""
    //   : "Hepatitis Coinfection is required";

    pst = basicInfo.clinicalParameters.pst ? "" : " PST is required";
    totalBiliRubin = basicInfo.clinicalParameters.totalBiliRubin
      ? ""
      : " ALT is required";
    directBiliribin = basicInfo.clinicalParameters.directBiliribin
      ? ""
      : "Direct Bilirubin is required";

    albumin = basicInfo.hepatitisBTest.albumin ? "" : "Albumin is required";

    apriScore = basicInfo.clinicalParameters.apriScore
      ? ""
      : "APRI score is required";

    fib4 = basicInfo.clinicalParameters.fib4 ? "" : "FIB-4 is required";

    prothrombinTimeNR = basicInfo.clinicalParameters.prothrombinTimeNR
      ? ""
      : "Prothrombin time/INR is required";

    urea = basicInfo.clinicalParameters.urea ? "" : "Urea is required";

    creatinine = basicInfo.clinicalParameters.creatinine
      ? ""
      : "Creatinine is required";

    ultrasoundScan = basicInfo.clinicalParameters.ultrasoundScan
      ? ""
      : "Ultrasound scan is required";

    afp = basicInfo.clinicalParameters.afp ? "" : "AFP  is required";
    fibroscan = basicInfo.clinicalParameters.fibroscan
      ? ""
      : "Fibroscan  is required";

    ctScan = basicInfo.hepatitisBTest.ctScan ? "" : "CT scan  is required";
    ascites = basicInfo.clinicalParameters.ascites
      ? ""
      : "Ascites  is required";
    gradeOfEncephalopathy = basicInfo.clinicalParameters.gradeOfEncephalopathy
      ? ""
      : "Grade of Encephalopathy  is required";

    childPughScore = basicInfo.clinicalParameters.childPughScore
      ? ""
      : "Child pugh score  is required";

    liverBiopsyStage = basicInfo.clinicalParameters.liverBiopsyStage
      ? ""
      : "Liver biopsy stage  is required";

    stagingDateOfLiverBiopsy = basicInfo.hepatitisBTest.stagingDateOfLiverBiopsy
      ? ""
      : "Staging date of liver biopsy is required";

    diagnosis_result = basicInfo.clinicalParameters.diagnosis_result
      ? ""
      : "Diagnosis is required";
    //

    //

    commobidities = basicInfo.hepatitisCTest.commobidities
      ? ""
      : "Commobiditie is required";
    multipleInfection = basicInfo.clinicalParameters.ast
      ? ""
      : "Multiple Infection required";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const postDataWithToken = async (data, key) => {
    try {
      const response = await axios.post(`${baseUrl}${key}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Diagnosis submitted successfully");
      setActiveContent({
        route: "recent-history",
        id: "",
        activeTab: "home",
        actionType: "create",
        obj: {},
      });
      return response.data;
    } catch (error) {
      toast.error("Diagnosis failed");
      console.error("Error posting data:", error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);

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

  const classes = useStyles();
  const { formik } = useValidateForm2ValuesHook(onSubmitHandler);

  const castCookieValueToForm = () => {
    const cookieValue = getCookie("hepatitis2");
    if (cookieValue) {
      formik.setValues(cookieValue);
    }
  };

  useEffect(() => {
    castCookieValueToForm();
    viewHepatitisEnrollment();
    fetchChildPughScore();
  }, []);

  useEffect(() => {
    setBasicInfo({
      ...basicInfo,
      enrollmentUuid: enrollmentUuid,
    });
  }, [enrollmentUuid]);

  useEffect(() => {
    if (basicInfo.hepatitisBTest.hbvDna === "UNDETECTED") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisBTest: { ...prev.hepatitisBTest, hvbDnaValue: "" },
      }));
    }
  }, [basicInfo.hepatitisBTest.hbvDna]);
  useEffect(() => {
    if (basicInfo.hepatitisCTest.hcvRNA === "UNDETECTED") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisCTest: { ...prev.hepatitisCTest, hcRnaValue: "" },
      }));
    }
  }, [basicInfo.hepatitisCTest.hcvRNA]);

  const [isDropdownsOpen, setIsDropdownsOpen] = useState({
    hepatitisBDropdown: true,
    hepatitisCDropdown: true,
    coInfectionDropdown: true,
  });
  useEffect(() => {
    if (basicInfo.hepatitisBTest.hbvDna === "UNDETECTED") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisBTest: { ...prev.hepatitisBTest, hbvDna: "" },
      }));
    }
  }, [basicInfo.hepatitisBTest.hbvDna]);
  useEffect(() => {
    if (basicInfo.hepatitisCTest.hcvRNA === "UNDETECTED") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisCTest: { ...prev.hepatitisCTest, hcRnaValue: "" },
      }));
    }
  }, [basicInfo.hepatitisCTest.hcvRNA]);
  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <div className="col-xl-12 col-lg-12">
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
                              <ImportantString str="*" />{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              name="dateHbvDnaTestRequested"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              id="dateHbvDnaTestRequested"
                              value={
                                basicInfo.hepatitisBTest.dateHbvDnaTestRequested
                              }
                              onChange={handleInputChangeBasic}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateHbvDnaTestRequested && (
                              <span className={classes.error}>
                                {errors.dateHbvDnaTestRequested}
                              </span>
                            )}
                          </FormGroup>
                        </div>

                        {/* <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="dateHbvTestRequested">
                              Date HBV test requested{" "}
                              <ImportantString str="*" />{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              name="dateHbvTestRequested"
                              id="dateHbvTestRequested"
                              value={
                                basicInfo.hepatitisBTest.dateHbvTestRequested
                              }
                              onChange={handleInputChangeBasic}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateHbvTestRequested && (
                              <span className={classes.error}>
                                {errors.dateHbvTestRequested}
                              </span>
                            )}
                          </FormGroup>
                        </div> */}

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="dateHbvSampleRequested">
                              Date HBV DNA sample collected{" "}
                              <ImportantString str="*" />{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              name="dateHbvSampleRequested"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              id="dateHbvSampleRequested"
                              value={
                                basicInfo.hepatitisBTest.dateHbvSampleRequested
                              }
                              onChange={handleInputChangeBasic}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.dateHbvSampleRequeste && (
                              <span className={classes.error}>
                                {errors.dateHbvSampleRequested}
                              </span>
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="dateHbvDnaResultReported">
                              Date of HBV DNA result reported{" "}
                              <ImportantString str="*" />{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
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
                            {errors.dateHbvDnaResultRepor && (
                              <span className={classes.error}>
                                {errors.dateHbvDnaResultReported}
                              </span>
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-2 col-md-4">
                          <FormGroup>
                            <Label>
                              HBV DNA(UI/ml) <ImportantString str="*" />
                            </Label>
                            <div className="radio">
                              <label>
                                <input
                                  type="radio"
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
                                  name="hbvDna"
                                  checked={
                                    basicInfo.hepatitisBTest.hbvDna ===
                                    "UNDETECTED"
                                  }
                                  onChange={handleInputChangeBasic}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />{" "}
                                Undetected
                              </label>
                            </div>
                          </FormGroup>
                        </div>
                        {basicInfo.hepatitisBTest.hbvDna === "DETECTED" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hvbDnaValue">
                                Input HBV DNA value <ImportantString str="*" />{" "}
                              </Label>
                              <input
                                className="form-control"
                                type="text"
                                name="hvbDnaValue"
                                id="hvbDnaValue"
                                value={basicInfo.hepatitisBTest.hvbDnaValue}
                                onChange={handleInputChangeBasic}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {errors.hvbDnaValue && (
                                <span className={classes.error}>
                                  {errors.hvbDnaValue}
                                </span>
                              )}
                            </FormGroup>
                          </div>
                        )}

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbsAgQuantification">
                              HBsAG Quantification (IU/ml){" "}
                              <ImportantString str="*" />{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              name="hbsAgQuantification"
                              id="hbsAgQuantification"
                              value={
                                basicInfo.hepatitisBTest.hbsAgQuantification
                              }
                              onChange={handleInputChangeBasic}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hbsAgQuantification && (
                              <span className={classes.error}>
                                {errors.hbsAgQuantification}
                              </span>
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbeAG">HbeAG</Label>{" "}
                            <ImportantString str="*" />{" "}
                            <select
                              className="form-control"
                              name="hbeAG"
                              id="hbeAG"
                              onChange={handleInputChangeBasic}
                              value={basicInfo.hepatitisBTest.hbeAG}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <GetOptions
                                options={[
                                  { fldName: "Select", fldValue: "" },
                                  { fldName: "Reactive", fldValue: "REACTIVE" },
                                  {
                                    fldName: "Non Reactive",
                                    fldValue: "NON REACTIVE",
                                  },
                                  { fldName: "Not Done", fldValue: "NOT DONE" },
                                ]}
                              />
                            </select>
                            {errors.hbeAG && (
                              <span className={classes.error}>
                                {errors.hbeAG}
                              </span>
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="antiHDV">Anti-HDV</Label>
                            <ImportantString str="*" />{" "}
                            <select
                              className="form-control"
                              name="antiHDV"
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
                              <option value={"NON REACTIVE"}>
                                Non Reactive
                              </option>
                              <option value={"NOT DONE"}>Not Done</option>
                            </select>
                            {errors.antiHDV && (
                              <span className={classes.error}>
                                {errors.antiHDV}
                              </span>
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="treatmentEligible">
                              Treatment Eligible
                            </Label>
                            <ImportantString str="*" />{" "}
                            <select
                              className="form-control"
                              name="treatmentEligible"
                              id="treatmentEligible"
                              onChange={handleInputChangeBasic}
                              value={basicInfo.hepatitisBTest.treatmentEligible}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <YesOrNoSelectInput />
                            </select>
                            {errors.treatmentEligible && (
                              <span className={classes.error}>
                                {errors.treatmentEligible}
                              </span>
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="pmtctEligible">PMTCT Eligible</Label>
                            <ImportantString str="*" />{" "}
                            <select
                              className="form-control"
                              name="pmtctEligible"
                              id="pmtctEligible"
                              onChange={handleInputChangeBasic}
                              value={basicInfo.hepatitisBTest.pmtctEligible}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <YesOrNoSelectInput />
                            </select>
                            {errors.pmtctEligible && (
                              <span className={classes.error}>
                                {errors.pmtctEligible}
                              </span>
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4-12">
                          <FormGroup>
                            <Label for="comment">Comment</Label>
                            <ImportantString str="*" />{" "}
                            <textarea
                              className="form-control"
                              name="comment"
                              id="comment"
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
                            {errors.comment && (
                              <span className={classes.error}>
                                {errors.comment}
                              </span>
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
                        <div className="form-group mb-2 col-md-4">
                          <FormGroup>
                            <Label>
                              HCV RNA(UI/ml){" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                            <div className="radio">
                              <label>
                                <input
                                  type="radio"
                                  value="DETECTED"
                                  name="hcvRNA"
                                  checked={
                                    basicInfo.hepatitisCTest.hcvRNA ===
                                    "DETECTED"
                                  }
                                  onChange={handleInputChangeBasicForHC}
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
                                  name="hcvRNA"
                                  checked={
                                    basicInfo.hepatitisCTest.hcvRNA ===
                                    "UNDETECTED"
                                  }
                                  onChange={handleInputChangeBasicForHC}
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
                        {basicInfo.hepatitisCTest.hcvRNA === "DETECTED" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hcRnaValue">
                                Input HCV RNA Value (IU/ml){" "}
                                <ImportantString str="*" />{" "}
                              </Label>
                              <ImportantString str="*" />{" "}
                              <input
                                className="form-control"
                                type="text"
                                name="hcRnaValue"
                                id="hcRnaValue"
                                value={basicInfo.hepatitisCTest.hcRnaValue}
                                onChange={handleInputChangeBasicForHC}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                            </FormGroup>
                          </div>
                        )}

                        {/* <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hepatitisCoinfection">
                              Hepatitis Coinfection
                            </Label>
                            <ImportantString str="*" />{" "}
                            <select
                              className="form-control"
                              name="hepatitisCoinfection"
                              id="hepatitisCoinfection"
                              multiple
                              onChange={handleInputChangeBasicForHC}
                              value={
                                basicInfo.hepatitisCTest.hepatitisCoinfection
                              }
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <GetOptions
                                options={[
                                  { fldName: "Select", fldValue: "" },
                                  { fldName: "HBV/HCV", fldValue: "HBV_HCV" },
                                  { fldName: "HBV/HIV", fldValue: "HBV_HIV" },
                                  { fldName: "HCV/HIV", fldValue: "HCV_HIV" },
                                  { fldName: "HBV/HDV", fldValue: "HBV_HDV" },
                                  {
                                    fldName: "HBV/HCD/HIV",
                                    fldValue: "HBV_HCD_HIV",
                                  },
                                ]}
                              />
                            </select>
                            {errors.hepatitisCoinfection && (
                              <span className={classes.error}>
                                {errors.hepatitisCoinfection}
                              </span>
                            )}
                          </FormGroup>
                        </div> */}

                        <div className="form-group mb-3 col-md-4">
                          <Label for="hepatitisCoinfection">
                            Hepatitis Coinfection
                          </Label>
                          <br />
                          <Label>
                            <input
                              // className="form-control"
                              type="checkbox"
                              name="hepatitisCoinfection"
                              value="HBV_HCV"
                              onChange={handleCheckboxChange}
                              checked={selectedOptions.includes("HBV_HCV")}
                            />
                            HBV/HCV
                          </Label>
                          <br />
                          <Label>
                            <input
                              // className="form-control"
                              name="hepatitisCoinfection"
                              type="checkbox"
                              value="HBV_HIV"
                              onChange={handleCheckboxChange}
                              checked={selectedOptions.includes("HBV_HIV")}
                            />
                            HBV/HIV
                          </Label>
                          <br />
                          <Label>
                            <input
                              // className="form-control"
                              type="checkbox"
                              name="hepatitisCoinfection"
                              value="HCV_HIV"
                              onChange={handleCheckboxChange}
                              checked={selectedOptions.includes("HCV_HIV")}
                            />
                            HCV/HIV
                          </Label>
                          <br />
                          <Label>
                            <input
                              // className="form-control"
                              type="checkbox"
                              value="HBV_HDV"
                              name="hepatitisCoinfection"
                              onChange={handleCheckboxChange}
                              checked={selectedOptions.includes("HBV_HDV")}
                            />
                            HBV/HDV
                          </Label>
                          <br />
                          <Label>
                            <input
                              // className="form-control"
                              type="checkbox"
                              value="HBV_HCD_HIV"
                              name="hepatitisCoinfection"
                              onChange={handleCheckboxChange}
                              checked={selectedOptions.includes("HBV_HCD_HIV")}
                            />
                            HBV/HCD/HIV
                          </Label>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="commobidities">
                              Commobidities <ImportantString str="*" />{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              name="commobidities"
                              id="commobidities"
                              value={basicInfo.hepatitisCTest.commobidities}
                              onChange={handleInputChangeBasicForHC}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.commobidities && (
                              <span className={classes.error}>
                                {errors.commobidities}
                              </span>
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="multipleInfection">
                              Specify multiple infection{" "}
                              <ImportantString str="*" />{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              name="multipleInfection"
                              id="multipleInfection"
                              value={basicInfo.hepatitisCTest.multipleInfection}
                              onChange={handleInputChangeBasicForHC}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.multipleInfection && (
                              <span className={classes.error}>
                                {errors.multipleInfection}
                              </span>
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
                      <ImportantString str="*" />{" "}
                      <select
                        className="form-control"
                        name="ast"
                        id="ast"
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.ast}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <YesOrNoSelectInput />
                      </select>
                      {errors.ast && (
                        <span className={classes.error}>{errors.ast}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="alt">ALT (IU/ml)</Label>
                      <ImportantString str="*" />{" "}
                      <select
                        className="form-control"
                        name="alt"
                        id="alt"
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.alt}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <YesOrNoSelectInput />
                      </select>
                      {errors.alt && (
                        <span className={classes.error}>{errors.alt}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="pst">PST (mm3)</Label>
                      <ImportantString str="*" />{" "}
                      <select
                        className="form-control"
                        name="pst"
                        id="pst"
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.pst}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <YesOrNoSelectInput />
                      </select>
                      {errors.pst && (
                        <span className={classes.error}>{errors.pst}</span>
                      )}
                    </FormGroup>
                  </div>
                </div>
                <div className="row">
                  {basicInfo.ast === "YES" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="astValue">
                          Input AST value <ImportantString str="*" />{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="astValue"
                          id="astValue"
                          value={basicInfo.clinicalParameters.astValue}
                          onChange={handleInputChangeBasicForClinic}
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
                          Input ALT value <ImportantString str="*" />{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="altValue"
                          id="altValue"
                          value={basicInfo.clinicalParameters.altValue}
                          onChange={handleInputChangeBasicForClinic}
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
                          Input PST value <ImportantString str="*" />{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="pstValue"
                          id="pstValue"
                          value={basicInfo.clinicalParameters.pstValue}
                          onChange={handleInputChangeBasicForClinic}
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
                        Total Bilirubin (μmol/L) <ImportantString str="*" />{" "}
                      </Label>
                      <input
                        className="form-control"
                        type="text"
                        name="totalBiliRubin"
                        id="totalBiliRubin"
                        value={basicInfo.clinicalParameters.totalBiliRubin}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.totalBiliRubin && (
                        <span className={classes.error}>
                          {errors.totalBiliRubin}
                        </span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="directBiliribin">
                        Direct Bilirubin (μmol/L)
                      </Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="directBiliribin"
                        id="directBiliribin"
                        value={basicInfo.clinicalParameters.directBiliribin}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.directBiliribin && (
                        <span className={classes.error}>
                          {errors.directBiliribin}
                        </span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="albumin">Albumin (g/dl)</Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="albumin"
                        id="albumin"
                        value={basicInfo.hepatitisBTest.albumin}
                        onChange={handleInputChangeBasic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.albumin && (
                        <span className={classes.error}>{errors.albumin}</span>
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="apriScore">APRI score </Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="apriScore"
                        id="apriScore"
                        value={basicInfo.clinicalParameters.apriScore}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.apriScore && (
                        <span className={classes.error}>
                          {errors.apriScore}
                        </span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="fib4">FIB-4</Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="fib4"
                        id="fib4"
                        value={basicInfo.clinicalParameters.fib4}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.fib4 && (
                        <span className={classes.error}>{errors.fib4}</span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="prothrombinTimeNR">
                        Prothrombin time/INR
                      </Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="prothrombinTimeNR"
                        id="prothrombinTimeNR"
                        value={basicInfo.clinicalParameters.prothrombinTimeNR}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.prothrombinTimeNR && (
                        <span className={classes.error}>
                          {errors.prothrombinTimeNR}
                        </span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="urea">Urea (mg/dl)</Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="urea"
                        id="urea"
                        value={basicInfo.clinicalParameters.urea}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.urea && (
                        <span className={classes.error}>{errors.urea}</span>
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="creatinine">Creatinine (μmol/L)</Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="creatinine"
                        id="creatinine"
                        value={basicInfo.clinicalParameters.creatinine}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.creatinine && (
                        <span className={classes.error}>
                          {errors.creatinine}
                        </span>
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ultrasoundScan">
                        Ultrasound scan (μmol/L)
                      </Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="ultrasoundScan"
                        id="ultrasoundScan"
                        value={basicInfo.clinicalParameters.ultrasoundScan}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.ultrasoundScan && (
                        <span className={classes.error}>
                          {errors.ultrasoundScan}
                        </span>
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="creatinine">AFP (ng/ml)</Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="afp"
                        id="afp"
                        value={basicInfo.clinicalParameters.afp}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.afp && (
                        <span className={classes.error}>{errors.afp}</span>
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="fibroscan">Fibroscan (Kpa)</Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="fibroscan"
                        id="fibroscan"
                        value={basicInfo.clinicalParameters.fibroscan}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.fibroscan && (
                        <span className={classes.error}>
                          {errors.fibroscan}
                        </span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ctScan">CT scan</Label>
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="text"
                        name="ctScan"
                        id="ctScan"
                        value={basicInfo.hepatitisBTest.ctScan}
                        onChange={handleInputChangeBasic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.ctScan && (
                        <span className={classes.error}>{errors.ctScan}</span>
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ascites">Ascites</Label>
                      <ImportantString str="*" />{" "}
                      <select
                        className="form-control"
                        name="ascites"
                        id="ascites"
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.ascites}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <YesOrNoSelectInput />
                      </select>
                      {errors.ascites && (
                        <span className={classes.error}>{errors.ascites}</span>
                      )}
                    </FormGroup>
                  </div>

                  {basicInfo.clinicalParameters.ascites === "YES" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="severityOfAscites">
                          Severity of ascites
                        </Label>
                        <ImportantString str="*" />{" "}
                        <select
                          className="form-control"
                          name="severityOfAscites"
                          id="severityOfAscites"
                          onChange={handleInputChangeBasicForClinic}
                          value={basicInfo.clinicalParameters.severityOfAscites}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <GetOptions
                            options={[
                              { fldName: "Select", fldValue: "" },
                              { fldName: "Mild", fldValue: "MILD" },
                              { fldName: "Moderate", fldValue: "MODERATE" },
                              {
                                fldName: "Massive/Gross",
                                fldValue: "MASSIVE_OR_GROSS",
                              },
                            ]}
                          />
                        </select>
                      </FormGroup>
                    </div>
                  )}

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ascitesLevel">Grade of Encephalopathy</Label>
                      <ImportantString str="*" />{" "}
                      <select
                        className="form-control"
                        name="gradeOfEncephalopathy"
                        id="gradeOfEncephalopathy"
                        onChange={handleInputChangeBasicForClinic}
                        value={
                          basicInfo.clinicalParameters.gradeOfEncephalopathy
                        }
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <GetOptions
                          options={[
                            { fldName: 0, fldValue: 0 },
                            { fldName: 1, fldValue: 1 },
                            { fldName: 2, fldValue: 2 },
                            { fldName: 3, fldValue: 3 },
                            { fldName: 4, fldValue: 4 },
                            { fldName: 5, fldValue: 5 },
                          ]}
                        />
                      </select>
                      {errors.gradeOfEncephalopathy && (
                        <span className={classes.error}>
                          {errors.gradeOfEncephalopathy}
                        </span>
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="childPughScore">Child pugh score</Label>
                      <ImportantString str="*" />{" "}
                      <select
                        className="form-control"
                        type="text"
                        name="childPughScore"
                        id="childPughScore"
                        value={basicInfo.clinicalParameters.childPughScore}
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option>Select</option>

                        {childPughData?.map((item) => (
                          <option key={item?.code} value={item?.code}>
                            {item?.display}
                          </option>
                        ))}
                      </select>
                      {errors.childPughScore && (
                        <span className={classes.error}>
                          {errors.childPughScore}
                        </span>
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
                      <ImportantString str="*" />{" "}
                      <input
                        className="form-control"
                        type="date"
                        name="stagingDateOfLiverBiopsy"
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        id="stagingDateOfLiverBiopsy"
                        value={
                          basicInfo.hepatitisBTest.stagingDateOfLiverBiopsy
                        }
                        onChange={handleInputChangeBasic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.stagingDateOfLiverBiopsy && (
                        <span className={classes.error}>
                          {errors.stagingDateOfLiverBiopsy}
                        </span>
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="diagnosis_result">Diagnosis</Label>
                      <ImportantString str="*" />{" "}
                      <select
                        className="form-control"
                        name="diagnosis_result"
                        id="diagnosis_result"
                        onChange={handleInputChangeBasicForClinic}
                        value={basicInfo.clinicalParameters.diagnosis_result}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <GetOptions
                          options={[
                            { fldName: "Select", fldValue: "" },
                            { fldName: "Fibrosis", fldValue: "FIBROSIS" },
                            { fldName: "Cirrhosis", fldValue: "CIRRHOSIS" },
                            { fldName: "No Fibrosis", fldValue: "NO_FIBROSIS" },
                            { fldName: "HCC", fldValue: "HIGH_CC" },
                          ]}
                        />
                      </select>
                      {errors.diagnosis_result && (
                        <span className={classes.error}>
                          {errors.diagnosis_result}
                        </span>
                      )}
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>{" "}
            {false ? <Spinner /> : ""}
            <br />
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
                <span style={{ textTransform: "capitalize" }}>Save</span>
              </MatButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardForm2;
