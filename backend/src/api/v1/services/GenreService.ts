import prisma from "../config/client";
import SearchParams from "../helpers/SearchParams";

class GenreService {
    async countGenres(whereClause: object, genresIds?: any): Promise<number> {
        try {
            if (genresIds) {
                return prisma.genre.count({
                    where: {
                        id: {in: genresIds},
                        ...whereClause,
                    },
                });
            }
            return prisma.genre.count({where: whereClause});
        } catch (error) {
            console.error("Error counting genres:", error);
            throw new Error("Could not count genres");
        }
    }

    async getGenres({
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
            let genres;
            let totalItems;

            if (searchTerm) {
                const searchQuery = `
                SELECT id
                FROM "Genre"
                WHERE SIMILARITY("name", $1) > 0.1
                ORDER BY SIMILARITY("name", $1) DESC
                LIMIT $2 OFFSET $3;
            `;
                const searchResults = await prisma.$queryRawUnsafe(searchQuery, searchTerm, pageSize, skip) as any[];

                const genresIds = searchResults.map(genre => genre.id);
                genres = await prisma.genre.findMany({
                    where: {
                        id: {in: genresIds},
                        ...whereClause,
                    },
                    skip,
                    take: pageSize,
                });
                totalItems = await this.countGenres(whereClause, genresIds);
            } else {
                genres = await prisma.genre.findMany({
                    where: whereClause,
                    orderBy: sortBy ? {[sortBy]: sortOrder || "asc"} : undefined,
                    skip,
                    take: pageSize,
                });

                totalItems = await this.countGenres(whereClause);
            }

            return [genres, totalItems];
        } catch (error) {
            throw new Error("Error fetching genres");
        }
    }

    async getGenreById(id: number) {
        try {
            return await prisma.genre.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new Error(`Could not fetch genre with ID ${id}`);
        }
    }

    async createGenre(genreData: any): Promise<any> {
        try {
            const {
                name
            } = genreData;

            return await prisma.$transaction(async (prisma) => {
                const genre = await prisma.genre.create({
                    data: {
                        name
                    },
                });

                return prisma.genre.findUnique({
                    where: {id: genre.id}
                });
            });
        } catch (error) {
            throw new Error("Could not create genre");
        }
    }

    async updateGenreById(id: number, updatedData: any): Promise<any> {
        try {
            const dataToUpdate: any = {
                ...(updatedData.name ? { name: updatedData.name } : {})
            };

            return await prisma.genre.update({
                where: {id},
                data: dataToUpdate
            });
        } catch (error) {
            throw new Error(`Could not update genre with ID ${id}`);
        }
    }

    async deleteGenreById(id: number): Promise<{ message: string, deletedGenre: any }> {
        try {
            const deletedGenre = await prisma.$transaction(async (prisma) => {
                await prisma.movieGenres.deleteMany({where: {genreId: id}});
                return prisma.genre.delete({where: {id}});
            });

            return {
                message: `Genre with ID ${id} deleted successfully`,
                deletedGenre,
            };
        } catch (error) {
            throw new Error(`Could not delete genre with ID ${id}`);
        }
    }
}

const genreService = new GenreService();
export default genreService;
