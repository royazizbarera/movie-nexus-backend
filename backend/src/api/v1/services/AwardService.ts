import prisma from "../config/client";
import SearchParams from "../helpers/SearchParams";
import {addAwardYearFilter, addCountryFilter} from "../helpers/fieldFilter";

class AwardService {
    joinTable = {
        include: {
            country: true,
        },
    };

    async countAwards(whereClause: object, awardsIds?: any): Promise<number> {
        try {
            if (awardsIds) {
                return prisma.award.count({
                    where: {
                        id: {in: awardsIds},
                        ...whereClause,
                    },
                });
            }
            return prisma.award.count({where: whereClause});
        } catch (error) {
            console.error("Error counting awards:", error);
            throw new Error("Could not count awards");
        }
    }

    async getAwards({
                        page = 1,
                        pageSize = 24,
                        params,
                    }: {
        page: number | undefined;
        pageSize: number | undefined;
        params: SearchParams;
    }): Promise<any[]> {
        const skip = (page - 1) * pageSize;
        const {searchTerm, country, year, sortBy, sortOrder} = params;
        const whereClause: any = {AND: []};

        if (country) addCountryFilter(whereClause, country);
        if (year) addAwardYearFilter(whereClause, year);

        if (whereClause.AND.length === 0) {
            delete whereClause.AND;
        }

        try {
            let awards;
            let totalItems;

            if (searchTerm) {
                const searchQuery = `
                SELECT id
                FROM "Award"
                WHERE SIMILARITY("name", $1) > 0.1
                ORDER BY SIMILARITY("name", $1) DESC
                LIMIT $2 OFFSET $3;
            `;
                const searchResults = await prisma.$queryRawUnsafe(searchQuery, searchTerm, pageSize, skip) as any[];

                const awardsIds = searchResults.map(award => award.id);
                awards = await prisma.award.findMany({
                    where: {
                        id: {in: awardsIds},
                        ...whereClause,
                    },
                    include: this.joinTable.include,
                    skip,
                    take: pageSize,
                });
                totalItems = await this.countAwards(whereClause, awardsIds);
            } else {
                awards = await prisma.award.findMany({
                    where: whereClause,
                    orderBy: sortBy ? {[sortBy]: sortOrder || "asc"} : undefined,
                    include: this.joinTable.include,
                    skip,
                    take: pageSize,
                });

                totalItems = await this.countAwards(whereClause);
            }

            return [awards, totalItems];
        } catch (error) {
            throw new Error("Error fetching awards");
        }
    }

    async getAwardById(id: number) {
        try {
            return await prisma.award.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new Error(`Could not fetch award with ID ${id}`);
        }
    }

    async createAward(awardData: any): Promise<any> {
        try {
            const {
                name,
                countryCode,
                year
            } = awardData;

            return await prisma.$transaction(async (prisma) => {
                const award = await prisma.award.create({
                    data: {
                        name,
                        year: new Date(year),
                        country: {connect: {code: countryCode}}
                    },
                });

                return prisma.award.findUnique({
                    where: {id: award.id},
                    ...this.joinTable,
                });
            });
        } catch (error) {
            throw new Error("Could not create award");
        }
    }

    async updateAwardById(id: number, updatedData: any): Promise<any> {
        try {
            const dataToUpdate: any = {
                ...(updatedData.name ? { name: updatedData.name } : {}),
                ...(updatedData.countryCode ? { country: { connect: { code: updatedData.countryCode } } } : {}),
                ...(updatedData.year ? { year: new Date(updatedData.year) } : {}),
            };

            return await prisma.award.update({
                where: {id},
                data: dataToUpdate,
                ...this.joinTable,
            });
        } catch (error) {
            throw new Error(`Could not update award with ID ${id}`);
        }
    }

    async deleteAwardById(id: number): Promise<{ message: string, deletedAward: any }> {
        try {
            const deletedAward = await prisma.$transaction(async (prisma) => {
                await prisma.movieAwards.deleteMany({where: {awardId: id}});
                return prisma.award.delete({where: {id}});
            });

            return {
                message: `Award with ID ${id} deleted successfully`,
                deletedAward,
            };
        } catch (error) {
            throw new Error(`Could not delete award with ID ${id}`);
        }
    }
}

const awardService = new AwardService();
export default awardService;
