import { CountryModel } from "./CountryModel";

export interface DirectorModel {
  id: number;
  name: string;
  birthDate: Date;
  photoUrl: string;
  countryCode: string;
  country: CountryModel;
}


export interface DirectorModelTable {
  id: number;
  name: string;
  birthDate: string;
  photoUrl: string;
  country: string;
}

export interface DirectorParamsModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: string;
}