import { CountryModel } from "./CountryModel";

export interface AwardModel {
  id: number;
  name: string;
  year: Date;
  countryCode: string;
  country?: CountryModel;
}

export interface AwardModelTable {
  id: number;
  name: string;
  year: string;
  country: string;
}


export interface AwardParamsModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: string;
}



export function convertAwardModelToTable(award: AwardModel): AwardModelTable {
  return {
    id: award.id,
    name: award.name,
    year: award.year.toString(),
    country: award.country?.name || award.countryCode,
  };
}