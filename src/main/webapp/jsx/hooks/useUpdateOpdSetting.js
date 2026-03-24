import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { updateOpdSetting } from "../services/updateOpdSetting";
import { queryClient } from "../utils/queryClient";
import { useHistory } from "react-router-dom";

export const useUpdateOpdSetting = (formik, props) => {
  const history = useHistory()
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: updateOpdSetting,
    onSuccess: () => {
      toast.success("Record updated successful");
      formik.resetForm();
      queryClient.invalidateQueries()
      queryClient.refetchQueries()
      history.push('/')
    },
  });

  return {
    mutate,
    isLoading,
    isError,
  };
};
