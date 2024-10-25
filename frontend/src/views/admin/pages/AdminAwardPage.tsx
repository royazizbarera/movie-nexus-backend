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
import awardController from "../../../controllers/AwardController";
import { AwardModel, AwardModelTable } from "../../../models/AwardModel";
import countryController from "../../../controllers/CountryController";

function convertAwardModelToTable(award: AwardModel): AwardModelTable {
  return {
    id: award.id,
    name: award.name,
    year: award.year.toString(),
    country: award.country.name,
  };
}

export default function AdminAwardPage() {
  const [awards, setAwards] = React.useState<AwardModelTable[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(24);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchAwards = async (page: number) => {
    try {
      const response = await awardController.getAwards(page);
      const { data: awards, pagination } = response;

      setAwards(awards.map(convertAwardModelToTable));
      setTotalItems(pagination!.totalItems);
      setPageSize(pagination!.pageSize);
      setTotalPages(pagination!.totalPages);
      setPage(pagination!.page); // Set current page explicitly
    } catch (error) {
      console.error("Error fetching awards:", error);
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
    fetchCountries(); // Pass current page to fetchAwards
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchAwards(page); // Pass current page to fetchAwards
  }, [page]);

  const handleEditAward = async (updatedAward: AwardModelTable) => {
    try {
      // Kirim data yang telah diubah ke endpoint tertentu
      // const response = await axios.put(`http://localhost:3001/award/${updatedAward.id}`, updatedAward);
      // console.log('Award updated successfully:', response.data);
      console.info("update award: ", updatedAward);
    } catch (error) {
      console.error("Error updating award:", error);
    }
  };

  const handleDeleteAward = async (award: AwardModelTable) => {
    try {
      const response = await awardController.deleteAward(award.id);
      setAwards((prevAwards) => prevAwards.filter((m) => m.id !== award.id));
      setTotalItems((prevTotal) => prevTotal - 1); // Mengurangi total items
      console.log("Award deleted successfully:", response.message);
      console.info("delete award with id: ", award.id);
    } catch (error) {
      console.error("Error deleting award:", error);
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
        <Sidebar selected="awards" />
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
                Awards
              </Typography>
            </Breadcrumbs>
          </Box>

          <GenericTable<AwardModelTable>
            title="Awards"
            data={awards}
            columns={[
              {
                key: "id",
                label: "ID",
                type: "number",
                readonly: true,
                width: 70,
              },
              { key: "name", label: "Name", type: "string" },
              { key: "year", label: "Year", type: "date" },
              { key: "country", label: "Country", type: "string_autocomplete" },
            ]}
            options={{
              country: countries,
            }}
            onEdit={handleEditAward}
            onDelete={handleDeleteAward}
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
