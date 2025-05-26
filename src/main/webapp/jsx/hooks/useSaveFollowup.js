import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { queryClient } from "../utils/queryClient";
import { saveFollowup } from "../services/saveFollowup";
import { useHistory } from "react-router-dom";

export const useSaveFollowup = (formik, props) => {
  const history = useHistory()
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: saveFollowup,
    onSuccess: () => {
      toast.success("Record saved successful.");
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