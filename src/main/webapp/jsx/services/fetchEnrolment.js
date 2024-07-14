import axios from "axios";
import { token, url as baseUrl } from "../../api";

export const fetchEnrolment = async (id) => {
  const response = await axios.get(
    `${baseUrl}hepatitis/view-hepatitis-enrollment/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};