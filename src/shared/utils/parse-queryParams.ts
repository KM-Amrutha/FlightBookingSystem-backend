import { ParsedQs } from "qs";

export const parseQueryParams = (query: ParsedQs) => {
  // Page & size → must have for pagination
  const page =
    query.page && typeof query.page === "string"
      ? Number(query.page)
      : 1;

  const limit =
    query.limit && typeof query.limit === "string"
      ? Number(query.limit)
      : 10;

  // Optional search (very useful)
  const search =
    query.search && typeof query.search === "string"
      ? query.search.trim()
      : "";

  // Optional filters ( use later for role/active/blocked etc.)
  const filters: string[] = Array.isArray(query.filters)
    ? query.filters.filter((f): f is string => typeof f === "string")
    : typeof query.filters === "string"
      ? [query.filters]
      : [];

  return {
    page,
    limit,
    search,
    filters,
  };

};