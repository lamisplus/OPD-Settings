import axios from "axios";
import { token, url as baseUrl } from "../../api";

const config = {
  headers: { Authorization: `Bearer ${token}` },
};

export const archiveOpdSetting = async (id) => {
  const response = await axios.put(
    `${baseUrl}hepatitis/${id}/archive/followup`,
    null,
    config
  );

  return response.data;
};
