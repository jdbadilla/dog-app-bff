export const getEntriesByPageNumberAndPageSize = <T>({
  pageNumber,
  pageSize,
  entries,
}: {
  pageNumber: number;
  pageSize: number;
  entries: T[];
}) => {
  const start = 0 + (pageNumber - 1) * pageSize;
  const end = pageSize * pageNumber;
  return entries.slice(start, end);
};
