import React, { useState } from "react";
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
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import { Collapse, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useValidateSummaryValuesHook } from "../../../formSchemas/summaryFormsValidationSchema";

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

const HbvType4 = () => {
  const classes = useStyles();
  const { formik } = useValidateSummaryValuesHook();
  const [isDropdownsOpen, setIsDropdownsOpen] = useState({
    hepatitisBDropdown: true,
    hepatitisCDropdown: true,
    coInfectionDropdown: true,
  });
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
                    HBegAg +ve
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
                      Men
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
                              <Label for="maleNineAndUnder">≤ 9 years</Label>
                              <select
                                className="form-control"
                                name="maleNineAndUnder"
                                id="maleNineAndUnder"
                                onChange={formik.handleChange}
                                value={formik.values.maleNineAndUnder}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>Select</option>
                                <option value={""}>option 1</option>
                                <option value={""}>option 2</option>
                              </select>
                              {formik.errors.maleNineAndUnder !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.maleNineAndUnder}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>

                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="maleTen2Fourteen">
                                10 - 14 years
                              </Label>
                              <select
                                className="form-control"
                                name="maleTen2Fourteen"
                                id="maleTen2Fourteen"
                                onChange={formik.handleChange}
                                value={formik.values.maleTen2Fourteen}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>Select</option>
                                <option value={""}>option 1</option>
                                <option value={""}>option 2</option>
                                <option value={""}>option 3</option>
                              </select>
                              {formik.errors.maleTen2Fourteen !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.maleTen2Fourteen}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>

                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="maleFifteenAndAbove">
                                ≥ 15 years
                              </Label>
                              <select
                                className="form-control"
                                name="maleFifteenAndAbove"
                                id="maleFifteenAndAbove"
                                onChange={formik.handleChange}
                                value={formik.values.maleFifteenAndAbove}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>Select</option>
                                <option value={""}>option 1</option>
                                <option value={""}>option 2</option>
                              </select>
                              {formik.errors.maleFifteenAndAbove !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.maleFifteenAndAbove}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>

                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="maleTotal"> Total</Label>
                              <input
                                className="form-control"
                                type="text"
                                name="maleTotal"
                                id="maleTotal"
                                value={formik.values.maleTotal}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {formik.errors.maleTotal ? (
                                <span className={classes.error}>
                                  {formik.errors.maleTotal}
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
                      Women
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
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="femaleNineAndUnder"> ≤ 9 years</Label>
                              <select
                                className="form-control"
                                name="femaleNineAndUnder"
                                id="femaleNineAndUnder"
                                onChange={formik.handleChange}
                                value={formik.values.femaleNineAndUnder}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>Select</option>
                                <option value={""}>option 1</option>
                                <option value={""}>option 2</option>
                              </select>
                              {formik.errors.femaleNineAndUnder !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.femaleNineAndUnder}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>

                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="femaleTen2Fourteen">
                                10 - 14 years
                              </Label>
                              <select
                                className="form-control"
                                name="femaleTen2Fourteen"
                                id="femaleTen2Fourteen"
                                onChange={formik.handleChange}
                                value={formik.values.femaleTen2Fourteen}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>Select</option>
                                <option value={""}>option 1</option>
                                <option value={""}>option 2</option>
                                <option value={""}>option 3</option>
                              </select>
                              {formik.errors.femaleTen2Fourteen !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.femaleTen2Fourteen}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>

                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="femaleFifteenAndAbove">
                                ≥ 15 years
                              </Label>
                              <select
                                className="form-control"
                                name="femaleFifteenAndAbove"
                                id="femaleFifteenAndAbove"
                                onChange={formik.handleChange}
                                value={formik.values.femaleFifteenAndAbove}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>Select</option>
                                <option value={""}>option 1</option>
                                <option value={""}>option 2</option>
                              </select>
                              {formik.errors.femaleFifteenAndAbove !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.femaleFifteenAndAbove}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>

                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="femaleTotal"> Total</Label>
                              <input
                                className="form-control"
                                type="text"
                                name="femaleTotal"
                                id="femaleTotal"
                                value={formik.values.femaleTotal}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              />
                              {formik.errors.femaleTotal ? (
                                <span className={classes.error}>
                                  {formik.errors.femaleTotal}
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
                      Special Population
                    </p>
                    <IconButton
                      onClick={() =>
                        setIsDropdownsOpen((prevState) => {
                          return {
                            ...prevState,
                            hepatitisCDropdown: !prevState.hepatitisCDropdown,
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
                    <Collapse in={isDropdownsOpen.hepatitisCDropdown}>
                      <div
                        className="basic-form"
                        style={{ padding: "0 50px 0 50px" }}
                      >
                        <div className="row">
                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="specialPopulationPWID">PWID</Label>
                              <select
                                className="form-control"
                                name="specialPopulationPWID"
                                id="specialPopulationPWID"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.specialPopulationPWID}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>select</option>
                                <option value={""}>option 1</option>
                                <option value={""}>option 2</option>
                              </select>
                              {formik.errors.specialPopulationPWID !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.specialPopulationPWID}
                                </span>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </div>

                          <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                              <Label for="specialPopulationPW">PW</Label>
                              <select
                                className="form-control"
                                name="specialPopulationPW"
                                id="specialPopulationPW"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.specialPopulationPW}
                                style={{
                                  border: "1px solid #014D88",
                                  borderRadius: "0.2rem",
                                }}
                              >
                                <option value={""}>select</option>
                                <option value={""}>option 1</option>
                                <option value={""}>option 2</option>
                              </select>
                              {formik.errors.specialPopulationPW !== "" ? (
                                <span className={classes.error}>
                                  {formik.errors.specialPopulationPW}
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
              <div className="d-flex justify-content-end">
                <MatButton
                  type="button"
                  variant="contained"
                  color="primary"
                  className={classes.button}
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

export default HbvType4;
