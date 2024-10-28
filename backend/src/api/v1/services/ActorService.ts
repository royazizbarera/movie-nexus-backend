import prisma from "../config/client";
import SearchParams from "../helpers/SearchParams";
import {handleFilter} from "../helpers/handleFilter";

class ActorService {
    joinTable = {
        include: {
            country: true,
        },
    };

    async countActors(whereClause: object, actorIds?: any): Promise<number> {
        try {
            if (actorIds) {
                return prisma.actor.count({
                    where: {
                        id: {in: actorIds},
                        ...whereClause,
                    },
                });
            }
            return prisma.movie.count({where: whereClause});
        } catch (error) {
            console.error("Error counting movies:", error);
            throw new Error("Could not count movies");
        }
    }

    // Metode untuk mendapatkan semua actor
    async getActors({
                        page = 1,
                        pageSize = 24,
                        params,
                    }: {
        page: number | undefined;
        pageSize: number | undefined;
        params: SearchParams;
    }): Promise<any[]> {
        const skip = (page - 1) * pageSize;
        const {filters, searchTerm, country, sortBy, sortOrder} = params;
        const whereClause: any = {AND: []};

        if (filters) {
            whereClause.AND = handleFilter(filters);
        }

        const addCountryFilter = (country: string) => {
            whereClause.AND.push({
                country: {
                    name: country,
                },
            });
        };

        if (country) addCountryFilter(country);

        if (whereClause.AND.length === 0) {
            delete whereClause.AND;
        }

        try {
            let actors;
            let totalItems;

            if (searchTerm) {
                const searchQuery = `
                SELECT id
                FROM "Movie"
                WHERE SIMILARITY("title", $1) > 0.01 OR SIMILARITY("synopsis", $1) > 0.01
                ORDER BY SIMILARITY("title", $1) DESC
                LIMIT $2 OFFSET $3;
            `;
                const searchResults = await prisma.$queryRawUnsafe(searchQuery, searchTerm, pageSize, skip) as any[];

                const actorIds = searchResults.map(actor => actor.id);
                actors = await prisma.actor.findMany({
                    where: {
                        id: {in: actorIds},
                        ...whereClause,
                    },
                    include: this.joinTable.include,
                    skip,
                    take: pageSize,
                });
                totalItems = await this.countActors(whereClause, actorIds);
            } else {
                actors = await prisma.actor.findMany({
                    where: whereClause,
                    orderBy: sortBy ? {[sortBy]: sortOrder || "asc"} : undefined,
                    include: this.joinTable.include,
                    skip,
                    take: pageSize,
                });
                totalItems = await this.countActors(whereClause);
            }

            return [actors, totalItems];
        } catch (error) {
            console.error("Failed to fetch actors: ", error);
            throw new Error("Error fetching actors");
        }
    }

    // Metode untuk mendapatkan satu actor berdasarkan ID
    async getActorById(id: number) {
        try {
            // Mengambil actor berdasarkan ID
            const actor = await prisma.actor.findUnique({
                where: {
                    id: id,
                },
            });

            // Jika actor tidak ditemukan, lempar error
            if (!actor) {
                throw new Error(`Actor with ID ${id} not found`);
            }

            return actor;
        } catch (error) {
            throw new Error(`Could not fetch actor with ID ${id}`);
        }
    }

    async createActor(actorData: any): Promise<any> {
        try {
            const {
                name,
                countryCode,
                birthDate,
                photoUrl
            } = actorData;

            return await prisma.$transaction(async (prisma) => {
                const actor = await prisma.actor.create({
                    data: {
                        name,
                        birthDate: new Date(birthDate),
                        photoUrl,
                        country: {connect: {code: countryCode}}
                    },
                });

                return prisma.actor.findUnique({
                    where: {id: actor.id},
                    ...this.joinTable,
                });
            });
        } catch (error) {
            console.error(error);
            throw new Error("Could not create actor");
        }
    }

    async updateActorById(id: number, updatedData: any): Promise<any> {
        try {
            const existingActor = await prisma.actor.findUnique({ where: { id } });

            if (!existingActor) {
                throw new Error(`Actor with ID ${id} not found.`);
            }

            const dataToUpdate: any = {
                ...(updatedData.name ? { name: updatedData.name } : {}),
                ...(updatedData.photoUrl ? { photoUrl: updatedData.photoUrl } : {}),
                ...(updatedData.birthDate ? { birthDate: updatedData.birthDate } : {}),
                ...(updatedData.countryCode ? { country: { connect: { code: updatedData.countryCode } } } : {})
            };

            return await prisma.actor.update({
                where: {id},
                data: dataToUpdate,
                ...this.joinTable,
            });
        } catch (error) {
            console.error(`Error updating actor with ID ${id}:`, error);
            throw new Error(`Could not update actor with ID ${id}`);
        }
    }

    async deleteActorById(id: number): Promise<{ message: string, deletedActor: any }> {
        try {
            const deletedActor = await prisma.$transaction(async (prisma) => {
                return prisma.actor.delete({where: {id}});
            });

            return {
                message: `Actor with ID ${id} deleted successfully`,
                deletedActor,
            };
        } catch (error) {
            console.error(`Error deleting actor with ID ${id}:`, error);
            throw new Error(`Could not delete actor with ID ${id}`);
        }
    }
}

const actorService = new ActorService();
export default actorService;
