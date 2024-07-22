import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { saveFollowup } from "../services/saveFollowup";
import { queryClient } from "../utils/queryClient";

export const useSaveFollowup = (formik, props) => {
 
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: saveFollowup,
    onSuccess: () => {
      toast.success("Record saved successful.");
      formik.resetForm();
      queryClient.invalidateQueries()
      queryClient.refetchQueries()
      props.setActiveContent({ ...props.activeContent, route: "patient-history" });
    },

  
  });

  return {
    mutate,
    isLoading,
    isError,
  };
};