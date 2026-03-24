import { useFormik } from "formik";
import * as yup from "yup";

export const useValidateOpdFormValuesHook = (onSubmit, operation, initialValues) => {
  const isOperationUpdate = operation === "update";

  const opdSettingValidationSchema = yup.object({
    moduleServiceName: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    moduleServiceCode: isOperationUpdate ? yup.mixed() : yup.string(),
    facilityId: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    encounter: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: opdSettingValidationSchema,
    enableReinitialize: true
  });
  return { formik };
};
