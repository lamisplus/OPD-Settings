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
import { useHistory } from "react-router-dom";
import isBefore from "date-fns/isBefore";

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

const TreatmentSubmittedForm = ({
  setStep,

  action,
  patientObj,
  enrollmentUuid,
  id,
}) => {
  const [treatmentInfo, setTreatmentInfo] = useState({});
  let history = useHistory();
  const [userId, setUserId] = useState(getCookie("enrollmentIds"));

  const [basicInfo, setBasicInfo] = useState({
    enrollmentUuid: enrollmentUuid,
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
        history_of_AdverseEffect: "YES",
        newRegimen: "",
        prescribedDuration: 0,
        retreatmentAdverseEffect: "",
      },
      hepatitisSvr12Testing: {
        dateTested: "",
        hcvRNA: "DETECTED",
        hcvRNAValue: "",
        retreatmentDateTested: "",
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

    // if (e.target.name === "hbvRegimeSwitchDateStarted") {
    //   setBasicInfo({
    //     ...basicInfo,
    //     hepatitisBTreatment: {
    //       ...basicInfo.hepatitisBTreatment,
    //       hepatitisBRegimenSwitch: {
    //         ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
    //         dateStarted: e.target.value,
    //       },
    //     },
    //   });
    // }
    // if (e.target.name === "hbvRegimeSwitchDateStopped") {
    //   setBasicInfo({
    //     ...basicInfo,
    //     hepatitisBTreatment: {
    //       ...basicInfo.hepatitisBTreatment,
    //       hepatitisBRegimenSwitch: {
    //         ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
    //         dateStopped: e.target.value,
    //       },
    //     },
    //   });
    // }
    // if (e.target.name === "hbvAdverseEffectReported") {
    //   setBasicInfo({
    //     ...basicInfo,
    //     hepatitisBTreatment: {
    //       ...basicInfo.hepatitisBTreatment,
    //       hepatitisBRegimenSwitch: {
    //         ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
    //         adverseEffectReported: e.target.value,
    //       },
    //     },
    //   });
    // }

    // if (e.target.name === "hbvRegimeSwitchReason") {
    //   setBasicInfo({
    //     ...basicInfo,
    //     hepatitisBTreatment: {
    //       ...basicInfo.hepatitisBTreatment,
    //       hepatitisBRegimenSwitch: {
    //         ...basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch,
    //         reasonForSwitch: e.target.value,
    //       },
    //     },
    //   });
    // }
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

  // to capture the error
  let temp = { ...errors };
  const validate = () => {
    temp.treatmentExperienceB = basicInfo.hepatitisBTreatment
      .treatmentExperience
      ? ""
      : "Treatment experience is required";

    temp.hbvRegimeSwitchNewRegimen = basicInfo.hepatitisBTreatment
      .hepatitisBRegimenSwitch.newRegime
      ? ""
      : "New Regimen is required";

    temp.hbvRegimeSwitchDateStarted =
      basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.dateStarted &&
      isBefore(
        basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.dateStarted,
        basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.dateCompleted
      )
        ? ""
        : "Date Started is required";

    temp.hbvRegimeSwitchReason = basicInfo.hepatitisBTreatment
      .hepatitisBRegimenSwitch.reasonForSwitch
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

    temp.historyOfAdverseEffect = basicInfo.hepatitisBTreatment
      .historyOfAdverseEffect
      ? ""
      : "History ofAdverse events is required";

    temp.newRegimen = basicInfo.hepatitisBTreatment.newRegimen
      ? ""
      : "New Regimen is required";

    temp.hbvPastTreatmentRegimen = basicInfo.hepatitisBTreatment
      .hbvPastTreatmentRegimen
      ? ""
      : "Hbv Past treatment regimen is required";
    temp.dateStarted =
      basicInfo.hepatitisBTreatment.dateStarted &&
      isBefore(
        basicInfo.hepatitisBTreatment.dateStarted,
        basicInfo.hepatitisBTreatment.dateCompleted
      )
        ? ""
        : "Date started is required";

    temp.hbvReasonForTreatmentEligibility = basicInfo.hepatitisBTreatment
      .reasonForHepatitisBTreatment.reasonsForTreatment
      ? ""
      : "Reason for Treatment is required";

    temp.hbvReasonsForTreatmentComment = basicInfo.hepatitisBTreatment
      .reasonForHepatitisBTreatment.comment
      ? ""
      : "Comment is required";

    temp.hcvAdverseEventReported = basicInfo.hepatitisCTreatment
      .adverseEffectReported
      ? ""
      : "Adverse events Reported is required";

    temp.hcvDateStarted =
      basicInfo.hepatitisCTreatment.dateStarted &&
      isBefore(
        basicInfo.hepatitisCTreatment.dateStarted,
        basicInfo.hepatitisCTreatment.dateCompleted
      )
        ? ""
        : "Date started is required";

    temp.hcvDateCompleted = basicInfo.hepatitisCTreatment.dateCompleted
      ? ""
      : "Date completed is required";

    temp.hcvPrescribedDuration = basicInfo.hepatitisCTreatment
      .prescribedDuration
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
      : " New regimen  is required";

    temp.hcvRetreatmentPrescribedDuration = basicInfo.hepatitisCTreatment
      .hcvRetreatment.prescribedDuration
      ? ""
      : "Prescribed Duration is required";

    temp.hcvRetreatmentDateStarted =
      basicInfo.hepatitisCTreatment.hcvRetreatment.dateStarted &&
      isBefore(
        basicInfo.hepatitisCTreatment.hcvRetreatment.dateStarted,
        basicInfo.hepatitisCTreatment.hcvRetreatment.dateCompleted
      )
        ? ""
        : "Date started is required";

    temp.hcvRetreatmentAdverseEffect = basicInfo.hepatitisCTreatment
      .hcvRetreatment.retreatmentAdverseEffect
      ? ""
      : " Retreatment Adverse events is required";

    temp.hcvRetreatmentHistoryOfAdverseEffect = basicInfo.hepatitisCTreatment
      .hcvRetreatment.history_of_AdverseEffect
      ? ""
      : " History of adverse event is required";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };
  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

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
          prescribedDuration: values.hcvRetreatmentPrescribedDuration,
          retreatmentAdverseEffect: values.hcvRetreatmentAdverseEffect,
        },
        hepatitisSvr12Testing: {
          dateTested: formatDate(values.svr12TestingDateStarted),
          hcvRNA: values.svr12TestingHcvRna,
          hcvRNAValue: values.svr12TestingHcvRnaValue,
          retreatmentDateTested: formatDate(values.svr12RetreatmentDateTested),
        },
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
  const postDataWithToken = async (data) => {
    try {
      const response = await axios.put(
        `${baseUrl}hepatitis/update-hepatitis-treatment/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Handle the response if needed

      toast.success("Treatment submitted successfully");
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
  const viewHepatitisTreatment = () => {
    axios
      .get(`${baseUrl}hepatitis/view-hepatitis-treatment-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTreatmentInfo(response.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    viewHepatitisTreatment();
  }, []);

  useEffect(() => {
    if (basicInfo.hepatitisBTreatment.treatmentExperience === "NO") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          hbvPastTreatmentRegimen: "",
        },
      });
    }
  }, [basicInfo.hepatitisBTreatment.treatmentExperience]);
  useEffect(() => {
    if (
      basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.hcvRNA ===
      "UNDETECTED"
    ) {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            hcvRNAValue: "",
          },
        },
      });
    }
  }, [basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.hcvRNA]);
  useEffect(() => {
    if (
      basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.retreatmentHcvRNA ===
      "UNDETECTED"
    ) {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...basicInfo.hepatitisCTreatment.hepatitisSvr12Testing,
            retreatmentHcvRNAValue: "",
          },
        },
      });
    }
  }, [basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.retreatmentHcvRNA]);

  useEffect(() => {
    castCookieValueToForm();
    setBasicInfo({
      enrollmentUuid: enrollmentUuid,
      hepatitisBTreatment: {
        dateStarted: `${
          treatmentInfo?.hepatitisBTreatmentDto?.dateStarted?.year
        }-${
          treatmentInfo?.hepatitisBTreatmentDto?.dateStarted?.monthValue.toString()
            .length > 1
            ? treatmentInfo?.hepatitisBTreatmentDto?.dateStarted?.monthValue
            : "0" +
              treatmentInfo?.hepatitisBTreatmentDto?.dateStarted?.monthValue
        }-${
          treatmentInfo?.hepatitisBTreatmentDto?.dateStarted?.dayOfMonth.toString()
            .length > 1
            ? treatmentInfo?.hepatitisBTreatmentDto?.dateStarted?.dayOfMonth
            : "0" +
              treatmentInfo?.hepatitisBTreatmentDto?.dateStarted?.dayOfMonth
        }`,
        hbvPastTreatmentRegimen:
          treatmentInfo?.hepatitisBTreatmentDto?.hbvPastTreatmentRegimen,
        hepatitisBRegimenSwitch: {
          adverseEffectReported:
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
              .adverseEffectReported,
          dateStarted: `${
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
              .dateStarted.year
          }-${
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch.dateStarted.monthValue.toString()
              .length > 1
              ? treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
                  .dateStarted.monthValue
              : "0" +
                treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
                  .dateStarted.monthValue
          }-${
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch?.dateStarted?.dayOfMonth.toString()
              .length > 1
              ? treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
                  .dateStarted.dayOfMonth
              : "0" +
                treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
                  .dateStarted?.dayOfMonth
          }`,
          dateStopped: `${
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
              .dateStopped?.year
          }-${
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch?.dateStopped?.monthValue?.toString()
              .length > 1
              ? treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
                  ?.dateStopped?.monthValue
              : "0" +
                treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
                  ?.dateStopped?.monthValue
          }-${
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch?.dateStopped?.dayOfMonth?.toString()
              .length > 1
              ? treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
                  .dateStopped.dayOfMonth
              : "0" +
                treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
                  .dateStopped?.dayOfMonth
          }`,
          newRegime:
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
              ?.newRegime,
          reasonForSwitch:
            treatmentInfo?.hepatitisBTreatmentDto?.hepatitisBRegimenSwitch
              ?.reasonForSwitch,
        },
        historyOfAdverseEffect:
          treatmentInfo?.hepatitisBTreatmentDto?.historyOfAdverseEffect,
        newRegimen: treatmentInfo?.hepatitisBTreatmentDto?.newRegimen,
        reasonForHepatitisBTreatment: {
          comment:
            treatmentInfo?.hepatitisBTreatmentDto?.reasonForHepatitisBTreatment
              ?.comment,
          reasonsForTreatment:
            treatmentInfo?.hepatitisBTreatmentDto?.reasonForHepatitisBTreatment
              ?.comment,
        },
        treatmentExperience:
          treatmentInfo?.hepatitisBTreatmentDto?.treatmentExperience,
      },
      hepatitisCTreatment: {
        adverseEffectReported:
          treatmentInfo?.hepatitisCTreatmentDto?.adverseEffectReported,
        dateCompleted: `${
          treatmentInfo?.hepatitisCTreatmentDto?.dateCompleted?.year
        }-${
          treatmentInfo?.hepatitisCTreatmentDto?.dateCompleted?.monthValue.toString()
            .length > 1
            ? treatmentInfo?.hepatitisCTreatmentDto?.dateCompleted?.monthValue
            : "0" +
              treatmentInfo?.hepatitisCTreatmentDto?.dateCompleted?.monthValue
        }-${
          treatmentInfo?.hepatitisCTreatmentDto?.dateCompleted?.dayOfMonth.toString()
            .length > 1
            ? treatmentInfo?.hepatitisCTreatmentDto?.dateCompleted?.dayOfMonth
            : "0" +
              treatmentInfo?.hepatitisCTreatmentDto?.dateCompleted?.dayOfMonth
        }`,
        dateStarted: `${
          treatmentInfo?.hepatitisCTreatmentDto?.dateStarted?.year
        }-${
          treatmentInfo?.hepatitisCTreatmentDto?.dateStarted?.monthValue.toString()
            .length > 1
            ? treatmentInfo?.hepatitisCTreatmentDto?.dateStarted?.monthValue
            : "0" +
              treatmentInfo?.hepatitisCTreatmentDto?.dateStarted?.monthValue
        }-${
          treatmentInfo?.hepatitisCTreatmentDto?.dateStarted?.dayOfMonth.toString()
            .length > 1
            ? treatmentInfo?.hepatitisCTreatmentDto?.dateStarted?.dayOfMonth
            : "0" +
              treatmentInfo?.hepatitisCTreatmentDto?.dateStarted?.dayOfMonth
        }`,
        hbvPastTreatmentRegimen:
          treatmentInfo?.hepatitisCTreatmentDto?.hbvPastTreatmentRegimen,
        hcvRetreatment: {
          dateStarted: `${
            treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment.dateStarted
              ?.year
          }-${
            treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment?.dateStarted?.monthValue.toString()
              .length > 1
              ? treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment
                  ?.dateStarted?.monthValue
              : "0" +
                treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment
                  ?.dateStarted?.monthValue
          }-${
            treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment?.dateStarted?.dayOfMonth.toString()
              .length > 1
              ? treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment
                  ?.dateStarted?.dayOfMonth
              : "0" +
                treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment
                  ?.dateStarted?.dayOfMonth
          }`,
          hbvPastTreatmentRegimen:
            treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment
              .hbvPastTreatmentRegimen,
          history_of_AdverseEffect:
            treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment
              .history_of_AdverseEffect,
          newRegimen:
            treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment.newRegimen,
          prescribedDuration: 0,
          retreatmentAdverseEffect:
            treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment
              .retreatmentAdverseEffect,
          prescribedDuration:
            treatmentInfo?.hepatitisCTreatmentDto?.hcvRetreatment
              .prescribedDuration,
        },
        hepatitisSvr12Testing: {
          dateTested: `${
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
              .dateTested.year
          }-${
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing.dateTested.monthValue.toString()
              .length > 1
              ? treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
                  .dateTested.monthValue
              : "0" +
                treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
                  .dateTested.monthValue
          }-${
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing.dateTested.dayOfMonth.toString()
              .length > 1
              ? treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
                  .dateTested.dayOfMonth
              : "0" +
                treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
                  .dateTested.dayOfMonth
          }`,
          hcvRNA:
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing.hcvRNA,
          hcvRNAValue:
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
              .hcvRNAValue,
          retreatmentDateTested: `${
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
              .retreatmentDateTested.year
          }-${
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing.retreatmentDateTested.monthValue.toString()
              .length > 1
              ? treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
                  .retreatmentDateTested.monthValue
              : "0" +
                treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
                  .retreatmentDateTested.monthValue
          }-${
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing.retreatmentDateTested.dayOfMonth.toString()
              .length > 1
              ? treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
                  .retreatmentDateTested.dayOfMonth
              : "0" +
                treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
                  .retreatmentDateTested.dayOfMonth
          }`,
          retreatmentHcvRNA:
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
              .retreatmentHcvRNA,
          retreatmentHcvRNAValue:
            treatmentInfo?.hepatitisCTreatmentDto?.hepatitisSvr12Testing
              .retreatmentHcvRNAValue,
        },
        pastTreatmentExperience:
          treatmentInfo?.hepatitisCTreatmentDto?.pastTreatmentExperience,

        prescribedDuration:
          treatmentInfo?.hepatitisCTreatmentDto?.prescribedDuration,
        treatmentExperience:
          treatmentInfo?.hepatitisCTreatmentDto?.treatmentExperience,
      },
    });
  }, [treatmentInfo, enrollmentUuid]);

  const [isDropdownsOpen, setIsDropdownsOpen] = useState({
    hbvTreatmentRegimenSwitch: true,
    hbvTreatmentReasonforTreatment: true,
    hcvTreatmentRegimenSwitch: true,
    hcvTreatmentRegimenHcvRetreatment: true,
    hcvTreatmentSvr12Testing: true,
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
                            disabled={action === "view" ? true : false}
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
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hbvNewRegimen">New regimen</Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <input
                            className="form-control"
                            type="text"
                            disabled={action === "view" ? true : false}
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
                          {errors.newRegimen !== "" ? (
                            <span className={classes.error}>
                              {errors.newRegimen}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hbvPastTreatmentRegimen">
                            Hbv Past treatment regimen
                          </Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <input
                            className="form-control"
                            type="text"
                            disabled={action === "view" ? true : false}
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

                      {basicInfo.hbvPastTreatmentRegimen !== "" && (
                        <>
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hbvDateStarted">Date started</Label>
                              <span style={{ color: "red" }}> *</span>{" "}
                              <input
                                className="form-control"
                                type="date"
                                name="dateStarted"
                                disabled={action === "view" ? true : false}
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
                              {errors.dateStarted !== "" ? (
                                <span className={classes.error}>
                                  {errors.dateStarted}
                                </span>
                              ) : (
                                ""
                              )}
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
                            disabled={action === "view" ? true : false}
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
                              New Regime
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="text"
                              disabled={action === "view" ? true : false}
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
                            {errors.hbvRegimeSwitchNewRegimen !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvRegimeSwitchNewRegimen}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvRegimeSwitchDateStarted">
                              Date Started{" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              name="hbvRegimeSwitchDateStarted"
                              disabled={action === "view" ? true : false}
                              id="hbvRegimeSwitchDateStarted"
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
                            <Label for="hbvRegimeSwitchDateStarted">
                              Date Stopped{" "}
                              {basicInfo.hepatitisBTreatment
                                .hepatitisBRegimenSwitch.dateStopped !== "" && (
                                <span style={{ color: "red" }}> *</span>
                              )}
                            </Label>
                            <input
                              readOnly={action === "view"}
                              className="form-control"
                              type="date"
                              name="hbvRegimeSwitchDateStopped"
                              id="hbvRegimeSwitchDateStopped"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              min={
                                basicInfo.hepatitisBTreatment
                                  .hepatitisBRegimenSwitch.dateStarted
                              }
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hepatitisBRegimenSwitch.dateStopped
                              }
                              onChange={handleInputChangeBasicHBRegSwitch}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hbvRegimeSwitchDateStopped !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvRegimeSwitchDateStopped}
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
                            </Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="hbvAdverseEffectReported"
                              disabled={action === "view" ? true : false}
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
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              className="form-control"
                              disabled={action === "view" ? true : false}
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
                              disabled={action === "view" ? true : false}
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
                            <span style={{ color: "red" }}> *</span>{" "}
                            <textarea
                              className="form-control"
                              name="hbvReasonsForTreatmentComment"
                              disabled={action === "view" ? true : false}
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
                            {errors.hbvReasonsForTreatmentComment !== "" ? (
                              <span className={classes.error}>
                                {errors.hbvReasonsForTreatmentComment}
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
                          <Label for="hbvPastTreatmentRegimen">
                            HBV Past treatment regimen
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            disabled={action === "view" ? true : false}
                            name="pastTreatmentExperience"
                            id="pastTreatmentExperience"
                            value={
                              basicInfo.hepatitisCTreatment
                                .pastTreatmentExperience
                            }
                            onChange={handleInputChangeBasicHCGen}
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

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hcvDateStarted">Date started</Label>
                          <input
                            className="form-control"
                            type="date"
                            name="hcvDateStarted"
                            disabled={action === "view" ? true : false}
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
                          <span style={{ color: "red" }}> *</span>{" "}
                          <input
                            className="form-control"
                            type="date"
                            name="hcvDateCompleted"
                            disabled={action === "view" ? true : false}
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
                          <span style={{ color: "red" }}> *</span>{" "}
                          <select
                            className="form-control"
                            name="hcvPrescribedDuration"
                            disabled={action === "view" ? true : false}
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
                          {/* <span style={{ color: "red" }}> *</span>{" "} */}
                          <select
                            type="text"
                            className="form-control"
                            name="hbvPastTreatmentRegimenForHcv"
                            id="hbvPastTreatmentRegimenForHcv"
                            disabled={action === "view" ? true : false}
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
                            disabled={action === "view" ? true : false}
                            value={
                              basicInfo.hepatitisCTreatment
                                .adverseEffectReported
                            }
                            onChange={handleInputChangeBasicHC}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                          </select>
                          {errors.hcvAdverseEventReported !== "" ? (
                            <span className={classes.error}>
                              {errors.hcvAdverseEventReported}
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
                              readOnly={action === "view"}
                              className="form-control"
                              name="svr12TestingDateStarted"
                              id="svr12TestingDateStarted"
                              type="date"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              min={moment(
                                new Date(patientObj?.dateOfBirth)
                              ).format()}
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
                            {errors.svr12TestingDateStarted ? (
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
                              HCV RNA (IU/ML){" "}
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <select
                              readOnly={action === "view"}
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
                                readOnly={action === "view"}
                                className="form-control"
                                name="svr12TestingHcvRnaValue"
                                id="svr12TestingHcvRnaValue"
                                type="number"
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
              {/** */}
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
                            <Label for="hcvRetreatmentGenotype">
                              HCV Genotype
                            </Label>
                            <span style={{ color: "red" }}> *</span>
                            <input
                              readOnly={action === "view"}
                              className="form-control"
                              name="hcvRetreatmentGenotype"
                              id="hcvRetreatmentGenotype"
                              type="text"
                              value={
                                basicInfo.hepatitisCTreatment.hcvRetreatment
                                  .hcvGenotype
                              }
                              onChange={handleInputChangeBasicHHCV}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hcvGenotype !== "" ? (
                              <span className={classes.error}>
                                {errors.hcvGenotype}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hcvRetreatmentNewRegimen">
                              New regimen
                            </Label>
                            <span style={{ color: "red" }}> *</span>
                            <input
                              readOnly={action === "view"}
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
                              readOnly={action === "view"}
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
                              readOnly={action === "view"}
                              className="form-control"
                              name="hcvRetreatmentDateStarted"
                              id="hcvRetreatmentDateStarted"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              min={moment(
                                new Date(patientObj?.dateOfBirth)
                              ).format()}
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
                            <Label for="hcvRetreatmentAdverseEffect">
                              Retreatment Adverse events
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <select
                              readOnly={action === "view"}
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
                              readOnly={action === "view"}
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
                  Retreatment SVR12 testing
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
                          <Label for="svr12RetreatmentDateTested">
                            Retreatment date tested
                          </Label>
                          <input
                            readOnly={action === "view"}
                            className="form-control"
                            name="svr12RetreatmentDateTested"
                            id="svr12RetreatmentDateTested"
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
                            type="date"
                          />

                          {errors.svr12RetreatmentDateTested !== "" ? (
                            <span className={classes.error}>
                              {errors.svr12RetreatmentDateTested}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="svr12RetreatmentHcvRna">
                            Retreatment HCV RNA(IU/ml)
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <select
                            readOnly={action === "view"}
                            className="form-control"
                            name="svr12RetreatmentHcvRna"
                            id="svr12RetreatmentHcvRna"
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

                          {errors.svr12RetreatmentHcvRna !== "" ? (
                            <span className={classes.error}>
                              {errors.svr12RetreatmentHcvRna}
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
                            <Label for="svr12RetreatmentHcvRnaValue">
                              Input Retreatment HCV RNA value(IU/ml)
                              <span style={{ color: "red" }}> *</span>{" "}
                            </Label>
                            <input
                              readOnly={action === "view"}
                              className="form-control"
                              type="text"
                              name="svr12RetreatmentHcvRnaValue"
                              id="svr12RetreatmentHcvRnaValue"
                              value={
                                basicInfo.hepatitisCTreatment
                                  .hepatitisSvr12Testing.retreatmentHcvRNAValue
                              }
                              onChange={handleInputChangeBasicHCSVR}
                              // onBlur={formik.handleBlur}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />

                            {/* {errors.svr12TestingHcvRna !== "" ? (
                                <span className={classes.error}>
                                  {errors.svr12TestingHcvRna}
                                </span>
                              ) : (
                                ""
                              )} */}
                          </FormGroup>
                        </div>
                      )}
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
            {false ? <Spinner /> : ""}
            <br />
            {action === "update" && (
              <div className="d-flex justify-content-end">
                {/* <MatButton
                type="button"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<ArrowBackIcon />}
                onClick={moveBack}
                style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
              >
                <span style={{ textTransform: "capitalize" }}>Previous</span>
              </MatButton> */}
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
            )}

            {/* </Form> */}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TreatmentSubmittedForm;
