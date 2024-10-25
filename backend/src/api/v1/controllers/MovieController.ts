import movieService from "../services/MovieService";
import ResponseApi from "../config/ResponseApi";
import HttpStatus from "../config/constants/HttpStatus";
import {Response, Request} from "express";

class MovieController {
    /**
     * Handles the creation of a new movie.
     * @param req - The HTTP request object, containing movie data in the body.
     * @param res - The HTTP response object.
     * @returns A JSON response with the status of movie creation.
     */
    async createMovie(req: Request, res: Response): Promise<Response> {
        const movieData = req.body;

        try {
            const newMovie = await movieService.createMovie(movieData);
            return res.status(HttpStatus.CREATED).json(
                ResponseApi({
                    code: HttpStatus.CREATED,
                    message: "Movie created successfully",
                    data: newMovie,
                    version: 1.0,
                })
            );
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to create movie",
                    errors: error,
                    version: 1.0,
                })
            );
        }
    }

    /**
     * Retrieves a list of movies with pagination, sorting, and filtering options.
     * @param req - The HTTP request object containing query parameters.
     * @param res - The HTTP response object.
     * @returns A JSON response with the list of movies and pagination details.
     */
    async getMovies(req: Request, res: Response): Promise<Response> {
        const {
            page = "1",
            pageSize = "24",
            searchTerm = "",
            genre = "",
            country = "",
            actor = "",
            year = "",
            award = "",
            director = "",
            sortBy = "title",
            sortOrder = "asc",
            filters = [],
        } = req.query;

        const parsedPage = Math.max(parseInt(page as string), 1);
        const parsedPageSize = Math.min(parseInt(pageSize as string), 24);

        const parsedSortOrder: "asc" | "desc" = sortOrder === "desc" ? "desc" : "asc";
        const parsedFilters = Array.isArray(filters) ? filters : [];

        if (parseInt(year as string) < 1900) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                ResponseApi({
                    code: HttpStatus.BAD_REQUEST,
                    message: "Year must be a valid number greater than 1900",
                    version: 1.0,
                })
            );
        }

        try {
            const [movies, totalItems] = await Promise.all([
                movieService.getMovies({
                    page: parsedPage,
                    pageSize: parsedPageSize,
                    params: {
                        searchTerm: searchTerm as string,
                        country: country as string,
                        actor: actor as string,
                        year: parseInt(year as string),
                        award: award as string,
                        director: director as string,
                        sortBy: sortBy as string,
                        sortOrder: parsedSortOrder,
                        filters: parsedFilters,
                        genre: genre as string,
                    },
                }),
                movieService.countMovies(),
            ]);

            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Movies fetched successfully",
                    data: movies,
                    version: 1.0,
                    pagination: {
                        page: parsedPage,
                        pageSize: parsedPageSize,
                        totalItems,
                        totalPages: Math.ceil(totalItems / parsedPageSize),
                    },
                })
            );
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch movies",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    /**
     * Retrieves a movie by its ID.
     * @param req - The HTTP request object containing the movie ID as a parameter.
     * @param res - The HTTP response object.
     * @returns A JSON response with the movie data.
     */
    async getMovieById(req: Request, res: Response): Promise<Response> {
        const movieId = parseInt(req.params.id);

        try {
            const movie = await movieService.getMovieById(movieId);
            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Movie fetched successfully",
                    data: movie,
                    version: 1.0,
                })
            );
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch movie",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    /**
     * Updates a movie by its ID.
     * @param req - The HTTP request object containing the movie ID as a parameter and the updated movie data in the body.
     * @param res - The HTTP response object.
     * @returns A JSON response with the updated movie data.
     */
    async updateMovieById(req: Request, res: Response): Promise<Response> {
        const movieId = parseInt(req.params.id);
        const movieData = req.body;

        try {
            const updatedMovie = await movieService.updateMovieById(movieId, movieData);

            return res.json(ResponseApi({
                code: HttpStatus.OK,
                message: "Movie updated successfully",
                data: updatedMovie,
                version: 1.0,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to update movie",
                errors: errorMessage,
                version: 1.0,
            }));
        }
    }

    /**
     * Deletes a movie by its ID.
     * @param req - The HTTP request object containing the movie ID as a parameter.
     * @param res - The HTTP response object.
     * @returns A JSON response indicating the result of the delete operation.
     */
    async deleteMovieById(req: Request, res: Response): Promise<Response> {
        const movieId = parseInt(req.params.id);

        try {
            const deletedMovie = await movieService.deleteMovieById(movieId);

            return res.json(ResponseApi({
                code: HttpStatus.OK,
                message: "Movie deleted successfully",
                data: deletedMovie,
                version: 1.0,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to delete movie",
                errors: errorMessage,
                version: 1.0,
            }));
        }
    }
}

const movieController = new MovieController();
export default movieController;
