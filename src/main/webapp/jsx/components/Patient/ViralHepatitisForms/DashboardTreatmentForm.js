import React, { useState, useEffect } from "react";
import { FormGroup, Label, Spinner } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Collapse,
  IconButton,
  Button as MatButton,
} from "@material-ui/core";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import { useValidateForm3ValuesHook } from "../../../formSchemas/form1ValidationSchema";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { getCookie, setCookie } from "../../../helpers/cookieStoragehelpers";
import axios from "axios";
import { url as baseUrl, token } from "../../../../api";
import { toast } from "react-toastify";
import { isNotInTheFutureOrBeforeBirth } from "../../../helpers/dateValidators";
import { FETCH_ENROLMENT_KEY } from "../../../utils/queryKeys";
import { useQuery } from "react-query";
import { fetchEnrolment } from "../../../services/fetchEnrolment";

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

const DasboardTreatmentForm = ({ patientObj, setActiveContent, setStep }) => {
  const [enrollmentUuid, setEnrollmentUuid] = useState(
    getCookie("enrollmentIds")?.enrollmentUuid
  );

  const [basicInfo, setBasicInfo] = useState({
    enrollmentUuid: getCookie("enrollmentIds")?.enrollmentUuid,
    hepatitisBTreatment: {
      hbvDateStarted: "",
      hbvDateStopped: "",
      hbvPastTreatmentRegimen: "",
      newRegimenPrescribedDuration: "",
      hepatitisBRegimenSwitch: {
        adverseEffectReported: "",
        dateStarted: "",
        dateStopped: "",
        newRegimen: "",
        reasonForSwitch: "",
      },
      historyOfAdverseEffect: "",
      hbvNewRegimen: "",
      newRegimenDateStarted: "",
      newRegimenDateStopped: "",
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
      hcvPastTreatmentRegimen: "",
      hcvNewRegimen: "",
      newRegimenDateStarted: "",
      newRegimenDateStopped: "",
      hcvRetreatment: {
        hcvGenotype: "",
        dateStarted: "",
        dateStopped: "",
        historyOfAdverseEffect: "",
        newRegimen: "",
        prescribedDuration: 0,
        retreatmentAdverseEffect: "",
      },
      hepatitisSvr12Testing: {
        dateTested: "",
        hcvRNA: "",
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
            newRegimen: e.target.value,
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

    if (e.target.name === "newRegimenHistoryOfAdverseEffect") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          newRegimenHistoryOfAdverseEffect: e.target.value,
        },
      });
    }
    if (e.target.name === "hcvNewRegimenHistoryOfAdverseEffect") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvNewRegimenHistoryOfAdverseEffect: e.target.value,
        },
      });
    }

    if (e.target.name === "historyOfAdverseEffect") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          historyOfAdverseEffect: e.target.value,
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

    if (e.target.name === "newRegimenDateStopped") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          newRegimenDateStopped: e.target.value,
        },
      });
    }
    if (e.target.name === "newRegimenDateStarted") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          newRegimenDateStarted: e.target.value,
        },
      });
    }
    if (e.target.name === "dateStarted") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          dateStarted: e.target.value,
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
    if (e.target.name === "hcvNewRegimen") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvNewRegimen: e.target.value,
        },
      });
    }
    if (e.target.name === "newRegimenPrescribedDuration") {
      setBasicInfo({
        ...basicInfo,
        hepatitisBTreatment: {
          ...basicInfo.hepatitisBTreatment,
          newRegimenPrescribedDuration: e.target.value,
        },
      });
    }

    if (e.target.name === "hcvPastTreatmentRegimen") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvPastTreatmentRegimen: e.target.value,
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
    if (e.target.name === "hcvRetreatmentGenotype") {
      setBasicInfo({
        ...basicInfo,
        hepatitisCTreatment: {
          ...basicInfo.hepatitisCTreatment,
          hcvRetreatment: {
            ...basicInfo.hepatitisCTreatment.hcvRetreatment,
            hcvGenotype: e.target.value,
          },
        },
      });
    }
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

    temp.hbvRegimeSwitchDateStarted = basicInfo.hepatitisBTreatment
      .hepatitisBRegimenSwitch.dateStarted
      ? ""
      : "Date Started is required";

    temp.hbvRegimeSwitchDateStarted =
      basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.newRegimen &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.newRegimen,
        patientObj?.dateOfBirth
      )
        ? ""
        : basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.dateStarted
        ? ""
        : "Date Started is required";

    temp.hbvRegimeSwitchReason = basicInfo.hepatitisBTreatment
      .hepatitisBRegimenSwitch.reasonForSwitch
      ? ""
      : "Reason for switch is required";

    temp.hbvRegimeSwitchReason =
      basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.newRegimen === ""
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
      basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch.newRegimen === ""
        ? ""
        : basicInfo.hepatitisBTreatment.hepatitisBRegimenSwitch
            .adverseEffectReported
        ? ""
        : "Adverse events is required";
    temp.historyOfAdverseEffect = basicInfo.hepatitisBTreatment
      .historyOfAdverseEffect
      ? ""
      : "History of Adverse events is required";

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

    temp.hcvDateStarted =
      basicInfo.hepatitisCTreatment.dateStarted &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisCTreatment.dateStarted,
        patientObj?.dateOfBirth
      )
        ? ""
        : "Date started is required";

    temp.hcvDateStarted =
      basicInfo.hepatitisCTreatment.treatmentExperience !== "YES"
        ? ""
        : basicInfo.hepatitisCTreatment.dateStarted
        ? ""
        : "Date started is required";
    temp.hcvDateCompleted =
      basicInfo.hepatitisCTreatment.dateCompleted &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisCTreatment.dateCompleted,
        patientObj?.dateOfBirth
      )
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

    temp.svr12TestingDateStarted =
      basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.dateTested &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.dateTested,
        patientObj?.dateOfBirth
      )
        ? ""
        : "Date tested is required";

    temp.svr12TestingHcvRna = basicInfo.hepatitisCTreatment
      .hepatitisSvr12Testing.hcvRNA
      ? ""
      : "HCV RNA is required";
    temp.svr12TestingHcvRna = isNaN(
      basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.hcvRNA
    )
      ? ""
      : "HCV RNA is invalid";

    temp.svr12RetreatmentDateTested =
      basicInfo.hepatitisCTreatment.hepatitisSvr12Testing
        .retreatmentDateTested &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisCTreatment.hepatitisSvr12Testing
          .retreatmentDateTested,
        patientObj?.dateOfBirth
      )
        ? ""
        : "Retreatment date tested is required";

    temp.svr12RetreatmentHcvRna =
      basicInfo.hepatitisCTreatment.hepatitisSvr12Testing
        .retreatmentDateTested &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisCTreatment.hepatitisSvr12Testing
          .retreatmentDateTested,
        patientObj?.dateOfBirth
      )
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

    temp.hcvRetreatmentDateStarted =
      basicInfo.hepatitisCTreatment.hcvRetreatment.dateStarted &&
      isNotInTheFutureOrBeforeBirth(
        basicInfo.hepatitisCTreatment.hcvRetreatment.dateStarted,
        patientObj?.dateOfBirth
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
      : " History of adverse events is required";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const [hcvTreatmentRegimenOptions, setHcvTreatmentRegimenOptions] =
    useState(null);
  const [hbvTreatmentRegimenOptions, setHbvTreatmentRegimenOptions] =
    useState(null);

  const fetchHcvRegimen = async () => {
    const { data } = await axios.get(
      `${baseUrl}application-codesets/v2/HCV_TREATMENT_REGIMEN`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setHcvTreatmentRegimenOptions(data);
  };
  const fetchHbvRegimen = async () => {
    const { data } = await axios.get(
      `${baseUrl}application-codesets/v2/HBV_TREATMENT_REGIMEN`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setHbvTreatmentRegimenOptions(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);

    if (validate()) {
      postDataWithToken(basicInfo, "hepatitis/treatment");
    }
  };

  const onSubmitHandler = (values) => {
    setCookie("hepatitis3", values, 1);
    const restructuredTreatmentPayload = {
      enrollmentUuid,
      hepatitisBTreatment: {
        hbvDateStarted: formatDate(values.hbvDateStarted),
        hbvDateCompleted: formatDate(values.hbvDateCompleted),
        newRegimen: values.hbvNewRegimen,
        newRegimenDateStarted: formatDate(values.newRegimenDateStarted),
        newRegimenDateStopped: formatDate(values.newRegimenDateStopped),
        hbvPastTreatmentRegimen: formatDate(values.hbvPastTreatmentRegimen),
        hepatitisBRegimenSwitch: {
          adverseEffectReported: values.hbvAdverseEffectReported,
          dateStarted: formatDate(values.hbvRegimeSwitchDateStarted),
          dateStopped: formatDate(values.hbvRegimeSwitchDateStopped),
          newRegimen: values.hbvRegimeSwitchNewRegimen,
          reasonForSwitch: values.hbvRegimeSwitchReason,
        },
        historyOfAdverseEffect: values.hbvHistoryOfAdverseEffect,
        newRegimen: values.hbvNewRegimen,
        newRegimenDateStarted: values.newRegimenDateStarted,
        newRegimenDateStopped: values.newRegimenDateStopped,
        reasonForHepatitisBTreatment: {
          comment: values.hbvReasonsForTreatmentComment,
          reasonsForTreatment: values.hbvReasonForTreatmentEligibility,
        },
        treatmentExperience: values.hbvTreatmentExperience,
      },
      hepatitisCTreatment: {
        dateCompleted: formatDate(values.hcvDateCompleted),
        dateStarted: formatDate(values.hcvDateStarted),
        dateStopped: formatDate(values.hcvDateStopped),
        hcvPastTreatmentRegimen: values.hcvPastTreatmentRegimen,
        hcvRetreatment: {
          hcvGenotype: values.hcvGenotype,
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
      toast.success("Treatment submitted successfully");
      if (setActiveContent) {
        setActiveContent((prev) => ({ ...prev, route: "recent-history" }));
      }
      if (setStep) {
        setStep(3);
      }
      deleteCookie("heaptitis3PayloadValue");
      deleteCookie("hepatitis3");
      deleteCookie("enrollmentIds");
      deleteCookie("hepatitis2");
      deleteCookie("heaptitis2PayloadValue");
      deleteCookie("hepatitis1");
      deleteCookie("heaptitis1PayloadValue");
      return response.data;
    } catch (error) {
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
    fetchHcvRegimen();
    fetchHbvRegimen();
    castCookieValueToForm();
  }, []);

  useEffect(() => {
    if (basicInfo.hepatitisBTreatment.treatmentExperience === "NO") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisBTreatment: {
          ...prev.hepatitisBTreatment,
          hbvPastTreatmentRegimen: "",
        },
      }));
    }
  }, [basicInfo.hepatitisBTreatment.treatmentExperience]);

  useEffect(() => {
    if (
      basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.hcvRNA ===
      "UNDETECTED"
    ) {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisCTreatment: {
          ...prev.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...prev.hepatitisCTreatment.hepatitisSvr12Testing,
            hcvRNAValue: "",
          },
        },
      }));
    }
  }, [basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.hcvRNA]);

  useEffect(() => {
    if (
      basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.retreatmentHcvRNA ===
      "UNDETECTED"
    ) {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisCTreatment: {
          ...prev.hepatitisCTreatment,
          hepatitisSvr12Testing: {
            ...prev.hepatitisCTreatment.hepatitisSvr12Testing,
            retreatmentHcvRNAValue: "",
          },
        },
      }));
    }
  }, [basicInfo.hepatitisCTreatment.hepatitisSvr12Testing.retreatmentHcvRNA]);

  useEffect(() => {
    if (basicInfo.hepatitisCTreatment.treatmentExperience === "NO") {
      setBasicInfo((prev) => ({
        ...prev,
        hepatitisCTreatment: {
          ...prev.hepatitisCTreatment,
          pastTreatmentExperience: "",
        },
      }));
    }
  }, [basicInfo.hepatitisCTreatment.treatmentExperience]);
  useEffect(() => {
    setBasicInfo({
      ...basicInfo,
      enrollmentUuid,
    });
  }, [enrollmentUuid]);
  const [isDropdownsOpen, setIsDropdownsOpen] = useState({
    hbvTreatmentRegimenSwitch: true,
    hbvTreatmentReasonforTreatment: true,
    hcvTreatmentRegimenSwitch: true,
    hcvTreatmentRegimenHcvRetreatment: true,
    hcvTreatmentSvr12Testing: true,
  });
  useEffect(() => {
    console.log("past treament", basicInfo.hepatitisCTreatment);
  }, [basicInfo]);
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
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            <option value={"YES"}>Yes</option>
                            <option value={"NO"}>No</option>
                          </select>
                          {errors.treatmentExperienceB ? (
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
                              HBV Past treatment regimen
                            </Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="hbvPastTreatmentRegimen"
                              id="hbvPastTreatmentRegimen"
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hbvPastTreatmentRegimen
                              }
                              onChange={handleInputChangeBasicHB}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              {hbvTreatmentRegimenOptions?.map(
                                ({ display }) => (
                                  <option key={display} value={display}>
                                    {display}
                                  </option>
                                )
                              )}
                            </select>
                            {errors.hbvPastTreatmentRegimen ? (
                              <span className={classes.error}>
                                {errors.hbvPastTreatmentRegimen}
                              </span>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      )}
                      {basicInfo.hepatitisBTreatment.treatmentExperience ===
                        "YES" && (
                        <>
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hbvDateStarted">Date started</Label>
                              <span style={{ color: "red" }}> *</span>{" "}
                              <input
                                className="form-control"
                                type="date"
                                name="hbvDateStarted"
                                id="hbvDateStarted"
                                max={moment(new Date()).format("YYYY-MM-DD")}
                                min={moment(
                                  new Date(patientObj?.dateOfBirth)
                                ).format("YYYY-MM-DD")}
                                value={
                                  basicInfo.hepatitisBTreatment.hbvDateStarted
                                }
                                onChange={handleInputChangeBasicHB}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                            </FormGroup>
                          </div>
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="hbvDateStopped">
                                Date Completed{" "}
                                {basicInfo.hepatitisBTreatment
                                  .hbvDateStopped && (
                                  <span style={{ color: "red" }}> *</span>
                                )}
                              </Label>
                              <input
                                className="form-control"
                                type="date"
                                name="hbvDateStopped"
                                id="hbvDateStopped"
                                max={moment(new Date()).format("YYYY-MM-DD")}
                                min={
                                  basicInfo.hepatitisBTreatment.hbvDateStarted
                                }
                                value={
                                  basicInfo.hepatitisBTreatment.hbvDateStopped
                                }
                                onChange={handleInputChangeBasicHB}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {errors.hbvDateStopped ? (
                                <span className={classes.error}>
                                  {errors.hbvDateStopped}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="prescribedDuration">
                                Prescribed duration
                              </Label>
                              {basicInfo.hepatitisBTreatment
                                .prescribedDuration && (
                                <span style={{ color: "red" }}> *</span>
                              )}{" "}
                              <select
                                className="form-control"
                                name="prescribedDuration"
                                id="prescribedDuration"
                                value={
                                  basicInfo.hepatitisBTreatment
                                    .prescribedDuration
                                }
                                onChange={handleInputChangeBasicHC}
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
                              {errors.prescribedDuration ? (
                                <span className={classes.error}>
                                  {errors.prescribedDuration}
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
                          <Label for="hbvNewRegimen">New regimen</Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <select
                            className="form-control"
                            name="hbvNewRegimen"
                            id="hbvNewRegimen"
                            value={basicInfo.hepatitisBTreatment.hbvNewRegimen}
                            onChange={handleInputChangeBasicHB}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="" selected>
                              Select
                            </option>
                            {hbvTreatmentRegimenOptions?.map(({ display }) => (
                              <option key={display} value={display}>
                                {display}
                              </option>
                            ))}
                          </select>
                        </FormGroup>
                      </div>
                      {basicInfo.hepatitisBTreatment.hbvNewRegimen && (
                        <>
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="newRegimenPrescribedDuration">
                                Prescribed duration
                              </Label>
                              {basicInfo.hepatitisBTreatment
                                .newRegimenPrescribedDuration && (
                                <span style={{ color: "red" }}> *</span>
                              )}{" "}
                              <select
                                className="form-control"
                                name="newRegimenPrescribedDuration"
                                id="newRegimenPrescribedDuration"
                                value={
                                  basicInfo.hepatitisBTreatment
                                    .newRegimenPrescribedDuration
                                }
                                onChange={handleInputChangeBasicHC}
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
                              {errors.newRegimenPrescribedDuration ? (
                                <span className={classes.error}>
                                  {errors.newRegimenPrescribedDuration}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="newRegimenDateStarted">
                                Date started
                              </Label>
                              <span style={{ color: "red" }}> *</span>{" "}
                              <input
                                className="form-control"
                                type="date"
                                name="newRegimenDateStarted"
                                id="newRegimenDateStarted"
                                max={moment(new Date()).format("YYYY-MM-DD")}
                                min={moment(
                                  new Date(patientObj?.dateOfBirth)
                                ).format("YYYY-MM-DD")}
                                value={
                                  basicInfo.hepatitisBTreatment
                                    .newRegimenDateStarted
                                }
                                onChange={handleInputChangeBasicHB}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                            </FormGroup>
                            {errors.newRegimenDateStarted ? (
                              <span className={classes.error}>
                                {errors.newRegimenDateStarted}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="newRegimenDateStopped">
                                Date Completed{" "}
                                {basicInfo.hepatitisBTreatment
                                  .newRegimenDateStopped && (
                                  <span style={{ color: "red" }}> *</span>
                                )}
                              </Label>
                              <input
                                className="form-control"
                                type="date"
                                name="newRegimenDateStopped"
                                id="newRegimenDateStopped"
                                max={moment(new Date()).format("YYYY-MM-DD")}
                                min={
                                  basicInfo.hepatitisBTreatment
                                    .newRegimenDateStarted
                                }
                                value={
                                  basicInfo.hepatitisBTreatment
                                    .newRegimenDateStopped
                                }
                                onChange={handleInputChangeBasicHB}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {errors.newRegimenDateStopped ? (
                                <span className={classes.error}>
                                  {errors.newRegimenDateStopped}
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
                            Adverse event reported
                          </Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <select
                            className="form-control"
                            name="historyOfAdverseEffect"
                            id="historyOfAdverseEffect"
                            value={
                              basicInfo.hepatitisCTreatment
                                .historyOfAdverseEffect
                            }
                            onChange={handleInputChangeBasicHB}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            <option value={"YES"}>Yes</option>
                            <option value={"NO"}>No</option>
                          </select>
                          {errors.historyOfAdverseEffect ? (
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
                            </Label>
                            <select
                              className="form-control"
                              type="text"
                              name="hbvRegimeSwitchNewRegimen"
                              id="hbvRegimeSwitchNewRegimen"
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hepatitisBRegimenSwitch.newRegimen
                              }
                              onChange={handleInputChangeBasicHBRegSwitch}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              {hbvTreatmentRegimenOptions?.map(
                                ({ display }) => (
                                  <option key={display} value={display}>
                                    {display}
                                  </option>
                                )
                              )}
                            </select>
                          </FormGroup>
                        </div>

                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvRegimeSwitchDateStarted">
                              Date Started{" "}
                              {basicInfo.hepatitisBTreatment
                                .hepatitisBRegimenSwitch.dateStarted && (
                                <span style={{ color: "red" }}> *</span>
                              )}
                            </Label>
                            <input
                              className="form-control"
                              type="date"
                              name="hbvRegimeSwitchDateStarted"
                              id="hbvRegimeSwitchDateStarted"
                              max={moment(new Date()).format("YYYY-MM-DD")}
                              min={moment(
                                new Date(patientObj?.dateOfBirth)
                              ).format()}
                              value={
                                basicInfo.hepatitisBTreatment
                                  .hepatitisBRegimenSwitch.dateStarted
                              }
                              onChange={handleInputChangeBasicHBRegSwitch}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />
                            {errors.hbvRegimeSwitchDateStarted ? (
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
                              Date Completed{" "}
                              {basicInfo.hepatitisBTreatment.hbvDateStopped && (
                                <span style={{ color: "red" }}> *</span>
                              )}
                            </Label>
                            <input
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
                            <Label for="hbvRegimeSwitchReason">
                              Reason for switch
                              {basicInfo.hepatitisBTreatment
                                .hepatitisBRegimenSwitch.newRegimen !== "" && (
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
                        <div className="form-group mb-3 col-md-4">
                          <FormGroup>
                            <Label for="hbvAdverseEffectReported">
                              Adverse event reported{" "}
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
                            <textarea
                              className="form-control"
                              name="hbvReasonsForTreatmentComment"
                              id="hbvReasonsForTreatmentComment"
                              onChange={handleInputChangeBasicHBReason}
                              value={
                                basicInfo.hepatitisBTreatment
                                  .reasonForHepatitisBTreatment.comment
                              }
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                                height: "80px",
                              }}
                            />
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
                              name="hcvTreatmentExperience"
                              id="hcvTreatmentExperience"
                              value={
                                basicInfo.hepatitisCTreatment
                                  .treatmentExperience
                              }
                              onChange={handleInputChangeBasicHC}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              <option value={"YES"}>Yes</option>
                              <option value={"NO"}>No</option>
                            </select>
                            {errors.treatmentExperienceB ? (
                              <span className={classes.error}>
                                {errors.treatmentExperienceB}
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
                              <Label for="hcvPastTreatmentRegimen">
                                HCV Past treatment regimen
                              </Label>
                              <span style={{ color: "red" }}> *</span>{" "}
                              <select
                                className="form-control"
                                name="hcvPastTreatmentRegimen"
                                id="hcvPastTreatmentRegimen"
                                value={
                                  basicInfo.hepatitisCTreatment
                                    .hcvPastTreatmentRegimen
                                }
                                onChange={handleInputChangeBasicHC}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value="">Select</option>
                                {hcvTreatmentRegimenOptions?.map(
                                  ({ display }) => (
                                    <option key={display} value={display}>
                                      {display}
                                    </option>
                                  )
                                )}
                              </select>
                              {errors.hcvPastTreatmentRegimen ? (
                                <span className={classes.error}>
                                  {errors.hcvPastTreatmentRegimen}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>
                        )}
                        {basicInfo.hepatitisCTreatment.treatmentExperience ===
                          "YES" && (
                          <>
                            <div className="form-group mb-3 col-md-4">
                              <FormGroup>
                                <Label for="hcvDateStarted">Date started</Label>
                                <span style={{ color: "red" }}> *</span>{" "}
                                <input
                                  className="form-control"
                                  type="date"
                                  name="hcvDateStarted"
                                  id="hcvDateStarted"
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                  min={moment(
                                    new Date(patientObj?.dateOfBirth)
                                  ).format("YYYY-MM-DD")}
                                  value={
                                    basicInfo.hepatitisCTreatment.dateStarted
                                  }
                                  onChange={handleInputChangeBasicHC}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                              <FormGroup>
                                <Label for="hcvDateCompleted">
                                  Date Completed{" "}
                                  {basicInfo.hepatitisCTreatment
                                    .hcvDateStopped && (
                                    <span style={{ color: "red" }}> *</span>
                                  )}
                                </Label>
                                <input
                                  className="form-control"
                                  type="date"
                                  name="hcvDateCompleted"
                                  id="hcvDateCompleted"
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                  min={
                                    basicInfo.hepatitisCTreatment.dateStarted
                                  }
                                  value={
                                    basicInfo.hepatitisCTreatment.dateCompleted
                                  }
                                  onChange={handleInputChangeBasicHC}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />
                                {errors.hcvDateStopped ? (
                                  <span className={classes.error}>
                                    {errors.hcvDateStopped}
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
                                {basicInfo.hepatitisCTreatment
                                  .prescribedDuration && (
                                  <span style={{ color: "red" }}> *</span>
                                )}{" "}
                                <select
                                  className="form-control"
                                  name="hcvPrescribedDuration"
                                  id="hcvPrescribedDuration"
                                  value={
                                    basicInfo.hepatitisCTreatment
                                      .prescribedDuration
                                  }
                                  onChange={handleInputChangeBasicHC}
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
                                {errors.prescribedDuration ? (
                                  <span className={classes.error}>
                                    {errors.prescribedDuration}
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
                            <Label for="hcvNewRegimen">New regimen</Label>
                            <span style={{ color: "red" }}> *</span>{" "}
                            <select
                              className="form-control"
                              name="hcvNewRegimen"
                              id="hcvNewRegimen"
                              value={
                                basicInfo.hepatitisCTreatment.hcvNewRegimen
                              }
                              onChange={handleInputChangeBasicHC}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="" selected>
                                Select
                              </option>
                              {hcvTreatmentRegimenOptions?.map(
                                ({ display }) => (
                                  <option key={display} value={display}>
                                    {display}
                                  </option>
                                )
                              )}
                            </select>
                          </FormGroup>
                        </div>
                        {basicInfo.hepatitisCTreatment.hcvNewRegimen && (
                          <>
                            <div className="form-group mb-3 col-md-4">
                              <FormGroup>
                                <Label for="newRegimenPrescribedDuration">
                                  Prescribed duration
                                </Label>
                                {basicInfo.hepatitisCTreatment
                                  .newRegimenPrescribedDuration && (
                                  <span style={{ color: "red" }}> *</span>
                                )}{" "}
                                <select
                                  className="form-control"
                                  name="newRegimenPrescribedDuration"
                                  id="newRegimenPrescribedDuration"
                                  value={
                                    basicInfo.hepatitisCTreatment
                                      .newRegimenPrescribedDuration
                                  }
                                  onChange={handleInputChangeBasicHC}
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
                                {errors.newRegimenPrescribedDuration ? (
                                  <span className={classes.error}>
                                    {errors.newRegimenPrescribedDuration}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </FormGroup>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                              <FormGroup>
                                <Label for="newRegimenDateStarted">
                                  Date started
                                </Label>
                                <span style={{ color: "red" }}> *</span>{" "}
                                <input
                                  className="form-control"
                                  type="date"
                                  name="newRegimenDateStarted"
                                  id="newRegimenDateStarted"
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                  min={moment(
                                    new Date(patientObj?.dateOfBirth)
                                  ).format("YYYY-MM-DD")}
                                  value={
                                    basicInfo.hepatitisCTreatment
                                      .newRegimenDateStarted
                                  }
                                  onChange={handleInputChangeBasicHC}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />
                              </FormGroup>
                              {errors.newRegimenDateStarted ? (
                                <span className={classes.error}>
                                  {errors.newRegimenDateStarted}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="form-group mb-3 col-md-4">
                              <FormGroup>
                                <Label for="newRegimenDateStopped">
                                  Date Completed{" "}
                                  {basicInfo.hepatitisBTreatment
                                    .newRegimenDateStopped && (
                                    <span style={{ color: "red" }}> *</span>
                                  )}
                                </Label>
                                <input
                                  className="form-control"
                                  type="date"
                                  name="newRegimenDateStopped"
                                  id="newRegimenDateStopped"
                                  max={moment(new Date()).format("YYYY-MM-DD")}
                                  min={
                                    basicInfo.hepatitisCTreatment
                                      .newRegimenDateStarted
                                  }
                                  value={
                                    basicInfo.hepatitisCTreatment
                                      .newRegimenDateStopped
                                  }
                                  onChange={handleInputChangeBasicHC}
                                  style={{
                                    border: "1px solid #014D88",
                                    borderRadius: "0.2rem",
                                  }}
                                />
                                {errors.newRegimenDateStopped ? (
                                  <span className={classes.error}>
                                    {errors.newRegimenDateStopped}
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
                            <Label for="hcvHistoryOfAdverseEffect">
                              Adverse event reported
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
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            >
                              <option value="">Select</option>
                              <option value={"YES"}>Yes</option>
                              <option value={"NO"}>No</option>
                            </select>
                            {errors.adverseEffectReported ? (
                              <span className={classes.error}>
                                {errors.adverseEffectReported}
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
                              className="form-control"
                              name="svr12TestingHcvRna"
                              id="svr12TestingHcvRna"
                              value={
                                basicInfo.hepatitisCTreatment
                                  .hepatitisSvr12Testing.hcvRNA
                              }
                              onChange={handleInputChangeBasicHCSVR}
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
                            <select
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
                            >
                              <option value="">Select</option>
                              {hcvTreatmentRegimenOptions?.map(
                                ({ display }) => (
                                  <option key={display} value={display}>
                                    {display}
                                  </option>
                                )
                              )}
                            </select>
                            {errors.hcvRetreatmentNewRegimen ? (
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
                              tpe={"date"}
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
                                  .historyOfAdverseEffect
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
                            className="form-control"
                            name="svr12RetreatmentHcvRna"
                            id="svr12RetreatmentHcvRna"
                            value={
                              basicInfo.hepatitisCTreatment
                                .hepatitisSvr12Testing.retreatmentHcvRNA
                            }
                            onChange={handleInputChangeBasicHCSVR}
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
                              className="form-control"
                              type="number"
                              name="svr12RetreatmentHcvRnaValue"
                              id="svr12RetreatmentHcvRnaValue"
                              value={
                                basicInfo.hepatitisCTreatment
                                  .hepatitisSvr12Testing.retreatmentHcvRNAValue
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
            <br />
            <div className="d-flex justify-content-end">
              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleSubmit}
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

export default DasboardTreatmentForm;
