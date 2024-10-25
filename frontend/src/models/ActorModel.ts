import { CountryModel } from "./CountryModel";

export interface ActorModel {
  id: number;
  name: string;
  birthDate: Date;
  photoUrl: string;
  countryCode: string;
  country: CountryModel;
}

export interface ActorModelTable {
  id: number;
  name: string;
  birthDate: string;
  photoUrl: string;
  country: string;
}



/**
 * Actor params model
 * @param page: number
 * @param pageSize: number
 * @param searchTerm: string
 * @param country: string
 * @param sortBy: string
 * @param sortOrder: string
 */
export interface ActorParamsModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: string;
}