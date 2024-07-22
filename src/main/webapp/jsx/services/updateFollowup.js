import axios from "axios";
import { token, url as baseUrl } from "../../api";

const config = {
  headers: { Authorization: `Bearer ${token}` },
};

export const updateFollowup = async (args) => {
  console.log('data: ', args)
  const response = await axios.put(
    `${baseUrl}opd-setting/${args.id}`,
    {
      ...args.data,
    },
    config
  );

  return response.data;
};
