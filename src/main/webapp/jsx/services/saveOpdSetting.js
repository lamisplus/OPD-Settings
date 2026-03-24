import axios from "axios";
import { token, url as baseUrl } from "../../api";

export const saveOpdSetting = async (data) => {
  
  const response = await axios.post(`${baseUrl}opd-setting`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
