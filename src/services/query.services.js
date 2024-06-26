const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 10;
const MAX_PAGE_LIMIT = 25;

export const getPagination = (query) => {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  let limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  if(limit > MAX_PAGE_LIMIT) limit = DEFAULT_PAGE_LIMIT
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
    page
  };
}

