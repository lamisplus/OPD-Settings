import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { updateFollowup } from "../services/updateFollowup";
import { queryClient } from "../utils/queryClient";

export const useUpdateFollowup = (formik, props) => {

  const { mutate, isLoading, isError } = useMutation({
    mutationFn: updateFollowup,
    onSuccess: () => {
      toast.success("Record updated successful");
      formik.resetForm();
      queryClient.invalidateQueries()
      queryClient.refetchQueries()
      props.setActiveContent({ ...props.activeContent, route: "patient-followup" });
    },
  });

  return {
    mutate,
    isLoading,
    isError,
  };
};