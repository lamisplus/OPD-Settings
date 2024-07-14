import React, { useState, useEffect } from "react";
import MatButton from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Input, Form, InputGroup } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory, useLocation } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import { useValidateForm3ValuesHook } from "../../../formSchemas/form1ValidationSchema";
import { Collapse, IconButton } from "@material-ui/core";
import { ArrowForward, ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getCookie, setCookie } from "../../../helpers/cookieStoragehelpers";
import axios from "axios";
import { url as baseUrl, token } from "../../../../api";
import { toast } from "react-toastify";

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

const ViralHepatitisForm3 = ({ setStep, userStatus }) => {
  const [userId, setUserId] = useState(getCookie("enrollmentIds"));
  const history = useHistory();
  const [basicInfo, setBasicInfo] = useState({
    enrollmentUuid: userId?.enrollmentUuid,
    hepatitisBTreatment: {
      dateStarted: "",
      dateStopped: "",
      hbvPastTreatmentRegimen: "",
      hepatitisBRegimenSwitch: {
        adverseEffectReported: "",
        dateStarted: "",
        dateStopped: "",
        newRegime: "",
        reasonForSwitch: "",
      },
      historyOfAdverseEffect: "",
      newRegimen: "",
      reasonForHepatitisBTreatment: {
        comment: "",
        reasonsForTreatment: "",
      },
      treatmentExperience: "",
    },
    hepatitisCTreatment: {
      adverseEffectReported: "",
      dateCompleted: "",
      dateStarted: "",
      dateStopped: "",
      hbvPastTreatmentRegimen: "",
      hcvRetreatment: {
        dateStarted: "",
        dateStopped: "",
        hbvPastTreatmentRegimen: "",
        history_of_AdverseEffect: "",
        newRegimen: "",
        prescribedDuration: 0,
        retreatmentAdverseEffect: "",
      },
      hepatitisSvr12Testing: {
        dateTested: "",
        retreatmentDateTested: "",
        hcvRNA: "",
        hcvRNAValue: "",
        retreatmentHcvRNA: "",
        retreatmentHcvRNAValue: "",
      },
      pastTreatmentExperience: "",
      prescribedDuration: "",
      treatmentExperience: "",
    },
  });

  const [errors, setErrors] = useState({});
  // handle input changes
  const handleInputChangeBasicHB = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    setBasicInfo({
      ...basicInfo,
      hepatitisBTreatment: {
        ...basicInfo.hepatitisBTreatment,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleInputChangeBasicHBReason = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    if (e.target.name === "hbvReasonForTreatmentEligibility") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          reasonForHepatitisBTreatment: {
            ...basicInfo.hepatitisBTreatment.reasonForHepatitisBTreatment,
            reasonsForTreatment: e.target.value,
          },
        },
      });
    }

    if (e.target.name === "hbvReasonsForTreatmentComment") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          reasonForHepatitisBTreatment: {
            ...basicInfo.hepatitisBTreatment.reasonForHepatitisBTreatment,
            comment: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "treatmentExperienceB") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          treatmentExperience: e.target.value,
        },
      });
    }
  };

  const handleInputChangeBasicHBRegSwitch = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    if (e.target.name === "hbvRegimeSwitchNewRegimen") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          hepatitisBRegimenSwitch: {
            ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
            newRegime: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "hbvRegimeSwitchDateStarted") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          hepatitisBRegimenSwitch: {
            ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
            dateStarted: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "hbvRegimeSwitchDateStopped") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          hepatitisBRegimenSwitch: {
            ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
            dateStopped: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "hbvAdverseEffectReported") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          hepatitisBRegimenSwitch: {
            ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
            adverseEffectReported: e.target.value,
          },
        },
      });
    }

    if (e.target.name === "hbvRegimeSwitchReason") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          hepatitisBRegimenSwitch: {
            ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
            reasonForSwitch: e.target.value,
          },
        },
      });
    }
  };

  const handleInputChangeBasicHCGen = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    setBasicInfo({
      ...basicInfo,
      hepatitisCTreatment: {
        ...basicInfo.hepatitisCTreatment,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleInputChangeBasicHC = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    if (e.target.name === "hcvAdverseEventReported") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          adverseEffectReported: e.target.value,
        },
      });
    }
    if (e.target.name === "hcvTreatmentExperience") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          treatmentExperience: e.target.value,
        },
      });
    }
    if (e.target.name === "hcvDateStarted") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          dateStarted: e.target.value,
        },
      });
    }

    if (e.target.name === "hcvDateCompleted") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          dateCompleted: e.target.value,
        },
      });
    }

    if (e.target.name === "hcvDateStopped") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          dateStopped: e.target.value,
        },
      });
    }

    if (e.target.name === "hcvPrescribedDuration") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          prescribedDuration: e.target.value,
        },
      });
    }

    if (e.target.name === "hbvPastTreatmentRegimenForHcv") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hbvPastTreatmentRegimen: e.target.value,
        },
      });
    }
  };

  const handleInputChangeBasicHCSVR = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    if (e.target.name === "svr12TestingDateStarted") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            dateTested: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "svr12TestingHcvRna") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            hcvRNA: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "svr12TestingHcvRnaValue") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            hcvRNAValue: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "svr12RetreatmentDateTested") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            retreatmentDateTested: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "svr12RetreatmentHcvRna") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            retreatmentHcvRNA: e.target.value,
          },
        },
      });
    }

    if (e.target.name === "svr12RetreatmentHcvRnaValue") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            retreatmentHcvRNAValue: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "retreatmentDateTested") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            retreatmentDateTested: e.target.value,
          },
        },
      });
    }

    if (e.target.name === "retreatmentHcvRNAValue") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            retreatmentHcvRNAValue: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "retreatmentHcvRNA") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            retreatmentHcvRNA: e.target.value,
          },
        },
      });
    }
  };

  const handleInputChangeBasicHHCV = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    if (e.target.name === "hcvRetreatmentNewRegimen") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvRetreatment: {
            ...basicInfo.hepatitisCTreatment.hcvRetreatment,
            newRegimen: e.target.value,
          },
        },
      });
    }

    if (e.target.name === "hcvRetreatmentPrescribedDuration") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvRetreatment: {
            ...basicInfo.hepatitisCTreatment.hcvRetreatment,
            prescribedDuration: e.target.value,
          },
        },
      });
    }

    if (e.target.name === "hcvRetreatmentDateStarted") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvRetreatment: {
            ...basicInfo.hepatitisCTreatment.hcvRetreatment,
            dateStarted: e.target.value,
          },
        },
      });
    }

    if (e.target.name === "hcvRetreatmentDateStopped") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvRetreatment: {
            ...basicInfo.hepatitisCTreatment.hcvRetreatment,
            dateStopped: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "hcvRetreatmentAdverseEffect") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvRetreatment: {
            ...basicInfo.hepatitisCTreatment.hcvRetreatment,
            retreatmentAdverseEffect: e.target.value,
          },
        },
      });
    }
    if (e.target.name === "hcvRetreatmentHistoryOfAdverseEffect") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvRetreatment: {
            ...basicInfo.hepatitisCTreatment.hcvRetreatment,
            history_of_AdverseEffect: e.target.value,
          },
        },
      });
    }
  };

  let temp = { ...errors };
  const validate = () => {
    temp.treatmentExperienceB = basicInfo.hepatitisBTreatment
      .treatmentExperience
      ? ""
      : "Treatment experience is required";

    // temp.hbvRegimeSwitchNewRegimen = basicInfo.hepatitisBTreatment
    //   .hepatitisBRegimenSwitch.newRegime
    //   ? ""
    //   : "New Regimen is required";

    temp.hbvRegimeSwitchDateStarted = basicInfo.hepatitisBTreatment
      .hepatitisBRegimenSwitch.dateStarted
      ? ""
      : "Date Started is required";

    temp.hbvRegimeSwitchDateStarted =
      basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.newRegime === ""
        ? ""
        : basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.dateStarted
        ? ""
        : "Date Started is required";

    temp.hbvRegimeSwitchReason = basicInfo.hepatitisBTreatment
      .hepatitisBRegimenSwitch.reasonForSwitch
      ? ""
      : "Reason for switch is required";

    temp.hbvRegimeSwitchReason =
      basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.newRegime === ""
        ? ""
        : basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.reasonForSwitch
        ? ""
        : "Reason for switch is required";
    temp.hcvTreatmentExperience = basicInfo.hepatitisCTreatment
      .treatmentExperience
      ? ""
      : " Treatment experience is required";
    temp.hbvAdverseEffectReported = basicInfo.hepatitisBTreatment
      .hepatitisBRegimenSwitch.adverseEffectReported
      ? ""
      : "Adverse events is required";
    temp.hbvAdverseEffectReported =
      basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.newRegime === ""
        ? ""
        : basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch
            .adverseEffectReported
        ? ""
        : "Adverse events is required";
    temp.historyOfAdverseEffect = basicInfo.hepatitisBTreatment
      .historyOfAdverseEffect
      ? ""
      : "History ofAdverse events is required";

    temp.hbvPastTreatmentRegimen = basicInfo.hepatitisBTreatment
      .hbvPastTreatmentRegimen
      ? ""
      : "Hbv Past treatment regimen is required";
    temp.hbvPastTreatmentRegimen =
      basicInfo.hepatitisBTreatment.treatmentExperience !== "YES"
        ? ""
        : basicInfo.hepatitisBTreatment.hbvPastTreatmentRegimen
        ? ""
        : "Hbv Past treatment regimen is required";

    temp.hbvReasonForTreatmentEligibility = basicInfo.hepatitisBTreatment
      .reasonForHepatitisBTreatment.reasonsForTreatment
      ? ""
      : "Reason for Treatment is required";

    temp.hcvDateStarted = basicInfo.hepatitisCTreatment.dateStarted
      ? ""
      : "Date started is required";

    temp.hcvDateStarted =
      basicInfo.hepatitisCTreatment.treatmentExperience !== "YES"
        ? ""
        : basicInfo.hepatitisCTreatment.dateStarted
        ? ""
        : "Date started is required";
    temp.hcvDateCompleted = basicInfo.hepatitisCTreatment.dateCompleted
      ? ""
      : "Date completed is required";
    temp.hcvDateCompleted =
      basicInfo.hepatitisCTreatment.treatmentExperience !== "YES"
        ? ""
        : basicInfo.hepatitisCTreatment.dateCompleted
        ? ""
        : "Date completed is required";

    temp.hcvPrescribedDuration = basicInfo.hepatitisCTreatment
      .prescribedDuration
      ? ""
      : "Prescribed duration is required";
    temp.hcvPrescribedDuration =
      basicInfo.hepatitisCTreatment.treatmentExperience !== "YES"
        ? ""
        : basicInfo.hepatitisCTreatment.prescribedDuration
        ? ""
        : "Prescribed duration is required";

    temp.svr12TestingDateStarted = basicInfo.hepatitisCTreatment
      .hepatitisSvr12Testing.dateTested
      ? ""
      : "Date tested is required";

    temp.svr12TestingHcvRna = basicInfo.hepatitisCTreatment
      .hepatitisSvr12Testing.hcvRNA
      ? ""
      : "HCV RNA is required";

    temp.svr12RetreatmentDateTested = basicInfo.hepatitisCTreatment
      .hepatitisSvr12Testing.retreatmentDateTested
      ? ""
      : "Retreatment date tested is required";

    temp.svr12RetreatmentHcvRna = basicInfo.hepatitisCTreatment
      .hepatitisSvr12Testing.retreatmentDateTested
      ? ""
      : " Retreatment HCV RNA is required";

    temp.svr12RetreatmentHcvRna = basicInfo.hepatitisCTreatment
      .hepatitisSvr12Testing.retreatmentHcvRNA
      ? ""
      : " Retreatment HCV RNA  is required";

    temp.hcvRetreatmentNewRegimen = basicInfo.hepatitisCTreatment.hcvRetreatment
      .newRegimen
      ? ""
      : "  New regimen is required";

    temp.hcvRetreatmentPrescribedDuration = basicInfo.hepatitisCTreatment
      .hcvRetreatment.prescribedDuration
      ? ""
      : "Prescribed Duration is required";

    temp.hcvRetreatmentDateStarted = basicInfo.hepatitisCTreatment
      .hcvRetreatment.dateStarted
      ? ""
      : "Date started is required";

    temp.hcvRetreatmentAdverseEffect = basicInfo.hepatitisCTreatment
      .hcvRetreatment.retreatmentAdverseEffect
      ? ""
      : " Retreatment Adverse events is required";

    temp.hcvRetreatmentHistoryOfAdverseEffect = basicInfo.hepatitisCTreatment
      .hcvRetreatment.history_of_AdverseEffect
      ? ""
      : " History of adverse events is required";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // validating the input
    window.scrollTo(0, 0);

    if (validate()) {
      postDataWithToken(basicInfo, "hepatitis/treatment");
    }
  };
  const onSubmitHandler = (values) => {
    setCookie("hepatitis3", values, 1);
    const enrollmentIds = getCookie("enrollmentIds");
    const restructuredTreatmentPayload = {
      enrollmentUuid: enrollmentIds?.enrollmentUuid,
      hepatitisBTreatment: {
        dateStarted: formatDate(values.hbvDateStarted),
        dateStopped: formatDate(values.hbvDateStopped),
        hbvPastTreatmentRegimen: values.hbvPastTreatmentRegimen,
        hepatitisBRegimenSwitch: {
          adverseEffectReported: values.hbvAdverseEffectReported,
          dateStarted: formatDate(values.hbvRegimeSwitchDateStarted),
          dateStopped: formatDate(values.hbvRegimeSwitchDateStopped),
          newRegime: values.hbvRegimeSwitchNewRegimen,
          reasonForSwitch: values.hbvRegimeSwitchReason,
        },
        historyOfAdverseEffect: values.hbvHistoryOfAdverseEffect,
        newRegimen: values.hbvNewRegimen,
        reasonForHepatitisBTreatment: {
          comment: values.hbvReasonsForTreatmentComment,
          reasonsForTreatment: values.hbvReasonForTreatmentEligibility,
        },
        treatmentExperience: values.hbvTreatmentExperience,
      },
      hepatitisCTreatment: {
        adverseEffectReported: values.hcvAdverseEventReported,
        dateCompleted: formatDate(values.hcvDateCompleted),
        dateStarted: formatDate(values.hcvDateStarted),
        dateStopped: formatDate(values.hcvDateStopped),
        hbvPastTreatmentRegimen: values.hbvPastTreatmentRegimenForHcv,
        hcvRetreatment: {
          dateStarted: formatDate(values.hcvRetreatmentDateStarted),
          dateStopped: formatDate(values.hcvRetreatmentDateStopped),
          hbvPastTreatmentRegimen: values.hbvPastTreatmentRegimenForHcv,
          history_of_AdverseEffect: values.hcvRetreatmentHistoryOfAdverseEffect,
          newRegimen: values.hcvRetreatmentNewRegimen,
          hcvRetreatmentHcvGenotype: values.hcvRetreatmentHcvGenotype,
          prescribedDuration: values.hcvRetreatmentPrescribedDuration,
          retreatmentAdverseEffect: values.hcvRetreatmentAdverseEffect,
        },
        hepatitisSvr12Testing: {
          dateTested: formatDate(values.svr12TestingDateStarted),
          hcvRNA: values.svr12TestingHcvRna,
          hcvRNAValue: values.svr12TestingHcvRnaValue,
          retreatmentDateTested: formatDate(values.svr12RetreatmentDateTested),
          retreatmentHcvRNA: values.retreatmentHcvRNA,
          retreatmentHcvRNAValue: values.retreatmentHcvRNAValue,
        },
        // pastTreatmentExperience: "string",
        prescribedDuration: values.hcvRetreatmentPrescribedDuration,
        treatmentExperience: values.hcvTreatmentExperience,
      },
    };

    setCookie("heaptitis3PayloadValue", restructuredTreatmentPayload, 1);
    postDataWithToken(restructuredTreatmentPayload, "hepatitis/treatment");
  };

  const moveBack = () => {
    window.scrollTo(0, 0);
    setStep(1);
  };

  const classes = useStyles();
  const { formik } = useValidateForm3ValuesHook(onSubmitHandler);

  const castCookieValueToForm = () => {
    const cookieValue = getCookie("hepatitis3");
    if (cookieValue) {
      formik.setValues(cookieValue);
    }
  };

  const postDataWithToken = async (data, key) => {
    try {
      const response = await axios.post(`${baseUrl}${key}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // Handle the response if needed
      toast.success("Treatment submitted successfully");
      deleteCookie("heaptitis3PayloadValue");
      deleteCookie("hepatitis3");
      deleteCookie("enrollmentIds");
      deleteCookie("hepatitis2");
      deleteCookie("heaptitis2PayloadValue");
      deleteCookie("hepatitis1");
      deleteCookie("heaptitis1PayloadValue");

      if (userStatus === "new") {
        setStep(0);
      } else {
        history.push("/");
      }
      return response.data;
    } catch (error) {
      // Handle any errors that occurred during the request
      toast.error("Treatment failed");
      console.error("Error posting data:", error.message);
      throw error;
    }
  };

  function deleteCookie(name) {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  function formatDate(inputDate) {
    // Split the input date string into an array
    var dateArray = inputDate.split("-");

    // Check if the input date is in the correct format (yyyy-mm-dd)
    if (dateArray.length !== 3) {
      return "Invalid date format";
    }

    // Extract the year, month, and day from the array
    var year = dateArray[0];
    var month = dateArray[1];
    var day = dateArray[2];

    // Create a new date string in the "dd-mm-yyyy" format
    var newDateFormat = day + "-" + month + "-" + year;

    return newDateFormat;
  }
  useEffect(() => {
    castCookieValueToForm();
  }, []);

  const [isDropdownsOpen, setIsDropdownsOpen] = useState({
    hbvTreatmentRegimenSwitch: true,
    hbvTreatmentReasonforTreatment: true,
    hcvTreatmentRegimenSwitch: true,
    hcvTreatmentRegimenHcvRetreatment: true,
    hcvTreatmentSvr12Testing: true,
    hcvRetreatmentSvr12Testing: true,
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
                  Hepatitis B Treatment
                </h5>
              </div>
              <div>
                <div className="card-body">
                  <div
                    className="basic-form"
                    style={{ padding: "0 50px 0 50px" }}
                  >
                    <div className="row">
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hbvTreatmentExperience">
                            Treatment experience
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <select
                            className="form-control"
                            name="treatmentExperienceB"
                            id="treatmentExperience"
                            value={
                              basicInfo.hepatitisBTreatment.treatmentExperience
                            }
                            onChange={handleInputChangeBasicHBReason}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            <option value={"YES"}>Yes</option>
                            <option value={"NO"}>No</option>
                          </select>
                          {errors.treatmentExperienceB !== "" ? (
                            <span className={classes.error}>
                              {errors.treatmentExperienceB}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      {basicInfo.hepatitisBTreatment.treatmentExperience ===
                        "YES" && (
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvPastTreatmentRegimen">
                              Hbv Past treatment regimen
                            </Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <input
                              className="form-control"
                              type="text"
                              name="hbvPastTreatmentRegimen"
                              id="hbvPastTreatmentRegimen"
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hbvPastTreatmentRegimen
                              }
                              onChange={handleInputChangeBasicHB}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hbvPastTreatmentRegimen !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvPastTreatmentRegimen}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      )}
                      {/* {basicInfo.hbvTreatmentExperience && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hbvPastTreatmentRegimen">
                                Past treatment regime
                                <span style={{ color: "red" }}> *</span>{" "}
                              </Label>
                              <input
                                className="form-control"
                                type="text"
                                name="hbvPastTreatmentRegimen"
                                id="hbvPastTreatmentRegimen"
                                value={basicInfo.hbvPastTreatmentRegimen}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {formik.errors.hbvPastTreatmentRegimen !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.hbvPastTreatmentRegimen}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>
                        )} */}
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hbvNewRegimen">New regimen</Label>
                          {/* <span style={{ color: "red" }}> *</span>{" "} */}
                          <input
                            className="form-control"
                            type="text"
                            name="newRegimen"
                            id="newRegimen"
                            value={basicInfo.hepatitisBTreatment.newRegimen}
                            onChange={handleInputChangeBasicHB}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {/* {errors.newRegimen !== "" ? (
                            <span className={classes.error}>
                              {errors.newRegimen}
                            </span>
                          ) : (
                            ""
                          )} */}
                        </FormGroup>
                      </div>

                      {basicInfo.hepatitisBTreatment.newRegimen !== "" && (
                        <>
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hbvDateStarted">Date started</Label>
                              <span style={{ color: "red" }}> *</span>{" "}
                              <input
                                className="form-control"
                                type="date"
                                name="dateStarted"
                                id="dateStarted"
                                max={moment(new Date()).format("YYYY-MM-DD")}
                                value={
                                  basicInfo.hepatitisBTreatment.dateStarted
                                }
                                onChange={handleInputChangeBasicHB}
                                // onBlur={formik.handleBlur}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {/* {errors.dateStarted !== "" ? (
                                <span className={classes.error}>
                                  {errors.dateStarted}
                                </span>
                              ) : (
                                ""
                              )} */}
                            </FormGroup>
                          </div>
                        </>
                      )}

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hbvHistoryOfAdverseEffect">
                            History of adverse events
                          </Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <select
                            className="form-control"
                            name="historyOfAdverseEffect"
                            id="historyOfAdverseEffect"
                            value={
                              basicInfo.hepatitisBTreatment
                                .historyOfAdverseEffect
                            }
                            onChange={handleInputChangeBasicHB}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            <option value={"YES"}>Yes</option>
                            <option value={"NO"}>No</option>
                          </select>
                          {errors.historyOfAdverseEffect !== "" ? (
                            <span className={classes.error}>
                              {errors.historyOfAdverseEffect}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    </div>
                  </div>
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
                    Regimen Switch
                  </p>
                  <IconButton
                    onClick={() =>
                      setIsDropdownsOpen((prevState) => {
                        return {
                          ...prevState,
                          hbvTreatmentRegimenSwitch:
                            !prevState.hbvTreatmentRegimenSwitch,
                        };
                      })
                    }
                    aria-expanded={isDropdownsOpen.hbvTreatmentRegimenSwitch}
                    aria-label="Expand"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>
                <div className="card-body">
                  <Collapse in={isDropdownsOpen.hbvTreatmentRegimenSwitch}>
                    <div
                      className="basic-form"
                      style={{ padding: "0 50px 0 50px" }}
                    >
                      <div className="row">
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvRegimeSwitchNewRegimen">
                              New Regimen
                              {/* <span style={{ color: "red" }}> *</span>{" "} */}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              name="hbvRegimeSwitchNewRegimen"
                              id="hbvRegimeSwitchNewRegimen"
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hepatitisBRegimenSwitch.newRegime
                              }
                              onChange={handleInputChangeBasicHBRegSwitch}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {/* {errors.hbvRegimeSwitchNewRegimen !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvRegimeSwitchNewRegimen}
                              </span>
                            ) : (
                              ""
                            )} */}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvRegimeSwitchDateStarted">
                              Date Started{" "}
                              {basicInfo.hepatitisBTreatment
                                .hepatitisBRegimenSwitch.newRegime !== "" && (
                                <span style={{ color: "red" }}> *</span>
                              )}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              name="hbvRegimeSwitchDateStarted"
                              id="hbvRegimeSwitchDateStarted"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hepatitisBRegimenSwitch.dateStarted
                              }
                              onChange={handleInputChangeBasicHBRegSwitch}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hbvRegimeSwitchDateStarted !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvRegimeSwitchDateStarted}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvAdverseEffectReported">
                              Adverse events reported{" "}
                            </Label>{" "}
                            <select
                              className="form-control"
                              name="hbvAdverseEffectReported"
                              id="hbvAdverseEffectReported"
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hepatitisBRegimenSwitch.adverseEffectReported
                              }
                              onChange={handleInputChangeBasicHBRegSwitch}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              <option value={"YES"}>Yes</option>
                              <option value={"NO"}>No</option>
                            </select>
                            {errors.hbvAdverseEffectReported !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvAdverseEffectReported}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvRegimeSwitchReason">
                              Reason for switch
                              {basicInfo.hepatitisBTreatment
                                .hepatitisBRegimenSwitch.newRegime !== "" && (
                                <span style={{ color: "red" }}> *</span>
                              )}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              name="hbvRegimeSwitchReason"
                              id="hbvRegimeSwitchReason"
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hepatitisBRegimenSwitch.reasonForSwitch
                              }
                              onChange={handleInputChangeBasicHBRegSwitch}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hbvRegimeSwitchReason !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvRegimeSwitchReason}
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
                    Reason for treatment
                  </p>
                  <IconButton
                    onClick={() =>
                      setIsDropdownsOpen((prevState) => {
                        return {
                          ...prevState,
                          hbvTreatmentReasonforTreatment:
                            !prevState.hbvTreatmentReasonforTreatment,
                        };
                      })
                    }
                    aria-expanded={isDropdownsOpen.hbvTreatmentRegimenSwitch}
                    aria-label="Expand"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>
                <div className="card-body">
                  <Collapse in={isDropdownsOpen.hbvTreatmentReasonforTreatment}>
                    <div
                      className="basic-form"
                      style={{ padding: "0 50px 0 50px" }}
                    >
                      <div className="row">
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="hbvReasonForTreatmentEligibility">
                              Reasons for treatment
                            </Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="hbvReasonForTreatmentEligibility"
                              id="hbvReasonForTreatmentEligibility"
                              onChange={handleInputChangeBasicHBReason}
                              value={
                                basicInfo.hepatitisBTreatment
                                  .reasonForHepatitisBTreatment
                                  .reasonsForTreatment
                              }
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value={""}>Select</option>

                              <option value={"treatment eligible"}>
                                Treatment Eligible
                              </option>
                              <option value={"hbv pmtct"}>HBV PMTCT</option>
                            </select>
                            {errors.hbvReasonForTreatmentEligibility !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvReasonForTreatmentEligibility}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="hbvReasonsForTreatmentComment">
                              Comment
                            </Label>
                            {/* <span style={{ color: "red" }}> *</span>{" "} */}
                            <textarea
                              className="form-control"
                              name="hbvReasonsForTreatmentComment"
                              id="hbvReasonsForTreatmentComment"
                              onChange={handleInputChangeBasicHBReason}
                              value={
                                basicInfo.hepatitisBTreatment
                                  .reasonForHepatitisBTreatment.comment
                              }
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                                height: "80px",
                              }}
                            />
                            {/* {errors.hbvReasonsForTreatmentComment !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvReasonsForTreatmentComment}
                              </span>
                            ) : (
                              ""
                            )} */}
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
                  Hepatitis C Treatment
                </h5>
              </div>

              <div>
                <div className="card-body">
                  <div
                    className="basic-form"
                    style={{ padding: "0 50px 0 50px" }}
                  >
                    <div className="row">
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hcvTreatmentExperience">
                            Treatment experience
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <select
                            className="form-control"
                            type="date"
                            name="hcvTreatmentExperience"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            id="hcvTreatmentExperience"
                            value={
                              basicInfo.hepatitisCTreatment.treatmentExperience
                            }
                            onChange={handleInputChangeBasicHC}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            <option value={"YES"}>Yes</option>
                            <option value={"NO"}>No</option>
                          </select>
                          {errors.hcvTreatmentExperience !== "" ? (
                            <span className={classes.error}>
                              {errors.hcvTreatmentExperience}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      {basicInfo.hepatitisCTreatment.treatmentExperience ===
                        "YES" && (
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvPastTreatmentRegimen">
                              HBV Past treatment regimen
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              name="pastTreatmentExperience"
                              id="pastTreatmentExperience"
                              value={
                                basicInfo.hepatitisCTreatment
                                  .pastTreatmentExperience
                              }
                              onChange={handleInputChangeBasicHCGen}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.pastTreatmentExperience !== "" ? (
                              <span className={classes.error}>
                                {errors.pastTreatmentExperience}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      )}

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hcvDateStarted">Date started</Label>
                          {basicInfo.hepatitisCTreatment.treatmentExperience ===
                            "YES" && <span style={{ color: "red" }}> *</span>}
                          <input
                            className="form-control"
                            type="date"
                            name="hcvDateStarted"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            id="hcvDateStarted"
                            value={basicInfo.hepatitisCTreatment.dateStarted}
                            onChange={handleInputChangeBasicHC}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.hcvDateStarted !== "" ? (
                            <span className={classes.error}>
                              {errors.hcvDateStarted}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hcvDateCompleted">Date completed</Label>
                          {basicInfo.hepatitisCTreatment.treatmentExperience ===
                            "YES" && (
                            <span style={{ color: "red" }}> *</span>
                          )}{" "}
                          <input
                            className="form-control"
                            type="date"
                            name="hcvDateCompleted"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            id="hcvDateCompleted"
                            value={basicInfo.hepatitisCTreatment.dateCompleted}
                            onChange={handleInputChangeBasicHC}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.hcvDateCompleted !== "" ? (
                            <span className={classes.error}>
                              {errors.hcvDateCompleted}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hcvPrescribedDuration">
                            Prescribed duration
                          </Label>
                          {basicInfo.hepatitisCTreatment.treatmentExperience ===
                            "YES" && (
                            <span style={{ color: "red" }}> *</span>
                          )}{" "}
                          <select
                            className="form-control"
                            name="hcvPrescribedDuration"
                            id="hcvPrescribedDuration"
                            value={
                              basicInfo.hepatitisCTreatment.prescribedDuration
                            }
                            onChange={handleInputChangeBasicHC}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={0}>Select</option>
                            <option value={8}>8 weeks</option>
                            <option value={12}>12 weeks</option>
                            <option value={24}>24 weeks</option>
                          </select>
                          {errors.hcvPrescribedDuration !== "" ? (
                            <span className={classes.error}>
                              {errors.hcvPrescribedDuration}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hbvPastTreatmentRegimenForHcv">
                            HBV past treatment regimen
                          </Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <select
                            type="text"
                            className="form-control"
                            name="hbvPastTreatmentRegimenForHcv"
                            id="hbvPastTreatmentRegimenForHcv"
                            value={
                              basicInfo.hepatitisCTreatment
                                .hbvPastTreatmentRegimen
                            }
                            onChange={handleInputChangeBasicHC}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}>Select</option>
                            <option value={"YES"}>Yes</option>
                            <option value={"NO"}>No</option>
                          </select>
                          {errors.treatmentExperienceB !== "" ? (
                            <span className={classes.error}>
                              {errors.treatmentExperienceB}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hcvAdverseEventReported">
                            Adverse events reported
                          </Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <select
                            className="form-control"
                            name="hcvAdverseEventReported"
                            id="hcvAdverseEventReported"
                            value={
                              basicInfo.hepatitisCTreatment
                                .adverseEffectReported
                            }
                            onChange={handleInputChangeBasicHC}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                          </select>
                        </FormGroup>
                      </div>
                    </div>
                  </div>
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
                    SVR 12 Testing
                  </p>
                  <IconButton
                    onClick={() =>
                      setIsDropdownsOpen((prevState) => {
                        return {
                          ...prevState,
                          hcvTreatmentSvr12Testing:
                            !prevState.hcvTreatmentSvr12Testing,
                        };
                      })
                    }
                    aria-expanded={isDropdownsOpen.hcvTreatmentSvr12Testing}
                    aria-label="Expand"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>
                <div className="card-body">
                  <Collapse in={isDropdownsOpen.hcvTreatmentSvr12Testing}>
                    <div
                      className="basic-form"
                      style={{ padding: "0 50px 0 50px" }}
                    >
                      <div className="row">
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="svr12TestingDateStarted">
                              Date tested
                            </Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <input
                              className="form-control"
                              name="svr12TestingDateStarted"
                              id="svr12TestingDateStarted"
                              type="date"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              value={
                                basicInfo.hepatitisCTreatment
                                  .hepatitisSvr12Testing.dateTested
                              }
                              onChange={handleInputChangeBasicHCSVR}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.svr12TestingDateStarted !== "" ? (
                              <span className={classes.error}>
                                {errors.svr12TestingDateStarted}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="svr12TestingHcvRna">
                              HCV RNA(IU/ml)
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <select
                              className="form-control"
                              name="svr12TestingHcvRna"
                              id="svr12TestingHcvRna"
                              value={
                                basicInfo.hepatitisCTreatment
                                  .hepatitisSvr12Testing.hcvRNA
                              }
                              onChange={handleInputChangeBasicHCSVR}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              <option value="DETECTED">Detected</option>
                              <option value="UNDETECTED">Undetected</option>
                            </select>
                            {errors.svr12TestingHcvRna !== "" ? (
                              <span className={classes.error}>
                                {errors.svr12TestingHcvRna}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        {basicInfo.hepatitisCTreatment.hepatitisSvr12Testing
                          .hcvRNA === "DETECTED" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="svr12TestingHcvRnaValue">
                                Input HCV RNA value (IU/ml)
                              </Label>
                              <input
                                className="form-control"
                                name="svr12TestingHcvRnaValue"
                                id="svr12TestingHcvRnaValue"
                                type="text"
                                value={
                                  basicInfo.hepatitisCTreatment
                                    .hepatitisSvr12Testing.hcvRNAValue
                                }
                                onChange={handleInputChangeBasicHCSVR}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                            </FormGroup>
                          </div>
                        )}
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
                    Retreatment SVR 12
                  </p>
                  <IconButton
                    onClick={() =>
                      setIsDropdownsOpen((prevState) => {
                        return {
                          ...prevState,
                          hcvRetreatmentSvr12Testing:
                            !prevState.hcvRetreatmentSvr12Testing,
                        };
                      })
                    }
                    aria-expanded={isDropdownsOpen.hcvRetreatmentSvr12Testing}
                    aria-label="Expand"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>
                <div className="card-body">
                  <Collapse in={isDropdownsOpen.hcvRetreatmentSvr12Testing}>
                    <div
                      className="basic-form"
                      style={{ padding: "0 50px 0 50px" }}
                    >
                      <div className="row">
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="retreatmentDateTested">
                              Date tested
                            </Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <input
                              className="form-control"
                              name="retreatmentDateTested"
                              id="retreatmentDateTested"
                              type="date"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              value={
                                basicInfo.hepatitisCTreatment
                                  .hepatitisSvr12Testing.retreatmentDateTested
                              }
                              onChange={handleInputChangeBasicHCSVR}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.retreatmentDateTested !== "" ? (
                              <span className={classes.error}>
                                {errors.retreatmentDateTested}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="retreatmentHcvRNA">
                              HCV RNA (IU/ml){" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <select
                              className="form-control"
                              name="retreatmentHcvRNA"
                              id="retreatmentHcvRNA"
                              value={
                                basicInfo.hepatitisCTreatment
                                  .hepatitisSvr12Testing.retreatmentHcvRNA
                              }
                              onChange={handleInputChangeBasicHCSVR}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              <option value="DETECTED">Detected</option>
                              <option value="UNDETECTED">Undetected</option>
                            </select>
                            {errors.retreatmentHcvRNA !== "" ? (
                              <span className={classes.error}>
                                {errors.retreatmentHcvRNA}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        {basicInfo.hepatitisCTreatment.hepatitisSvr12Testing
                          .retreatmentHcvRNA === "DETECTED" && (
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="retreatmentHcvRNAValue">
                                Input HCV RNA value (IU/ml)
                              </Label>
                              <input
                                className="form-control"
                                name="retreatmentHcvRNAValue"
                                id="retreatmentHcvRNAValue"
                                type="text"
                                value={
                                  basicInfo.hepatitisCTreatment
                                    .hepatitisSvr12Testing
                                    .retreatmentHcvRNAValue
                                }
                                onChange={handleInputChangeBasicHCSVR}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                            </FormGroup>
                          </div>
                        )}
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
                    HCV Retreatment
                  </p>
                  <IconButton
                    onClick={() =>
                      setIsDropdownsOpen((prevState) => {
                        return {
                          ...prevState,
                          hcvTreatmentRegimenHcvRetreatment:
                            !prevState.hcvTreatmentRegimenHcvRetreatment,
                        };
                      })
                    }
                    aria-expanded={
                      isDropdownsOpen.hcvTreatmentRegimenHcvRetreatment
                    }
                    aria-label="Expand"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>
                <div className="card-body">
                  <Collapse
                    in={isDropdownsOpen.hcvTreatmentRegimenHcvRetreatment}
                  >
                    <div
                      className="basic-form"
                      style={{ padding: "0 50px 0 50px" }}
                    >
                      <div className="row">
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hcvRetreatmentNewRegimen">
                              New regimen
                            </Label>
                            <span style={{ color: "red" }}> *</span>
                            <input
                              className="form-control"
                              name="hcvRetreatmentNewRegimen"
                              id="hcvRetreatmentNewRegimen"
                              type="text"
                              value={
                                basicInfo.hepatitisCTreatment.hcvRetreatment
                                  .newRegimen
                              }
                              onChange={handleInputChangeBasicHHCV}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hcvRetreatmentNewRegimen !== "" ? (
                              <span className={classes.error}>
                                {errors.hcvRetreatmentNewRegimen}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hcvRetreatmentPrescribedDuration">
                              Prescribed Duration
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <select
                              className="form-control"
                              name="hcvRetreatmentPrescribedDuration"
                              id="hcvRetreatmentPrescribedDuration"
                              value={
                                basicInfo.hepatitisCTreatment.hcvRetreatment
                                  .prescribedDuration
                              }
                              onChange={handleInputChangeBasicHHCV}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value={0}>Select</option>
                              <option value={8}>8 weeks</option>
                              <option value={12}>12 weeks</option>
                              <option value={24}>24 weeks</option>
                            </select>
                            {errors.hcvRetreatmentPrescribedDuration !== "" ? (
                              <span className={classes.error}>
                                {errors.hcvRetreatmentPrescribedDuration}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hcvRetreatmentDateStarted">
                              Date started
                            </Label>
                            <span style={{ color: "red" }}> *</span>
                            <input
                              className="form-control"
                              name="hcvRetreatmentDateStarted"
                              id="hcvRetreatmentDateStarted"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              type="date"
                              value={
                                basicInfo.hepatitisCTreatment.hcvRetreatment
                                  .dateStarted
                              }
                              onChange={handleInputChangeBasicHHCV}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />

                            {errors.hcvRetreatmentDateStarted !== "" ? (
                              <span className={classes.error}>
                                {errors.hcvRetreatmentDateStarted}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hcvRetreatmentHcvGenotype">
                              HCV genotype
                            </Label>
                            <span style={{ color: "red" }}> *</span>
                            <input
                              className="form-control"
                              name="hcvRetreatmentHcvGenotype"
                              id="hcvRetreatmentHcvGenotype"
                              type="text"
                              value={
                                basicInfo.hepatitisCTreatment.hcvRetreatment
                                  .hcvRetreatmentHcvGenotype
                              }
                              onChange={handleInputChangeBasicHHCV}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />

                            {errors.hcvRetreatmentHcvGenotype !== "" ? (
                              <span className={classes.error}>
                                {errors.hcvRetreatmentHcvGenotype}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hcvRetreatmentAdverseEffect">
                              Retreatment Adverse events
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <select
                              className="form-control"
                              name="hcvRetreatmentAdverseEffect"
                              id="hcvRetreatmentAdverseEffect"
                              value={
                                basicInfo.hepatitisCTreatment.hcvRetreatment
                                  .retreatmentAdverseEffect
                              }
                              onChange={handleInputChangeBasicHHCV}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              <option value={"YES"}>Yes</option>
                              <option value={"NO"}>No</option>
                            </select>
                            {errors.hcvRetreatmentAdverseEffect !== "" ? (
                              <span className={classes.error}>
                                {errors.hcvRetreatmentAdverseEffect}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hcvRetreatmentHistoryOfAdverseEffect">
                              History of adverse events
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <select
                              className="form-control"
                              name="hcvRetreatmentHistoryOfAdverseEffect"
                              id="hcvRetreatmentHistoryOfAdverseEffect"
                              value={
                                basicInfo.hepatitisCTreatment.hcvRetreatment
                                  .history_of_AdverseEffect
                              }
                              onChange={handleInputChangeBasicHHCV}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              <option value={"YES"}>Yes</option>
                              <option value={"NO"}>No</option>
                            </select>
                            {errors.hcvRetreatmentHistoryOfAdverseEffect !==
                            "" ? (
                              <span className={classes.error}>
                                {errors.hcvRetreatmentHistoryOfAdverseEffect}
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
            {false ? <Spinner /> : ""}
            <br />
            <div className="d-flex justify-content-between">
              <MatButton
                type="button"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<ArrowBackIcon />}
                onClick={moveBack}
                style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
              >
                <span style={{ textTransform: "capitalize" }}>Previous</span>
              </MatButton>
              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleSubmit}
                // endIcon={<ArrowForward />}
                style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
              >
                <span style={{ textTransform: "capitalize" }}>Submit</span>
              </MatButton>
            </div>
            {/* </Form> */}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ViralHepatitisForm3;
