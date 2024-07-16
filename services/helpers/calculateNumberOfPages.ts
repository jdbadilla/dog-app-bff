export const calculateNumberOfPages = ({
  totalNumberOfEntries,
  pageSize,
}: {
  totalNumberOfEntries: number;
  pageSize: number;
}) => {
  return Math.ceil(totalNumberOfEntries / pageSize);
};
