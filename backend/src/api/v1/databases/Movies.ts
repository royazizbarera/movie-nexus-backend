import MovieModel from "../models/MovieModel";
import movieData from "../databases/datas/movies.json";
import userData from "../databases/datas/users.json";

export const movies: MovieModel[] = movieData.map((movie) => ({
    id: movie.id,
    title: movie.title,
    synopsis: movie.synopsis,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    videoUrl: movie.videoUrl,
    releaseDate: new Date(movie.releaseDate),
    approvalStatus: movie.approvalStatus,
    countryCode: movie.countryId,
    directorId: movie.directorId,
    rating: typeof movie.rating === "string" ? parseFloat(movie.rating) : movie.rating,
    userId: userData[0].id
}));

interface MovieActorsModel {
    movieId: number;
    actorId: number;
}

export const movieActors: MovieActorsModel[] = require("../databases/datas/movieActors.json");

interface MovieGenresModel {
    movieId: number;
    genreId: number;
}

export const movieGenres: MovieGenresModel[] = require("../databases/datas/movieGenres.json");

interface MovieAwardsModel {
    movieId: number;
    awardId: number;
}

const movieIds = movies.map((movie) => movie.id);

export const movieAwards: MovieAwardsModel[] = Array.from(
    {length: movies.length * 10},
    (_, index) => ({
        movieId: movieIds[Math.floor(index / 10)],
        awardId: Math.floor(Math.random() * 25) + 1,
    })
);
