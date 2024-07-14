import { isBefore } from "date-fns";

export const isNotInTheFutureOrBeforeBirth = (date, birthday) => {
  return (
    !isBefore(new Date(date), new Date(birthday)) &&
    isBefore(new Date(date), new Date())
  );
};
