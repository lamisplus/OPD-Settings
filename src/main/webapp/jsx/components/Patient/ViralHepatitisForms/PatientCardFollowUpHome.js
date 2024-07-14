import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../patient.css";
import "react-widgets/dist/css/react-widgets.css";
import FollowupCreate from "./FollowUpCreate";
import FollowupUpdate from "./FollowupUpdate";

const DashboardFollowupFormHome = (props) => {
  const actionType = props?.activeContent?.actionType;
  const componentMap = {
    create: <FollowupCreate {...props} />,
    update: <FollowupUpdate {...props} disableInputs={false} />,
    view: <FollowupUpdate {...props} disableInputs={true} />,
  };

  const mapComponentToActionType = (actionType) => {
    if (!actionType) {
      return componentMap["create"];
    }
    return componentMap[actionType];
  };
  return <>{mapComponentToActionType(actionType)}</>;
};

export default DashboardFollowupFormHome;
