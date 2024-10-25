import { ActorModel } from "./ActorModel";
import { AwardModel } from "./AwardModel";
import { CountryModel } from "./CountryModel";
import { DirectorModel } from "./DirectorModel";
import { GenreModel } from "./GenreModel";












interface Review {
  id: number;
  content: string;
  rating: number;
  movieId: number;
  userId: number;
}

export interface MovieModel {
  id: number;
  title: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string | null;
  releaseDate: string;
  approvalStatus: boolean;
  rating: number | null;
  
  country: CountryModel | null;
  countryCode: string;

  director: DirectorModel | null;
  directorId: number;

  genres: { genre: GenreModel }[];
  actors: { actor: ActorModel }[];
  awards: { award: AwardModel }[];
  reviews: { review: Review }[] | null;
}