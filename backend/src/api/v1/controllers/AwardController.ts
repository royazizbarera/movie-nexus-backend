import HttpStatus from "../config/constants/HttpStatus";
import ResponseApi from "../config/ResponseApi";
import awardService from "../services/AwardService";
import {Response, Request} from "express";

class AwardController {
    async getAwards(req: Request, res: Response) {
        try {
            const parsedPage = parseInt(req.query.page as string) || 1;
            const parsedPageSize = parseInt(req.query.pageSize as string) || 24;

            const {
                searchTerm = '',
                year = '',
                country = '',
                sortBy = '',
                sortOrder = 'asc',
            } = req.query;

            const [awards, totalItems] = await awardService.getAwards({
                page: parsedPage,
                pageSize: parsedPageSize,
                params: {
                    searchTerm: searchTerm as string,
                    country: country as string,
                    year: parseInt(year as string) || undefined,
                    sortBy: sortBy as string,
                    sortOrder: sortOrder as "asc" | "desc",
                },
            });

            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Awards fetched successfully",
                    data: awards,
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
            console.error("Error fetching awards: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch awards",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async getAwardById(req: Request, res: Response) {
        try {
            const awardId = parseInt(req.params.id);

            if (isNaN(awardId)) {
                return res.status(HttpStatus.BAD_REQUEST).json(
                    ResponseApi({
                        code: HttpStatus.BAD_REQUEST,
                        message: "Invalid award ID",
                        version: 1.0,
                    })
                );
            }

            const award = await awardService.getAwardById(awardId);

            if (!award) {
                return res.status(HttpStatus.NOT_FOUND).json(
                    ResponseApi({
                        code: HttpStatus.NOT_FOUND,
                        message: "Award not found",
                        version: 1.0,
                    })
                );
            }

            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Award fetched successfully",
                    data: award,
                    version: 1.0,
                })
            );
        } catch (error) {
            console.error("Error fetching award: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch award",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async createAward(req: Request, res: Response) {
        try {
            const awardData = req.query;

            const newAward = await awardService.createAward(awardData);

            return res.json(
                ResponseApi({
                    code: HttpStatus.CREATED,
                    message: "Award created successfully",
                    data: newAward,
                    version: 1.0,
                })
            );
        } catch (error) {
            console.error("Error creating award: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to create award",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async updateAwardById(req: Request, res: Response): Promise<Response> {
        const awardId = parseInt(req.params.id);
        const awardData = req.query;

        try {
            const updatedAward = await awardService.updateAwardById(awardId, awardData);

            return res.json(ResponseApi({
                code: HttpStatus.OK,
                message: "Award updated successfully",
                data: updatedAward,
                version: 1.0,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to update award",
                errors: errorMessage,
                version: 1.0,
            }));
        }
    }

    async deleteAwardById(req: Request, res: Response): Promise<Response> {
        const awardId = parseInt(req.params.id);

        try {
            const deletedAward = await awardService.deleteAwardById(awardId);

            return res.json(ResponseApi({
                code: HttpStatus.OK,
                message: "Award deleted successfully",
                data: deletedAward,
                version: 1.0,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to delete award",
                errors: errorMessage,
                version: 1.0,
            }));
        }
    }
}

const awardController = new AwardController();
export default awardController;
