import React, { useEffect } from "react";
import MatButton from "@material-ui/core/Button";
import { FormGroup, Label, Spinner } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

import PhoneInput from "react-phone-input-2";
import * as moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import { useValidateForm1ValuesHook } from "../../../formSchemas/form1ValidationSchema";
import { ArrowForward } from "@material-ui/icons";
import { getCookie, setCookie } from "../../../helpers/cookieStoragehelpers";
import axios from "axios";
import { toast } from "react-toastify";
import {
  token,
  url as baseUrl,
  hivStatsEnrolPath,
  srcRefPath,
  erollmentSettingPath,
  tbStatsPath,
  targetGroupPath,
  pregnancyStatsPath,
  sexPath,
  maritalStatsPath,
  educationPath,
  occupationPath,
  relationshipPath,
  careEntryPointPath,
  hepatitisScreeningResultPath,
} from "../../../../api";
import { useCallback } from "react";
import { useState } from "react";

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

const ViralHepatitisForm1 = ({ setStep, userStatus, patientObj }) => {
  const [info, setInfo] = useState({
    countryId: 1,
    stateId: "",
    dateOfBirth: "",
    educationId: "",
    employmentStatusId: "",
    district: "",
    value: "",
    city: "",
  });
  const [basicInfo, setBasicInfo] = useState({
    bmi: "",
    hepatitisB: "",
    height: "",
    // address: [],
    careEntryPoint: "",
    age: "",
    phoneNumber: "",
    altPhonenumber: "",
    pregnancy: "",
    breastfeeding: "",
    historyOfUsingAbusedSubstance: "",
    screening: {
      dateOfFirstHepatitisBPositiveScreening: "",
      hepatitisC: "",
    },
    personDto: {
      active: true,
      address: [
        {
          city: info.city,
          countryId: info.countryId,
          stateId: info.stateId,
          district: "",
        },
      ],
      contactPoint: [
        {
          type: "phone",
          value: "",
        },
      ],
      dateOfBirth: "",
      dateOfRegistration: "",
      educationId: "",
      employmentStatusId: "",
      firstName: "",
      genderId: "",
      identifier: [
        {
          assignerId: 0,
          type: "",
          value: "",
        },
      ],
      isDateOfBirthEstimated: "",
      maritalStatusId: "",
      ninNumber: "",
      organizationId: "",
      otherName: "",
      sexId: "",
      surname: "",
    },
    weight: "",
  });

  const location = useLocation();
  const locationState = location.state;
  const [hospitalNumStatus, setHospitalNumStatus] = useState(false);
  const [genders, setGenders] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [occupationOptions, setOccupationOptions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [hepatitisStatus, setHepatitisStatus] = useState([
    { id: "Reactive", display: " Reactive" },
    { id: "Non-reactive", display: " Non-Reactive" },
  ]);
  const [provinces, setProvinces] = useState([]);

  const [errors, setErrors] = useState({});
  const [topLevelUnitCountryOptions, setTopLevelUnitCountryOptions] = useState(
    []
  );

  const [ageDisabled, setAgeDisabled] = useState(true);
  // const [isDateOfBirthEstimated, setIsDateOfBirthEstimated] = useState(false);

  const [carePoints, setCarePoints] = useState([]);
  const [sourceReferral, setSourceReferral] = useState([]);
  const [pregnancyStatus, setPregnancyStatus] = useState([]);
  const [disabledAgeBaseOnAge, setDisabledAgeBaseOnAge] = useState(false);

  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);

  const sexCodeset = useCallback(async () => {
    const response = await axios.get(
      `${baseUrl}application-codesets/v2/${sexPath}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setGenders(response.data.sort());
  }, []);

  const loadMaritalStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/${maritalStatsPath}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaritalStatusOptions(response.data.sort());
    } catch (e) {}
  }, []);

  const loadEducation = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/${educationPath}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEducationOptions(response.data.sort());
    } catch (e) {}
  }, []);

  const loadOccupation = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/${occupationPath}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOccupationOptions(response.data.sort());
    } catch (e) {}
  }, []);

  const CareEntryPoint = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/${careEntryPointPath}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCarePoints(response.data);
      })
      .catch((error) => {});
  };

  const getHepatitisPoint = () => {
    axios
      .get(
        `${baseUrl}application-codesets/v2/${hepatitisScreeningResultPath}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setHepatitisStatus(response.data);
      })
      .catch((error) => {});
  };
  //Get list of Source of Referral
  const SourceReferral = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/${srcRefPath}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSourceReferral(response.data);
      })
      .catch((error) => {});
  };

  const EnrollmentSetting = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/${erollmentSettingPath}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEnrollSetting(response.data);
      })
      .catch((error) => {});
  };

  const loadRelationships = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/${relationshipPath}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRelationshipOptions(response.data.sort());
    } catch (e) {}
  }, []);

  const loadTopLevelCountry = useCallback(async () => {
    const response = await axios.get(
      `${baseUrl}organisation-units/parent-organisation-units/0`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTopLevelUnitCountryOptions(response.data.sort());
  }, []);

  const loadOrganisationUnitsByParentId = async (parentId) => {
    const response = await axios.get(
      `${baseUrl}organisation-units/parent-organisation-units/${parentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };
  const calculate_age = (dob) => {
    const today = new Date();
    const dateParts = dob.split("-");
    const birthDate = new Date(dob); // create a date object directlyfrom`dob1`argument
    let age_now = today.getFullYear() - birthDate.getFullYear();

    return age_now;
  };
  const phoneNumberFormatCheck = (phone) => {
    if (
      phone != undefined &&
      typeof phone?.value !== null &&
      typeof phone?.value !== "undefined" &&
      phone?.value?.charAt(0) === "0"
    ) {
      phone.value = phone.value.replace("0", "234");
    }
    return phone;
  };
  //Country List
  const GetCountry = () => {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/0`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {});
  };

  const handleAgeChange = (e) => {
    if (!ageDisabled && e.target.value) {
      if (e.target.value !== "" && e.target.value >= 60) {
        toggle();
      }
      if (e.target.value <= 1) {
        setDisabledAgeBaseOnAge(true);
      } else {
        setDisabledAgeBaseOnAge(false);
      }
      const currentDate = new Date();
      currentDate.setDate(15);
      currentDate.setMonth(5);
      const estDob = moment(currentDate.toISOString());
      const dobNew = estDob.add(e.target.value * -1, "years");
      //setBasicInfo({...basicInfo, dob: moment(dobNew).format("YYYY-MM-DD")});

      basicInfo.personDto.dateOfBirth = moment(dobNew).format("YYYY-MM-DD");

      setInfo({ ...info, dateOfBirth: moment(dobNew).format("YYYY-MM-DD") });
    }
    setBasicInfo({ ...basicInfo, age: Math.abs(e.target.value) });
  };

  //Date of Birth and Age handle
  const handleDobChange = (e) => {
    if (e.target.value) {
      const today = new Date();
      const birthDate = new Date(e.target.value);
      let age_now = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
      }
      basicInfo.age = age_now;
      //setBasicInfo({...basicInfo, age: age_now});
    } else {
      setBasicInfo({ ...basicInfo, age: "" });
    }
    if (basicInfo.age !== "" && basicInfo.age >= 60) {
      toggle();
    }
  };

  //Get States from selected country
  const getStates = () => {
    const getCountryId = info?.countryId;
    setStateByCountryId(1);
    setInfo({ ...info, countryId: getCountryId });
  };
  //Get list of Statef
  function setStateByCountryId(id) {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStates(response.data.sort());
      })
      .catch((error) => {});
  }
  //fetch province
  const getProvinces = (e) => {
    const stateId = e?.target?.value;
    // setBasicInfo({ ...basicInfo, stateId: e?.target?.value });
    axios
      .get(
        `${baseUrl}organisation-units/parent-organisation-units/${stateId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setProvinces(response.data.sort());
      })
      .catch((error) => {});
  };

  const postDataWithToken = async (data, key) => {
    try {
      const response = await axios.post(`${baseUrl}${key}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Enrolment submitted successfully");

      setCookie(
        "enrollmentIds",
        {
          enrollmentId: response.data?.enrollmentId,
          enrollmentUuid: response.data?.enrollmentUuid,
          person: response.data?.person,
        },
        1
      );
      setStep(1);
      return response.data;
    } catch (error) {
      toast.error("Enrolment failed");
      console.error("Error posting data:", error.message);
      throw error;
    }
  };

  const onSubmitHandler = (values) => {
    window.scrollTo(0, 0);
    const restructuredEnrolmentPayload = {
      bmi: values.weight / values.height,
      breastfeeding: values.breastfeeding,
      coreEntryPoint: values.coreEntryPoint,
      height: values.height,
      hepatitisB: values.hepatitisB,
      historyOfUsingAbusedSubstance: values.historyOfUsingAbusedSubstance,

      personDto: {
        active: true,
        address: [
          {
            countryId: values.countryId,
            stateId: values.stateId,
          },
        ],
        dateOfBirth: values.dateOfBirth,
        dateOfRegistration: values.dateOfRegistration,
        educationId: values.educationId,
        employmentStatusId: values.employmentStatusId,
        firstName: values.firstName,
        genderId: values.sexId,
        identifier: [
          {
            assignerId: 0,
            type: "string",
            value: "string",
          },
        ],
        isDateOfBirthEstimated:
          values.isDateOfBirthEstimated === "true" ? true : false,
        maritalStatusId: values.maritalStatusId,
        ninNumber: values.ninNumber,
        organizationId: 0,
        otherName: values.otherName,
        sexId: values.sexId,
        surname: values.surname,
      },
      pregnancy: values.pregnancy,
      screening: {
        dateOfFirstHepatitisBPositiveScreening:
          values.dateOfFirstHepatitisBPositiveScreening,
        hepatitisC: values.hepatitisC,
      },
      weight: values.weight,
    };

    setCookie("hepatitis1", values, 1);
    setCookie("heaptitis1PayloadValue", restructuredEnrolmentPayload, 1);
    postDataWithToken(restructuredEnrolmentPayload, "hepatitis/enrollment");
  };
  const classes = useStyles();
  const { formik } = useValidateForm1ValuesHook(onSubmitHandler);

  const castCookieValueToForm = () => {
    const cookieValue = getCookie("hepatitis1");
    if (cookieValue) {
      formik.setValues(cookieValue);
    }
  };

  const PregnancyStatus = () => {
    axios
      .get(`${baseUrl}application-codesets/v2/PREGNANCY_STATUS`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPregnancyStatus(response.data);
      })
      .catch((error) => {});
  };

  const calculateBMI = () => {
    let convertMeterToCM = Number(basicInfo.height) / 100;
    let squareH = convertMeterToCM * convertMeterToCM;

    let value = (Number(basicInfo.weight) / squareH).toFixed(2);
    setBasicInfo({ ...basicInfo, bmi: value });

    return value;
  };

  const alphabetOnly = (value) => {
    const result = value.replace(/[^a-z]/gi, "");
    return result;
  };

  const handleDateOfBirthChange = (e) => {
    if (e.target.value == "Actual") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          isDateOfBirthEstimated: false,
        },
      });
    } else if (e.target.value == "Estimated") {
      setAgeDisabled(false);
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          isDateOfBirthEstimated: true,
        },
      });
    }
  };

  // to capture the error
  let temp = { ...errors };
  const validate = () => {
    if (userStatus === "new") {
      //date of registration
      temp.dateOfRegistration = info.dateOfRegistration
        ? ""
        : "Date of Registration is required.";

      //hospital number
      temp.hospitalNumber = info.value ? "" : "Hospital Id is required";

      temp.city = info.city ? "" : "Address is required";

      //Names

      temp.surname = basicInfo.personDto.surname ? "" : "Surname is required";
      temp.firstName = basicInfo.personDto.firstName
        ? ""
        : "First name is required";

      //phone number
      temp.phone = basicInfo.personDto.contactPoint[0].value
        ? ""
        : "Phone Number  is required.";

      //state and district

      temp.stateId = info.stateId ? "" : "State is required.";
      temp.district = info.district ? "" : "Province/LGA is required.";

      //date of birth
      temp.dateOfBirth = info.dateOfBirth ? "" : "Date of Birth is required.";

      // Marital Status

      temp.maritalStatusId = basicInfo.personDto.maritalStatusId
        ? ""
        : "Marital Status is required";

      // Education
      temp.educationId = info.educationId ? "" : "Education is required";

      //Relationship
      // temp.relationship = basicInfo.relationship
      //   ? ""
      //   : "Relationship is required";

      //sex
      temp.genderId = basicInfo?.personDto?.genderId ? "" : "sex is required";
      temp.pregnancy = basicInfo.pregnancy
        ? ""
        : "pregnancy status is required";
      temp.pregnancy =
        Number(basicInfo.personDto.genderId) === 376 ? "" : temp.pregnancy;
      temp.breastfeeding = basicInfo.breastfeeding
        ? ""
        : "Breastfeeding status is required";
      temp.breastfeeding =
        Number(basicInfo.personDto.genderId) === 376 ? "" : temp.breastfeeding;
    }

    temp.careEntryPoint = basicInfo.careEntryPoint
      ? ""
      : "careEntryPoint is required";
    temp.weight = basicInfo.weight ? "" : "Weight is required";
    temp.height = basicInfo.height ? "" : "Height is required";
    temp.hepatitisB = basicInfo.hepatitisB ? "" : "HepatitisB is required";

    temp.dateOfFirstHepatitisBPositiveScreening = basicInfo.screening
      .dateOfFirstHepatitisBPositiveScreening
      ? ""
      : "Date of first HepatitisB positive screening is required";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };

  const checkPhoneNumberBasic = (e, inputName) => {
    const limit = 10;
    setBasicInfo({
      ...basicInfo,
      personDto: {
        ...basicInfo.personDto,
        contactPoint: [
          {
            type: "phone",
            value: e,
          },
        ],
      },
    });
    // setBasicInfo({ ...basicInfo, [inputName]: e });
  };

  // handle input changes
  const handleInputChangeBasic = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    //manupulate inpute fields base on gender/sex
    // if (e.target.name === "sexId" && e.target.value === "377") {
    //   setfemaleStatus(true);
    // }
    if (e.target.name === "firstName") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          [e.target.name]: name,
        },
      });
    } else if (e.target.name === "genderId") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          [e.target.name]: e.target.value,
          sexId: e.target.value,
        },
      });
      // setBasicInfo({
      //   ...basicInfo,
      //   personDto: {
      //     ...basicInfo.personDto,
      //
      //   },
      // });
    } else if (e.target.name === "surname") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          [e.target.name]: name,
        },
      });
    } else if (
      e.target.name === "dateOfFirstHepatitisBPositiveScreening" &&
      e.target.value !== ""
    ) {
      setBasicInfo({
        ...basicInfo,
        screening: {
          ...basicInfo.screening,
          dateOfFirstHepatitisBPositiveScreening: e.target.value,
        },
      });
    } else if (e.target.name === "otherName") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          [e.target.name]: name,
        },
      });
    } else if (e.target.name === "stateId" && e.target.value !== "") {
      getProvinces(e);
    } else if (e.target.name === "hepatitisC") {
      setBasicInfo({
        ...basicInfo,
        screening: {
          ...basicInfo.screening,
          [e.target.name]: e.target.value,
        },
      });
    } else if (e.target.name === "maritalStatusId") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          [e.target.name]: e.target.value,
        },
      });
    } else {
      setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    }
  };

  const handleInputChangesForInfo = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });

    if (e.target.name === "hospitalNumber") {
      setInfo({ ...info, value: e.target.value });
    } else {
      setInfo({ ...info, [e.target.name]: e.target.value });
    }
    //manipulate input fields base on gender/sex
    if (e.target.name === "hospitalNumber") {
      if (e.target.value !== "") {
        async function getHosiptalNumber() {
          const hosiptalNumber = e.target.value;
          const response = await axios.post(
            `${baseUrl}patient/exist/hospital-number`,
            hosiptalNumber,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "text/plain",
              },
            }
          );
          if (response.data !== true) {
            setHospitalNumStatus(false);
            errors.hospitalNumber = "";
          } else {
            errors.hospitalNumber = "";
            toast.error("Error! Hospital Number already exist");
            setHospitalNumStatus(true);
          }
        }
        getHosiptalNumber();
      }
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          identifier: [
            {
              assignerId: 1,
              type: "HospitalNumber",
              value: e.target.value,
            },
          ],
        },
      });

      getProvinces(e);
    }
    if (e.target.name === "stateId" && e.target.value !== "") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          address: [
            {
              countryId: info.countryId,
              stateId: e.target.value,
              district: info.district,
              city: info.city,
            },
          ],
        },
      });

      getProvinces(e);
    }
    if (e.target.name === "district") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          address: [
            {
              countryId: info.countryId,
              stateId: info.stateId,
              district: e.target.value,
              city: info.city,
            },
          ],
        },
      });

      // getProvinces(e);
    }

    if (e.target.name === "city") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          address: [
            {
              countryId: info.countryId,
              stateId: info.stateId,
              district: info.district,
              city: e.target.value,
            },
          ],
        },
      });
    }
    if (e.target.name === "dateOfBirth" && e.target.value !== "") {
      handleDobChange(e);
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          dateOfBirth: e.target.value,
        },
      });
    }
    if (e.target.name === "dateOfRegistration" && e.target.value !== "") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          dateOfRegistration: e.target.value,
        },
      });
    }
    if (e.target.name === "educationId" && e.target.value !== "") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          educationId: e.target.value,
        },
      });
    }
    if (e.target.name === "employmentStatusId" && e.target.value !== "") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          employmentStatusId: e.target.value,
        },
      });
    }
    if (
      e.target.name === "dateOfRdistrictegistration" &&
      e.target.value !== ""
    ) {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          address: [
            {
              countryId: info.countryId,
              stateId: info.stateId,
              district: e.target.value,
            },
          ],
        },
      });
    }

    // }
    // if (e.target.name === "firstName" && e.target.value !== "") {
    //   const name = alphabetOnly(e.target.value);
    //   setBasicInfo({ ...basicInfo, [e.target.name]: name });
    // }
    // if (e.target.name === "surname" && e.target.value !== "") {
    //   const name = alphabetOnly(e.target.value);
    //   setBasicInfo({ ...basicInfo, [e.target.name]: name });
    // }
    // if (e.target.name === "otherName" && e.target.value !== "") {
    //   const name = alphabetOnly(e.target.value);
    //   setBasicInfo({ ...basicInfo, [e.target.name]: name });
    // }

    // if (e.target.name === "stateId" && e.target.value !== "") {
    //   getProvinces(e);
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validating the input
    window.scrollTo(0, 0);

    if (validate()) {
      if (userStatus === "new") {
        if (hospitalNumStatus) {
          toast.error("Error! Hospital Number already exist");
        } else {
          postDataWithToken(basicInfo, "hepatitis/enrollment");
        }
      } else {
        let userInfo = basicInfo;
        delete userInfo.personDto;
        delete userInfo.address;

        let newUserInfo = {
          ...userInfo,
          personId: patientObj.id,
        };
        postDataWithToken(newUserInfo, "hepatitis/enrollment");
      }
    }
  };

  useEffect(() => {
    castCookieValueToForm();
    sexCodeset();
    PregnancyStatus();
    CareEntryPoint();
    SourceReferral();
    loadMaritalStatus();
    loadTopLevelCountry();
    loadRelationships();
    loadOrganisationUnitsByParentId();
    EnrollmentSetting();
    loadEducation();
    getProvinces();
    setStateByCountryId();
    loadOccupation();
    getStates();
    GetCountry();

    if (userStatus === "existing") {
      setBasicInfo({
        ...basicInfo,
        personDto: {
          ...basicInfo.personDto,
          genderId: locationState?.patientObj?.gender?.id,
        },
      });
    }
    // getHepatitisPoint();
  }, []);
  // calculate bmi when weight and height changes
  useEffect(() => {
    if (basicInfo.weight && basicInfo.height) {
      calculateBMI();
    }
  }, [basicInfo.weight, basicInfo.height, info.stateId]); // Runs whenever 'data' changes
  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <div className="col-xl-12 col-lg-12">
            {/* <Form onSubmit={formik.handleSubmit}> */}
            {userStatus === "new" && (
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
                    Demography
                  </h5>
                </div>

                <div className="card-body">
                  <div className="basic-form">
                    <div className="row">
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="dateOfRegistration">
                            Date of registration
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="date"
                            name="dateOfRegistration"
                            id="dateOfRegistration"
                            value={info.dateOfRegistration}
                            onChange={handleInputChangesForInfo}
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.dateOfRegistration !== "" ? (
                            <span className={classes.error}>
                              {errors.dateOfRegistration}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="patientId">
                            Hospital Number{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="hospitalNumber"
                            id="hospitalNumber"
                            value={info.value}
                            onChange={handleInputChangesForInfo}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.hospitalNumber !== "" ? (
                            <span className={classes.error}>
                              {errors.hospitalNumber}
                            </span>
                          ) : (
                            ""
                          )}
                          {hospitalNumStatus === true ? (
                            <span className={classes.error}>
                              {"Hospital number already exist"}
                            </span>
                          ) : (
                            ""
                          )}
                          {/* {hospitalNumStatus2 === true ? (
                          <span className={classes.success}>
                            {"Hospital number is OK."}
                          </span>
                        ) : (
                          ""
                        )} */}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="surname">
                            Surname <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="surname"
                            id="surname"
                            value={basicInfo.personDto.surname}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.surname !== "" ? (
                            <span className={classes.error}>
                              {errors.surname}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="firstName">
                            Firstname <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={basicInfo.personDto.firstName}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.firstName !== "" ? (
                            <span className={classes.error}>
                              {errors.firstName}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="otherName">Other name </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="otherName"
                            id="otherName"
                            value={basicInfo.personDto.otherName}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.otherName !== "" ? (
                            <span className={classes.error}>
                              {errors.otherName}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label>
                            Phone Number{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <PhoneInput
                            containerStyle={{
                              width: "100%",
                              border: "1px solid #014D88",
                            }}
                            inputStyle={{ width: "100%", borderRadius: "0px" }}
                            country={"ng"}
                            placeholder="(234)7099999999"
                            maxLength={5}
                            name="phoneNumber"
                            id="phoneNumber"
                            masks={{
                              ng: "...-...-....",
                              at: "(....) ...-....",
                            }}
                            value={basicInfo.personDto.contactPoint[0].value}
                            onChange={(e) => {
                              setErrors({ ...errors, phone: "" });
                              checkPhoneNumberBasic(e, "phone");
                            }}
                            //onChange={(e)=>{handleInputChangeBasic(e,'phoneNumber')}}
                          />
                          {errors.phone !== "" ? (
                            <span className={classes.error}>
                              {errors.phone}
                            </span>
                          ) : (
                            ""
                          )}
                          {/* {basicInfo.phoneNumber.length >13 ||  basicInfo.phoneNumber.length <13? (
                                                <span className={classes.error}>{"The maximum and minimum required number is 13 digit"}</span>
                                                ) : "" } */}
                        </FormGroup>
                      </div>

                      {/* <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="residentialAddress">
                            Residential Address{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="residentialAddress"
                            id="residentialAddress"
                            value={basicInfo.residentialAddress}
                            onChange={handleInputChangeBasic}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.residentialAddress !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.residentialAddress}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div> */}

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="countryId">
                            Country <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <select
                            className="form-control"
                            // type="text"
                            name="countryId"
                            id="countryId"
                            value={info.countryId}
                            onChange={handleInputChangesForInfo}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            disabled
                          >
                            {countries.map((item, index) => (
                              <option value={Number(item.id)} key={index}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                          {errors.countryId !== "" ? (
                            <span className={classes.error}>
                              {errors.countryId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="stateId">
                            State <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <select
                            className="form-control"
                            name="stateId"
                            id="stateId"
                            value={info.stateId}
                            onChange={handleInputChangesForInfo}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            {states.map((item, index) => (
                              <option value={Number(item.id)} key={index}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                          {errors.stateId !== "" ? (
                            <span className={classes.error}>
                              {errors.stateId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label>
                            Province/District/LGA{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <select
                            className="form-control"
                            type="text"
                            name="district"
                            id="district"
                            value={info.district}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            onChange={handleInputChangesForInfo}
                          >
                            <option value="">Select</option>
                            {provinces.map((value, index) => (
                              <option key={index} value={value.id}>
                                {value.name}
                              </option>
                            ))}
                          </select>
                          {errors.district !== "" ? (
                            <span className={classes.error}>
                              {errors.district}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      {/*  */}
                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>
                            Street Address{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="city"
                            id="address"
                            value={info.city}
                            onChange={handleInputChangesForInfo}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.city !== "" ? (
                            <span className={classes.error}>{errors.city}</span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      {/*  */}
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="landmark">Landmark </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="landmark"
                            id="landmark"
                            value={basicInfo.landmark}
                            onChange={handleInputChangeBasic}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {/* {formik.errors.landmark !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.landmark}
                          </span>
                        ) : (
                          ""
                        )} */}
                        </FormGroup>
                      </div>

                      {/* new date of registration with actual/estimated date  */}
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label>Date Of Birth</Label>
                          <div className="radio">
                            <label>
                              <input
                                type="radio"
                                value="Actual"
                                name="dateOfBirth"
                                defaultChecked
                                onChange={(e) => handleDateOfBirthChange(e)}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />{" "}
                              Actual
                            </label>
                          </div>
                          <div className="radio">
                            <label>
                              <input
                                type="radio"
                                value="Estimated"
                                name="dateOfBirth"
                                onChange={(e) => handleDateOfBirthChange(e)}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />{" "}
                              Estimated
                            </label>
                          </div>
                        </FormGroup>
                      </div>

                      {/* end of new date of reg with actual/estimated  date */}

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="dateOfBirth">
                            Date of birth
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            value={info.dateOfBirth}
                            onChange={handleInputChangesForInfo}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.dateOfBirth !== "" ? (
                            <span className={classes.error}>
                              {errors.dateOfBirth}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label>Age</Label>
                          <input
                            type="number"
                            name="age"
                            className="form-control"
                            id="age"
                            min="10"
                            value={basicInfo.age}
                            disabled={ageDisabled}
                            onChange={handleAgeChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                        {/* <p>
                        <b style={{ color: "red" }}>
                          {basicInfo.age !== "" && basicInfo.age < 10
                            ? "The minimum age is 10"
                            : " "}{" "}
                        </b>
                      </p> */}
                      </div>

                      {/* <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="isDateOfBirthEstimated">
                          Is date Of estimated
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <select
                          className="form-control"
                          // type="date"
                          name="isDateOfBirthEstimated"
                          id="isDateOfBirthEstimated"
                          value={basicInfo.isDateOfBirthEstimated}
                          onChange={handleInputChangeBasic}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option>Select</option>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
                        {formik.errors.isDateOfBirthEstimated !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.isDateOfBirthEstimated}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div> */}

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="employmentStatusId">Occupation</Label>
                          <select
                            className="form-control"
                            name="employmentStatusId"
                            id="employmentStatusId"
                            value={info.employmentStatusId}
                            onChange={handleInputChangesForInfo}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            {occupationOptions.map((item, index) => (
                              <option
                                value={Number(item.id)}
                                key={Number(item.id)}
                              >
                                {item.display}
                              </option>
                            ))}
                          </select>
                          {/* {errors.district !== "" ? (
                          <span className={classes.error}>
                            {errors.district}
                          </span>
                        ) : (
                          ""
                        )} */}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="maritalStatusId">
                            Marital status
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <select
                            className="form-control"
                            name="maritalStatusId"
                            id="maritalStatusId"
                            value={basicInfo.personDto.maritalStatusId}
                            onChange={handleInputChangeBasic}
                            // onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select</option>
                            {maritalStatusOptions.map((item, index) => (
                              <option value={Number(item.id)}>
                                {item.display}
                              </option>
                            ))}
                          </select>
                          {errors.maritalStatusId !== "" ? (
                            <span className={classes.error}>
                              {errors.maritalStatusId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="educationId">
                            Education <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <select
                            className="form-control"
                            // type="text"
                            name="educationId"
                            id="educationId"
                            value={info.educationId}
                            onChange={handleInputChangesForInfo}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option>Select</option>
                            {educationOptions.map((item, index) => (
                              <option value={Number(item.id)}>
                                {item.display}
                              </option>
                            ))}
                          </select>
                          {errors.educationId !== "" ? (
                            <span className={classes.error}>
                              {errors.educationId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="sexId">
                            Sex <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <select
                            className="form-control"
                            name="genderId"
                            id="genderId"
                            value={basicInfo.personDto.genderId}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option>Select</option>
                            {genders.map((item, index) => (
                              <option value={Number(item.id)}>
                                {item.display}
                              </option>
                            ))}
                          </select>
                          {errors.genderId !== "" ? (
                            <span className={classes.error}>
                              {errors.genderId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="ninNumber">NIN number </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="ninNumber"
                            id="ninNumber"
                            value={basicInfo.ninNumber}
                            onChange={handleInputChangeBasic}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {/* {formik.errors.ninNumber !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.ninNumber}
                          </span>
                        ) : (
                          ""
                        )} */}
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                  Enrolment
                </h5>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="coreEntryPoint">
                        Care entry point
                        <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <select
                        className="form-control"
                        name="careEntryPoint"
                        id="careEntryPoint"
                        value={basicInfo.careEntryPoint}
                        onChange={handleInputChangeBasic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value="">Select </option>
                        {carePoints.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.display}
                          </option>
                        ))}
                      </select>
                      {errors.careEntryPoint !== "" ? (
                        <span className={classes.error}>
                          {errors.careEntryPoint}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  {/* <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="sex">
                          Sex <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <select
                          className="form-control"
                          name="sex"
                          id="sex"
                          value={basicInfo.sex}
                          onChange={handleInputChangeBasic}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        {formik.errors.sex !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.sex}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div> */}
                  {Number(basicInfo?.personDto?.genderId) === 377 && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="pregnancy">
                          Pregnancy <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <select
                          className="form-control"
                          name="pregnancy"
                          id="pregnancy"
                          value={basicInfo.pregnancy}
                          onChange={handleInputChangeBasic}
                          // onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value="">Select </option>
                          <option value="NO">No </option>
                          <option value="YES">Yes </option>
                          {/* {pregnancyStatus.map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.display}
                            </option>
                          ))} */}
                        </select>
                        {errors.pregnancy !== "" ? (
                          <span className={classes.error}>
                            {errors.pregnancy}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                  )}

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="weight">
                        Weight (in KG) <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <input
                        className="form-control"
                        type="number"
                        name="weight"
                        id="weight"
                        value={basicInfo.weight}
                        onChange={handleInputChangeBasic}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.weight !== "" ? (
                        <span className={classes.error}>{errors.weight}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="height">
                        Height (In CM) <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <input
                        className="form-control"
                        type="number"
                        name="height"
                        id="height"
                        value={basicInfo.height}
                        onChange={handleInputChangeBasic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.height !== "" ? (
                        <span className={classes.error}>{errors.height}</span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="bmi">BMI </Label>

                      <input
                        className="form-control"
                        type="number"
                        disabled
                        name="bmi"
                        id="bmi"
                        value={basicInfo.bmi}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {/* {formik.errors.bmi !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.bmi}
                          </span>
                        ) : (
                          ""
                        )} */}
                    </FormGroup>
                  </div>

                  {Number(basicInfo?.personDto?.genderId) === 377 && (
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="breastfeeding">
                          Breastfeeding <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <select
                          className="form-control"
                          name="breastfeeding"
                          id="breastfeeding"
                          value={basicInfo.breastfeeding}
                          onChange={handleInputChangeBasic}
                          // onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option>Select</option>
                          <option value={"YES"}>Yes</option>
                          <option value={"NO"}>No</option>
                        </select>
                        {errors.breastfeeding !== "" ? (
                          <span className={classes.error}>
                            {errors.breastfeeding}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                  )}
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="historyOfUsingAbusedSubstance">
                        History of using abused substance{" "}
                      </Label>
                      <select
                        className="form-control"
                        name="historyOfUsingAbusedSubstance"
                        id="historyOfUsingAbusedSubstance"
                        value={basicInfo.historyOfUsingAbusedSubstance}
                        onChange={handleInputChangeBasic}
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
                      {/* {formik.errors.historyOfUsingAbusedSubstance !== "" ? (
                        <span className={classes.error}>
                          {formik.errors.historyOfUsingAbusedSubstance}
                        </span>
                      ) : (
                        ""
                      )} */}
                    </FormGroup>
                  </div>
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
                  Screening
                </h5>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="hepatitisB">
                        Hepatitis B (HBsAg){" "}
                        <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <select
                        className="form-control"
                        name="hepatitisB"
                        id="hepatitisB"
                        value={basicInfo.hepatitisB}
                        onChange={handleInputChangeBasic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value="">Select </option>
                        {hepatitisStatus.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.display}
                          </option>
                        ))}
                      </select>
                      {/* <input
                        className="form-control"
                        type="text"
                        name="hepatitisB"
                        id="hepatitisB"
                        onChange={handleInputChangeBasic}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      /> */}
                      {errors.hepatitisB !== "" ? (
                        <span className={classes.error}>
                          {errors.hepatitisB}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>

                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="dateOfFirstHepatitisBPositiveScreening">
                        Date of first Hep. B positive screening{" "}
                        <span style={{ color: "red" }}> *</span>{" "}
                      </Label>
                      <input
                        className="form-control"
                        type="date"
                        name="dateOfFirstHepatitisBPositiveScreening"
                        id="dateOfFirstHepatitisBPositiveScreening"
                        value={
                          basicInfo.screening
                            .dateOfFirstHepatitisBPositiveScreening
                        }
                        onChange={handleInputChangeBasic}
                        max={moment(new Date()).format("YYYY-MM-DD")}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      />
                      {errors.dateOfFirstHepatitisBPositiveScreening !== "" ? (
                        <span className={classes.error}>
                          {errors.dateOfFirstHepatitisBPositiveScreening}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </div>
                  <div className="form-group mb-3 col-md-4">
                    <FormGroup>
                      <Label for="hepatitisC">Hepatitis C (HCVAb) </Label>
                      <select
                        className="form-control"
                        name="hepatitisC"
                        id="hepatitisC"
                        value={basicInfo.screening.hepatitisC}
                        onChange={handleInputChangeBasic}
                        // onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      >
                        <option value="">Select </option>
                        {hepatitisStatus.map((value) => (
                          <option key={value.id} value={value.id}>
                            {value.display}
                          </option>
                        ))}
                      </select>

                      {/* <input
                        className="form-control"
                        type="text"
                        name="hepatitisC"
                        id="hepatitisC"
                        value={basicInfo.hepatitisC}
                        onChange={handleInputChangeBasic}
                        onBlur={formik.handleBlur}
                        style={{
                          border: "1px solid #014D88",
                          borderRadius: "0.2rem",
                        }}
                      /> */}
                      {/* {errors.pregnancy !== "" ? (
                        <span className={classes.error}>
                          {errors.pregnancy}
                        </span>
                      ) : (
                        ""
                      )} */}
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>

            {false ? <Spinner /> : ""}

            <br />
            <div className="d-flex justify-content-end">
              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className={classes.button}
                endIcon={<ArrowForward />}
                style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
              >
                <span style={{ textTransform: "capitalize" }}>Next</span>
              </MatButton>
            </div>
            {/* </Form> */}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ViralHepatitisForm1;
