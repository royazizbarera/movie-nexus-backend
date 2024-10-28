import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BreadcrumbsHome from "../components/BreadcrumbsHome";
import BreadcrumbsDashboard from "../components/BreadcrumbsDashboard";
import { AdminTableLayout } from "../layouts/AdminTableLayout";
import GenericTable, { Column } from "../components/GenericTable";
import { MovieParamsModel, MovieModel } from "../../../models/MovieModel";
import genreController from "../../../controllers/GenreController";
import { GenreModel } from "../../../models/GenreModel";
import { PaginationModel } from "../../../models/PaginationModel";
import actorController from "../../../controllers/ActorController";
import { ActorModel } from "../../../models/ActorModel";
import awardController from "../../../controllers/AwardController";
import { AwardModel } from "../../../models/AwardModel";
import getYearsFromXtoY from "../../../helpers/getYearsFromXtoY";
import countryController from "../../../controllers/CountryController";
import { CountryModel } from "../../../models/CountryModel";
import {
  PAGE_SIZE_DROPDOWN,
  SORT_ORDER_DROPDOWN,
} from "../../../configs/constants";
import movieController from "../../../controllers/MovieController";

interface MovieModelTable {
  id: number;
  title: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  releaseDate: string;
  approvalStatus: boolean;
  rating: number;
  country: string;
  director: string;
  genres: string[];
  actors: string[];
  awards: string[];
  reviews: string[];
}

function convertMovieModelToTable(movie: MovieModel): MovieModelTable {
  return {
    id: movie.id,
    title: movie.title,
    synopsis: movie.synopsis,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    videoUrl: movie.videoUrl ?? "", // If videoUrl is null, return empty string
    releaseDate: movie.releaseDate, // Assuming releaseDate is already an ISO string
    approvalStatus: movie.approvalStatus, // Assuming true is "approved", false is "pending"
    rating: movie.rating ?? 0, // If rating is null, default to 0
    country: movie.country ? movie.country.name : "Unknown", // Default to "Unknown" if country is null
    director: movie.director ? movie.director.name : "Unknown", // Default to "Unknown" if director is null
    genres: movie.genres.map((g) => g.genre.name), // Extract genre names from genres array
    actors: movie.actors.map((a) => a.actor.name), // Extract actor names from actors array
    awards: movie.awards.map((a) => a.award.name), // Extract award names from awards array
    reviews: movie.reviews ? movie.reviews.map((r) => r.review.content) : [], // Extract review content from reviews array or empty array if reviews is null
  };
}

const columns: Column<MovieModelTable>[] = [
  {
    key: "id",
    label: "ID",
    type: "number",
    readonly: true,
    width: 70,
  },
  { key: "title", label: "Title", type: "string" },
  { key: "synopsis", label: "Synopsis", type: "string" },
  { key: "posterUrl", label: "Poster", type: "string" },
  { key: "backdropUrl", label: "Backdrop", type: "string" },
  { key: "videoUrl", label: "Video", type: "string" },
  { key: "releaseDate", label: "Release Date", type: "date" },
  {
    key: "approvalStatus",
    label: "Approval Status",
    type: "boolean",
  },
  { key: "rating", label: "Rating", type: "number" },
  { key: "country", label: "Country", type: "string_autocomplete" },
  {
    key: "director",
    label: "Director",
    type: "string_autocomplete",
  },
  { key: "genres", label: "Genres", type: "string[]" },
  { key: "actors", label: "Actors", type: "string[]" },
  { key: "awards", label: "Awards", type: "string[]" },
  { key: "reviews", label: "Reviews", type: "string[]" },
];

export default function AdminMoviePage() {
  const [movies, setMovies] = React.useState<MovieModelTable[]>([]);
  const [pagination, setPagination] = React.useState<PaginationModel>({
    page: 1,
    pageSize: 24,
    totalItems: 0,
    totalPages: 1,
  });
  const [movieParams, setMovieParams] = React.useState<MovieParamsModel>({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  const [genres, setGenres] = React.useState<string[]>([]);
  const [actors, setActors] = React.useState<string[]>([]);
  const [awards, setAwards] = React.useState<string[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);

  const fetchMovies = async (movieParamsModel?: MovieParamsModel) => {
    try {
      const response = await movieController.getMovies(movieParamsModel);
      const { data: movies, pagination } = response;
      setMovies(movies.map(convertMovieModelToTable));
      setPagination(pagination!);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const getGenres = async () => {
    try {
      const response = await genreController.getGenres();
      const data = response.data;
      setGenres(
        data.map((genre: GenreModel) => {
          return genre.name;
        })
      );
    } catch (error) {}
  };

  const getActors = async () => {
    try {
      const response = await actorController.getActors();
      const data = response.data;
      setActors(
        data.map((actor: ActorModel) => {
          return actor.name;
        })
      );
    } catch (error) {
      console.error("Error fetching directors:", error);
    }
  };

  const getAward = async () => {
    try {
      const response = await awardController.getAwards();
      const data = response.data;
      setAwards(
        data.map((award: AwardModel) => {
          return award.name;
        })
      );
    } catch (error) {}
  };

  const getCountries = async () => {
    try {
      const response = await countryController.getCountries();
      const data = response.data;
      setCountries(
        data.map((country: CountryModel) => {
          return country.name;
        })
      );
    } catch (error) {}
  };



  React.useEffect(() => {
    getGenres();
    getActors();
    getAward();
    getCountries();
  }, []);

  React.useEffect(() => {
    fetchMovies(movieParams); // Pass current page to fetchMovies
  }, [movieParams]);

  const handleEditMovie = async (updatedMovie: MovieModelTable) => {
    try {
      // Kirim data yang telah diubah ke endpoint tertentu
      // const response = await axios.put(`http://localhost:3001/movie/${updatedMovie.id}`, updatedMovie);
      // console.log('Movie updated successfully:', response.data);
      console.info("update movie: ", updatedMovie);
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleDeleteMovie = async (movie: MovieModelTable) => {
    try {
      const response = await movieController.deleteMovie(movie.id);
      setMovies((prevMovies) => prevMovies.filter((m) => m.id !== movie.id));
      setPagination((prevPagination) => ({
        ...prevPagination,
        totalItems: prevPagination.totalItems - 1,
      }));
      console.log("Movie deleted successfully:", response.message);
      console.info("delete movie with id: ", movie.id);
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };
  const handlePageChange = async (newPage: number) => {
    handleFilterChange("page", newPage);
  };

  const handleFilterChange = (name: string, value: string | number) => {
    setMovieParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
    console.info("Filter change: ", name, value);
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar selected="movies" />
        <AdminTableLayout>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <BreadcrumbsHome />
              <BreadcrumbsDashboard />
              <Typography
                color="primary"
                sx={{ fontWeight: 500, fontSize: 12 }}
              >
                Movies
              </Typography>
            </Breadcrumbs>
          </Box>
          <GenericTable<MovieModelTable>
            title="Movies"
            data={movies}
            columns={columns}
            options={{
              genres: genres,
              actors: actors,
              awards: awards,
              director: ["Pete Docter"],
              country: countries,
            }}
            filters={{
              genre: genres,
              actor: actors,
              award: awards,
              year: getYearsFromXtoY(
                new Date().getFullYear() - 20,
                new Date().getFullYear(),
                "desc",
                "string"
              ) as string[],
              director: ["Pete Docter"],
              country: countries,
              sortBy: columns.map((column) => column.key),
              sortOrder: SORT_ORDER_DROPDOWN,
              pageSize: PAGE_SIZE_DROPDOWN,
            }}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
            onPageChange={handlePageChange}
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            // search and filter
            onFilterChange={handleFilterChange}
            applySearch
            realtimeSearch
            placeholderSearch="Search movies..."
            onSearchApply={(searchTerm) =>
              handleFilterChange("searchTerm", searchTerm)
            }
          />

          {/* <OrderList /> */}
        </AdminTableLayout>
      </Box>
    </CssVarsProvider>
  );
}
