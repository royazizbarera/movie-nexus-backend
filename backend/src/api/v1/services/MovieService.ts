import prisma from "../config/client";
import SearchParams from "../helpers/SearchParams";
import {handleFilter} from "../helpers/handleFilter";

class MovieService {
    joinTable = {
        include: {
            country: true,
            director: true,
            genres: {
                select: {
                    genre: true,
                },
            },
            actors: {
                select: {
                    actor: {
                        include: {
                            country: true,
                        },
                    },
                },
            },
            awards: {
                select: {
                    award: true,
                },
            },
            reviews: true,
        },
    };

    /**
     * Refactors the movie object to sort and map genres, actors, and awards.
     * @param movies - The array of movies to refactor.
     * @returns An array of refactored movies.
     */
    refactorMovies(movies: any[]): any[] {
        return movies
            .map(movie => ({
                ...movie,
                genres: this.sortAndMap(movie.genres, 'genre'),
                actors: this.sortAndMap(movie.actors, 'actor'),
                awards: this.sortAndMap(movie.awards, 'award'),
            }))
            .sort((a, b) => a.id - b.id);
    }

    /**
     * Maps and sorts an array of objects based on a specified property.
     * @param items - The array of items to process.
     * @param property - The property to extract from each item.
     * @returns A sorted array of the specified property.
     */
    private sortAndMap(items: any[], property: string): any[] {
        return items
            .map(item => item[property])
            .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
    }

    /**
     * Counts the total number of movies in the database.
     * @param whereClause - The where clause to filter the movies.
     * @param movieIds - The IDs of the movies to count.
     * @returns {Promise<number>} A promise that resolves to the total count of movies.
     * @throws {Error} Throws an error if the count operation fails.
     */
    async countMovies(whereClause: object, movieIds?: any): Promise<number> {
        try {
            if (movieIds) {
                return prisma.movie.count({
                    where: {
                        id: {in: movieIds},
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

    /**
     * Creates a new movie record in the database along with its related data
     * (country, director, genres, actors, and awards) within a transaction.
     *
     * @param {any} movieData - The data for the new movie, including title, synopsis, poster URL,
     *                           release date, approval status, rating, backdrop URL, video URL,
     *                           country code, director ID, genres, actors, and awards.
     * @returns {Promise<any>} A promise that resolves to the newly created movie object.
     * @throws {Error} Throws an error if the movie creation fails.
     */
    async createMovie(movieData: any): Promise<any> {
        try {
            const {
                title,
                synopsis,
                posterUrl,
                releaseDate,
                approvalStatus,
                rating,
                backdropUrl,
                videoUrl,
                countryCode,
                directorId,
                genres,
                actors,
                awards
            } = movieData;

            const newMovie = await prisma.$transaction(async (prisma) => {
                const movie = await prisma.movie.create({
                    data: {
                        title,
                        synopsis,
                        posterUrl,
                        releaseDate: new Date(releaseDate),
                        approvalStatus: Boolean(approvalStatus),
                        rating: parseFloat(rating),
                        backdropUrl,
                        videoUrl,
                        country: {connect: {code: countryCode}},
                        director: {connect: {id: parseInt(directorId)}},
                        genres: {
                            create: genres.map((id: any) => ({genre: {connect: {id: parseInt(id)}}})),
                        },
                        actors: {
                            create: actors.map((id: any) => ({actor: {connect: {id: parseInt(id)}}})),
                        },
                        awards: {
                            create: awards.map((id: any) => ({award: {connect: {id: parseInt(id)}}})),
                        },
                    },
                });

                return prisma.movie.findUnique({
                    where: {id: movie.id},
                    ...this.joinTable,
                });
            });

            return this.refactorMovies([newMovie])[0];
        } catch (error) {
            console.error(error);
            throw new Error("Could not create movie");
        }
    }

    /**
     * Retrieves a movie by its ID from the database, along with its related data.
     *
     * @param {number} id - The ID of the movie to retrieve.
     * @returns {Promise<any>} A promise that resolves to the movie object.
     * @throws {Error} Throws an error if the movie is not found or if the fetch fails.
     */
    async getMovieById(id: number): Promise<any> {
        try {
            const movie = await prisma.movie.findUnique({
                where: {id},
                ...this.joinTable,
            });

            return this.refactorMovies([movie])[0];
        } catch (error) {
            throw new Error(`Could not fetch movie with ID ${id}`);
        }
    }

    /**
     * Updates a movie by its ID with the provided updated data.
     *
     * @param {number} id - The ID of the movie to update.
     * @param {any} updatedData - The data to update the movie with.
     * @returns {Promise<any>} A promise that resolves to the updated movie object.
     */
    async updateMovieById(id: number, updatedData: any): Promise<any> {
        try {
            const existingMovie = await prisma.movie.findUnique({ where: { id } });

            if (!existingMovie) {
                throw new Error(`Movie with ID ${id} not found.`);
            }

            const dataToUpdate: any = {
                ...(updatedData.title ? { title: updatedData.title } : {}),
                ...(updatedData.synopsis ? { synopsis: updatedData.synopsis } : {}),
                ...(updatedData.posterUrl ? { posterUrl: updatedData.posterUrl } : {}),
                ...(updatedData.releaseDate ? { releaseDate: updatedData.releaseDate } : {}),
                ...(updatedData.approvalStatus ? { approvalStatus: updatedData.approvalStatus } : {}),
                ...(updatedData.rating !== undefined ? { rating: updatedData.rating } : {}),
                ...(updatedData.countryCode ? { country: { connect: { code: updatedData.countryCode } } } : {}),
                ...(updatedData.directorId ? { director: { connect: { id: updatedData.directorId } } } : {}),
                ...(updatedData.genres ? { genres: this.updateRelations(updatedData.genres) } : {}),
                ...(updatedData.actors ? { actors: this.updateRelations(updatedData.actors) } : {}),
                ...(updatedData.awards ? { awards: this.updateRelations(updatedData.awards) } : {}),
            };

            const updatedMovie = await prisma.movie.update({
                where: { id },
                data: dataToUpdate,
                ...this.joinTable,
            });

            return this.refactorMovies([updatedMovie])[0];
        } catch (error) {
            console.error(`Error updating movie with ID ${id}:`, error);
            throw new Error(`Could not update movie with ID ${id}`);
        }
    }

    /**
     * Prepares the relation update data for genres, actors, or awards.
     *
     * @param {Array<{ id: number }>} relations - The relations to update.
     * @returns {Object} The prepared data for the Prisma update operation.
     */
    private updateRelations(relations: Array<{ id: number }>): object {
        return relations.length > 0
            ? {
                deleteMany: {},
                connect: relations.map(({ id }) => ({ id })),
            }
            : { deleteMany: {} };
    }

    /**
     * Deletes a movie by its ID along with its associated actors, genres, and awards.
     *
     * @param {number} id - The ID of the movie to delete.
     * @returns {Promise<{ message: string, deletedMovie: any }>} A promise that resolves to a message and the deleted movie object.
     */
    async deleteMovieById(id: number): Promise<{ message: string, deletedMovie: any }> {
        try {
            const deletedMovie = await prisma.$transaction(async (prisma) => {
                await Promise.all([
                    prisma.movieActors.deleteMany({where: {movieId: id}}),
                    prisma.movieGenres.deleteMany({where: {movieId: id}}),
                    prisma.movieAwards.deleteMany({where: {movieId: id}}),
                ]);

                return prisma.movie.delete({where: {id}});
            });

            return {
                message: `Movie with ID ${id} deleted successfully`,
                deletedMovie,
            };
        } catch (error) {
            console.error(`Error deleting movie with ID ${id}:`, error);
            throw new Error(`Could not delete movie with ID ${id}`);
        }
    }

    /**
     * Retrieves a list of movies based on pagination, search parameters, and filters.
     *
     * @param {Object} options - The options for fetching movies.
     * @param {number} options.page - The current page number.
     * @param {number} options.pageSize - The number of movies per page.
     * @param {SearchParams} options.params - The search parameters including filters, search term, and sorting.
     * @returns {Promise<any[]>} A promise that resolves to a list of movies and the total count of movies.
     */
    async getMovies({
                        page = 1,
                        pageSize = 24,
                        params,
                    }: {
        page?: number;
        pageSize?: number;
        params: SearchParams;
    }): Promise<any[]> {
        const skip = (page - 1) * pageSize;
        const {filters, searchTerm, sortBy, sortOrder, genre, country, actor, year, award, director} = params;
        const whereClause: any = {AND: []};

        const addGenreFilter = (genre: string) => {
            whereClause.AND.push({
                genres: {
                    some: {
                        genre: {
                            name: {
                                contains: genre,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            });
        };

        const addCountryFilter = (country: string) => {
            whereClause.AND.push({
                country: {
                    name: country,
                },
            });
        };

        const addActorFilter = (actor: string) => {
            whereClause.AND.push({
                actors: {
                    some: {
                        actor: {
                            name: {
                                contains: actor,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            });
        };

        if (genre) addGenreFilter(genre);
        if (country) addCountryFilter(country);
        if (actor) addActorFilter(actor);

        if (year) {
            whereClause.AND.push({
                releaseDate: {
                    gte: new Date(year, 0),
                    lt: new Date(year + 1, 0),
                },
            });
        }

        if (award) {
            whereClause.AND.push({
                awards: {
                    some: {
                        award: {
                            name: {
                                contains: award,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            });
        }

        if (director) {
            whereClause.AND.push({
                director: {
                    name: {
                        contains: director,
                        mode: "insensitive",
                    },
                },
            });
        }

        // if (filters) {
        //     whereClause.AND.push(handleFilter(filters));
        // }

        if (whereClause.AND.length === 0) {
            delete whereClause.AND;
        }

        try {
            let movies;
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

                const movieIds = searchResults.map(movie => movie.id);
                movies = await prisma.movie.findMany({
                    where: {
                        id: {in: movieIds},
                        ...whereClause,
                    },
                    include: this.joinTable.include,
                    skip,
                    take: pageSize,
                });
                totalItems = await this.countMovies(whereClause, movieIds);
            } else {
                movies = await prisma.movie.findMany({
                    where: whereClause,
                    orderBy: sortBy ? {[sortBy]: sortOrder || "asc"} : undefined,
                    include: this.joinTable.include,
                    skip,
                    take: pageSize,
                });
                totalItems = await this.countMovies(whereClause);
            }

            return [movies, totalItems];
        } catch (error) {
            console.error("Failed to fetch movies: ", error);
            throw new Error("Error fetching movies");
        }
    }
}

const movieService = new MovieService();
export default movieService;
