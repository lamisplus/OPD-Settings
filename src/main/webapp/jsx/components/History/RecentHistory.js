import React, { Fragment, useState, useEffect } from "react";
// BS
import { Dropdown } from "react-bootstrap";
/// Scroll
//import { makeStyles } from '@material-ui/core/styles';
import PerfectScrollbar from "react-perfect-scrollbar";
//import { Link } from "react-router-dom";
import axios from "axios";
import { url as baseUrl, token } from "../../../api";
//import { Alert } from "react-bootstrap";
import { Card, Accordion } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "react-widgets/dist/css/react-widgets.css";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { useArchiveFollowup } from "../../hooks/useArchiveFollowup";
import { useQuery } from "react-query";
import { FETCH_ENROLMENT_KEY, FETCH_FOLLOWUP_KEY } from "../../utils/queryKeys";
import { fetchEnrolment } from "../../services/fetchEnrolment";
import { fetchFollowup } from "../../services/fetchFollowup";
import { queryClient } from "../../utils/queryClient";
import { da } from "date-fns/locale";

const RecentHistory = (props) => {
  let history = useHistory();
  const [recentActivities, setRecentActivities] = useState([
    {
      activityName: "Hepatitis Enrollment",
      path: "hepatitis_enrollment",
      activityDate: props.patientObj.dateOfRegistration,
    },
    {
      activityName: "Hepatitis Diagnosis",
      path: "hepatitis_diagnosis",
      activityDate: props.patientObj.dateOfRegistration,
    },
    {
      activityName: "Hepatitis Treatment",
      path: "hepatitis_treatment",
      activityDate: props.patientObj.dateOfRegistration,
    },
    {
      activityName: "Hepatitis Followups",
      path: "hepatitis_followup",
      activityDate: props.patientObj.dateOfRegistration,
    },
  ]);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = useState(false);
  const [record, setRecord] = useState(null);
  const toggle = () => setOpen(!open);
  let notToBeUpdated = ["pmtct_infant_information"];
  const [activeAccordionHeaderShadow, setActiveAccordionHeaderShadow] =
    useState(0);
  const [enrolmentData, setEnrolmentData] = useState(null);

  useEffect(() => {
    setRecentActivities(props.allRecentActivities);
  }, [props.patientObj.id, props.allRecentActivities]);

  const prefetchAllFollowUp = () => {
    const array = recentActivities;
    for (let index = 0; index < array.length; index++) {
      const activityRecord = array[index];
      if (activityRecord?.path === "hepatitis_followup") {
        queryClient.prefetchQuery(
          [FETCH_FOLLOWUP_KEY, activityRecord?.recordId],
          () => fetchFollowup(activityRecord?.recordId)
        );
      }
    }
  };

  useQuery(
    [FETCH_ENROLMENT_KEY, props?.patientObj?.personUuid],
    () => fetchEnrolment(props?.patientObj?.personUuid),
    {
      onSuccess: ({ uuid }) => {
        setEnrolmentData(uuid);
        prefetchAllFollowUp();
      },
    }
  );

  const ActivityName = (name) => {
    if (name === "Hepatitis Enrollment") {
      return "HE";
    } else if (name === "Hepatitis Followups") {
      return "HF";
    } else if (name === "Hepatitis Diagnosis") {
      return "HD";
    } else if (name === "Hepatitis Treatment") {
      return "HT";
    } else {
      return "HP";
    }
  };

  const LoadViewPage = (row, action) => {
    prefetchAllFollowUp();
    if (row.path === "hepatitis_enrollment") {
      history.push({
        pathname: "/update-patient",
        state: {
          id: row.recordId,
          patientObj: props.patientObj,
          actionType: action,
          showForm: {
            enrollment: true,
            diagnosis: false,
            treatment: false,
          },
        },
      });
    } else if (row.path === "hepatitis_diagnosis") {
      history.push({
        pathname: "/update-patient",
        state: {
          id: row.recordId,
          patientObj: props.patientObj,
          actionType: action,
          showForm: {
            enrollment: false,
            diagnosis: true,
            treatment: false,
          },
        },
      });
    } else if (row.path === "hepatitis_treatment") {
      history.push({
        pathname: "/update-patient",
        state: {
          id: row.recordId,
          patientObj: props.patientObj,
          actionType: action,
          showForm: {
            enrollment: false,
            diagnosis: false,
            treatment: true,
          },
        },
      });
    } else if (row.path === "hepatitis_followup") {
      if (action === "update") {
        props.setActiveContent({
          ...props.activeContent,
          route: "patient-followup",
          actionType: "update",
          followupRecord: row,
        });
      } else {
        props.setActiveContent({
          ...props.activeContent,
          route: "patient-followup",
          actionType: "view",
          followupRecord: row,
        });
      }
    }
  };
  const LoadDeletePage = (row) => {
    if (row.path === "hepatitis_diagnosis") {
      setSaving(true);
      axios
        .put(
          `${baseUrl}hepatitis/${row.recordId}/archive/diagnosis`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          toast.success("Record Deleted Successfully");
          toggle();
          setSaving(false);
          props.getRecentActivties();
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "hepatitis_treatment") {
      setSaving(true);
      axios
        .put(
          `${baseUrl}hepatitis/${row.recordId}/archive/treatment`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          toast.success("Record Deleted Successfully");
          toggle();
          setSaving(false);
          props.getRecentActivties();
        })
        .catch((error) => {
          setSaving(false);
          if (error.response && error.response.data) {
            let errorMessage =
              error.response.data.apierror &&
              error.response.data.apierror.message !== ""
                ? error.response.data.apierror.message
                : "Something went wrong, please try again";
            toast.error(errorMessage);
          } else if (row.path === "hepatitis_followup") {
          } else {
            toast.error("Something went wrong. Please try again...");
          }
        });
    } else if (row.path === "hepatitis_followup") {
      setSaving(true);

      mutate(row?.recordId);
    }
  };

  const LoadModal = (row) => {
    toggle();
    setRecord(row);
  };

  const { mutate } = useArchiveFollowup(props, setSaving, toggle);

  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-4 col-xxl-4 col-lg-4">
          <div className="card">
            <div className="card-header  border-0 pb-0">
              <h4 className="card-title"> Recent Activities</h4>
            </div>
            <div className="card-body">
              <PerfectScrollbar
                style={{ height: "370px" }}
                id="DZ_W_Todo1"
                className="widget-media dz-scroll ps ps--active-y"
              >
                <Accordion
                  className="accordion accordion-header-bg accordion-header-shadow accordion-rounded "
                  defaultActiveKey="0"
                >
                  <>
                    {recentActivities &&
                      recentActivities.map((data, i) => (
                        <div className="accordion-item" key={i}>
                          <Accordion.Toggle
                            as={Card.Text}
                            eventKey={`${i}`}
                            className={`accordion-header ${
                              activeAccordionHeaderShadow === 1
                                ? ""
                                : "collapsed"
                            } accordion-header-info`}
                            onClick={() =>
                              setActiveAccordionHeaderShadow(
                                activeAccordionHeaderShadow === 1 ? -1 : i
                              )
                            }
                          >
                            <span className="accordion-header-icon"></span>
                            <span className="accordion-header-text">
                              Visit Date :{" "}
                              <span className="">{data?.activityName}</span>{" "}
                            </span>
                            <span className="accordion-header-indicator"></span>
                          </Accordion.Toggle>
                          <Accordion.Collapse
                            eventKey={`${i}`}
                            className="accordion__body"
                          >
                            <div className="accordion-body-text">
                              <ul className="timeline">
                                <li>
                                  <div className="timeline-panel">
                                    <div
                                      className={
                                        i % 2 == 0
                                          ? "media me-2 media-info"
                                          : "media me-2 media-success"
                                      }
                                    >
                                      {ActivityName(data.activityName)}
                                    </div>
                                    <div className="media-body">
                                      <h5 className="mb-1">
                                        {data.activityName}
                                      </h5>
                                      <small className="d-block">
                                        {data.activityDate}
                                      </small>
                                    </div>
                                    {!notToBeUpdated.includes(data.path) ? (
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
                                          {data.deletable && (
                                            <Dropdown.Item
                                              className="dropdown-item"
                                              onClick={() =>
                                                LoadModal(data, "delete")
                                              }
                                            >
                                              Delete
                                            </Dropdown.Item>
                                          )}
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    ) : (
                                      ""
                                    )}
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
        </div>

        <Modal
          show={open}
          toggle={toggle}
          className="fade"
          size="md"
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
            <h4>
              Are you Sure you want to delete{" "}
              <b>{record && record.activityName}</b>
            </h4>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => LoadDeletePage(record)}
              style={{ backgroundColor: "red", color: "#fff" }}
              disabled={saving}
            >
              {saving === false ? "Yes" : "Deleting..."}
            </Button>
            <Button
              onClick={toggle}
              style={{ backgroundColor: "#014d88", color: "#fff" }}
              disabled={saving}
            >
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Fragment>
  );
};

export default RecentHistory;
