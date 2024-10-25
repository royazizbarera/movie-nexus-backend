import { CountryModel } from "./CountryModel";

export interface AwardModel {
  id: number;
  name: string;
  year: Date;
  countryCode: string;
  country: CountryModel;
}

export interface AwardModelTable {
  id: number;
  name: string;
  year: string;
  country: string;
}