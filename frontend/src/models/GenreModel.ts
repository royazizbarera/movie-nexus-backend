



export interface GenreModel {
  id: number;
  name: string;
}

export interface GenreModelTable {
  id: number;
  name: string;
}


export interface GenreParamsModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}