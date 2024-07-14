import React, { useEffect, useState } from "react";
import MatButton from "@material-ui/core/Button";
import { FormGroup, Label, Spinner } from "reactstrap";
import moment from "moment";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import { useValidateForm2ValuesHook } from "../../../formSchemas/form1ValidationSchema";
import { Collapse, IconButton } from "@material-ui/core";
import { ArrowForward, ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getCookie, setCookie } from "../../../helpers/cookieStoragehelpers";
import axios from "axios";
import { url as baseUrl, token } from "../../../../api";
import { toast } from "react-toastify";
import {
  GetOptions,
  ImportantString,
  YesOrNoSelectInput,
} from "./DashboardForm2";
import { isNotInTheFutureOrBeforeBirth } from "../../../helpers/dateValidators";
import { useQuery } from "react-query";
import { fetchEnrolment } from "../../../services/fetchEnrolment";
import { FETCH_ENROLMENT_KEY } from "../../../utils/queryKeys";
import { isNumeric } from "validator";
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

export const GetHepatitisCoinfectionCheckBoxValues = ({
  val,
  onChangeHandler,
  checked,
  label,
  placeholder,
  id,
  action,
}) => {
  return (
    <div>
      <input
        disabled={action === "view"}
        type="checkbox"
        value={val}
        onChange={onChangeHandler}
        checked={checked}
      />
      <Label>
        <span className="p-2">{label}</span>{" "}
      </Label>
      <span>
        <input
          disabled={action === "view"}
          className="form-control"
          type="text"
          name={id}
          id={id}
          placeholder={placeholder}
          style={{
            border: "1px solid #014D88",
            borderRadius: "0.2rem",
          }}
        />
      </span>
    </div>
  );
};
export const GetClinicalParamsCheckBoxValues = ({
  val,
  onChangeHandler,
  checked,
  label,
  placeholder,
  id,
}) => {
  return (
    <div>
      <input
        type="checkbox"
        value={val}
        onChange={onChangeHandler}
        checked={checked}
      />
      <Label>
        <span className="p-2">{label}</span>{" "}
      </Label>
      <span>
        <input
          className="form-control"
          type="text"
          name={id}
          id={id}
          placeholder={placeholder}
          style={{
            border: "1px solid #014D88",
            borderRadius: "0.2rem",
          }}
        />
      </span>
    </div>
  );
};

export const fetchHBsAG = async () => {
  return await axios.get(`${baseUrl}application-codesets/v2/HBsAg_RESULT`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const HepatitisCoinfection = ({
  title,
  checkName,
  placeholder,
  handleCheckboxChange,
  basicInfo,
  handleCoinfectionsInputValue,
  action,
}) => {
  return (
    <div className="form-group my-2 col-md-4">
      <input
        type="checkbox"
        disabled={action === "view"}
        name={checkName}
        checked={
          basicInfo.hepatitisBTest.hepatitisCoinfection &&
          !!basicInfo.hepatitisBTest.hepatitisCoinfection[checkName]
        }
        onChange={handleCheckboxChange}
      />
      <Label>
        <span className="p-2">{title}</span>{" "}
      </Label>
      {basicInfo.hepatitisBTest.hepatitisCoinfection &&
      basicInfo.hepatitisBTest.hepatitisCoinfection[checkName] &&
      basicInfo.hepatitisBTest.hepatitisCoinfection[checkName] >= -1 ? (
        <span style={{ fontSize: "1.2em" }}>
          <ImportantString str="*" />
          <input
            onChange={(e) => handleCoinfectionsInputValue(e)}
            className="form-control"
            type="text"
            name={checkName}
            value={
              basicInfo.hepatitisBTest.hepatitisCoinfection[checkName] &&
              Math.sign(
                basicInfo.hepatitisBTest.hepatitisCoinfection[checkName]
              ) === 1
                ? basicInfo.hepatitisBTest.hepatitisCoinfection[checkName]
                : ""
            }
            id={checkName}
            placeholder={placeholder}
            style={{
              border: "1px solid #014D88",
              borderRadius: "0.2rem",
            }}
          />
        </span>
      ) : null}
    </div>
  );
};
export const CheckOptionsParams = ({
  title,
  checkName,
  placeholder,
  handleCheckboxChange,
  handleClinicalParamsInputValue,
  basicInfo,
  action,
}) => {
  return (
    <div className="form-group my-3 col-md-4">
      <input
        type="checkbox"
        disabled={action === "view"}
        name={checkName}
        checked={
          basicInfo.hepatitisCTest.selectedClinicalParamsOptions &&
          !!basicInfo.hepatitisCTest.selectedClinicalParamsOptions[checkName]
        }
        onChange={handleCheckboxChange}
      />
      <Label>
        <span className="p-2">{title}</span>{" "}
      </Label>
      {basicInfo.hepatitisCTest.selectedClinicalParamsOptions &&
      basicInfo.hepatitisCTest.selectedClinicalParamsOptions[checkName] &&
      basicInfo.hepatitisCTest.selectedClinicalParamsOptions[checkName] >=
        -1 ? (
        <span style={{ fontSize: "1.2em" }}>
          <ImportantString str="*" />
          <input
            onChange={(e) => handleClinicalParamsInputValue(e)}
            className="form-control"
            type="text"
            name={checkName}
            value={
              basicInfo.hepatitisCTest.selectedClinicalParamsOptions[
                checkName
              ] &&
              Math.sign(
                basicInfo.hepatitisCTest.selectedClinicalParamsOptions[
                  checkName
                ]
              ) === 1
                ? basicInfo.hepatitisCTest.selectedClinicalParamsOptions[
                  checkName
                ]
                : ""
            }
            id={checkName}
            placeholder={placeholder}
            style={{
              border: "1px solid #014D88",
              borderRadius: "0.2rem",
            }}
          />
        </span>
      ) : null}
    </div>
  );
};
const ViralHepatitisForm2 = ({
  submit,
  setStep,
  action,
  patientObj,
  id,
  setActiveContent,
}) => {
  const [enrollmentUuid, setEnrollmentUuid] = useState(
    getCookie("enrollmentIds")?.enrollmentUuid
  );
  const [basicInfo, setBasicInfo] = useState({
    clinicalParameters: {
      apriScore: "",
      ascites: "",
      childPughScore: "",
      creatinine: "",
      diagnosis_result: "",
      directBiliribin: "",
      fib4: "",
      fibroscan: "",
      gradeOfEncephalopathy: "",
      liverBiopsyStage: "",
      prothrombinTimeNR: "",
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
      dateHbvDnaTestRequested: "",
      dateHbvSampleRequested: "",
      dateHbvTestRequested: "",
      hbeAG: "",
      hepatitisCoinfection: {
        hbvHcv: undefined,
        hbvHiv: undefined,
        hcvHiv: undefined,
        hbvHdv: undefined,
        hbvHcdHiv: undefined,
      },
      dateHbvDnaResultReported: "",
      hbsAgQuantification: "",
      hbvDna: "DETECTED",
      hvbDnaValue: "",
      pmtctEligible: "",
      stagingDateOfLiverBiopsy: "",
      treatmentEligible: "",
    },
    hepatitisCTest: {
      selectedClinicalParamsOptions: {
        ast: undefined,
        plt: undefined,
        alt: undefined,
      },
      commobidities: "",
      hcRnaValue: "",
      hcvRNA: "DETECTED",
      multipleInfection: "",
    },
  });
  const [childPughData, setChildPughData] = useState([]);
  const [errors, setErrors] = useState({});

  const handleCoinfectionsCheckbox = (event) => {
    basicInfo.hepatitisBTest.hepatitisCoinfection &&
      setBasicInfo({
        ...basicInfo,
        hepatitisBTest: {
          ...basicInfo.hepatitisBTest,
          hepatitisCoinfection: {
            ...basicInfo.hepatitisBTest.hepatitisCoinfection,
            [event.target.name]: !basicInfo.hepatitisBTest.hepatitisCoinfection[
              event.target.name
            ]
              ? -1
              : undefined,
          },
        },
      });
  };
  const handleClinicalParamsCheckbox = (event) => {
    basicInfo.hepatitisCTest.selectedClinicalParamsOptions &&
      setBasicInfo({
        ...basicInfo,
        hepatitisCTest: {
          ...basicInfo.hepatitisCTest,
          selectedClinicalParamsOptions: {
            ...basicInfo.hepatitisCTest.selectedClinicalParamsOptions,
            [event.target.name]: !basicInfo.hepatitisCTest
              .selectedClinicalParamsOptions[event.target.name]
              ? -1
              : undefined,
          },
        },
      });
  };
  const handleClinicalParamsInputValue = (event) => {
    setBasicInfo({
      ...basicInfo,
      hepatitisCTest: {
        ...basicInfo.hepatitisCTest,
        selectedClinicalParamsOptions: {
          ...basicInfo.hepatitisCTest.selectedClinicalParamsOptions,
          [event.target.name]: event.target.value,
        },
      },
    });
  };
  useEffect(()=>{
    console.log("clinical params: ", basicInfo.hepatitisCTest.selectedClinicalParamsOptions)
  })
  const handleCoinfectionsInputValue = (event) => {
    setBasicInfo({
      ...basicInfo,
      hepatitisBTest: {
        ...basicInfo.hepatitisBTest,
        hepatitisCoinfection: {
          ...basicInfo.hepatitisBTest.hepatitisCoinfection,
          [event.target.name]: event.target.value,
        },
      },
    });
  };
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
    setBasicInfo((prev) => ({
      ...prev,
      clinicalParameters: {
        ...prev.clinicalParameters,
        [e.target.name]: e.target.value,
      },
    }));
  };

  let temp = { ...errors };
  const validate = () => {
    temp.dateHbvDnaTestRequested =
      basicInfo.hepatitisBTest.dateHbvDnaTestRequested &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisBTest.dateHbvDnaTestRequested,
        patientObj?.dateOfBirth
      )
        ? ""
        : "Date HBV DNA test requested is invalid";
    temp.dateHbvSampleRequested =
      basicInfo.hepatitisBTest.dateHbvSampleRequested &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisBTest.dateHbvSampleRequested,
        patientObj?.dateOfBirth
      )
        ? ""
        : "Date HBV Sample requested invalid";

    temp.dateHbvDnaResultReported =
      basicInfo.hepatitisBTest.dateHbvDnaResultReported &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisBTest.dateHbvDnaResultReported,
        patientObj?.dateOfBirth
      )
        ? ""
        : "Date of HBV DNA result reported is invalid";

    temp.hbsAgQuantification =
      basicInfo.hepatitisBTest?.hbsAgQuantification &&
      isNumeric(basicInfo.hepatitisBTest?.hbsAgQuantification.toString())
        ? ""
        : "HBsAG Quantification is invalid";

    temp.hbeAG = basicInfo.hepatitisBTest.hbeAG ? "" : "HbeAG is required";

    temp.antiHDV = basicInfo.hepatitisBTest.antiHDV
      ? ""
      : "Anti-HDV is required";

    temp.treatmentEligible =
      basicInfo.hepatitisBTest.treatmentEligible ||
      basicInfo.hepatitisBTest.hbvDna === "UNDETECTED" ||
      basicInfo.hepatitisBTest.hbeAG === "NON_REACTIVE" ||
      basicInfo.hepatitisBTest.antiHDV === "NON_REACTIVE"
        ? ""
        : " Treatment Eligible is required";
    temp.hcvRnaValue =
      basicInfo.hepatitisCTest.hcRnaValue &&
      isNumeric(basicInfo.hepatitisCTest.hcRnaValue.toString())
        ? ""
        : "HCV RNA is invalid";
    temp.hvbDnaValue =
      basicInfo.hepatitisBTest.hvbDnaValue &&
      isNumeric(basicInfo.hepatitisBTest.hvbDnaValue.toString())
        ? ""
        : "HVB DNA is invalid";

    temp.totalBiliRubin =
      basicInfo.clinicalParameters.totalBiliRubin &&
      isNumeric(basicInfo.clinicalParameters.totalBiliRubin.toString())
        ? ""
        : " ALT is invalid";
    temp.directBiliribin =
      basicInfo.clinicalParameters.directBiliribin &&
      isNumeric(basicInfo.clinicalParameters.directBiliribin.toString())
        ? ""
        : "Direct Bilirubin is invalid";

    temp.albumin =
      basicInfo.hepatitisBTest.albumin &&
      isNumeric(basicInfo.hepatitisBTest.albumin.toString())
        ? ""
        : "Albumin is invalid";

    temp.prothrombinTimeNR =
      basicInfo.clinicalParameters.prothrombinTimeNR &&
      isNumeric(basicInfo.clinicalParameters.prothrombinTimeNR.toString())
        ? ""
        : "Prothrombin time/INR is invalid";

    temp.urea =
      basicInfo.clinicalParameters.urea &&
      isNumeric(basicInfo.clinicalParameters.urea.toString())
        ? ""
        : "Urea is invalid";

    temp.creatinine =
      basicInfo.clinicalParameters.creatinine &&
      isNumeric(basicInfo.clinicalParameters.creatinine.toString())
        ? ""
        : "Creatinine is invalid";

    temp.ultrasoundScan =
      basicInfo.clinicalParameters.ultrasoundScan &&
      isNumeric(basicInfo.clinicalParameters.ultrasoundScan.toString())
        ? ""
        : "Ultrasound scan is invalid";
    temp.fibroscan =
      basicInfo.clinicalParameters.fibroscan &&
      isNumeric(basicInfo.clinicalParameters.fibroscan.toString())
        ? ""
        : "Fibroscan  is invalid";

    temp.ctScan = basicInfo.hepatitisBTest.ctScan ? "" : "CT scan  is required";
    temp.ascites = basicInfo.clinicalParameters.ascites
      ? ""
      : "Ascites  is required";
    temp.gradeOfEncephalopathy = basicInfo.clinicalParameters
      .gradeOfEncephalopathy
      ? ""
      : "Grade of Encephalopathy  is invalid";

    temp.childPughScore = basicInfo.clinicalParameters.childPughScore
      ? ""
      : "Child pugh score is required";

    temp.liverBiopsyStage = basicInfo.clinicalParameters.liverBiopsyStage
      ? ""
      : "Liver biopsy stage  is required";

    temp.stagingDateOfLiverBiopsy =
      basicInfo.clinicalParameters.liverBiopsyStage === "NOT_DONE"
        ? ""
        : basicInfo.clinicalParameters.liverBiopsyStage !== "NOT_DONE" &&
          basicInfo.hepatitisBTest.stagingDateOfLiverBiopsy &&
          isNotInTheFutureOrBeforeBirth(
            basicInfo.hepatitisBTest.stagingDateOfLiverBiopsy,
            patientObj?.dateOfBirth
          )
        ? ""
        : "Staging date of liver biopsy is required";

    temp.diagnosis_result = basicInfo.clinicalParameters.liverBiopsyStage
      ? ""
      : "Diagnosis is required";

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
      if (setActiveContent) {
        setActiveContent((prev) => ({ ...prev, route: "recent-history" }));
      }
      if (setStep) {
        setStep(2);
      }
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
  const transformDate = (dateObj) => {
    const isoDate = new Date(
      `${dateObj?.year}, ${dateObj?.monthValue}, ${dateObj?.dayOfMonth}`
    );
    return moment(isoDate).format("YYYY-MM-DD");
  };
  const onSubmitHandler = (values) => {
    window.scrollTo(0, 0);
    const restructuredDiagnosisPayload = {
      enrollmentUuid,
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
        clinicalParameters: values.clinicalParametersOptions,
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

  useQuery(
    [FETCH_ENROLMENT_KEY, patientObj?.personUuid],
    () => fetchEnrolment(patientObj?.personUuid),
    {
      onSuccess: ({ uuid }) => {
        const actualUuid = uuid || getCookie("enrollmentIds")?.enrollmentUuid;
        setEnrollmentUuid(actualUuid);
      },
    }
  );

  const moveBack = () => {
    window.scrollTo(0, 0);
    setStep(0);
  };
  const classes = useStyles();
  const { formik } = useValidateForm2ValuesHook(onSubmitHandler);

  const viewHepatitisDiagnosis = (eId) => {
    axios
      .get(`${baseUrl}hepatitis/view-hepatitis-diagnosis-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const dataCopy = JSON.parse(JSON.stringify(data));
        dataCopy.hepatitisBTest.dateHbvDnaResultReported = transformDate(
          dataCopy.hepatitisBTest.dateHbvDnaResultReported
        );
        dataCopy.hepatitisBTest.dateHbvDnaTestRequested = transformDate(
          dataCopy.hepatitisBTest.dateHbvDnaTestRequested
        );
        dataCopy.hepatitisBTest.dateHbvSampleRequested = transformDate(
          dataCopy.hepatitisBTest.dateHbvSampleRequested
        );
        dataCopy.hepatitisBTest.dateHbvTestRequested = transformDate(
          dataCopy.hepatitisBTest.dateHbvTestRequested
        );
        dataCopy.hepatitisBTest.stagingDateOfLiverBiopsy = transformDate(
          dataCopy.hepatitisBTest.stagingDateOfLiverBiopsy
        );
        setBasicInfo(dataCopy);
      })
      .catch((error) => console.log(error));
  };
  const calulateApriScore = () =>
    basicInfo.hepatitisCTest.selectedClinicalParamsOptions?.ast === -1
      ? ""
      : parseInt(
          (basicInfo.hepatitisCTest.selectedClinicalParamsOptions?.ast /
            basicInfo.hepatitisCTest.selectedClinicalParamsOptions?.plt) *
            100
        );

  const calulateFib4 = () =>
    basicInfo.hepatitisCTest.selectedClinicalParamsOptions?.ast === -1
      ? ""
      : parseInt(
          (patientObj?.age *
            basicInfo.hepatitisCTest.selectedClinicalParamsOptions?.ast) /
            (basicInfo.hepatitisCTest.selectedClinicalParamsOptions?.plt *
              basicInfo.hepatitisCTest.selectedClinicalParamsOptions?.alt)
        );

  useEffect(() => {
    fetchChildPughScore();
  }, []);

  useEffect(() => {
    setBasicInfo({
      ...basicInfo,
      enrollmentUuid,
    });
  }, [enrollmentUuid]);

  const [isDropdownsOpen, setIsDropdownsOpen] = useState({
    hepatitisBDropdown: true,
    hepatitisCDropdown: true,
    coInfectionDropdown: true,
  });

  useEffect(() => {
    if (basicInfo.hepatitisBTest.hbvDna === "UNDETECTED") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisBTest: { ...prev.hepatitisBTest, hvbDnaValue: "" },
      }));
    }
  }, [basicInfo.hepatitisBTest.hbvDna]);
  useEffect(() => {
    if (basicInfo.hepatitisBTest.hbvDna === "UNDETECTED") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisBTest: { ...prev.hepatitisBTest, hbsAgQuantification: "" },
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
  useEffect(() => {
    if (basicInfo.hepatitisCTest.commobidities === "NO") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisCTest: { ...prev.hepatitisCTest, multipleInfection: "" },
      }));
    }
  }, [basicInfo.hepatitisCTest.commobidities]);
  useEffect(() => {
    viewHepatitisDiagnosis();
  }, []);
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
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              disabled={action === "view"}
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
                            <Label for="dateHbvSampleRequested">
                              Date HBV DNA sample collected{" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              disabled={action === "view"}
                              name="dateHbvSampleRequested"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              min={
                                basicInfo.hepatitisBTest.dateHbvDnaTestRequested
                              }
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
                              disabled={action === "view"}
                              name="dateHbvDnaResultReported"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              min={
                                basicInfo.hepatitisBTest.dateHbvSampleRequested
                              }
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
                                  value="DETECTED"
                                  disabled={action === "view"}
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
                                  disabled={action === "view"}
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
                                disabled={action === "view"}
                                className="form-control"
                                type="number"
                                name="hvbDnaValue"
                                id="hvbDnaValue"
                                value={basicInfo.hepatitisBTest.hvbDnaValue}
                                onChange={handleInputChangeBasic}
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
                        {basicInfo.hepatitisBTest.hbvDna === "DETECTED" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hbsAgQuantification">
                                HBsAG Quantification (IU/ml){" "}
                                <span style={{ color: "red" }}> *</span>{" "}
                              </Label>
                              <input
                                className="form-control"
                                type="number"
                                disabled={action === "view"}
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
                              {errors.hbsAgQuantification !== "" ? (
                                <span className={classes.error}>
                                  {errors.hbsAgQuantification}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>
                        )}

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbeAG">HbeAG</Label>{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="hbeAG"
                              id="hbeAG"
                              disabled={action === "view"}
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
                              id="antiHDV"
                              disabled={action === "view"}
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
                        {basicInfo.hepatitisBTest.hbvDna === "UNDETECTED" &&
                        basicInfo.hepatitisBTest.hbeAG === "NON_REACTIVE" &&
                        basicInfo.hepatitisBTest.antiHDV ===
                          "NON_REACTIVE" ? null : (
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
                                disabled={action === "view"}
                                onChange={handleInputChangeBasic}
                                value={
                                  basicInfo.hepatitisBTest.treatmentEligible
                                }
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
                        )}

                        {patientObj?.sex?.toLowerCase() === "female" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="pmtctEligible">PMTCT Eligible</Label>
                              <span style={{ color: "red" }}> *</span>{" "}
                              <select
                                disabled={action === "view"}
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
                                <option value={""}>Select</option>
                                <option value={"YES"}>Yes</option>
                                <option value={"NO"}>No</option>
                              </select>
                            </FormGroup>
                          </div>
                        )}

                        <div className="form-group mb-3 col-md-4-12">
                          <FormGroup>
                            <Label for="comment">Comment</Label>
                            <textarea
                              className="form-control"
                              name="comment"
                              id="comment"
                              disabled={action === "view"}
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
                                  disabled={action === "view"}
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
                                  disabled={action === "view"}
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
                                <span style={{ color: "red" }}> *</span>{" "}
                              </Label>
                              <input
                                className="form-control"
                                type="number"
                                name="hcRnaValue"
                                disabled={action === "view"}
                                id="hcRnaValue"
                                value={basicInfo.hepatitisCTest.hcRnaValue}
                                onChange={handleInputChangeBasicForHC}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                            </FormGroup>
                            {errors.hcvRnaValue !== "" ? (
                              <span className={classes.error}>
                                {errors.hcvRnaValue}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                        <div className="form-group mb-3 col-md-12">
                          <div className="row">
                            <Label for="hepatitisCoinfection">
                              Hepatitis Coinfection
                            </Label>
                            <br />

                            {[
                              {
                                title: "HBV/HCV (IU/ml)",
                                checkName: "hbvHcv",
                                placeholder: "hbv/hcv...",
                                checkValue: "HBV_HCV",
                                actualValue: "HBV_HCV_VALUE",
                              },
                              {
                                title: "HBV/HIV (IU/ml)",
                                checkName: "hbvHiv",
                                placeholder: "hbv/hiv...",
                                checkValue: "HBV_HIV",
                                actualValue: "HBV_HIV_VALUE",
                              },
                              {
                                title: "HCV/HIV (IU/ml)",
                                checkName: "hcvHiv",
                                placeholder: "hcv/hiv...",
                                checkValue: "HCV_HIV",
                                actualValue: "HCV_HIV_VALUE",
                              },
                              {
                                title: "HBV/HDV (IU/ml)",
                                checkName: "hbvHdv",
                                placeholder: "hbv/hdv...",
                                checkValue: "HBV_HDV",
                                actualValue: "HBV_HDV_VALUE",
                              },
                              {
                                title: "HBV/HCD/HIV (IU/ml)",
                                checkName: "hbvHcdHiv",
                                placeholder: "hbv/hcd/Hiv...",
                                checkValue: "HBV_HCD_HIV",
                                actualValue: "HBV_HCD_HIV_VALUE",
                              },
                            ].map(
                              ({
                                title,
                                checkName,
                                placeholder,
                                actualValue,
                                checkValue,
                              }) => (
                                <HepatitisCoinfection
                                  key={title}
                                  title={title}
                                  checkName={checkName}
                                  placeholder={placeholder}
                                  actualValue={actualValue}
                                  checkValue={checkValue}
                                  basicInfo={basicInfo}
                                  action={action}
                                  handleCoinfectionsInputValue={
                                    handleCoinfectionsInputValue
                                  }
                                  handleCheckboxChange={
                                    handleCoinfectionsCheckbox
                                  }
                                />
                              )
                            )}
                          </div>
                          {errors.hepatitisCoinfection !== "" ? (
                            <span className={classes.error}>
                              {errors.hepatitisCoinfection}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="pmtctEligible">Commobidities</Label>
                            <select
                              className="form-control"
                              name="commobidities"
                              disabled={action === "view"}
                              id="commobidities"
                              onChange={handleInputChangeBasicForHC}
                              value={basicInfo.hepatitisCTest.commobidities}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <YesOrNoSelectInput />
                            </select>
                          </FormGroup>
                        </div>

                        {basicInfo.hepatitisCTest.commobidities === "YES" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="multipleInfection">
                                Specify multiple infection{" "}
                                <span style={{ color: "red" }}> *</span>{" "}
                              </Label>
                              <input
                                disabled={action === "view"}
                                className="form-control"
                                type="text"
                                name="multipleInfection"
                                id="multipleInfection"
                                value={
                                  basicInfo.hepatitisCTest.multipleInfection
                                }
                                onChange={handleInputChangeBasicForHC}
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
                        )}
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
                  {[
                    {
                      title: "AST (IU/ml)",
                      checkName: "ast",
                      placeholder: "Ast...",
                      checkValue: "AST",
                    },
                    {
                      title: "PLT (mm3)",
                      checkName: "plt",
                      placeholder: "Plt...",
                      checkValue: "PST",
                    },
                    {
                      title: "ALT (IU/ml)",
                      checkName: "alt",
                      placeholder: "alt...",
                      checkValue: "ALT",
                    },
                  ].map(
                    ({
                      title,
                      checkName,
                      placeholder,
                      actualValue,
                      checkValue,
                    }) => (
                      <CheckOptionsParams
                        key={title}
                        title={title}
                        checkName={checkName}
                        placeholder={placeholder}
                        actualValue={actualValue}
                        basicInfo={basicInfo}
                        checkValue={checkValue}
                        action={action}
                        handleClinicalParamsInputValue={
                          handleClinicalParamsInputValue
                        }
                        handleCheckboxChange={handleClinicalParamsCheckbox}
                      />
                    )
                  )}
                  {errors.hepatitisClinicalParams !== "" ? (
                    <span className={classes.error}>
                      {errors.hepatitisClinicalParams}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="row">
                  {basicInfo.ast === "YES" && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="astValue">
                          {" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          disabled={action === "view"}
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
                          Input ALT value{" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="number"
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
                          Input PLT value{" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          disabled={action === "view"}
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
                        Total Bilirubin (μmol/L){" "}
                        <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <input
                        disabled={action === "view"}
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
                        disabled={action === "view"}
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
                        disabled={action === "view"}
                        className="form-control"
                        type="number"
                        name="albumin"
                        id="albumin"
                        value={basicInfo.hepatitisBTest.albumin}
                        onChange={handleInputChangeBasic}
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
                        disabled={action === "view"}
                        className="form-control"
                        type="text"
                        name="apriScore"
                        id="apriScore"
                        value={
                          isNaN(calulateApriScore()) ||
                          Math.sign(calulateApriScore()) === -1
                            ? ""
                            : calulateApriScore()
                        }
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        readOnly
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="fib4">FIB-4</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        disabled={action === "view"}
                        className="form-control"
                        type="text"
                        name="fib4"
                        id="fib4"
                        value={
                          isNaN(calulateFib4()) ||
                          Math.sign(calulateFib4()) === -1
                            ? ""
                            : calulateFib4()
                        }
                        onChange={handleInputChangeBasicForClinic}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                        readOnly
                      />
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="prothrombinTimeNR">
                        Prothrombin time/INR
                      </Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <input
                        disabled={action === "view"}
                        className="form-control"
                        type="number"
                        name="prothrombinTimeNR"
                        id="prothrombinTimeNR"
                        value={basicInfo.clinicalParameters.prothrombinTimeNR}
                        onChange={handleInputChangeBasicForClinic}
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
                        disabled={action === "view"}
                        className="form-control"
                        type="number"
                        name="urea"
                        id="urea"
                        value={basicInfo.clinicalParameters.urea}
                        onChange={handleInputChangeBasicForClinic}
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
                        disabled={action === "view"}
                        className="form-control"
                        type="number"
                        name="creatinine"
                        id="creatinine"
                        value={basicInfo.clinicalParameters.creatinine}
                        onChange={handleInputChangeBasicForClinic}
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
                        disabled={action === "view"}
                        className="form-control"
                        type="number"
                        name="ultrasoundScan"
                        id="ultrasoundScan"
                        value={basicInfo.clinicalParameters.ultrasoundScan}
                        onChange={handleInputChangeBasicForClinic}
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
                        disabled={action === "view"}
                        className="form-control"
                        type="number"
                        name="afp"
                        id="afp"
                        value={basicInfo.clinicalParameters.afp}
                        onChange={handleInputChangeBasicForClinic}
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
                        disabled={action === "view"}
                        className="form-control"
                        type="number"
                        name="fibroscan"
                        id="fibroscan"
                        value={basicInfo.clinicalParameters.fibroscan}
                        onChange={handleInputChangeBasicForClinic}
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
                        disabled={action === "view"}
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
                        disabled={action === "view"}
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
                          disabled={action === "view"}
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
                          <option value={""}>Select</option>
                          <option value={"MILD"}>Mild</option>
                          <option value={"MODERATE"}>Moderate</option>
                          <option value={"MASSIVE_OR_GROSS"}>
                            Massive/Gross
                          </option>
                        </select>
                      </FormGroup>
                    </div>
                  )}

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="ascitesLevel">Grade of Encephalopathy</Label>
                      <span style={{ color: "red" }}> *</span>{" "}
                      <select
                        disabled={action === "view"}
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
                        <option value={""}>Select</option>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
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
                      <select
                        disabled={action === "view"}
                        className="form-control"
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
                        disabled={action === "view"}
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

                  {[
                    "NO_FIBROSIS",
                    "MILD_FIBROSIS",
                    "MODERATE_FIBROSIS",
                    "FIBROSIS",
                    "SEVERE_FIBROSIS",
                    "CIRRHOSIS",
                  ]?.includes(
                    basicInfo.clinicalParameters.liverBiopsyStage
                  ) && (
                    <>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="stagingDateOfLiverBiopsy">
                            Staging date of liver biopsy{" "}
                          </Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <input
                            disabled={action === "view"}
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
                            disabled={action === "view"}
                            className="form-control"
                            name="diagnosis_result"
                            id="diagnosis_result"
                            onChange={handleInputChangeBasicForClinic}
                            value={
                              basicInfo.clinicalParameters.diagnosis_result
                            }
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
                    </>
                  )}
                </div>
              </div>
            </div>
            {false ? <Spinner /> : ""}
            <br />
            {action === "view" ? null : (
              <div className="d-flex justify-content-between">
                <MatButton
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={moveBack}
                  className={classes.button}
                  startIcon={<ArrowBackIcon />}
                  style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
                >
                  <span style={{ textTransform: "capitalize" }}>Previous</span>
                </MatButton>
                <MatButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<ArrowForward />}
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
                >
                  <span style={{ textTransform: "capitalize" }}>
                    {submit ? "Submit" : "Next"}
                  </span>
                </MatButton>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ViralHepatitisForm2;
