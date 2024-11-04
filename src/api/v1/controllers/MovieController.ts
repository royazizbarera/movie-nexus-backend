import movieService from "../services/MovieService";
import ResponseApi from "../config/ResponseApi";
import HttpStatus from "../config/constants/HttpStatus";
import { Response, Request } from "express";

class MovieController {
  /**
   * Creates a new movie in the database using provided data.
   * @param req - Express Request object containing movie data in the body.
   * @param res - Express Response object.
   * @returns JSON response with creation status and the created movie data.
   */
  async createMovie(req: Request, res: Response): Promise<Response> {
    try {
      const newMovie = await movieService.createMovie(req.body);
      return res.status(HttpStatus.CREATED).json(
        ResponseApi({
          code: HttpStatus.CREATED,
          message: "Movie created successfully",
          data: newMovie,
          version: 1.0,
        })
      );
    } catch (error) {
      return this.handleError(res, error, "Failed to create movie");
    }
  }

  /**
   * Retrieves a list of movies with optional filters, sorting, and pagination.
   * @param req - Express Request object with query parameters for filtering, sorting, and pagination.
   * @param res - Express Response object.
   * @returns JSON response containing the list of movies with pagination details.
   */
  async getMovies(req: Request, res: Response): Promise<Response> {
    try {
      const { page = "1", pageSize = "24", year, ...filters } = req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);

      // Early validation for the year filter
      if (year && parseInt(year as string, 10) < 1900) {
        return res.status(HttpStatus.BAD_REQUEST).json(
          ResponseApi({
            code: HttpStatus.BAD_REQUEST,
            message: "Year must be a valid number greater than 1900",
            version: 1.0,
          })
        );
      }

      const [movies, totalItems] = await movieService.getMovies({
        page: parsedPage,
        pageSize: parsedPageSize,
        params: {
          ...filters,
          year: year ? parseInt(year as string, 10) : undefined,
        },
      });

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
      return this.handleError(res, error, "Failed to fetch movies");
    }
  }

  /**
   * Retrieves a list of unapproved movies with optional filters, sorting, and pagination.
   * @param req - Express Request object with query parameters for filtering, sorting, and pagination.
   * @param res - Express Response object.
   * @returns JSON response containing the list of movies with pagination details.
   */
  async getUnapprovedMovies(req: Request, res: Response): Promise<Response> {
    try {
      const { page = "1", pageSize = "24", year, ...filters } = req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);

      // Early validation for the year filter
      if (year && parseInt(year as string, 10) < 1900) {
        return res.status(HttpStatus.BAD_REQUEST).json(
          ResponseApi({
            code: HttpStatus.BAD_REQUEST,
            message: "Year must be a valid number greater than 1900",
            version: 1.0,
          })
        );
      }

      let filtered = { ...filters, approvalStatus: false };

      const [movies, totalItems] = await movieService.getMovies({
        page: parsedPage,
        pageSize: parsedPageSize,
        params: {
          ...filtered,
          year: year ? parseInt(year as string, 10) : undefined,
        },
      });

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
      return this.handleError(res, error, "Failed to fetch movies");
    }
  }

  /**
   * Retrieves a movie by its unique identifier.
   * @param req - Express Request object containing the movie ID as a route parameter.
   * @param res - Express Response object.
   * @returns JSON response with the movie details if found.
   */
  async getMovieById(req: Request, res: Response): Promise<Response> {
    try {
      const movieId = parseInt(req.params.id);
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
      return this.handleError(res, error, "Failed to fetch movie");
    }
  }

  /**
   * Updates an existing movie by its unique identifier.
   * @param req - Express Request object containing the movie ID as a route parameter and updated data in the body.
   * @param res - Express Response object.
   * @returns JSON response with the updated movie data.
   */
  async updateMovieById(req: Request, res: Response): Promise<Response> {
    try {
      const movieId = parseInt(req.params.id);
      const updatedMovie = await movieService.updateMovieById(
        movieId,
        req.body
      );

      return res.json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Movie updated successfully",
          data: updatedMovie,
          version: 1.0,
        })
      );
    } catch (error) {
      return this.handleError(res, error, "Failed to update movie");
    }
  }

  /**
   * Deletes a movie by its unique identifier.
   * @param req - Express Request object containing the movie ID as a route parameter.
   * @param res - Express Response object.
   * @returns JSON response indicating the result of the delete operation.
   */
  async deleteMovieById(req: Request, res: Response): Promise<Response> {
    try {
      const movieId = parseInt(req.params.id);
      const deletedMovie = await movieService.deleteMovieById(movieId);

      return res.json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Movie deleted successfully",
          data: deletedMovie,
          version: 1.0,
        })
      );
    } catch (error) {
      return this.handleError(res, error, "Failed to delete movie");
    }
  }

  /**
   * Handles errors by sending a standardized JSON response.
   * @param res - Express Response object.
   * @param error - Error object or string message.
   * @param defaultMessage - Default message to include in the response if error lacks a message.
   * @returns JSON response with error details.
   */
  private handleError(
    res: Response,
    error: unknown,
    defaultMessage: string
  ): Response {
    const message = error instanceof Error ? error.message : defaultMessage;
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ResponseApi({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        errors: message,
        version: 1.0,
      })
    );
  }
}

const movieController = new MovieController();
export default movieController;
