import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import OpdSettingDetailHeader from "./OpdSettingDetailHeader";
import { useHistory } from "react-router-dom";
import { token, url as baseUrl } from "../../../api";
import axios from "axios";
import OpdSettingDetailNav from "./OpdSettingDetailNav";
import OpdSettingActivityHistory from "./OpdSettingActivityHistory";
import OpdSettingFormRouter from "./OpdSettingForms/OpdSettingFormRouter";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "20.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

function OpdSettingDetail(props) {
  let history = useHistory();
  const [art, setArt] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [allPatientInfo, setAllPatientInfo] = useState({});
  const [activeContent, setActiveContent] = useState({
    route: "recent-history",
    id: "",
    activeTab: "home",
    actionType: "update",
    obj: {},
  });
  const [createContent, setCreateContent] = useState({
    route: "recent-history",
    id: "",
    activeTab: "home",
    actionType: "create",
    obj: {},
  });
  const { classes } = props;
  const patientObj =
    history.location && history.location.state
      ? history.location.state.patientObj
      : {};

  const getRecentActivities = () => {
    axios
      .get(`${baseUrl}hepatitis/activities/${patientObj?.personUuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRecentActivities(response?.data);
      })

      .catch((error) => {});
  };

  useEffect(() => {
    if (history?.location?.state?.isNewVisit) {
      setActiveContent({ ...createContent });
    }
  }, []);
  useEffect(() => {
    getRecentActivities();
  }, [activeContent]);
  return (
    <div className={classes.root}>
      <div
        className="row page-titles mx-0"
        style={{ marginTop: "0px", marginBottom: "-10px" }}
      >
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">
            <h4>
              {" "}
              <Link to={"/"}>OPD /</Link> Edit
            </h4>
          </li>
        </ol>
      </div>
      <Card>
        <CardContent>
          <OpdSettingDetailHeader
            patientObj={patientObj}
            allPatientInfo={allPatientInfo}
            setArt={setArt}
            setActiveContent={setActiveContent}
          />
          <OpdSettingDetailNav
            patientObj={patientObj}
            art={art}
            setActiveContent={setActiveContent}
            recentActivities={recentActivities}
          />
          <br />
          {activeContent.route === "recent-history" && (
            <OpdSettingFormRouter
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
              recentActivities={recentActivities}
              getRecentActivities={getRecentActivities}
            />
          )}

          {activeContent.route === "patient-history" && (
            <OpdSettingActivityHistory
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
              recentActivities={recentActivities}
            />
          )}
          {activeContent.route === "patient-followup" && (
            <OpdSettingFormRouter
              patientObj={patientObj}
              setActiveContent={setActiveContent}
              activeContent={createContent}
              recentActivities={recentActivities}
              getRecentActivities={getRecentActivities}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

OpdSettingDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpdSettingDetail);
