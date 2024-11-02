export interface CountryModel {
  code: string;
  name: string;
}

export interface CountryModelTable {
  code: string;
  name: string;
}

export interface CountryParamsModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function convertCountryModelToTable(
  country: CountryModel
): CountryModelTable {
  return {
    code: country.code,
    name: country.name,
  };
}

export function convertCountryTableToModel(
  countryTable: CountryModelTable
): CountryModel {
  return {
    ...countryTable,
  };
}
