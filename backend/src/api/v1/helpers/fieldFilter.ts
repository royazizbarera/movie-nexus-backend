const addGenreFilter = (whereClause: any = {AND: []}, genre: string) => {
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

const addCountryFilter = (whereClause: any = {AND: []}, country: string) => {
    whereClause.AND.push({
        country: {
            name: country,
        },
    });
};

const addActorFilter = (whereClause: any = {AND: []}, actor: string) => {
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

const addMovieYearFilter = (whereClause: any = {AND: []}, year: number) => {
    whereClause.AND.push({
        releaseDate: {
            gte: new Date(year, 0),
            lt: new Date(year + 1, 0),
        },
    });
}

const addAwardYearFilter = (whereClause: any = {AND: []}, year: number) => {
    whereClause.AND.push({
        year: {
            gte: new Date(year, 0),
            lt: new Date(year + 1, 0),
        },
    });
}

const addAwardFilter = (whereClause: any = {AND: []}, award: string) => {
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

const addDirectorFilter = (whereClause: any = {AND: []}, director: string) => {
    whereClause.AND.push({
        director: {
            name: {
                contains: director,
                mode: "insensitive",
            },
        },
    });
}

const addRatingFilter = (whereClause: any = {AND: []}, rating: number) => {
    whereClause.AND.push({
        rating: {
            eq: rating,
        },
    });
}

const addUserIdFilter = (whereClause: any = {AND: []}, userId: number) => {
    whereClause.AND.push({
        userId: {
            eq: userId,
        },
    });
}

export {
    addGenreFilter,
    addCountryFilter,
    addActorFilter,
    addMovieYearFilter,
    addAwardYearFilter,
    addAwardFilter,
    addDirectorFilter,
    addRatingFilter,
    addUserIdFilter,
};