// export const  token = (new URLSearchParams(window.location.search)).get("jwt")
// export const url = '/api/v1/'
export const careEntryPointPath = process.env.REACT_APP_CARE_ENTRY_POINT_PATH;
export const srcRefPath = process.env.REACT_APP_SOURCE_REFERRAL_PATH;
export const hivStatsEnrolPath = process.env.REACT_APP_HIV_STATUS_ENROL_PATH;
export const erollmentSettingPath =
  process.env.REACT_APP_ENROLLMENT_SETTING_PATH;
export const tbStatsPath = process.env.REACT_APP_TB_STATUS_PATH;
export const targetGroupPath = process.env.REACT_APP_TARGET_GROUP_PATH;
export const pregnancyStatsPath = process.env.REACT_APP_PREGNANCY_STATUS_PATH;
export const sexPath = process.env.REACT_APP_SEX_PATH;
export const maritalStatsPath = process.env.REACT_APP_MARITAL_STATUS_PATH;
export const educationPath = process.env.REACT_APP_EDUCATION_PATH;
export const occupationPath = process.env.REACT_APP_OCCUPATION_PATH;
export const relationshipPath = process.env.REACT_APP_RELATIONSHIP_PATH;
export const hepatitisScreeningResultPath =
  process.env.REACT_APP_HEPATITIS_SCREENING_RESULT_PATH;


  export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8383/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
      ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzIxMDQ2MTA0fQ.m39bvfefOZVh-1g941bH2P94Paa4ItNHG1ldzEIq8I0ajXh1IGn1yOS7NOZWmXEjfip0OscEYf0MDVHsmzNNQg"
      : new URLSearchParams(window.location.search).get("jwt");