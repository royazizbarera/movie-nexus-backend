import genreService from "../services/GenreService";
import HttpStatus from "../config/constants/HttpStatus";
import ResponseApi from "../config/ResponseApi";
import {Response, Request} from "express";

class GenreController {
    async getGenres(req: Request, res: Response) {
        try {
            const parsedPage = parseInt(req.query.page as string) || 1;
            const parsedPageSize = parseInt(req.query.pageSize as string) || 24;

            const {
                searchTerm = '',
                sortBy = '',
                sortOrder = 'asc',
            } = req.query;

            const [genres, totalItems] = await genreService.getGenres({
                page: parsedPage,
                pageSize: parsedPageSize,
                params: {
                    searchTerm: searchTerm as string,
                    sortBy: sortBy as string,
                    sortOrder: sortOrder as "asc" | "desc",
                },
            });

            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Genres fetched successfully",
                    data: genres,
                    version: 1.0,
                    pagination: {
                        page: parsedPage || 1,
                        pageSize: parsedPageSize || 1,
                        totalItems: totalItems,
                        totalPages: Math.ceil(totalItems / (parsedPageSize || 1)),
                    },
                })
            );
        } catch (error) {
            console.error("Error fetching genres: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch genres",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async getGenreById(req: Request, res: Response) {
        try {
            const genreId = parseInt(req.params.id);

            if (isNaN(genreId)) {
                return res.status(HttpStatus.BAD_REQUEST).json(
                    ResponseApi({
                        code: HttpStatus.BAD_REQUEST,
                        message: "Invalid genre ID",
                        version: 1.0,
                    })
                );
            }

            const genre = await genreService.getGenreById(genreId);

            if (!genre) {
                return res.status(HttpStatus.NOT_FOUND).json(
                    ResponseApi({
                        code: HttpStatus.NOT_FOUND,
                        message: "Genre not found",
                        version: 1.0,
                    })
                );
            }

            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Genre fetched successfully",
                    data: genre,
                    version: 1.0,
                })
            );
        } catch (error) {
            console.error("Error fetching genre: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch genre",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async createGenre(req: Request, res: Response) {
        try {
            const genreData = req.query;

            const newGenre = await genreService.createGenre(genreData);

            return res.json(
                ResponseApi({
                    code: HttpStatus.CREATED,
                    message: "Genre created successfully",
                    data: newGenre,
                    version: 1.0,
                })
            );
        } catch (error) {
            console.error("Error creating genre: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to create genre",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async updateGenreById(req: Request, res: Response): Promise<Response> {
        const genreId = parseInt(req.params.id);
        const genreData = req.query;

        try {
            const updatedGenre = await genreService.updateGenreById(genreId, genreData);

            return res.json(ResponseApi({
                code: HttpStatus.OK,
                message: "Genre updated successfully",
                data: updatedGenre,
                version: 1.0,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to update genre",
                errors: errorMessage,
                version: 1.0,
            }));
        }
    }

    async deleteGenreById(req: Request, res: Response): Promise<Response> {
        const genreId = parseInt(req.params.id);

        try {
            const deletedGenre = await genreService.deleteGenreById(genreId);

            return res.json(ResponseApi({
                code: HttpStatus.OK,
                message: "Genre deleted successfully",
                data: deletedGenre,
                version: 1.0,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to delete genre",
                errors: errorMessage,
                version: 1.0,
            }));
        }
    }
}

const genreController = new GenreController();
export default genreController;
