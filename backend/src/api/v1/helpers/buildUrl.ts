import SearchParams from "./SearchParams";

export function buildSearchMoviesURL(params: SearchParams): string {
  const { searchTerm, country, sortBy, sortOrder } = params;

  const queryParams = new URLSearchParams();

  // Menambahkan parameter pencarian (searchTerm)
  if (searchTerm) {
    queryParams.append("searchTerm", searchTerm);
  }

  // Menambahkan parameter negara (country)
  if (country) {
    queryParams.append("country", country);
  }

  // Menambahkan parameter sorting
  if (sortBy) {
    queryParams.append("sortBy", sortBy);
  }

  if (sortOrder) {
    queryParams.append("sortOrder", sortOrder);
  }

  // Membuat URL lengkap
  return `/movies/search?${queryParams.toString()}`;
}
