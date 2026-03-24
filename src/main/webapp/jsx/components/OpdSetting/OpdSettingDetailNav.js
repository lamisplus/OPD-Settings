import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Menu } from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import { url as baseUrl, token } from "../../../api";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navItemText: {
    padding: theme.spacing(2),
  },
}));

function OpdSettingDetailNav(props) {
  const history = useHistory()
  useEffect(() => {
    Observation();
  }, [props.patientObj, props.recentActivities]);

  const Observation = () => {
    if (props.patientObj?.id) {
      axios
        .get(`${baseUrl}observation/person/${props.patientObj?.id}`, {
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
    }

  };

  const onClickHome = (row) => {
    props.setActiveContent({ ...props.activeContent, route: "recent-history", actionType: "update" });
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
        {history?.location?.state?.isNewVisit ? <Menu.Item onClick={() => loadFollowup()}>Create</Menu.Item> : <Menu.Item onClick={() => onClickHome()}>Update</Menu.Item>}
      </Menu>
    </div>
  );
}

export default OpdSettingDetailNav;
