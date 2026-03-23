import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { updateFollowup } from "../services/updateFollowup";
import { queryClient } from "../utils/queryClient";
import { useHistory } from "react-router-dom";

export const useUpdateFollowup = (formik, props) => {
  const history = useHistory()
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: updateFollowup,
    onSuccess: () => {
      toast.success("Record updated successful");
      formik.resetForm();
      queryClient.invalidateQueries()
      queryClient.refetchQueries()
      history.push('/')
      // props.setActiveContent({ ...props.activeContent, route: "patient-followup" });
    },
  });

  return {
    mutate,
    isLoading,
    isError,
  };
};