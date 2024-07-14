import React, { useState } from "react";
import SummaryTypeSelect from "./SummaryTypeSelect/SummaryTypeSelect";
import Reactive from "../Patient/ViralHepatitisSummaryForms/Reactive";
import NonReactive from "./ViralHepatitisSummaryForms/NonReactive";
import Fibrosis from "./ViralHepatitisSummaryForms/Fibrosis";
import Cirrhosis from "./ViralHepatitisSummaryForms/Cirrhosis";
import HepatocellularCarcinoma from "./ViralHepatitisSummaryForms/HepatocellularCarcinoma";
import HbvType1 from "./ViralHepatitisSummaryForms/HbvType1";
import HbvType2 from "./ViralHepatitisSummaryForms/HbvType2";
import HbvType3 from "./ViralHepatitisSummaryForms/HbvType3";
import HbvType4 from "./ViralHepatitisSummaryForms/HbvType4";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Card, Accordion } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import HepatitisBSummaryForm from "./ViralHepatitisSummaryForms/HepatitisBSummaryForm";
const ViralHepatitisSummaryFormContainer = () => {
  const [formValues, setFormValues] = useState({
    select1Value: "",
    select2Value: "",
    select3Value: "",
  });
  let notToBeUpdated = ["pmtct_infant_information"];

  const [formSection, setFormSection] = useState([
    {
      activityName: "Hepatitis B",
      path: "Enrolment",
      activityDate: "props.patientObj.dateOfRegistration",
      content: <HepatitisBSummaryForm />,
    },
    {
      activityName: "Hepatitis C",
      path: "Diagnosis",
      activityDate: "props.patientObj.dateOfRegistration",
      content: "ekoo",
    },
    {
      activityName: "Coinfections",
      path: "Treatment",
      activityDate: "props.patientObj.dateOfRegistration",
      content: "ekoo",
    },
  ]);
  const [activeAccordionHeaderShadow, setActiveAccordionHeaderShadow] =
    useState(0);
  const formMap = {
    Reactive: <Reactive />,
    "Non Reactive": <NonReactive />,
    Fibrosis: <Fibrosis />,
    Cirrhosis: <Cirrhosis />,
    "Hepatocellular Carcinoma": <HepatocellularCarcinoma />,
    "HBV DNA <2000 IU/ml": <HbvType1 />,
    "HBV DNA >=2000 IU/ml": <HbvType2 />,
    "HBV DNA >=200000 IU/ml": <HbvType3 />,
    "HBegAg +ve": <HbvType4 />,
    "Mortality Reactive": <div> Mortality Reactive</div>,
    "Mortality Reactive": <div> Mortality Reactive</div>,
    "Monitoring Reactive": <div>Monitoring Reactive</div>,
    "Monitoring Non Reactive": <div>Monitoring Non Reactive</div>,
  };

  return (
    <div>
      <div className="card">
        <div
          className="card-header  border-0 pb-0"
          style={{ minHeight: "fit-content", paddingTop: "2px" }}
        >
          {/* <h4 className="card-title">Summary</h4> */}
        </div>
        <div className="">
          <PerfectScrollbar
            // style={{ height: "370px" }}
            id="DZ_W_Todo1"
            className="widget-media dz-scroll ps ps--active-y"
          >
            <Accordion
              className="accordion accordion-header-bg accordion-header-shadow accordion-rounded "
              defaultActiveKey="0"
            >
              <>
                {formSection &&
                  formSection.map((data, i) => (
                    <div className="accordion-item" key={i}>
                      <Accordion.Toggle
                        as={Card.Text}
                        eventKey={`${i}`}
                        className={`accordion-header ${
                          activeAccordionHeaderShadow === 1 ? "" : "collapsed"
                        } accordion-header-info`}
                        onClick={() =>
                          setActiveAccordionHeaderShadow(
                            activeAccordionHeaderShadow === 1 ? -1 : i
                          )
                        }
                        style={{
                          backgroundColor: "#014d88",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "0.2rem",
                          fontSize: "18px",
                        }}
                      >
                        <span className="accordion-header-icon"></span>
                        <span className="accordion-header-text">
                          <span className="">{data.activityName}</span>{" "}
                        </span>
                        <span className="accordion-header-indicator"></span>
                      </Accordion.Toggle>
                      <Accordion.Collapse
                        eventKey={`${i}`}
                        className="accordion__body"
                      >
                        <div
                          className="accordion-body-text"
                          style={{ padding: "0px", margin: "0" }}
                        >
                          {data.content}
                          <ul className="timeline">
                            <li>
                              <div className="timeline-panel">
                                {/* <div
                                  className={
                                    i % 2 == 0
                                      ? "media me-2 media-info"
                                      : "media me-2 media-success"
                                  }
                                >
                                  {ActivityName("pmtct-enrollment")}
                                </div> */}
                                {/* <div className="media-body">
                                  <h5 className="mb-1">{data.activityName}</h5>
                                  <small className="d-block">
                                    {data.activityDate}
                                  </small>
                                </div> */}
                                {/* {!notToBeUpdated.includes(data.path) ? (
                                  <Dropdown className="dropdown">
                                    <Dropdown.Toggle
                                      variant=" light"
                                      className="i-false p-0 btn-info sharp"
                                    >
                                      <svg
                                        width="18px"
                                        height="18px"
                                        viewBox="0 0 24 24"
                                        version="1.1"
                                      >
                                        <g
                                          stroke="none"
                                          strokeWidth="1"
                                          fill="none"
                                          fillRule="evenodd"
                                        >
                                          <rect
                                            x="0"
                                            y="0"
                                            width="24"
                                            height="24"
                                          />
                                          <circle
                                            fill="#000000"
                                            cx="5"
                                            cy="12"
                                            r="2"
                                          />
                                          <circle
                                            fill="#000000"
                                            cx="12"
                                            cy="12"
                                            r="2"
                                          />
                                          <circle
                                            fill="#000000"
                                            cx="19"
                                            cy="12"
                                            r="2"
                                          />
                                        </g>
                                      </svg>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu">
                                      <Dropdown.Item
                                        className="dropdown-item"
                                        onClick={() =>
                                          LoadViewPage(data, "view")
                                        }
                                      >
                                        View
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        className="dropdown-item"
                                        onClick={() =>
                                          LoadViewPage(data, "update")
                                        }
                                      >
                                        Update
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        className="dropdown-item"
                                        onClick={() =>
                                          LoadModal(data, "delete")
                                        }
                                      >
                                        Delete
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                ) : (
                                  ""
                                )} */}
                              </div>
                            </li>
                          </ul>
                        </div>
                      </Accordion.Collapse>
                    </div>
                  ))}
              </>
            </Accordion>
          </PerfectScrollbar>
        </div>
      </div>

      {/* the former UI */}
      {/* <div>
        <SummaryTypeSelect formValues={formValues} setFormValues={setFormValues}/>
      </div>

      <div className="my-2" style={{fontWeight: "600"}}>
        <span>{formValues.select1Value && ` ${formValues.select1Value} `}</span>
        <span>{formValues.select2Value && ` | ${formValues.select2Value } `}</span>
        <span style={{color: "#014d88"}}>{formValues.select3Value && `| ${formValues.select3Value} `}</span>
      </div>

      <div>
       {formMap[formValues.select3Value]}
      </div> */}
    </div>
  );
};

export default ViralHepatitisSummaryFormContainer;
