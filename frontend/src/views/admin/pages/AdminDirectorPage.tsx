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
import directorController from "../../../controllers/DirectorController";
import {
  DirectorModel,
  DirectorModelTable,
} from "../../../models/DirectorModel";
import countryController from "../../../controllers/CountryController";

function convertDirectorModelToTable(
  director: DirectorModel
): DirectorModelTable {
  return {
    id: director.id,
    name: director.name,
    birthDate: director.birthDate.toString(),
    photoUrl: director.photoUrl,
    country: director.country.name,
  };
}

export default function AdminDirectorPage() {
  const [directors, setDirectors] = React.useState<DirectorModelTable[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(24);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchDirectors = async (page: number) => {
    try {
      const response = await directorController.getDirectors(page);
      const { data: directors, pagination } = response;

      setDirectors(directors.map(convertDirectorModelToTable));
      setTotalItems(pagination!.totalItems);
      setPageSize(pagination!.pageSize);
      setTotalPages(pagination!.totalPages);
      setPage(pagination!.page); // Set current page explicitly
    } catch (error) {
      console.error("Error fetching directors:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await countryController.getCountries(
        undefined,
        undefined
      );
      const data = response.data;
      setCountries(data.map((country) => country.name));
    } catch (error) {
      console.error("Error fetching countrys:", error);
    }
  };

  React.useEffect(() => {
    fetchCountries(); // Pass current page to fetchDirectors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchDirectors(page); // Pass current page to fetchDirectors
  }, [page]);

  const handleEditDirector = async (updatedDirector: DirectorModelTable) => {
    try {
      // Kirim data yang telah diubah ke endpoint tertentu
      // const response = await axios.put(`http://localhost:3001/director/${updatedDirector.id}`, updatedDirector);
      // console.log('Director updated successfully:', response.data);
      console.info("update director: ", updatedDirector);
    } catch (error) {
      console.error("Error updating director:", error);
    }
  };

  const handleDeleteDirector = async (director: DirectorModelTable) => {
    try {
      const response = await directorController.deleteDirector(director.id);
      setDirectors((prevDirectors) =>
        prevDirectors.filter((m) => m.id !== director.id)
      );
      setTotalItems((prevTotal) => prevTotal - 1); // Mengurangi total items
      console.log("Director deleted successfully:", response.message);
      console.info("delete director with id: ", director.id);
    } catch (error) {
      console.error("Error deleting director:", error);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar selected="directors" />
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
                Directors
              </Typography>
            </Breadcrumbs>
          </Box>
          <GenericTable<DirectorModelTable>
            title="Directors"
            data={directors}
            columns={[
              {
                key: "id",
                label: "ID",
                type: "number",
                readonly: true,
                width: 70,
              },
              { key: "name", label: "Name", type: "string" },
              { key: "birthDate", label: "Birth Date", type: "date" },
              { key: "photoUrl", label: "Photo Url", type: "string" },
              { key: "country", label: "Country", type: "string_autocomplete" },
            ]}
            options={{
              country: countries,
            }}
            onEdit={handleEditDirector}
            onDelete={handleDeleteDirector}
            onPageChange={handlePageChange}
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
          />

          {/* <OrderList /> */}
        </AdminTableLayout>
      </Box>
    </CssVarsProvider>
  );
}
