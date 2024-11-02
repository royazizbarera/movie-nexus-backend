import prisma from "../config/client";
import SearchParams from "../helpers/SearchParams";

class CountryService {
    async countCountries(whereClause: object, countryCodes?: any): Promise<number> {
        try {
            if (countryCodes) {
                return prisma.country.count({
                    where: {
                        code: {in: countryCodes},
                        ...whereClause,
                    },
                });
            }
            return prisma.country.count({where: whereClause});
        } catch (error) {
            console.error("Error counting countries:", error);
            throw new Error("Could not count countries");
        }
    }

    async getCountries({
                        page = 1,
                        pageSize = 24,
                        params,
                    }: {
        page: number | undefined;
        pageSize: number | undefined;
        params: SearchParams;
    }): Promise<any[]> {
        const skip = (page - 1) * pageSize;
        const {searchTerm, sortBy, sortOrder} = params;
        const whereClause: any = {AND: []};

        if (whereClause.AND.length === 0) {
            delete whereClause.AND;
        }

        try {
            let countries;
            let totalItems;

            if (searchTerm) {
                const searchQuery = `
                SELECT code
                FROM "Country"
                WHERE SIMILARITY("name", $1) > 0.1
                ORDER BY SIMILARITY("name", $1) DESC
                LIMIT $2 OFFSET $3;
            `;
                const searchResults = await prisma.$queryRawUnsafe(searchQuery, searchTerm, pageSize, skip) as any[];

                const countryCodes = searchResults.map(country => country.code);
                countries = await prisma.country.findMany({
                    where: {
                        code: {in: countryCodes},
                        ...whereClause,
                    },
                    skip,
                    take: pageSize,
                });
                totalItems = await this.countCountries(whereClause, countryCodes);
            } else {
                countries = await prisma.country.findMany({
                    where: whereClause,
                    orderBy: sortBy ? {[sortBy]: sortOrder || "asc"} : undefined,
                    skip,
                    take: pageSize,
                });
                totalItems = await this.countCountries(whereClause);
            }

            return [countries, totalItems];
        } catch (error) {
            throw new Error("Error fetching countries");
        }
    }

    async getCountryByCode(code: string) {
        try {
            return await prisma.country.findUnique({
                where: {
                    code: code,
                },
            });
        } catch (error) {
            throw new Error(`Could not fetch country with Code ${code}`);
        }
    }

    async createCountry(countryData: any): Promise<any> {
        try {
            const {
                code,
                name
            } = countryData;

            return await prisma.$transaction(async (prisma) => {
                const country = await prisma.country.create({
                    data: {
                        code,
                        name
                    },
                });

                return prisma.country.findUnique({
                    where: {code: country.code}
                });
            });
        } catch (error) {
            throw new Error("Could not create country");
        }
    }

    async updateCountryByCode(code: string, updatedData: any): Promise<any> {
        try {
            const dataToUpdate: any = {
                ...(updatedData.code ? { code: updatedData.code } : {}),
                ...(updatedData.name ? { name: updatedData.name } : {})
            };

            return await prisma.country.update({
                where: {code},
                data: dataToUpdate,
            });
        } catch (error) {
            throw new Error(`Could not update country with Code ${code}`);
        }
    }

    async deleteCountryByCode(code: string): Promise<{ message: string, deletedCountry: any }> {
        try {
            const deletedCountry = await prisma.$transaction(async (prisma) => {
                return prisma.country.delete({where: {code}});
            });

            return {
                message: `Country with Code ${code} deleted successfully`,
                deletedCountry
            };
        } catch (error) {
            throw new Error(`Could not delete country with Code ${code}`);
        }
    }
}

const countryService = new CountryService();
export default countryService;
