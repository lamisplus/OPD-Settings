import React, { useEffect } from "react";
import MatButton from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Form } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
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
// import { FormGroup, Label, Spinner, Input, Form, InputGroup } from "reactstrap";
import Reactive from "./Reactive";
import NonReactive from "./NonReactive";

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
  const [hospitalNumStatus, setHospitalNumStatus] = useState(false);

  const [genders, setGenders] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [occupationOptions, setOccupationOptions] = useState([]);
  const [relationshipOptions, setRelationshipOptions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [hepatitisStatus, setHepatitisStatus] = useState([
    { id: "Reactive", display: " Reactive" },
    { id: "Non-reactive", display: " Non-Reactive" },
  ]);
  const [provinces, setProvinces] = useState([]);

  const [errors, setErrors] = useState({});
  const [topLevelUnitCountryOptions, settopLevelUnitCountryOptions] = useState(
    []
  );

  const [ageDisabled, setAgeDisabled] = useState(true);
  const [carePoints, setCarePoints] = useState([]);
  const [sourceReferral, setSourceReferral] = useState([]);
  const [pregnancyStatus, setPregnancyStatus] = useState([]);
  const [disabledAgeBaseOnAge, setDisabledAgeBaseOnAge] = useState(false);

  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);

  const sexCodeset = async () => {
    const response = await axios.get(
      `${baseUrl}application-codesets/v2/${sexPath}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setGenders(response.data.sort());
  };

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
    settopLevelUnitCountryOptions(response.data.sort());
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
    // setBasicInfo({
    //   ...basicInfo,
    //   personDto: {
    //     ...basicInfo.personDto,
    //     dateOfRegistration: e.target.value,
    //   },
    // });

    // setBasicInfo({ ...basicInfo, dob: e.target.value });
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
  //Get list of State
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
      // Handle the response if needed

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
      // Handle any errors that occurred during the request
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
    // setStep(1);
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
    let mass = basicInfo.weight;
    let convertMeterToCM = Number(basicInfo.height) / 100;

    let heightSquare = convertMeterToCM * convertMeterToCM;

    setBasicInfo({ ...basicInfo, bmi: mass / heightSquare });

    return mass / heightSquare;
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
      temp.genderId = basicInfo.personDto.genderId ? "" : "sex is required";
    }

    temp.careEntryPoint = basicInfo.careEntryPoint
      ? ""
      : "careEntryPoint is required";
    temp.pregnancy = basicInfo.pregnancy ? "" : "pregnancy status is required";
    temp.weight = basicInfo.weight ? "" : "Weight is required";
    temp.height = basicInfo.height ? "" : "Height is required";
    temp.hepatitisB = basicInfo.hepatitisB ? "" : "HepatitisB is required";
    temp.breastfeeding = basicInfo.breastfeeding
      ? ""
      : "Breastfeeding status is required";
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
        <Reactive />
      </Card>
    </>
  );
};

export default ViralHepatitisForm1;
