import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Menu } from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import { url as baseUrl, token } from "../../../api";

const useStyles = makeStyles((theme) => ({
  navItemText: {
    padding: theme.spacing(2),
  },
}));

function SubMenu(props) {
  useEffect(() => {
    Observation();
  }, [props.patientObj, props.recentActivities]);

  const Observation = () => {
    axios
      .get(`${baseUrl}observation/person/${props.patientObj.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const observation = response.data;
        const mental = observation.filter((x) => x.type === "mental health");
        const evaluation = observation.filter(
          (x) => x.type === "initial evaluation"
        );
      })
      .catch((error) => {
        
      });
  };

  // const loadVaccination = (row) => {
  //   props.setActiveContent({ ...props.activeContent, route: "diagnosis" });
  // };
  // const loadTreatment = (row) => {
  //   props.setActiveContent({ ...props.activeContent, route: "treatment" });
  // };

  const onClickHome = (row) => {
    props.setActiveContent({ ...props.activeContent, route: "recent-history", actionType: "update" });
  };

  const loadPatientHistory = () => {
    props.setActiveContent({
      ...props.activeContent,
      route: "patient-history",
    });
  };

  const loadFollowup = () => {
    props.setActiveContent({
      ...props.activeContent,
      route: "patient-followup",
      actionType: "create",
    });
  };

  return (
    <div>
      <Menu size="large" color={"black"} inverted>
        <Menu.Item onClick={() => onClickHome()}> Home</Menu.Item>
        <Menu.Item onClick={() => loadFollowup()}>New Visit</Menu.Item>
        {/* <Menu.Item onClick={() => loadVaccination()}>Diagnosis</Menu.Item>
        <Menu.Item onClick={() => loadTreatment()}>Treatment</Menu.Item> */}
        {/* <Menu.Item onClick={() => loadPatientHistory()}>History</Menu.Item> */}
      </Menu>
    </div>
  );
}

export default SubMenu;
