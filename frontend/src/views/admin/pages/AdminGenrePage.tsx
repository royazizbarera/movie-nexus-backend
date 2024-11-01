import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Typography from "@mui/joy/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BreadcrumbsHome from "../components/BreadcrumbsHome";
import BreadcrumbsDashboard from "../components/BreadcrumbsDashboard";
import { AdminTableLayout } from "../layouts/AdminTableLayout";
import GenericTable from "../components/GenericTable";
import genreController from "../../../controllers/GenreController";
import {
  GenreModel,
  GenreModelTable,
  GenreParamsModel,
} from "../../../models/GenreModel";
import { PaginationModel } from "../../../models/PaginationModel";
import { PAGE_SIZE_DROPDOWN, SORT_ORDER_DROPDOWN } from "../../../configs/constants";

function convertGenreModelToTable(genre: GenreModel): GenreModelTable {
  return {
    id: genre.id,
    name: genre.name,
  };
}

const columns: any[] = [
  {
    key: "id",
    label: "ID",
    type: "number",
    readonly: true,
    width: 70,
  },
  { key: "name", label: "Genre", type: "string", width: "100%" },
];

export default function AdminGenrePage() {
  const [genres, setGenres] = React.useState<GenreModelTable[]>([]);
  const [pagination, setPagination] = React.useState<PaginationModel>({
    page: 1,
    pageSize: 24,
    totalItems: 0,
    totalPages: 1,
  });
  const [genreParams, setGenreParams] = React.useState<GenreParamsModel>({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  
  React.useEffect(() => {
    fetchGenres(genreParams); // Pass current page to fetchGenres
  }, [genreParams]);
  
  
  // TODO: Genre CRUD operations
  const fetchGenres = async (genreParamsModel: GenreParamsModel) => {
    try {
      const response = await genreController.getGenres(genreParamsModel);
      const { data: genres, pagination } = response;

      setGenres(genres.map(convertGenreModelToTable));
      setPagination(pagination!);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };
  const handleEditGenre = async (updatedGenre: GenreModelTable) => {
    try {
      // Kirim data yang telah diubah ke endpoint tertentu
      // const response = await axios.put(`http://localhost:3001/genre/${updatedGenre.id}`, updatedGenre);
        // console.log('Genre updated successfully:', response.data);
      const response = await genreController.updateGenre(updatedGenre.id, updatedGenre);
      fetchGenres(genreParams);
      console.log("Genre updated successfully:", response.message);
      console.info("update genre: ", updatedGenre);
    } catch (error) {
      console.error("Error updating genre:", error);
    }
  };

  const handleDeleteGenre = async (genre: GenreModelTable) => {
    try {
      const response = await genreController.deleteGenre(genre.id);
      setGenres((prevGenres) => prevGenres.filter((m) => m.id !== genre.id));
      setPagination((prevPagination) => ({
        ...prevPagination,
        totalItems: prevPagination.totalItems - 1,
      }));
      console.log("Genre deleted successfully:", response.message);
      console.info("delete genre with id: ", genre.id);
    } catch (error) {
      console.error("Error deleting genre:", error);
    }
  };

  const handlePageChange = async (newPage: number) => {
    handleFilterChange("page", newPage);
  };

  const handleFilterChange = (name: string, value: string | number) => {
    setGenreParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
    console.info("Filter change: ", name, value);
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar selected="genres" />
        <AdminTableLayout>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <BreadcrumbsHome />
              <BreadcrumbsDashboard />
              <Typography
                color="primary"
                sx={{ fontWeight: 500, fontSize: 12 }}
              >
                Genres
              </Typography>
            </Breadcrumbs>
          </Box>

          <GenericTable<GenreModelTable>
            simpleAddItem
            title="Genres"
            data={genres}
            columns={columns}
            onEdit={handleEditGenre}
            onDelete={handleDeleteGenre}
            onPageChange={handlePageChange}
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            filters={{
              sortBy: columns.map((column) => column.key),
              sortOrder: SORT_ORDER_DROPDOWN,
              pageSize: PAGE_SIZE_DROPDOWN,
            }}
            onFilterChange={handleFilterChange}
            applySearch
            realtimeSearch
            placeholderSearch="Search genre..."
            onSearchApply={(searchTerm) =>
              handleFilterChange("searchTerm", searchTerm)
            }
          />

          {/* <OrderList /> */}
        </AdminTableLayout>
      </Box>
    </CssVarsProvider>
  );
}
