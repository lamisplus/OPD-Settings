import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import "react-phone-input-2/lib/style.css";
import "../opdSetting.css";
import OpdSettingCreateForm from "./OpdSettingCreateForm";
import OpdSettingUpdateForm from "./OpdSettingUpdateForm";

const OpdSettingFormRouter = (props) => {
  const actionType = props?.activeContent?.actionType;
  const componentMap = {
    create: <OpdSettingCreateForm {...props} />,
    update: <OpdSettingUpdateForm {...props} disableInputs={false} />,
    view: <OpdSettingUpdateForm {...props} disableInputs={true} />,
  };

  const mapComponentToActionType = (actionType) => {
    if (!actionType) {
      return componentMap["create"];
    }
    return componentMap[actionType];
  };
  return <>{mapComponentToActionType(actionType)}</>;
};

export default OpdSettingFormRouter;
