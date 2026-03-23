import React, { useEffect, useMemo, useState } from "react";
import MatButton from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Input } from "reactstrap";
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
import { useValidateOpdFormValuesHook } from "../../../formSchemas/followupFormValidation";
import { toast } from "react-toastify";
import { fetchCurrentFacility } from "../../../services/fetchCurrentFacility";
import { useSaveFollowup } from "../../../hooks/useSaveFollowup";

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
    marginTop: "10px",
  },
  success: {
    color: "#4BB543 ",
    fontSize: "11px",
  },
}));

const FollowupCreate = (props) => {
  const classes = useStyles();
  const [currentFacId, setCurrentFacId] = useState(null);

  const ALL_OPTIONS = [
    "Triage",
    "HIV",
    "HTS",
    "PrEP",
    "Consultation",
    "Laboratory",
    "Pharmacy",
    "PMTCT",
  ];

  const onSubmit = (values) => {
    const { facilityId, moduleServiceName, moduleServiceCode, encounter } =
      values;

    const formattedData = {
      facilityId: parseInt(facilityId),
      moduleServiceName,
      moduleServiceCode,
      encounterType: encounter,
    };
    mutate(formattedData);
  };

  const { formik } = useValidateOpdFormValuesHook(onSubmit, "create", {
    facilityId: "",
    moduleServiceName: "",
    moduleServiceCode: "",
    encounter: "test",
  });

  const { mutate, isLoading } = useSaveFollowup(formik, props);
  const calcServiceCode = useMemo(
    () =>
      formik?.values?.moduleServiceName +
      (formik?.values?.moduleServiceName && "_code"),
    [formik?.values?.moduleServiceName],
  );
  useEffect(async () => {
    const facId = await fetchCurrentFacility(
      history?.location?.state?.patientId,
    );
    setCurrentFacId(facId?.applicationUserOrganisationUnits[0]);
  }, []);

  return (
    <Card className={classes.root}>
      <CardContent>
        <div className="col-xl-12 col-lg-12">
          <form onSubmit={formik.handleSubmit}>
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
                  Setting{" "}
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
                          <Label for="opdVisitId">Facility ID</Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <select
                            className="form-control"
                            type="text"
                            name="facilityId"
                            id="facilityId"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik?.values?.facilityId}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Choose Facility ID</option>
                            <option value={currentFacId?.organisationUnitId}>
                              {currentFacId?.organisationUnitName}
                            </option>
                          </select>
                          {formik.touched?.facilityId &&
                            formik?.errors?.facilityId !== "" && (
                              <span className={classes.error}>
                                {formik?.errors?.facilityId}
                              </span>
                            )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="moduleServiceName">Service Name</Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <select
                            className="form-control"
                            type="text"
                            name="moduleServiceName"
                            id="moduleServiceName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik?.values?.moduleServiceName}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value="">Select Service Area</option>
                            {ALL_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          {/* <Input
                            className="form-control"
                            type="text"
                            name="moduleServiceName"
                            id="moduleServiceName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik?.values?.moduleServiceName}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          /> */}
                          {formik.touched?.moduleServiceName &&
                            formik?.errors?.moduleServiceName !== "" && (
                              <span className={classes.error}>
                                {formik?.errors?.moduleServiceName}
                              </span>
                            )}
                        </FormGroup>
                      </div>
                      <div
                        style={{ display: "none" }}
                        className="form-group mb-3 col-md-4"
                      >
                        <FormGroup>
                          <Label for="facilityId">Service Code</Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <Input
                            disabled
                            className="form-control"
                            type="text"
                            name="moduleServiceCode"
                            id="moduleServiceCode"
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={calcServiceCode}
                          />
                          {formik.touched?.moduleServiceCode &&
                            formik?.errors?.moduleServiceCode !== "" && (
                              <span className={classes.error}>
                                {formik?.errors?.moduleServiceCode}
                              </span>
                            )}
                        </FormGroup>
                      </div>
                      <div
                        style={{ display: "none" }}
                        className="form-group mb-3 col-md-4"
                      >
                        <FormGroup>
                          <Label for="encounter">Encounter Type</Label>
                          <span style={{ color: "red" }}> *</span>{" "}
                          <Input
                            className="form-control"
                            type="text"
                            name="encounter"
                            id="encounter"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik?.values?.encounter}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.touched?.encounter &&
                            formik?.errors?.encounter !== "" && (
                              <span className={classes.error}>
                                {formik?.errors?.encounter}
                              </span>
                            )}
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? <Spinner /> : ""}
            <br />
            <div className="d-flex justify-content-end">
              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                // onClick={handleSubmit}
                style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {isLoading ? "Please wait" : "Submit"}
                </span>
              </MatButton>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowupCreate;
