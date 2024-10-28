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