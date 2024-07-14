import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import MatButton from "@material-ui/core/Button";
import Button from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Input, Form, InputGroup } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
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
import { FaPlus, FaAngleDown } from "react-icons/fa";
import { token, url as baseUrl } from "../../../api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./patient.css";
import { Modal } from "react-bootstrap";
import "react-widgets/dist/css/react-widgets.css";
import { DateTimePicker } from "react-widgets";
import Steppers from "./Stepper/Stepper";
import {
  GetOptions,
  ImportantString,
} from "./ViralHepatitisForms/DashboardForm2";

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

const UserRegistration = (props) => {
  const [basicInfo, setBasicInfo] = useState({
    active: true,
    address: [],
    contact: [],
    contactPoint: [],
    dateOfBirth: "",
    deceased: false,
    deceasedDateTime: null,
    firstName: "",
    genderId: "",
    identifier: "",
    otherName: "",
    maritalStatusId: "",
    educationId: "",
    employmentStatusId: "",
    dateOfRegistration: "",
    isDateOfBirthEstimated: null,
    age: "",
    phoneNumber: "",
    altPhonenumber: "",
    dob: "",
    countryId: 1,
    stateId: "",
    district: "",
    sexId: "",
    ninNumber: "",
  });
  const [relatives, setRelatives] = useState({
    address: "",
    phone: "",
    firstName: "",
    email: "",
    relationshipId: "",
    lastName: "",
    middleName: "",
  });
  const [contacts, setContacts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [disabledAgeBaseOnAge, setDisabledAgeBaseOnAge] = useState(false);
  const [ageDisabled, setAgeDisabled] = useState(true);
  const [showRelative, setShowRelative] = useState(false);
  //const [editRelative, setEditRelative] = useState(null);
  const [genders, setGenders] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [occupationOptions, setOccupationOptions] = useState([]);
  const [relationshipOptions, setRelationshipOptions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [errors, setErrors] = useState({});
  //const [topLevelUnitCountryOptions, settopLevelUnitCountryOptions]= useState([]);
  const [patientDTO, setPatientDTO] = useState({
    person: "",
    vaccinationEnrollment: "",
  });
  const userDetail =
    props.location && props.location.state ? props.location.state.user : null;
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  //HIV INFORMATION
  const [showContactCard, setShowContactCard] = useState(true);
  const [vaccine, setVaccine] = useState([]);

  const [objValues, setObjValues] = useState({
    adverseEffect: "",
    batchNumber: "",
    doseNumber: "",
    location: "",
    patientId: "",
    vaccinationFacility: "",
    vaccine: "",
    vaccineDate: "",
    knownMedicalCondition: "",
    medicalCondition: "",
    occupation: "",
    vaccineId: "",
    visitDate: "",
    visitId: "",
    workInHealthSector: "",
    careEntryPoint: "",
    weight: "",
    height: "",
    bmi: "",
    pregnant: "",
    breastFeeding: "",
    historyOfInjectionUsed: "",
    hepatitisBHbsag: "",
    dateOfFirstPositiveScreening: new Date(),
    hepatitisCHcvab: "",
    dateOfHbvDnaTestRequired: new Date(),
    dateOfHbvDnaSampleCollected: new Date(),
    dateOfHbvDnaResultReportedForHepatitisB: new Date(),
    hbvDna: "",
    hbvDnaResult: "",
    hbsagQuantification: "",
    hbeag: "",
    antHdv: "",
    treatmentEligible: "",
    pmtctEligible: "",
    comment: "",
    hcvRna: "",
    hcvRnaResult: "",
    hepatitisCoinfection: null,
    hepatitisCommobidities: "",
    astChecked: false,
    astResult: "",
    altChecked: false,
    altResult: "",
    pstChecked: false,
    pstResult: "",
    bilibrubinTotal: "",
    bilibrubinDirect: "",
    bilibrubinAlbumin: "",
    apriScore: "",
    fib4: "",
    prothrombinTime: "",
    urea: "",
    creatinine: "",
    ultrasoundScan: "",
    afp: "",
    fibroScan: "",
    notDone: "",
    ctScan: "",
    acitesChecked: "",
    acitesValue: "",
    encephalopathy: "",
    childPughScore: "",
    liverBiopsyStage: "",
    stagingDateOfLiverBiopsy: new Date(),
    diagnosis: "",
    treatmentExperience: "",
    pastTreatmentRegimen: "",
    newRegimenOptional: "",
    dateStartedOnNewRegimen: new Date(),
    historyOfAdvserseEvents: "",
    newRegimen: "",
    dateStarted: new Date(),
    adverseEventReported: "",
    reasonForSwitch: "",
    dateStopped: "",
    treatmentEligibleForNewRegimen: "",
    hbvPmtct: "",
    commentNewRegimen: "",
  });
  const handleAncillaryInputChange = async (e) => {
    setObjValues({
      ...objValues,
      [e.target.name]: !objValues[e.target.name],
    });
  };

  //status for hospital Number
  const [hospitalNumStatus, setHospitalNumStatus] = useState(false);
  const [hospitalNumStatus2, setHospitalNumStatus2] = useState(false);
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);
  const locationState = location.state;
  let patientId = null;
  patientId = locationState ? locationState.patientId : null;
  let temp = { ...errors };

  useEffect(() => {
    loadGenders();
    loadMaritalStatus();
    loadEducation();
    loadOccupation();
    loadRelationships();
    VACCINE();
    GetCountry();
    setStateByCountryId();
    if (
      isBefore(new Date(basicInfo.dateOfRegistration), new Date(basicInfo.dob))
    ) {
      toast.error("Date of registration can not be earlier than date of birth");
    }
  }, [basicInfo.dateOfRegistration]);

  //covid/codeset?category=VACCINE
  const VACCINE = () => {
    axios
      .get(`${baseUrl}covid/codeset?category=VACCINE`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setVaccine(response.data);
      })
      .catch((error) => {});
  };
  const loadGenders = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/SEX`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGenders(response.data);
    } catch (e) {}
  }, []);
  const loadMaritalStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/MARITAL_STATUS`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaritalStatusOptions(response.data);
    } catch (e) {}
  }, []);
  const loadEducation = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/EDUCATION`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEducationOptions(response.data);
    } catch (e) {}
  }, []);
  const loadOccupation = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/OCCUPATION`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOccupationOptions(response.data);
    } catch (e) {}
  }, []);
  const loadRelationships = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}application-codesets/v2/RELATIONSHIP`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRelationshipOptions(response.data);
    } catch (e) {}
  }, []);

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
  //Get States from selected country
  const getStates = (e) => {
    const getCountryId = e.target.value;
    setStateByCountryId(1);
    setBasicInfo({ ...basicInfo, countryId: getCountryId });
  };
  //Get list of State
  function setStateByCountryId() {
    axios
      .get(`${baseUrl}organisation-units/parent-organisation-units/1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStates(response.data.sort());
      })
      .catch((error) => {});
  }
  //fetch province
  const getProvinces = (e) => {
    const stateId = e.target.value;
    setBasicInfo({ ...basicInfo, stateId: e.target.value });
    axios
      .get(
        `${baseUrl}organisation-units/parent-organisation-units/${stateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {});
  };
  //Date of Birth and Age handle
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
  const handleDobChange = (e) => {
    if (e.target.value) {
      const today = new Date();
      const birthDate = new Date(e.target.value);
      let age_now = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 18) {
        alert("The child is less than 18months");
        setDisabledAgeBaseOnAge(true);
      } else {
        setDisabledAgeBaseOnAge(false);
      }
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
      }
      basicInfo.age = age_now;
      //setBasicInfo({...basicInfo, age: age_now});
    } else {
      setBasicInfo({ ...basicInfo, age: "" });
    }
    setBasicInfo({ ...basicInfo, dob: e.target.value });
    if (basicInfo.age !== "" && basicInfo.age >= 60) {
      toggle();
    }
  };
  const handleDateOfBirthChange = (e) => {
    if (e.target.value === "Actual") {
      setAgeDisabled(true);
    } else if (e.target.value === "Estimated") {
      setAgeDisabled(false);
    }
  };
  const handleAgeChange = (e) => {
    const ageNumber = e.target.value.replace(/\D/g, "");
    if (!ageDisabled && ageNumber) {
      const currentDate = new Date();
      currentDate.setDate(15);
      currentDate.setMonth(5);
      const estDob = moment(currentDate.toISOString());
      const dobNew = estDob.add(ageNumber * -1, "years");
      basicInfo.dob = moment(dobNew).format("YYYY-MM-DD");
      if (ageNumber !== "" && ageNumber >= 60) {
        toggle();
      }
    }
    setBasicInfo({ ...basicInfo, age: Math.abs(e.target.value) });
  };
  const handleInputChangeBasic = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    if (e.target.name === "firstName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "lastName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "middleName" && e.target.value !== "") {
      const name = alphabetOnly(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: name });
    }
    if (e.target.name === "ninNumber" && e.target.value !== "") {
      const ninNumberValue = checkNINLimit(e.target.value);
      setBasicInfo({ ...basicInfo, [e.target.name]: ninNumberValue });
    }
    if (e.target.name === "hospitalNumber" && e.target.value !== "") {
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
          setObjValues({ ...objValues, uniqueId: e.target.value });
          setHospitalNumStatus2(true);
        } else {
          errors.hospitalNumber = "";
          toast.error("Error! Hosiptal Number already exist");
          setHospitalNumStatus(true);
          setHospitalNumStatus2(false);
        }
      }
      getHosiptalNumber();
    }
  };
  //Function to show relatives
  const handleAddRelative = () => {
    setShowRelative(true);
  };

  //Function to cancel the relatives form
  const handleCancelSaveRelationship = () => {
    setShowRelative(false);
  };
  /*****  Validation  Relationship Input*/
  const validateRelatives = () => {
    let temp = { ...errors };
    temp.firstName = relatives.firstName ? "" : "First Name is required";
    temp.lastName = relatives.lastName ? "" : "Last Name  is required.";
    temp.phone = relatives.phone ? "" : "Phone Number  is required.";
    temp.relationshipId = relatives.relationshipId
      ? ""
      : "Relationship Type is required.";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };
  //Function to add relatives
  const handleSaveRelationship = (e) => {
    if (validateRelatives()) {
      setContacts([...contacts, relatives]);
      setRelatives({
        address: "",
        phone: "",
        firstName: "",
        email: "",
        relationshipId: "",
        lastName: "",
        middleName: "",
      });
    }
  };
  const handleDeleteRelative = (index) => {
    contacts.splice(index, 1);
    setContacts([...contacts]);
  };
  const handleEditRelative = (relative, index) => {
    setRelatives(relative);
    setShowRelative(true);
    contacts.splice(index, 1);
  };
  const getRelationship = (relationshipId) => {
    const relationship = relationshipOptions.find(
      (obj) => obj.id == relationshipId
    );
    return relationship ? relationship.display : "";
  };
  const handleInputChangeRelatives = (e) => {
    setRelatives({ ...relatives, [e.target.name]: e.target.value });
  };
  /*****  Validation  */
  const validate = () => {
    temp.firstName = basicInfo.firstName ? "" : "First Name is required";
    temp.hospitalNumber = basicInfo.hospitalNumber
      ? ""
      : "Hospital Number  is required.";
    //temp.middleName = basicInfo.middleName ? "" : "Middle is required."
    // temp.landmark = basicInfo.landmark ? "" : "This field is required."
    temp.lastName = basicInfo.lastName ? "" : "Last Name  is required.";
    temp.sexId = basicInfo.sexId ? "" : "Gender is required.";
    temp.dateOfRegistration = basicInfo.dateOfRegistration
      ? ""
      : "Date of Registration is required.";
    //temp.educationId = basicInfo.educationId ? "" : "Education is required."
    temp.address = basicInfo.address ? "" : "Address is required.";
    temp.phoneNumber = basicInfo.phoneNumber
      ? ""
      : "Phone Number  is required.";
    temp.countryId = basicInfo.countryId ? "" : "Country is required.";
    temp.stateId = basicInfo.stateId ? "" : "State is required.";
    temp.district = basicInfo.district ? "" : "Province/LGA is required.";
    //VACCINATION FORM VALIDATION
    temp.vaccine = objValues.vaccine ? "" : "This field is required";
    temp.vaccineDate = objValues.vaccineDate ? "" : "This field is required";
    //temp.doseNumber = objValues.doseNumber ? "" : "This field is required"
    temp.location = objValues.location ? "" : "This field is required";
    temp.batchNumber = objValues.batchNumber ? "" : "This field is required";
    temp.adverseEffect = objValues.adverseEffect
      ? ""
      : "This field is required";

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x == "");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setSaving(true);
      let newConatctsInfo = [];
      //Manipulate relatives contact  address:"",
      const actualcontacts =
        contacts &&
        contacts.length > 0 &&
        contacts.map((x) => {
          const contactInfo = {
            address: {
              line: [x.address],
            },
            contactPoint: {
              type: "phone",
              value: x.phone,
            },
            firstName: x.firstName,
            fullName: x.firstName + " " + x.middleName + " " + x.lastName,
            relationshipId: x.relationshipId,
            surname: x.lastName,
            otherName: x.middleName,
          };

          newConatctsInfo.push(contactInfo);
        });
      try {
        const patientForm = {
          active: true,
          address: [
            {
              city: basicInfo.address,
              countryId: basicInfo.countryId,
              district: basicInfo.district,
              line: [basicInfo.landmark],
              organisationUnitId: 0,
              postalCode: "",
              stateId: basicInfo.stateId,
            },
          ],
          contact: newConatctsInfo,
          contactPoint: [],
          dateOfBirth: basicInfo.dob,
          deceased: false,
          deceasedDateTime: null,
          firstName: basicInfo.firstName,
          genderId: basicInfo.sexId,
          sexId: basicInfo.sexId,
          identifier: [
            {
              assignerId: 1,
              type: "HospitalNumber",
              value: basicInfo.hospitalNumber,
            },
          ],
          otherName: basicInfo.middleName,
          maritalStatusId: basicInfo.maritalStatusId,
          surname: basicInfo.lastName,
          educationId: basicInfo.educationId,
          employmentStatusId: basicInfo.employmentStatusId,
          dateOfRegistration: basicInfo.dateOfRegistration,
          isDateOfBirthEstimated:
            basicInfo.dateOfBirth == "Actual" ? false : true,
          ninNumber: basicInfo.ninNumber,
        };
        const phone = {
          type: "phone",
          value: basicInfo.phoneNumber,
        };
        if (basicInfo.email) {
          const email = {
            type: "email",
            value: basicInfo.email,
          };
          patientForm.contactPoint.push(email);
        }
        if (basicInfo.altPhonenumber) {
          const altPhonenumber = {
            type: "altphone",
            value: basicInfo.altPhonenumber,
          };
          patientForm.contactPoint.push(altPhonenumber);
        }
        patientForm.contactPoint.push(phone);
        //patientForm.id = patientId;
        patientDTO.person = patientForm;
        patientDTO.vaccinationEnrollment = objValues;
        const response = await axios.post(
          `${baseUrl}covid/enrollments`,
          patientDTO,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Patient Register successful", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setSaving(false);
        history.push("/");
      } catch (error) {
        setSaving(false);
        if (error.response && error.response.data) {
          let errorMessage =
            error.response.data.apierror &&
            error.response.data.apierror.message !== ""
              ? error.response.data.apierror.message
              : "Something went wrong, please try again";
          if (
            error.response.data.apierror &&
            error.response.data.apierror.message !== "" &&
            error.response.data.apierror &&
            error.response.data.apierror.subErrors[0].message !== ""
          ) {
            toast.error(
              error.response.data.apierror.message +
                " : " +
                error.response.data.apierror.subErrors[0].field +
                " " +
                error.response.data.apierror.subErrors[0].message,
              { position: toast.POSITION.BOTTOM_CENTER }
            );
          } else {
            toast.error(errorMessage, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        } else {
          toast.error("Something went wrong. Please try again...", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    }
  };
  const alphabetOnly = (value) => {
    const result = value.replace(/[^a-z]/gi, "");
    return result;
  };
  const handleInputChange = (e) => {
    setErrors({ ...temp, [e.target.name]: "" });
    setObjValues({ ...objValues, [e.target.name]: e.target.value });
    if (e.target.name === "location" && objValues.location !== "Facility") {
      objValues.vaccinationFacility = "";
      setObjValues({ ...objValues, vaccinationFacility: "" });
      setObjValues({ ...objValues, [e.target.name]: e.target.value });
    }
  };

  const checkPhoneNumber = (e, inputName) => {
    const NumberValue = checkNumberLimit(e.target.value.replace(/\D/g, ""));
    setRelatives({ ...relatives, [inputName]: NumberValue });
  };

  const checkNINLimit = (e) => {
    const limit = 11;
    const acceptedNumber = e.slice(0, limit);
    return acceptedNumber;
  };
  //Handle CheckBox handleCheckBoxworkInHealthSector handleCheckBoxknownMedicalCondition
  const handleCheckBoxworkInHealthSector = (e) => {
    if (e.target.checked) {
      setObjValues({ ...objValues, workInHealthSector: e.target.checked });
      //setOvcEnrolled(true)
    } else {
      setObjValues({ ...objValues, workInHealthSector: false });
    }
  };

  const handleInputChangePhoneNumber = (e, inputName) => {
    const limit = 11;
    const NumberValue = checkNumberLimit(e.target.value.replace(/\D/g, ""));
    setBasicInfo({ ...basicInfo, [inputName]: NumberValue });
  };
  const checkNumberLimit = (e) => {
    const limit = 11;
    const acceptedNumber = e.slice(0, limit);
    return acceptedNumber;
  };
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
      <ToastContainer autoClose={3000} hideProgressBar />
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h4>
              {" "}
              <Link to={"/"}>Viral Hepatitis /</Link>New Client
            </h4>
          </li>
        </ol>
      </div>
      <Link
        to={{
          pathname: "/",
          state: "users",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          className=" float-end mr-10 pr-10"
          style={{
            backgroundColor: "#014d88",
            fontWeight: "bolder",
            margingRight: "-40px",
          }}
          startIcon={<TiArrowBack />}
        >
          <span style={{ textTransform: "capitalize", color: "#fff" }}>
            Back{" "}
          </span>
        </Button>
      </Link>
      <br />
      <br />

      <Steppers />
      <Card className={classes.root}>
        <CardContent>
          <div className="col-xl-12 col-lg-12">
            <Form>
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
                          <Label for="patientId">
                            Hospital Number{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="hospitalNumber"
                            id="hospitalNumber"
                            value={basicInfo.hospitalNumber}
                            onChange={handleInputChangeBasic}
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
                          {/* {hospitalNumStatus2===true ? (
                                                        <span className={classes.success}>{"Hospital number is OK."}</span>
                                                    ) :""} */}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="dateOfRegistration">
                            Date of Registration{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <Input
                            className="form-control"
                            type="date"
                            name="dateOfRegistration"
                            id="dateOfRegistration"
                            min="1983-12-31"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            value={basicInfo.dateOfRegistration}
                            onChange={handleInputChangeBasic}
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
                    </div>

                    <div className="row">
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="firstName">
                            First Names <span style={{ color: "red" }}> *</span>
                          </Label>
                          <Input
                            className="form-control"
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={basicInfo.firstName}
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
                          <Label>Middle Name</Label>
                          <Input
                            className="form-control"
                            type="text"
                            name="middleName"
                            id="middleName"
                            value={basicInfo.middleName}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label>
                            Last Name <span style={{ color: "red" }}> *</span>
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={basicInfo.lastName}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.lastName !== "" ? (
                            <span className={classes.error}>
                              {errors.lastName}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>
                            Sex <span style={{ color: "red" }}> *</span>
                          </Label>
                          <select
                            className="form-control"
                            name="sexId"
                            id="sexId"
                            onChange={handleInputChangeBasic}
                            value={basicInfo.sexId}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}>Select</option>
                            {genders.map((gender, index) => (
                              <option key={gender.id} value={gender.id}>
                                {gender.display}
                              </option>
                            ))}
                          </select>
                          {errors.sexId !== "" ? (
                            <span className={classes.error}>
                              {errors.sexId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-2 col-md-2">
                        <FormGroup>
                          <Label>
                            Date Of Birth{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
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

                      <div className="form-group mb-3 col-md-3">
                        <FormGroup>
                          <Label>Date </Label>
                          <input
                            className="form-control"
                            type="date"
                            name="dob"
                            min="1940-01-01"
                            id="dob"
                            max={basicInfo.dateOfRegistration}
                            value={basicInfo.dob}
                            onChange={handleDobChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-3">
                        <FormGroup>
                          <Label>Age</Label>
                          <input
                            type="number"
                            name="age"
                            className="form-control"
                            id="age"
                            min="1"
                            value={basicInfo.age}
                            disabled={ageDisabled}
                            onChange={handleAgeChange}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                      </div>
                    </div>

                    <div className={"row"}>
                      <div className="form-group mb-3 col-md-3">
                        <FormGroup>
                          <Label>Marital Status</Label>
                          <select
                            className="form-control"
                            name="maritalStatusId"
                            id="maritalStatusId"
                            onChange={handleInputChangeBasic}
                            value={basicInfo.maritalStatusId}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}>Select</option>
                            {maritalStatusOptions.map(
                              (maritalStatusOption, index) => (
                                <option
                                  key={maritalStatusOption.id}
                                  value={maritalStatusOption.id}
                                >
                                  {maritalStatusOption.display}
                                </option>
                              )
                            )}
                          </select>
                        </FormGroup>
                      </div>

                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>Employment Status </Label>
                          <select
                            className="form-control"
                            name="employmentStatusId"
                            id="employmentStatusId"
                            onChange={handleInputChangeBasic}
                            value={basicInfo.employmentStatusId}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}>Select</option>
                            {occupationOptions.map(
                              (occupationOption, index) => (
                                <option
                                  key={occupationOption.id}
                                  value={occupationOption.id}
                                >
                                  {occupationOption.display}
                                </option>
                              )
                            )}
                          </select>
                          {errors.employmentStatusId !== "" ? (
                            <span className={classes.error}>
                              {errors.employmentStatusId}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>Education Level </Label>
                          <select
                            className="form-control"
                            name="educationId"
                            id="educationId"
                            onChange={handleInputChangeBasic}
                            value={basicInfo.educationId}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}>Select</option>
                            {educationOptions.map((educationOption, index) => (
                              <option
                                key={educationOption.id}
                                value={educationOption.id}
                              >
                                {educationOption.display}
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
                          <Label for="ninNumber">
                            National Identity Number (NIN){" "}
                          </Label>
                          <input
                            className="form-control"
                            type="number"
                            name="ninNumber"
                            value={basicInfo.ninNumber}
                            id="ninNumber"
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                      </div>
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
                    Contact Details
                  </h5>
                  {showContactCard === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickContactCard}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickContactCard}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showContactCard && (
                  <div className="card-body">
                    <div className={"row"}>
                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>
                            Phone Number{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          {/* <PhoneInput
                                                      containerStyle={{width:'100%',border: "1px solid #014D88"}}
                                                      inputStyle={{width:'100%',borderRadius:'0px'}}
                                                      country={'ng'}
                                                      placeholder="(234)7099999999"
                                                      maxLength={5}
                                                      name="phoneNumber"
                                                      id="phoneNumber"
                                                      masks={{ng: '...-...-....', at: '(....) ...-....'}}
                                                      value={basicInfo.phoneNumber}
                                                    onChange={(e)=>{checkPhoneNumberBasic(e,'phoneNumber')}}
                                                    //onChange={(e)=>{handleInputChangeBasic(e,'phoneNumber')}}
                                                  /> */}
                          <Input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            onChange={(e) => {
                              handleInputChangePhoneNumber(e, "phoneNumber");
                            }}
                            value={basicInfo.phoneNumber}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            required
                          />
                          {errors.phoneNumber !== "" ? (
                            <span className={classes.error}>
                              {errors.phoneNumber}
                            </span>
                          ) : (
                            ""
                          )}
                          {/* {basicInfo.phoneNumber.length >13 ||  basicInfo.phoneNumber.length <13? (
                                                  <span className={classes.error}>{"The maximum and minimum required number is 13 digit"}</span>
                                                  ) : "" } */}
                        </FormGroup>
                      </div>

                      <div className="form-group col-md-4">
                        <FormGroup>
                          <Label>Alt. Phone Number</Label>
                          {/* <PhoneInput
                                                      containerStyle={{width:'100%',border: "1px solid #014D88"}}
                                                      inputStyle={{width:'100%',borderRadius:'0px'}}
                                                      country={'ng'}
                                                      placeholder="(234)7099999999"
                                                      value={basicInfo.altPhonenumber}
                                                      masks={{ng: '...-...-....', at: '(....) ...-....'}}
                                                      onChange={(e)=>{checkPhoneNumberBasic(e,'altPhonenumber')}}
                                                      
                                                  /> */}
                          <Input
                            type="text"
                            name="altPhonenumber"
                            id="altPhonenumber"
                            onChange={(e) => {
                              handleInputChangePhoneNumber(e, "altPhonenumber");
                            }}
                            value={basicInfo.altPhonenumber}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            required
                          />
                          {/* {basicInfo.phoneNumber.length >13 ||  basicInfo.phoneNumber.length <13? (
                                                  <span className={classes.error}>{"The maximum and minimum required number is 13 digit"}</span>
                                                  ) : "" } */}
                        </FormGroup>
                      </div>

                      <div className="form-group col-md-4">
                        <FormGroup>
                          <Label>Email</Label>
                          <input
                            className="form-control"
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChangeBasic}
                            value={basicInfo.email}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            required
                          />
                        </FormGroup>
                      </div>
                    </div>

                    <div className="row">
                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>
                            Country <span style={{ color: "red" }}> *</span>
                          </Label>
                          <select
                            className="form-control"
                            type="text"
                            name="countryId"
                            id="countryId"
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            value={basicInfo.countryId}
                            disabled
                            onChange={getStates}
                          >
                            <option value={""}>Select</option>
                            {countries.map((value, index) => (
                              <option key={index} value={value.id}>
                                {value.name}
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

                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>
                            State <span style={{ color: "red" }}> *</span>
                          </Label>
                          <select
                            className="form-control"
                            type="text"
                            name="stateId"
                            id="stateId"
                            value={basicInfo.stateId}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            onChange={getProvinces}
                          >
                            <option value="">Select</option>
                            {states.map((value, index) => (
                              <option key={index} value={value.id}>
                                {value.name}
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

                      <div className="form-group  col-md-4">
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
                            value={basicInfo.district}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            onChange={handleInputChangeBasic}
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
                    </div>

                    <div className={"row"}>
                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>
                            Street Address{" "}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="address"
                            id="address"
                            value={basicInfo.address}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {errors.address !== "" ? (
                            <span className={classes.error}>
                              {errors.address}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group  col-md-4">
                        <FormGroup>
                          <Label>Landmark</Label>
                          <input
                            className="form-control"
                            type="text"
                            name="landmark"
                            id="landmark"
                            value={basicInfo.landmark}
                            onChange={handleInputChangeBasic}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                )}
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
                    Relationship / Next Of Kin
                  </h5>
                  {showRelative === false ? (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickRelativeCard}
                      >
                        <FaPlus />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="float-end"
                        style={{ cursor: "pointer" }}
                        onClick={onClickRelativeCard}
                      >
                        <FaAngleDown />
                      </span>{" "}
                    </>
                  )}
                </div>
                {showRelative && (
                  <div className="card-body">
                    <div className="row">
                      {contacts && contacts.length > 0 && (
                        <div className="col-xl-12 col-lg-12">
                          <table style={{ width: "100%" }} className="mb-3">
                            <thead className="mb-3">
                              <tr>
                                <th>Relationship Type</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody className="mb-3">
                              {contacts.map((item, index) => {
                                return (
                                  <tr key={item.index} className="mb-3">
                                    <td>
                                      {getRelationship(item.relationshipId)}
                                    </td>
                                    <td>
                                      {item.firstName +
                                        " " +
                                        item.middleName +
                                        " " +
                                        item.lastName}
                                    </td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className="btn btn-default btn-light btn-sm editRow"
                                        onClick={() =>
                                          handleEditRelative(item, index)
                                        }
                                      >
                                        <FontAwesomeIcon icon="edit" />
                                      </button>
                                      &nbsp;&nbsp;
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm removeRow"
                                        onClick={(e) =>
                                          handleDeleteRelative(index)
                                        }
                                      >
                                        <FontAwesomeIcon icon="trash" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div className="col-xl-12 col-lg-12">
                        {showRelative && (
                          <div className="card">
                            <div className="card-body">
                              <div className="row">
                                <div className="form-group mb-3 col-md-3">
                                  <FormGroup>
                                    <Label for="relationshipType">
                                      Relationship Type{" "}
                                      <span style={{ color: "red" }}> *</span>
                                    </Label>
                                    <select
                                      className="form-control"
                                      name="relationshipId"
                                      id="relationshipId"
                                      value={relatives.relationshipId}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                      onChange={handleInputChangeRelatives}
                                    >
                                      <option value={""}>Select</option>
                                      {relationshipOptions.map(
                                        (relative, index) => (
                                          <option
                                            key={relative.id}
                                            value={relative.id}
                                          >
                                            {relative.display}
                                          </option>
                                        )
                                      )}
                                    </select>
                                    {errors.relationshipId !== "" ? (
                                      <span className={classes.error}>
                                        {errors.relationshipId}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-3">
                                  <FormGroup>
                                    <Label for="cfirstName">
                                      First Name{" "}
                                      <span style={{ color: "red" }}> *</span>
                                    </Label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      name="firstName"
                                      value={relatives.firstName}
                                      id="firstName"
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                      onChange={handleInputChangeRelatives}
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

                                <div className="form-group mb-3 col-md-3">
                                  <FormGroup>
                                    <Label>Middle Name</Label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      name="middleName"
                                      id="middleName"
                                      value={relatives.middleName}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                      onChange={handleInputChangeRelatives}
                                    />
                                    {/* {errors.cmiddleName && <p>{errors.cmiddleName.message}</p>} */}
                                  </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-3">
                                  <FormGroup>
                                    <Label>
                                      Last Name{" "}
                                      <span style={{ color: "red" }}> *</span>
                                    </Label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      name="lastName"
                                      id="lastName"
                                      value={relatives.lastName}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                      onChange={handleInputChangeRelatives}
                                    />
                                    {errors.lastName !== "" ? (
                                      <span className={classes.error}>
                                        {errors.lastName}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </FormGroup>
                                </div>
                              </div>

                              <div className="row">
                                <div className="form-group mb-3 col-md-3">
                                  <FormGroup>
                                    <Label for="contactPhoneNumber">
                                      Phone Number
                                    </Label>
                                    {/* <PhoneInput
                                                                            containerStyle={{width:'100%',border: "1px solid #014D88"}}
                                                                            inputStyle={{width:'100%',borderRadius:'0px'}}
                                                                            country={'ng'}
                                                                            placeholder="(234)7099999999"
                                                                            name="phone"
                                                                            value={relatives.phone}
                                                                            masks={{ng: '...-...-....', at: '(....) ...-....'}}
                                                                            id="phone"
                                                                           
                                                                            onChange={(e)=>{checkPhoneNumber(e,'phone')}}
                                                                        /> */}
                                    <Input
                                      type="text"
                                      name="phone"
                                      id="phone"
                                      onChange={(e) => {
                                        checkPhoneNumber(e, "phone");
                                      }}
                                      value={relatives.phone}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                      required
                                    />
                                    {errors.phone !== "" ? (
                                      <span className={classes.error}>
                                        {errors.phone}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-3">
                                  <FormGroup>
                                    <Label for="contactEmail">Email</Label>
                                    <input
                                      className="form-control"
                                      type="email"
                                      name="email"
                                      id="email"
                                      value={relatives.email}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                      onChange={handleInputChangeRelatives}
                                      required
                                    />
                                    {/* {errors.contactEmail && <p>{errors.contactEmail.message}</p>} */}
                                  </FormGroup>
                                </div>

                                <div className="form-group mb-3 col-md-3">
                                  <FormGroup>
                                    <Label for="contactAddress">Address</Label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      name="address"
                                      id="address"
                                      value={relatives.address}
                                      style={{
                                        border: "1px solid #014D88",
                                        borderRadius: "0.2rem",
                                      }}
                                      onChange={handleInputChangeRelatives}
                                    />
                                    {/* {errors.contactAddress && <p>{errors.contactAddress.message}</p>} */}
                                  </FormGroup>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-1">
                                  <MatButton
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={handleSaveRelationship}
                                  >
                                    Add
                                  </MatButton>
                                </div>

                                <div className="col-1">
                                  <MatButton
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    onClick={handleCancelSaveRelationship}
                                  >
                                    Cancel
                                  </MatButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row"></div>
                    {/* <MatButton
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            startIcon={<AddIcon />}
                                            onClick={handleAddRelative}
                                            style={{backgroundColor:'#014d88',fontWeight:"bolder"}}
                                        >
                                            Add a Relative/Next Of Kin
                                        </MatButton> */}
                    {/* </div> */}
                  </div>
                )}
              </div>
              {/* Adding First DOSAGE FORM HERE */}
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
                    Hepatitis Enrolment
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Care Entry Point{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="text"
                          name="careEntryPoint"
                          id="careEntryPoint"
                          onChange={handleInputChange}
                          value={objValues.careEntryPoint}
                        />

                        {errors.careEntryPoint !== "" ? (
                          <span className={classes.error}>
                            {errors.careEntryPoint}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Weight (Kg) <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="weight"
                            id="weight"
                            onChange={handleInputChange}
                            value={objValues.weight}
                          />
                        </InputGroup>
                        {errors.weight !== "" ? (
                          <span className={classes.error}>{errors.weight}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Height (m) <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="height"
                            id="height"
                            onChange={handleInputChange}
                            value={objValues.height}
                          />
                        </InputGroup>
                        {errors.height ? (
                          <span className={classes.error}>{errors.height}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          BMI <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="text"
                          name="bmi"
                          id="bmi"
                          onChange={handleInputChange}
                          value={Math.round(
                            objValues.weight /
                              Math.pow(objValues.height / 100, 2)
                          )}
                        />
                        {errors.bmi ? (
                          <span className={classes.error}>{errors.bmi}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Pregnant </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="pregnant"
                            id="pregnant"
                            onChange={handleInputChange}
                            value={objValues.pregnant}
                          >
                            <option value="">Select</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </Input>
                        </InputGroup>
                        {errors.pregnant !== "" ? (
                          <span className={classes.error}>
                            {errors.pregnant}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>Breast Feeding </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="breastFeeding"
                            id="breastFeeding"
                            onChange={handleInputChange}
                            value={objValues.breastFeeding}
                          >
                            <option value="">Select</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </Input>
                        </InputGroup>
                        {errors.breastFeeding !== "" ? (
                          <span className={classes.error}>
                            {errors.breastFeeding}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>History of injection drugs used </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="historyOfInjectionUsed"
                            id="historyOfInjectionUsed"
                            onChange={handleInputChange}
                            value={objValues.historyOfInjectionUsed}
                          >
                            <option value="">Select</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </Input>
                        </InputGroup>
                        {errors.historyOfInjectionUsed !== "" ? (
                          <span className={classes.error}>
                            {errors.historyOfInjectionUsed}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
              {/* END OF First DOSAGE */}

              {/* Start of screening */}
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
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Hepatitis B HBsAG{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="select"
                          name="hepatitisBHbsag"
                          id="hepatitisBHbsag"
                          onChange={handleInputChange}
                          value={objValues.hepatitisBHbsag}
                        >
                          <option value="">select</option>
                          <option value={"reactive"}>Reactive</option>
                          <option value={"non-reactive"}>Non-Reactive</option>
                        </Input>

                        {errors.hepatitisBHbsag !== "" ? (
                          <span className={classes.error}>
                            {errors.hepatitisBHbsag}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Date of first possible screening (If applicable){" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="date"
                            name="dateOfFirstPositiveScreening"
                            id="dateOfFirstPositiveScreening"
                            onChange={handleInputChange}
                            value={objValues.dateOfFirstPositiveScreening}
                          />
                        </InputGroup>
                        {errors.dateOfFirstPositiveScreening !== "" ? (
                          <span className={classes.error}>
                            {errors.dateOfFirstPositiveScreening}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Hepatitis C HCVAb
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="hepatitisCHcvab"
                            id="hepatitisCHcvab"
                            onChange={handleInputChange}
                            value={objValues.hepatitisCHcvab}
                          >
                            <option></option>
                          </Input>
                        </InputGroup>
                        {errors.hepatitisCHcvab !== "" ? (
                          <span className={classes.error}>
                            {errors.hepatitisCHcvab}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of screening */}

              {/* Start of diagnosis (hepatitis b) */}
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
                    Diagnosis (Hepatitis B)
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Date of HBV DNA test required{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <Input
                          type="select"
                          name="dateOfHbvDnaTestRequired"
                          id="dateOfHbvDnaTestRequired"
                          onChange={handleInputChange}
                          value={objValues.dateOfHbvDnaTestRequired}
                        >
                          <option value="">select</option>
                          <option value={"reactive"}>Reactive</option>
                          <option value={"non-reactive"}>Non-Reactive</option>
                        </Input>

                        {errors.dateOfHbvDnaTestRequired !== "" ? (
                          <span className={classes.error}>
                            {errors.dateOfHbvDnaTestRequired}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Date of HBV DNA sample collected{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="date"
                            name="dateOfHbvDnaSampleCollected"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            id="dateOfHbvDnaSampleCollected"
                            onChange={handleInputChange}
                            value={objValues.dateOfHbvDnaSampleCollected}
                          />
                        </InputGroup>
                        {errors.dateOfHbvDnaSampleCollected !== "" ? (
                          <span className={classes.error}>
                            {errors.dateOfHbvDnaSampleCollected}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          HBV DNA(IU/ml)<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="hbvDna"
                            id="hbvDna"
                            onChange={handleInputChange}
                            value={objValues.hbvDna}
                          >
                            <option value="">select</option>
                            <option value={"detected"}>Detected</option>
                            <option value={"undetected"}>Undetected</option>
                          </Input>
                        </InputGroup>
                        {errors.hbvDna !== "" ? (
                          <span className={classes.error}>{errors.hbvDna}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    {objValues.hbvDna === "detected" && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            HBV DNA result
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="text"
                              name="hbvDnaResult"
                              id="hbvDnaResult"
                              onChange={handleInputChange}
                              value={objValues.hbvDnaResult}
                            />
                          </InputGroup>
                          {errors.hbvDnaResult !== "" ? (
                            <span className={classes.error}>
                              {errors.hbvDnaResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          HBsAG quantification
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="hbsagQuantification"
                            id="hbsagQuantification"
                            onChange={handleInputChange}
                            value={objValues.hbsagQuantification}
                          />
                        </InputGroup>
                        {errors.hbsagQuantification !== "" ? (
                          <span className={classes.error}>
                            {errors.hbsagQuantification}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          HBeAG<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="hbeag"
                            id="hbeag"
                            onChange={handleInputChange}
                            value={objValues.hbeag}
                          >
                            <option value="">select</option>
                            <option value={"reactive"}>Reactive</option>
                            <option value={"unreactive"}>Unreactive</option>
                          </Input>
                        </InputGroup>
                        {errors.hbeag !== "" ? (
                          <span className={classes.error}>{errors.hbeag}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Ant-HDV<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="antHdv"
                            id="antHdv"
                            onChange={handleInputChange}
                            value={objValues.antHdv}
                          >
                            <option value="">select</option>
                            <option value={"reactive"}>Reactive</option>
                            <option value={"unreactive"}>Unreactive</option>
                            <option value={"not done"}>Not done</option>
                          </Input>
                        </InputGroup>
                        {errors.antHdv !== "" ? (
                          <span className={classes.error}>{errors.antHdv}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Treatment Eligible
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="treatmentEligible"
                            id="treatmentEligible"
                            onChange={handleInputChange}
                            value={objValues.treatmentEligible}
                          >
                            <option value="">select</option>
                            <option value={"yes"}>Yes</option>
                            <option value={"no"}>No</option>
                          </Input>
                        </InputGroup>
                        {errors.treatmentEligible !== "" ? (
                          <span className={classes.error}>
                            {errors.treatmentEligible}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    {Number(objValues?.sexId) === 377 && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            PMTCT Eligible
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="pmtctEligible"
                              id="pmtctEligible"
                              onChange={handleInputChange}
                              value={objValues.pmtctEligible}
                            >
                              <option value="">select</option>
                              <option value={"yes"}>Yes</option>
                              <option value={"no"}>No</option>
                            </Input>
                          </InputGroup>
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

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>
                          Comment<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="textarea"
                            name="comment"
                            id="comment"
                            onChange={handleInputChange}
                            value={objValues.comment}
                            rows="5"
                            style={{ height: "150px" }}
                          />
                        </InputGroup>
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
              </div>
              {/* End of diagnosis (hepatitis b) */}

              {/* Start of diagnosis (hepatitis c) */}
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
                    Diagnosis (Hepatitis C)
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          HCV RNA(IU/ml)<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="hcvRna"
                            id="hcvRna"
                            onChange={handleInputChange}
                            value={objValues.hcvRna}
                          >
                            <option value="">select</option>
                            <option value={"detected"}>Detected</option>
                            <option value={"undetected"}>Undetected</option>
                          </Input>
                        </InputGroup>
                        {errors.hcvRna !== "" ? (
                          <span className={classes.error}>{errors.hcvRna}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    {objValues.hcvRna === "detected" && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            HCV RNA result (IU/ml)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="text"
                              name="hcvRnaResult"
                              id="hcvRnaResult"
                              onChange={handleInputChange}
                              value={objValues.hcvRnaResult}
                            />
                          </InputGroup>
                          {errors.hcvRnaResult !== "" ? (
                            <span className={classes.error}>
                              {errors.hcvRnaResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Hepatitis Coinfection
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            multiple
                            type="select"
                            name="hepatitisCoinfection"
                            id="hepatitisCoinfection"
                            onChange={handleInputChange}
                            value={objValues.hepatitisCoinfection}
                          >
                            <option value="HBV/HCV/">HBV/HCV (UI/ml)</option>
                            <option value="HCV/HIV">HCV/HIV (UI/ml)</option>
                            <option value="HBV/HDV">HBV/HDV (UI/ml)</option>
                            <option value="HBV/HCD/HIV">
                              HBV/HCD/HIV (UI/ml)
                            </option>
                          </Input>
                        </InputGroup>
                        {errors.hepatitisCoinfection !== "" ? (
                          <span className={classes.error}>
                            {errors.hepatitisCoinfection}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>
                          Commobidities<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="hepatitisCommobidities"
                            id="hepatitisCommobidities"
                            onChange={handleInputChange}
                            value={objValues.hepatitisCommobidities}
                          />
                        </InputGroup>
                        {errors.hepatitisCommobidities !== "" ? (
                          <span className={classes.error}>
                            {errors.hepatitisCommobidities}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of diagnosis (hepatitis c) */}

              {/* Start of ancillary testing */}
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
                    Ancillary testing/Clinical Parameter
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="form-group mb-2 col-md-6">
                      <FormGroup>
                        <Label>
                          Check box if applicable{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <div className="radio">
                          <label>
                            <input
                              type="checkbox"
                              id="astChecked"
                              name="astChecked"
                              checked={objValues.astChecked}
                              onChange={handleAncillaryInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            AST
                          </label>
                        </div>
                        <div className="radio">
                          <label>
                            <input
                              type="checkbox"
                              id="altChecked"
                              name="altChecked"
                              checked={objValues.altChecked}
                              onChange={handleAncillaryInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            ALT
                          </label>
                        </div>
                        <div className="radio">
                          <label>
                            <input
                              type="checkbox"
                              id="pstChecked"
                              name="pstChecked"
                              checked={objValues.pstChecked}
                              onChange={handleAncillaryInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            PST
                          </label>
                        </div>
                      </FormGroup>
                    </div>

                    {objValues.astChecked && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            AST result (IU/ml)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="text"
                              name="astResult"
                              id="astResult"
                              onChange={handleInputChange}
                              value={objValues.astResult}
                            />
                          </InputGroup>
                          {errors.astResult !== "" ? (
                            <span className={classes.error}>
                              {errors.astResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}

                    {objValues.altChecked && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            ALT result (IU/ml)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="text"
                              name="altResult"
                              id="altResult"
                              onChange={handleInputChange}
                              value={objValues.altResult}
                            />
                          </InputGroup>
                          {errors.altResult !== "" ? (
                            <span className={classes.error}>
                              {errors.altResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}

                    {objValues.pstChecked && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            PST result (IU/ml)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="text"
                              name="pstResult"
                              id="pstResult"
                              onChange={handleInputChange}
                              value={objValues.pstResult}
                            />
                          </InputGroup>
                          {errors.pstResult !== "" ? (
                            <span className={classes.error}>
                              {errors.pstResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Bilibrubin: Total (μmol/L)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="bilibrubinTotal"
                            id="bilibrubinTotal"
                            onChange={handleInputChange}
                            value={objValues.bilibrubinTotal}
                          />
                        </InputGroup>
                        {errors.bilibrubinTotal !== "" ? (
                          <span className={classes.error}>
                            {errors.bilibrubinTotal}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Bilibrubin: Direct (μmol/L)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="bilibrubinDirect"
                            id="bilibrubinDirect"
                            onChange={handleInputChange}
                            value={objValues.bilibrubinDirect}
                          />
                        </InputGroup>
                        {errors.bilibrubinDirect !== "" ? (
                          <span className={classes.error}>
                            {errors.bilibrubinDirect}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Bilibrubin: Albumin (μmol/L)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="bilibrubinAlbumin"
                            id="bilibrubinAlbumin"
                            onChange={handleInputChange}
                            value={objValues.bilibrubinAlbumin}
                          />
                        </InputGroup>
                        {errors.bilibrubinAlbumin !== "" ? (
                          <span className={classes.error}>
                            {errors.bilibrubinAlbumin}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          APRI Score<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="apriScore"
                            id="apriScore"
                            onChange={handleInputChange}
                            value={objValues.apriScore}
                          />
                        </InputGroup>
                        {errors.apriScore !== "" ? (
                          <span className={classes.error}>
                            {errors.apriScore}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          FIB-4<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="fib4"
                            id="fib4"
                            onChange={handleInputChange}
                            value={objValues.fib4}
                          />
                        </InputGroup>
                        {errors.fib4 !== "" ? (
                          <span className={classes.error}>{errors.fib4}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Prothrombin time/INR
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="prothrombinTime"
                            id="prothrombinTime"
                            onChange={handleInputChange}
                            value={objValues.prothrombinTime}
                          />
                        </InputGroup>
                        {errors.prothrombinTime !== "" ? (
                          <span className={classes.error}>
                            {errors.prothrombinTime}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Urea<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="urea"
                            id="urea"
                            onChange={handleInputChange}
                            value={objValues.urea}
                          />
                        </InputGroup>
                        {errors.urea !== "" ? (
                          <span className={classes.error}>{errors.urea}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Creatinine (μmol/L)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="creatinine"
                            id="creatinine"
                            onChange={handleInputChange}
                            value={objValues.creatinine}
                          />
                        </InputGroup>
                        {errors.creatinine !== "" ? (
                          <span className={classes.error}>
                            {errors.creatinine}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Ultrasound scan
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="ultrasoundScan"
                            id="ultrasoundScan"
                            onChange={handleInputChange}
                            value={objValues.ultrasoundScan}
                          />
                        </InputGroup>
                        {errors.ultrasoundScan !== "" ? (
                          <span className={classes.error}>
                            {errors.ultrasoundScan}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          AFP (ng/ml)<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="afp"
                            id="afp"
                            onChange={handleInputChange}
                            value={objValues.afp}
                          />
                        </InputGroup>
                        {errors.afp !== "" ? (
                          <span className={classes.error}>{errors.afp}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          FibroScan
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="fibroScan"
                            id="fibroScan"
                            onChange={handleInputChange}
                            value={objValues.fibroScan}
                          />
                        </InputGroup>
                        {errors.fibroScan !== "" ? (
                          <span className={classes.error}>
                            {errors.fibroScan}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Not done (kpa)<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="notDone"
                            id="notDone"
                            onChange={handleInputChange}
                            value={objValues.notDone}
                          />
                        </InputGroup>
                        {errors.notDone !== "" ? (
                          <span className={classes.error}>
                            {errors.notDone}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          CT scan<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="notDone"
                            id="notDone"
                            onChange={handleInputChange}
                            value={objValues.notDone}
                          />
                        </InputGroup>
                        {errors.notDone !== "" ? (
                          <span className={classes.error}>
                            {errors.notDone}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-2 col-md-6">
                      <FormGroup>
                        <Label>
                          Ascites<span style={{ color: "red" }}> *</span>
                        </Label>
                        <div className="radio">
                          <label>
                            <input
                              type="radio"
                              value="yes"
                              checked={objValues.acitesChecked === "yes"}
                              name="acitesChecked"
                              onChange={handleInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            Yes
                          </label>
                        </div>
                        <div className="radio">
                          <label>
                            <input
                              type="radio"
                              value="no"
                              name="acitesChecked"
                              checked={objValues.acitesChecked === "no"}
                              onChange={handleInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            No
                          </label>
                        </div>
                      </FormGroup>
                    </div>

                    {objValues.acitesChecked === "yes" && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Ascites value
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="acitesValue"
                              id="acitesValue"
                              onChange={handleInputChange}
                              value={objValues.acitesValue}
                            >
                              <option value="">select</option>
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="massive/gross">
                                Massive/Gross
                              </option>
                            </Input>
                          </InputGroup>
                          {errors.acitesValue !== "" ? (
                            <span className={classes.error}>
                              {errors.acitesValue}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Encephalopathy<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="encephalopathy"
                            id="encephalopathy"
                            onChange={handleInputChange}
                            value={objValues.encephalopathy}
                          >
                            <option value="">select</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </Input>
                        </InputGroup>
                        {errors.encephalopathy !== "" ? (
                          <span className={classes.error}>
                            {errors.encephalopathy}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Child pugh score
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="childPughScore"
                            id="childPughScore"
                            onChange={handleInputChange}
                            value={objValues.childPughScore}
                          />
                        </InputGroup>
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
                              {
                                fldName: "No Fibrosis",
                                fldValue: "NO_FIBROSIS",
                              },
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

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Staging date of liver biopsy
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="date"
                            name="stagingDateOfLiverBiopsy"
                            id="stagingDateOfLiverBiopsy"
                            min="1983-12-31"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            onChange={handleInputChange}
                            value={objValues.stagingDateOfLiverBiopsy}
                          />
                        </InputGroup>
                        {errors.stagingDateOfLiverBiopsy !== "" ? (
                          <span className={classes.error}>
                            {errors.stagingDateOfLiverBiopsy}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>Diagnosis</Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="diagnosis"
                            id="diagnosis"
                            onChange={handleInputChange}
                            value={objValues.diagnosis}
                          >
                            <option value="">Select</option>
                            <option value="no fibrosis">No Fibrosis</option>
                            <option value="fibrosis">Fibrosis</option>
                            <option value="cirrhosis">cirrhosis</option>
                            <option value="hcc">HCC</option>
                          </Input>
                        </InputGroup>
                        {errors.diagnosis !== "" ? (
                          <span className={classes.error}>
                            {errors.diagnosis}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of ancillary testing */}

              {/* Start ofHepatitis B treatment */}
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

                <div className="card-body">
                  <div className="row">
                    <div className="form-group mb-2 col-md-6">
                      <FormGroup>
                        <Label>
                          Check box if applicable{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <div className="radio">
                          <label>
                            <input
                              type="checkbox"
                              id="astChecked"
                              name="astChecked"
                              checked={objValues.astChecked}
                              onChange={handleAncillaryInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            AST
                          </label>
                        </div>
                        <div className="radio">
                          <label>
                            <input
                              type="checkbox"
                              id="altChecked"
                              name="altChecked"
                              checked={objValues.altChecked}
                              onChange={handleAncillaryInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            ALT
                          </label>
                        </div>
                        <div className="radio">
                          <label>
                            <input
                              type="checkbox"
                              id="pstChecked"
                              name="pstChecked"
                              checked={objValues.pstChecked}
                              onChange={handleAncillaryInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            PST
                          </label>
                        </div>
                      </FormGroup>
                    </div>

                    {objValues.astChecked && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            AST result (IU/ml)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="text"
                              name="astResult"
                              id="astResult"
                              onChange={handleInputChange}
                              value={objValues.astResult}
                            />
                          </InputGroup>
                          {errors.astResult !== "" ? (
                            <span className={classes.error}>
                              {errors.astResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}

                    {objValues.altChecked && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            ALT result (IU/ml)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="text"
                              name="altResult"
                              id="altResult"
                              onChange={handleInputChange}
                              value={objValues.altResult}
                            />
                          </InputGroup>
                          {errors.altResult !== "" ? (
                            <span className={classes.error}>
                              {errors.altResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}

                    {objValues.pstChecked && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            PST result (IU/ml)
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="text"
                              name="pstResult"
                              id="pstResult"
                              onChange={handleInputChange}
                              value={objValues.pstResult}
                            />
                          </InputGroup>
                          {errors.pstResult !== "" ? (
                            <span className={classes.error}>
                              {errors.pstResult}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Bilibrubin: Total (μmol/L)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="bilibrubinTotal"
                            id="bilibrubinTotal"
                            onChange={handleInputChange}
                            value={objValues.bilibrubinTotal}
                          />
                        </InputGroup>
                        {errors.bilibrubinTotal !== "" ? (
                          <span className={classes.error}>
                            {errors.bilibrubinTotal}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Bilibrubin: Direct (μmol/L)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="bilibrubinDirect"
                            id="bilibrubinDirect"
                            onChange={handleInputChange}
                            value={objValues.bilibrubinDirect}
                          />
                        </InputGroup>
                        {errors.bilibrubinDirect !== "" ? (
                          <span className={classes.error}>
                            {errors.bilibrubinDirect}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Bilibrubin: Albumin (μmol/L)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="bilibrubinAlbumin"
                            id="bilibrubinAlbumin"
                            onChange={handleInputChange}
                            value={objValues.bilibrubinAlbumin}
                          />
                        </InputGroup>
                        {errors.bilibrubinAlbumin !== "" ? (
                          <span className={classes.error}>
                            {errors.bilibrubinAlbumin}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          APRI Score<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="apriScore"
                            id="apriScore"
                            onChange={handleInputChange}
                            value={objValues.apriScore}
                          />
                        </InputGroup>
                        {errors.apriScore !== "" ? (
                          <span className={classes.error}>
                            {errors.apriScore}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          FIB-4<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="fib4"
                            id="fib4"
                            onChange={handleInputChange}
                            value={objValues.fib4}
                          />
                        </InputGroup>
                        {errors.fib4 !== "" ? (
                          <span className={classes.error}>{errors.fib4}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Prothrombin time/INR
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="prothrombinTime"
                            id="prothrombinTime"
                            onChange={handleInputChange}
                            value={objValues.prothrombinTime}
                          />
                        </InputGroup>
                        {errors.prothrombinTime !== "" ? (
                          <span className={classes.error}>
                            {errors.prothrombinTime}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Urea<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="urea"
                            id="urea"
                            onChange={handleInputChange}
                            value={objValues.urea}
                          />
                        </InputGroup>
                        {errors.urea !== "" ? (
                          <span className={classes.error}>{errors.urea}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Creatinine (μmol/L)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="creatinine"
                            id="creatinine"
                            onChange={handleInputChange}
                            value={objValues.creatinine}
                          />
                        </InputGroup>
                        {errors.creatinine !== "" ? (
                          <span className={classes.error}>
                            {errors.creatinine}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Ultrasound scan
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="ultrasoundScan"
                            id="ultrasoundScan"
                            onChange={handleInputChange}
                            value={objValues.ultrasoundScan}
                          />
                        </InputGroup>
                        {errors.ultrasoundScan !== "" ? (
                          <span className={classes.error}>
                            {errors.ultrasoundScan}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          AFP (ng/ml)<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="afp"
                            id="afp"
                            onChange={handleInputChange}
                            value={objValues.afp}
                          />
                        </InputGroup>
                        {errors.afp !== "" ? (
                          <span className={classes.error}>{errors.afp}</span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          FibroScan (Kpa)
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="fibroScan"
                            id="fibroScan"
                            onChange={handleInputChange}
                            value={objValues.fibroScan}
                          />
                        </InputGroup>
                        {errors.fibroScan !== "" ? (
                          <span className={classes.error}>
                            {errors.fibroScan}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Not done (kpa)<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="notDone"
                            id="notDone"
                            onChange={handleInputChange}
                            value={objValues.notDone}
                          />
                        </InputGroup>
                        {errors.notDone !== "" ? (
                          <span className={classes.error}>
                            {errors.notDone}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          CT scan<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="notDone"
                            id="notDone"
                            onChange={handleInputChange}
                            value={objValues.notDone}
                          />
                        </InputGroup>
                        {errors.notDone !== "" ? (
                          <span className={classes.error}>
                            {errors.notDone}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-2 col-md-6">
                      <FormGroup>
                        <Label>
                          Ascites<span style={{ color: "red" }}> *</span>
                        </Label>
                        <div className="radio">
                          <label>
                            <input
                              type="radio"
                              value="yes"
                              checked={objValues.acitesChecked === "yes"}
                              name="acitesChecked"
                              onChange={handleInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            Yes
                          </label>
                        </div>
                        <div className="radio">
                          <label>
                            <input
                              type="radio"
                              value="no"
                              name="acitesChecked"
                              checked={objValues.acitesChecked === "no"}
                              onChange={handleInputChange}
                              style={{
                                border: "1px solid #014D88",
                                borderRadius: "0.2rem",
                              }}
                            />{" "}
                            No
                          </label>
                        </div>
                      </FormGroup>
                    </div>

                    {objValues.acitesChecked === "yes" && (
                      <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                          <Label>
                            Ascites value
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <InputGroup>
                            <Input
                              type="select"
                              name="acitesValue"
                              id="acitesValue"
                              onChange={handleInputChange}
                              value={objValues.acitesValue}
                            >
                              <option value="">select</option>
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="massive/gross">
                                Massive/Gross
                              </option>
                            </Input>
                          </InputGroup>
                          {errors.acitesValue !== "" ? (
                            <span className={classes.error}>
                              {errors.acitesValue}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Encephalopathy<span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="encephalopathy"
                            id="encephalopathy"
                            onChange={handleInputChange}
                            value={objValues.encephalopathy}
                          >
                            <option value="">select</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </Input>
                        </InputGroup>
                        {errors.encephalopathy !== "" ? (
                          <span className={classes.error}>
                            {errors.encephalopathy}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Child pugh score
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            name="childPughScore"
                            id="childPughScore"
                            onChange={handleInputChange}
                            value={objValues.childPughScore}
                          />
                        </InputGroup>
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
                              {
                                fldName: "No Fibrosis",
                                fldValue: "NO_FIBROSIS",
                              },
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

                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                        <Label>
                          Staging date of liver biopsy
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                        <InputGroup>
                          <Input
                            type="date"
                            name="stagingDateOfLiverBiopsy"
                            id="stagingDateOfLiverBiopsy"
                            min="1983-12-31"
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            onChange={handleInputChange}
                            value={objValues.stagingDateOfLiverBiopsy}
                          />
                        </InputGroup>
                        {errors.stagingDateOfLiverBiopsy !== "" ? (
                          <span className={classes.error}>
                            {errors.stagingDateOfLiverBiopsy}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-12">
                      <FormGroup>
                        <Label>Diagnosis</Label>
                        <InputGroup>
                          <Input
                            type="select"
                            name="diagnosis"
                            id="diagnosis"
                            onChange={handleInputChange}
                            value={objValues.diagnosis}
                          >
                            <option value="">Select</option>
                            <option value="no fibrosis">No Fibrosis</option>
                            <option value="fibrosis">Fibrosis</option>
                            <option value="cirrhosis">cirrhosis</option>
                            <option value="hcc">HCC</option>
                          </Input>
                        </InputGroup>
                        {errors.diagnosis !== "" ? (
                          <span className={classes.error}>
                            {errors.diagnosis}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of Hepatitis B treatment */}
              {saving ? <Spinner /> : ""}

              <br />
              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={disabledAgeBaseOnAge}
                style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
              >
                {!saving ? (
                  <span style={{ textTransform: "capitalize" }}>Save</span>
                ) : (
                  <span style={{ textTransform: "capitalize" }}>Saving...</span>
                )}
              </MatButton>

              <MatButton
                variant="contained"
                className={classes.button}
                startIcon={<CancelIcon />}
                style={{ backgroundColor: "#992E62" }}
                onClick={handleCancel}
              >
                <span style={{ textTransform: "capitalize", color: "#fff" }}>
                  Cancel
                </span>
              </MatButton>
            </Form>
          </div>
        </CardContent>
      </Card>
      <Modal
        show={open}
        toggle={toggle}
        className="fade"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Notification!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you Sure of the Age entered?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={toggle}
            style={{ backgroundColor: "#014d88", color: "#fff" }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserRegistration;
