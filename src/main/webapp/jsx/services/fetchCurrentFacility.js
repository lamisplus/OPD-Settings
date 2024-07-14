import axios from "axios";
import { token, url as baseUrl } from "../../api";

export const fetchCurrentFacility = async (id) => {
  const response = await axios.get(
    `${baseUrl}account`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};