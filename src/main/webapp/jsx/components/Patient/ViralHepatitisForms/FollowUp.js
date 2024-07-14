import React from "react";
import MatButton from "@material-ui/core/Button";
import { FormGroup, Label, Spinner, Form } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import { useValidateFollowupFormValuesHook } from "../../../formSchemas/form1ValidationSchema";
import { ArrowForward } from "@material-ui/icons";
import { ImportantString } from "./DashboardForm2";
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
export const getLiverBiopsyTestOptions = () => {
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
  />;
};

const FollowupForm = () => {
  const onSubmitHandler = (values) => {};
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

  const classes = useStyles();
  const { formik } = useValidateFollowupFormValuesHook(onSubmitHandler);
  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <div className="col-xl-12 col-lg-12">
            <Form onSubmit={formik.handleSubmit}>
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
                    Preliminary
                  </h5>
                </div>

                <div className="card-body">
                  <div className="basic-form">
                    <div className="row">
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="dateOfVisit">
                            Date of visit{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="date"
                            name="dateOfVisit"
                            id="dateOfVisit"
                            value={formik.initialValues.dateOfVisit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.dateOfVisit !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.dateOfVisit}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="bloodPressure">
                            Blood pressure (mmHg)
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="bloodPressure"
                            id="bloodPressure"
                            value={formik.initialValues.bloodPressure}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.bloodPressure !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.bloodPressure}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="weight">
                            Weight <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="weight"
                            id="weight"
                            value={formik.initialValues.weight}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.weight !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.weight}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="height">
                            Height <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="height"
                            id="height"
                            value={formik.initialValues.height}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.height !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.height}
                            </span>
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
                            type="text"
                            name="bmi"
                            id="bmi"
                            value={formik.initialValues.bmi}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.bmi !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.bmi}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hbeAg">HbeAG</Label>
                          <select
                            className="form-control"
                            name="hbeAg"
                            id="hbeAg"
                            onChange={formik.handleChange}
                            value={formik.values.hbeAg}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}>Select</option>
                            <option value={"reactive"}>Reactive</option>
                            <option value={"non-reactive"}>Non Reactive</option>
                          </select>
                          {formik.errors.hbeAg !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.hbeAg}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="hbvDna">HBV DNA (IU/mL)</Label>
                          <select
                            className="form-control"
                            name="hbvDna"
                            id="hbvDna"
                            onChange={formik.handleChange}
                            value={formik.values.hbvDna}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          >
                            <option value={""}>Select</option>
                            <option value={"detected"}>Detected</option>
                            <option value={"undetected"}>Undetected</option>
                          </select>
                          {formik.errors.hbvDna !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.hbvDna}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="landmark">HBsAG Quantification</Label>
                          <input
                            className="form-control"
                            type="text"
                            name="hbsAgQuantification"
                            id="hbsAgQuantification"
                            value={formik.values.hbsAgQuantification}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.hbsAgQuantification ? (
                            <span className={classes.error}>
                              {formik.errors.hbsAgQuantification}
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
                    Ancillary testing/Clinical parameters
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="ast">AST (UI/mL)</Label>
                        <select
                          className="form-control"
                          name="ast"
                          id="ast"
                          onChange={formik.handleChange}
                          value={formik.values.ast}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value={""}>Select</option>
                          <option value={"yes"}>Yes</option>
                          <option value={"no"}>No</option>
                        </select>
                        {formik.errors.ast !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.ast}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="alt">ALT (UI/mL)</Label>
                        <select
                          className="form-control"
                          name="alt"
                          id="alt"
                          onChange={formik.handleChange}
                          value={formik.values.alt}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value={""}>Select</option>
                          <option value={"yes"}>Yes</option>
                          <option value={"no"}>No</option>
                        </select>
                        {formik.errors.alt !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.alt}
                          </span>
                        ) : null}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="plt">PLT (mm3)</Label>
                        <select
                          className="form-control"
                          name="plt"
                          id="plt"
                          onChange={formik.handleChange}
                          value={formik.values.plt}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value={""}>Select</option>
                          <option value={"yes"}>Yes</option>
                          <option value={"no"}>No</option>
                        </select>
                        {formik.errors.plt !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.plt}
                          </span>
                        ) : null}
                      </FormGroup>
                    </div>
                  </div>
                  <div className="row">
                    {formik.values.ast === "yes" && (
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
                            value={formik.values.astValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.astValue !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.astValue}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}
                    {formik.values.alt === "yes" && (
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="altValue">
                            Input ALT value{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="altValue"
                            id="altValue"
                            value={formik.values.altValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.altValue !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.altValue}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}
                    {formik.values.pst === "yes" && (
                      <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                          <Label for="pstValue">
                            Input PST value{" "}
                            <span style={{ color: "red" }}> *</span>{" "}
                          </Label>
                          <input
                            className="form-control"
                            type="text"
                            name="pstValue"
                            id="pstValue"
                            value={formik.values.pstValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{
                              border: "1px solid #014D88",
                              borderRadius: "0.2rem",
                            }}
                          />
                          {formik.errors.pstValue !== "" ? (
                            <span className={classes.error}>
                              {formik.errors.pstValue}
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </div>
                    )}
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="totalBilirubin">
                          Total Bilirubin{" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="totalBilirubin"
                          id="totalBilirubin"
                          value={formik.values.totalBilirubin}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.totalBilirubin !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.totalBilirubin}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="albumin">
                          Albumin <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="albumin"
                          id="albumin"
                          value={formik.values.albumin}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.albumin !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.albumin}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="directBilirubin">Direct Bilirubin </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="directBilirubin"
                          id="directBilirubin"
                          value={formik.values.directBilirubin}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.directBilirubin !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.directBilirubin}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="apriScore">APRI score </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="apriScore"
                          id="apriScore"
                          value={formik.values.apriScore}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.apriScore !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.apriScore}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="fib4">FIB-4</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="fib4"
                          id="fib4"
                          value={formik.values.fib4}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.fib4 !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.fib4}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="prothrombinTime">
                          Prothrombin time/INR
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="prothrombinTime"
                          id="prothrombinTime"
                          value={formik.values.prothrombinTime}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.prothrombinTime !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.prothrombinTime}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="urea">Urea (mg/dl)</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="urea"
                          id="urea"
                          value={formik.values.urea}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.urea !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.urea}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="creatinine">Creatinine (μmol/L)</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="creatinine"
                          id="creatinine"
                          value={formik.values.creatinine}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.creatinine !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.creatinine}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="creatinine">AFP (ng/ml)</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="afp"
                          id="afp"
                          value={formik.values.afp}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.afp !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.afp}
                          </span>
                        ) : null}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="fibroscan">Fibroscan (kPa)</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="fibroscan"
                          id="fibroscan"
                          value={formik.values.fibroscan}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.fibroscan !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.fibroscan}
                          </span>
                        ) : null}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="ultrasoundScan">Ultrasound scan</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="ultrasoundScan"
                          id="ultrasoundScan"
                          value={formik.values.ultrasoundScan}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.ultrasoundScan !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.ultrasoundScan}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="ctScan">CT scan</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="ctScan"
                          id="ctScan"
                          value={formik.values.ctScan}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.ctScan !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.ctScan}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="acites">Ascites</Label>
                        <select
                          className="form-control"
                          name="acites"
                          id="acites"
                          onChange={formik.handleChange}
                          value={formik.values.acites}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value={""}>Select</option>
                          <option value={"yes"}>Yes</option>
                          <option value={"no"}>No</option>
                        </select>
                        {formik.errors.acites !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.acites}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="severityOfAscites">
                          Severity of ascites
                        </Label>
                        <select
                          className="form-control"
                          name="severityOfAscites"
                          id="severityOfAscites"
                          onChange={formik.handleChange}
                          value={formik.values.severityOfAscites}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value={""}>Select</option>
                          <option value={"mild"}>Mild</option>
                          <option value={"moderate"}>Moderate</option>
                          <option value={"massive/gross"}>Massive/Gross</option>
                        </select>
                        {formik.errors.severityOfAscites !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.severityOfAscites}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="ascitesLevel">
                          Grade of Encephalopathy
                        </Label>
                        <select
                          className="form-control"
                          name="gradeOfEncephalopathy"
                          id="gradeOfEncephalopathy"
                          onChange={formik.handleChange}
                          value={formik.values.gradeOfEncephalopathy}
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
                        {formik.errors.gradeOfEncephalopathy !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.gradeOfEncephalopathy}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="childPughScore">Child pugh score</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="childPughScore"
                          id="childPughScore"
                          value={formik.values.childPughScore}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.childPughScore !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.childPughScore}
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

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="stagingDateForLiverBiopsy">
                          Staging date for liver{" "}
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="date"
                          name="stagingDateForLiverBiopsy"
                          id="stagingDateForLiverBiopsy"
                          value={formik.values.stagingDateForLiverBiopsy}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.stagingDateForLiverBiopsy !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.stagingDateForLiverBiopsy}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="diagnosis">Diagnosis</Label>
                        <select
                          className="form-control"
                          name="diagnosis"
                          id="diagnosis"
                          onChange={formik.handleChange}
                          value={formik.values.diagnosis}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        >
                          <option value={""}>Select</option>
                          <option value={"no fibrosis"}> No Fibrosis</option>
                          <option value={"fibrosis"}>Fibrosis</option>
                          <option value={"cirrhosis"}>Cirrhosis</option>
                          <option value={"hcc"}>HCC</option>
                        </select>
                        {formik.errors.diagnosis !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.diagnosis}
                          </span>
                        ) : (
                          ""
                        )}
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
                    Appointment
                  </h5>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="treatmentRegimen">
                          Treatment regimen
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="treatmentRegimen"
                          id="treatmentRegimen"
                          value={formik.initialValues.treatmentRegimen}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.treatmentRegimen !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.treatmentRegimen}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="nextAppointment">
                          Next appointment
                          <span style={{ color: "red" }}> *</span>{" "}
                        </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="nextAppointment"
                          id="nextAppointment"
                          value={formik.initialValues.nextAppointment}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.nextAppointment !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.dateOfHepatitisBPositiveScreening}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                      <FormGroup>
                        <Label for="clinicalName">Clinical Name </Label>
                        <input
                          className="form-control"
                          type="text"
                          name="clinicalName"
                          id="clinicalName"
                          value={formik.initialValues.clinicalName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                        />
                        {formik.errors.clinicalName !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.clinicalName}
                          </span>
                        ) : (
                          ""
                        )}
                      </FormGroup>
                    </div>

                    <div className="form-group mb-3 col-md-4-12">
                      <FormGroup>
                        <Label for="remark">Remark</Label>
                        <textarea
                          className="form-control"
                          name="remark"
                          id="remark"
                          onChange={formik.handleChange}
                          value={formik.values.remark}
                          cols="50"
                          rows="30"
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                            height: "120px",
                          }}
                        />
                        {formik.errors.remark !== "" ? (
                          <span className={classes.error}>
                            {formik.errors.remark}
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
              <div className="d-flex justify-content-end">
                <MatButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<ArrowForward />}
                  style={{ backgroundColor: "#014d88", fontWeight: "bolder" }}
                >
                  <span style={{ textTransform: "capitalize" }}>Submit</span>
                </MatButton>
              </div>
            </Form>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FollowupForm;
