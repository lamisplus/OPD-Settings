import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { archiveFollowup } from "../services/archiveFollowup";
import { queryClient } from "../utils/queryClient";

export const useArchiveFollowup = (props, setSaving, toggle) => {
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: archiveFollowup,
    onSuccess: () => {
    setSaving(false)
    toggle()
      toast.success("Follow up deleted successful.");
      queryClient.invalidateQueries();
      queryClient.refetchQueries();
      props.setActiveContent({
        ...props.activeContent,
        route: "recent-history",
      });
    },

    onError: () => {
      toast.error("Immunization deletion failed");
    },
  });

  return {
    mutate,
    isLoading,
    isError,
  };
};
