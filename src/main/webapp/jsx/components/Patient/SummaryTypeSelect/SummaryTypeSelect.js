import React, { useState } from "react";
import { Row, Col, FormGroup, Input } from "reactstrap";

const SummaryTypeSelect = ({
  setFormValues,
  formValues: { select1Value, select2Value, select3Value },
}) => {
  return (
    <div style={{ maxWidth: "400px" }}>
      <Row className="d-flex justify-content-between">
        <Col>
          <FormGroup>
            <Input
              type="select"
              name="summary-type"
              id="summary-type"
              value={select1Value}
              onChange={(event) => setFormValues(prevState => {
                return { ...prevState, select1Value: event.target.value, select2Value: "" }
              })}
            >
              <option value="">Summary type</option>
              <option value="Hepatitis B">Hepatitis B</option>
              <option value="Hepatitis C">Hepatitis C</option>
              <option value="CoInfection">CoInfection</option>
            </Input>
          </FormGroup>
        </Col>

        {select1Value !== "" && (
          <Col>
            <FormGroup>
              <Input
                type="select"
                name="select2"
                id="select2"
                value={select2Value}
                onChange={(event) => setFormValues(prevState => {
                  return { ...prevState, select2Value: event.target.value, select3Value: "" }
                })}
                disabled={select1Value === ""}
              >
                <option value="">select type for {select1Value}</option>

                {select1Value === "Hepatitis B" && (
                  <>
                    <option value="Diagnosis">Diagnosis</option>
                    <option value="Complications">Complications</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Mortality">Mortality</option>
                  </>
                )}
                {select1Value === "Hepatitis C" && (
                  <>
                    <option value="Screening/Diagnosis">
                      Screening/Diagnosis
                    </option>
                    <option value="HCV Complications">HCV Complications</option>
                    <option value="HCV Treatment">HCV Treatment</option>
                    <option value="HCV Treatment Effectiveness">
                      HCV Treatment Effectiveness
                    </option>
                    <option value="HCV Re-treatment">HCV Re-treatment</option>
                    <option value="HCV Related Mortality">
                      HCV Related Mortality
                    </option>
                  </>
                )}
              </Input>
            </FormGroup>
          </Col>
        )}


        {select2Value !== "" && select1Value !== "" && (
          <Col>
            <FormGroup>
              <Input
                type="select"
                name="select3"
                id="select3"
                value={select3Value}
                onChange={(event) => setFormValues(prevState => {
                  return { ...prevState, select3Value: event.target.value }
                })}
                disabled={select2Value === ""}
              >
                <option value="">
                  Select type for {select1Value} {select2Value}
                </option>
                {select2Value === "Diagnosis" && (
                  <>
                    <option value="Reactive">Reactive</option>
                    <option value="Non Reactive">Non Reactive</option>
                  </>
                )}
                {select2Value === "Complications" && (
                  <>
                    <option value="Fibrosis">Fibrosis</option>
                    <option value="Cirrhosis">Cirrhosis</option>
                    <option value="Hepatocellular Carcinoma">
                      Hepatocellular Carcinoma
                    </option>
                  </>
                )}
                {select2Value === "Monitoring" && (
                  <>
                    <option value="Monitoring Reactive">Reactive</option>
                    <option value="Monitoring Non Reactive">Non Reactive</option>
                  </>
                )}
                {select2Value === "Mortality" && (
                  <>
                    <option value="Mortality Reactive">Reactive</option>
                    <option value="Mortality Reactive">Non Reactive</option>
                  </>
                )}
                {select2Value === "Treatment" && (
                  <>
                    <option value="HBV DNA <2000 IU/ml">
                      HBV DNA {"<"}2000 IU/ml
                    </option>
                    <option value="HBV DNA >=2000 IU/ml">
                      HBV DNA {">="}2000 IU/ml
                    </option>
                    <option value="HBV DNA >=200000 IU/ml">
                      HBV DNA {">="}200,000 IU/ml
                    </option>
                    <option value="HBegAg +ve">HBegAg +ve</option>
                  </>
                )}
              </Input>
            </FormGroup>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default SummaryTypeSelect
