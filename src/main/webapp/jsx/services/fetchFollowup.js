import axios from "axios";
import { token, url as baseUrl } from "../../api";

export const fetchFollowup = async (id) => {
  const response = await axios.get(
    `${baseUrl}opd-setting/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};