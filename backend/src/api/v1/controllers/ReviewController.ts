import HttpStatus from "../config/constants/HttpStatus";
import ResponseApi from "../config/ResponseApi";
import reviewService from "../services/ReviewService";
import { Response, Request } from "express";

class ReviewController {
    /**
     * Retrieves a list of reviews based on pagination, search parameters, and filters.
     *
     * @param {Request} req - The Express request object containing query parameters.
     * @param {Response} res - The Express response object to send back the result.
     * @returns {Promise<Response>} A promise that resolves to a JSON response containing the reviews data and pagination info.
     * @throws {Error} If there is an issue fetching the reviews, an error message will be returned.
     */
    async getReviews(req: Request, res: Response): Promise<Response> {
        try {
            const {
                page = "1",
                pageSize = "10",
                searchTerm = '',
                rating = '',
                userId = '',
                sortBy = '',
                sortOrder = 'asc',
            } = req.query;

            const parsedPage = parseInt(page as string, 10) || 1;
            const parsedPageSize = parseInt(pageSize as string, 10) || 10;

            const [reviews, totalItems] = await reviewService.getReviews({
                page: parsedPage,
                pageSize: parsedPageSize,
                params: {
                    searchTerm: searchTerm as string,
                    rating: parseInt(rating as string, 10),
                    userId: parseInt(userId as string, 10),
                    sortBy: sortBy as string,
                    sortOrder: sortOrder as "asc" | "desc",
                },
            });

            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Reviews fetched successfully",
                    data: reviews,
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
            console.error("Error fetching reviews: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch reviews",
                    errors: error instanceof Error ? error.message : String(error),
                })
            );
        }
    }

    /**
     * Retrieves a single review by their ID.
     *
     * @param {Request} req - The Express request object containing the review ID in the route parameters.
     * @param {Response} res - The Express response object to send back the result.
     * @returns {Promise<Response>} A promise that resolves to a JSON response containing the review's data.
     * @throws {Error} If the review cannot be found or there is an issue retrieving the review, an error will be thrown.
     */
    async getReviewById(req: Request, res: Response): Promise<Response> {
        try {
            const reviewId = parseInt(req.params.id, 10);

            if (isNaN(reviewId)) {
                return res.status(HttpStatus.BAD_REQUEST).json(
                    ResponseApi({
                        code: HttpStatus.BAD_REQUEST,
                        message: "Invalid review ID",
                        version: 1.0,
                    })
                );
            }

            const review = await reviewService.getReviewById(reviewId);

            if (!review) {
                return res.status(HttpStatus.NOT_FOUND).json(
                    ResponseApi({
                        code: HttpStatus.NOT_FOUND,
                        message: "Review not found",
                        version: 1.0,
                    })
                );
            }

            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Review fetched successfully",
                    data: review,
                    version: 1.0,
                })
            );
        } catch (error) {
            console.error("Error fetching review: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch review",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }
}

const reviewController = new ReviewController();
export default reviewController;