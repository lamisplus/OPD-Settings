import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { queryClient } from '../utils/queryClient';
import { saveOpdSetting } from '../services/saveOpdSetting';
import { useHistory } from 'react-router-dom';

export const useSaveOpdSetting = formik => {
  const history = useHistory();
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: saveOpdSetting,
    onSuccess: () => {
      toast.success('Record saved successful.');
      formik.resetForm();
      queryClient.invalidateQueries();
      queryClient.refetchQueries();
      history.push('/');
    },
  });

  return {
    mutate,
    isLoading,
    isError,
  };
};
