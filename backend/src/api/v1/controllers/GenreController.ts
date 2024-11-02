import genreService from "../services/GenreService";
import HttpStatus from "../config/constants/HttpStatus";
import ResponseApi from "../config/ResponseApi";
import { Response, Request } from "express";
class GenreController {
  async getGenres(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || undefined;
      const pageSize = parseInt(req.query.pageSize as string) || undefined;
      // Ambil parameter query dari request
      const {sortBy, sortOrder, filters } =
        req.query;
      // Jika genres adalah string, ubah menjadi array dengan split. Jika tidak, atur sebagai array kosong.

      const genres = await genreService.getGenres({
        page: page,
        pageSize: pageSize,
        params: {
          sortBy: sortBy as string, // pastikan bahwa sortBy adalah string
          sortOrder: sortOrder as "asc" | "desc", // pastikan bahwa sortOrder adalah string
          filters: filters as any[],
        },
      });
      const totalItems = await genreService.countGenres();
      return res.json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Genres fetched successfully",
          data: genres,
          version: 1.0,
          pagination: {
            page: page || 1,
            pageSize: pageSize || 1,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / (pageSize || 1)),
          },
        })
      );
    } catch (error) {
      return res.json(
        ResponseApi({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  async getGenreById(id: number) {
    try {
      return await genreService.getGenreById(id);
    } catch (error) {
      throw error;
    }
  }


  // nyoba bikin fungsi baru aja, buat ngetest ke frontend add
  async addGenre(req: Request, res: Response) {
    try {
      const genreName = req.body.name;
      const genre = await genreService.addGenre(genreName);
      return res.json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Genre added successfully",
          data: genre,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.json(
        ResponseApi({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  // delete
  async deleteGenre(req: Request, res: Response) {
    try {
      const genreId = req.params.id;
      await genreService.deleteGenre(Number(genreId));
      return res.json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Genre deleted successfully",
          data: null,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.json(
        ResponseApi({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }

  // update
  async updateGenre(req: Request, res: Response) {
    try {
      const genreId = req.params.id;
      const genreName = req.body.name;
      const genre = await genreService.updateGenre(Number(genreId), genreName);
      return res.json(
        ResponseApi({
          code: HttpStatus.OK,
          message: "Genre updated successfully",
          data: genre,
          version: 1.0,
        })
      );
    } catch (error) {
      return res.json(
        ResponseApi({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  }
}

const genreController = new GenreController();
export default genreController;
