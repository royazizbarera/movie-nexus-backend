import { CountryModel } from "./CountryModel";

export interface DirectorModel {
  id: number;
  name: string;
  birthDate: string;
  photoUrl: string;
  countryCode: string;
  country?: CountryModel;
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




export function convertDirectorModelToTable(
  director: DirectorModel
): DirectorModelTable {
  return {
    id: director.id,
    name: director.name,
    birthDate: director.birthDate.toString(),
    photoUrl: director.photoUrl,
    country: director.country?.name || '',
  };
}