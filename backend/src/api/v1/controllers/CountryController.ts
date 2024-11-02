import countryService from "../services/CountryService";
import HttpStatus from "../config/constants/HttpStatus";
import ResponseApi from "../config/ResponseApi";
import {Response, Request} from "express";

class CountryController {
    async getCountries(req: Request, res: Response) {
        try {
            const parsedPage = parseInt(req.query.page as string) || 1;
            const parsedPageSize = parseInt(req.query.pageSize as string) || 24;

            const {
                searchTerm = '',
                sortBy = '',
                sortOrder = 'asc',
            } = req.query;

            const [countries, totalItems] = await countryService.getCountries({
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
                    message: "Countries fetched successfully",
                    data: countries,
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
            console.error("Error fetching countries: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch countries",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async getCountryByCode(req: Request, res: Response) {
        try {
            const countryCode = req.params.code;

            if (!countryCode) {
                return res.status(HttpStatus.BAD_REQUEST).json(
                    ResponseApi({
                        code: HttpStatus.BAD_REQUEST,
                        message: "Invalid country Code",
                        version: 1.0,
                    })
                );
            }

            const country = await countryService.getCountryByCode(countryCode);

            if (!country) {
                return res.status(HttpStatus.NOT_FOUND).json(
                    ResponseApi({
                        code: HttpStatus.NOT_FOUND,
                        message: "Country not found",
                        version: 1.0,
                    })
                );
            }

            return res.json(
                ResponseApi({
                    code: HttpStatus.OK,
                    message: "Country fetched successfully",
                    data: country,
                    version: 1.0,
                })
            );
        } catch (error) {
            console.error("Error fetching country: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to fetch country",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async createCountry(req: Request, res: Response) {
        try {
            const countryData = req.query;

            const newCountry = await countryService.createCountry(countryData);

            return res.json(
                ResponseApi({
                    code: HttpStatus.CREATED,
                    message: "Country created successfully",
                    data: newCountry,
                    version: 1.0,
                })
            );
        } catch (error) {
            console.error("Error creating country: ", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ResponseApi({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Failed to create country",
                    errors: error instanceof Error ? error.message : String(error),
                    version: 1.0,
                })
            );
        }
    }

    async updateCountryByCode(req: Request, res: Response): Promise<Response> {
        const countryCode = req.params.code;
        const countryData = req.query;

        try {
            const updatedCountry = await countryService.updateCountryByCode(countryCode, countryData);

            return res.json(ResponseApi({
                code: HttpStatus.OK,
                message: "Country updated successfully",
                data: updatedCountry,
                version: 1.0,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to update country",
                errors: errorMessage,
                version: 1.0,
            }));
        }
    }

    async deleteCountryByCode(req: Request, res: Response): Promise<Response> {
        const countryCode = req.params.code;

        try {
            const deletedCountry = await countryService.deleteCountryByCode(countryCode);

            return res.json(ResponseApi({
                code: HttpStatus.OK,
                message: "Country deleted successfully",
                data: deletedCountry,
                version: 1.0,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to delete country",
                errors: errorMessage,
                version: 1.0,
            }));
        }
    }
}

const countryController = new CountryController();
export default countryController;
