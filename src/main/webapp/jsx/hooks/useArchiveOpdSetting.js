import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { archiveOpdSetting } from "../services/archiveOpdSetting";
import { queryClient } from "../utils/queryClient";

export const useArchiveOpdSetting = (props, setSaving, toggle) => {
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: archiveOpdSetting,
    onSuccess: () => {
    setSaving(false)
    toggle()
      toast.success("OPD setting deleted successful.");
      queryClient.invalidateQueries();
      queryClient.refetchQueries();
      props.setActiveContent({
        ...props.activeContent,
        route: "recent-history",
      });
    },

    onError: () => {
      toast.error("OPD setting deletion failed");
    },
  });

  return {
    mutate,
    isLoading,
    isError,
  };
};
