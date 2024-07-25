import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { saveFollowup } from "../services/saveFollowup";
import { queryClient } from "../utils/queryClient";
import { useHistory } from "react-router-dom";

export const useSaveFollowup = (formik, props) => {
  const history = useHistory();

  const { mutate, isLoading, isError } = useMutation({
    mutationFn: saveFollowup,
    onSuccess: () => {
      toast.success("Record saved successful.");
      formik.resetForm();
      queryClient.invalidateQueries();
      queryClient.refetchQueries();
      // props.setActiveContent({ ...props.activeContent, route: "recent-history" });
      history.push("/");
    },
  });

  return {
    mutate,
    isLoading,
    isError,
  };
};
