export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8388/api/v1/"
    : "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLFJERSIsIm5hbWUiOiJHdWVzdCBHdWVzdCIsImV4cCI6MTc3NDMwNTgyM30.RVEqRgb_jvuytEGWPhRdkjbgopH2ranFZH-DksbPXToGHACjMEuM0GL27BZUKKk2ftYVg0c9rqJa730Cj_dZTg"
    : new URLSearchParams(window.location.search).get("jwt");
