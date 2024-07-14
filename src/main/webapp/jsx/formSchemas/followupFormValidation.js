import { useFormik } from "formik";
import * as yup from "yup";

const invalidTextPrompt = "Invalid input type";
const requiredTextPrompt = "field is required";

export const useValidateForm1ValuesHook = (onSubmit) => {
  const form1InitialValues = {
    stateId: "",
    otherName: "",
    countryId: "",
    coreEntryPoint: "",
    pregnancy: "",
    weight: "",
    height: "",
    hepatitisB: "",
    breastfeeding: "",
    historyOfUsingAbusedSubstance: "",
    dateOfFirstHepatitisBPositiveScreening: "",
    hepatitisC: "",
    surname: "",
    firstName: "",
    dateOfBirth: "",
    maritalStatusId: "",
    phone: "",
    ninNumber: "",
    isDateOfBirthEstimated: "",
    educationId: "",
    employmentStatusId: "",
    dateOfRegistration: "",
  };

  const Form1ValidationSchema = yup.object({
    stateId: isOperationUpdate ? yup.mixed().required().required() : yup.string().required(),
    countryId: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    educationId: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    employmentStatusId: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    coreEntryPoint: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    pregnancy: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    weight: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    height: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    hepatitisB: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    breastfeeding: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    historyOfUsingAbusedSubstance: isOperationUpdate
      ? yup.mixed().required()
      : yup.string().required(),
    dateOfFirstHepatitisBPositiveScreening: yup.date(),
    hepatitisC: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    surname: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    firstName: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    otherName: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    dateOfBirth: yup.date(),
    dateOfRegistration: yup.date(),
    maritalStatusId: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    sexId: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    phone: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    ninNumber: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    isDateOfBirthEstimated: yup.boolean(),
  });

  const formik = useFormik({
    initialValues: form1InitialValues,
    onSubmit,
    validationSchema: Form1ValidationSchema,
  });
  return { formik };
};

export const useValidateOpdFormValuesHook = (onSubmit, operation,initialValues) => {
  const isOperationUpdate = operation === "update" ? true : false;
  const opdVisitInit = initialValues;

  const FollowupFormValidationSchema = yup.object({
    moduleServiceName: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    moduleServiceCode: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    facilityId: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
    encounter: isOperationUpdate ? yup.mixed().required() : yup.string().required(),
  });

  const formik = useFormik({
    initialValues: opdVisitInit,
    onSubmit,
    validationSchema: FollowupFormValidationSchema,
    enableReinitialize: true
  });
  return { formik };
};
