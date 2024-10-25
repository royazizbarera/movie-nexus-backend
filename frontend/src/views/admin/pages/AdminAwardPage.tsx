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
import {
  AwardModel,
  AwardModelTable,
  AwardParamsModel,
} from "../../../models/AwardModel";
import countryController from "../../../controllers/CountryController";
import { PaginationModel } from "../../../models/PaginationModel";
import {
  PAGE_SIZE_DROPDOWN,
  SORT_ORDER_DROPDOWN,
} from "../../../configs/constants";

function convertAwardModelToTable(award: AwardModel): AwardModelTable {
  return {
    id: award.id,
    name: award.name,
    year: award.year.toString(),
    country: award.country.name,
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
  { key: "name", label: "Name", type: "string" },
  { key: "year", label: "Year", type: "date" },
  { key: "country", label: "Country", type: "string_autocomplete" },
];

export default function AdminAwardPage() {
  const [awards, setAwards] = React.useState<AwardModelTable[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);

  const [pagination, setPagination] = React.useState<PaginationModel>({
    page: 1,
    pageSize: 24,
    totalItems: 0,
    totalPages: 1,
  });
  const [awardParams, setAwardParams] = React.useState<AwardParamsModel>({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  const fetchAwards = async (awardParamsModel: AwardParamsModel) => {
    try {
      const response = await awardController.getAwards(awardParamsModel);
      const { data: awards, pagination } = response;
      setAwards(awards.map(convertAwardModelToTable));
      setPagination(pagination!);
    } catch (error) {
      console.error("Error fetching awards:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await countryController.getCountries();
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
    fetchAwards(awardParams); // Pass current page to fetchAwards
  }, [awardParams]);

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
      setPagination((prevPagination) => ({
        ...prevPagination,
        totalItems: prevPagination.totalItems - 1,
      }));
      console.log("Award deleted successfully:", response.message);
      console.info("delete award with id: ", award.id);
    } catch (error) {
      console.error("Error deleting award:", error);
    }
  };

  const handlePageChange = async (newPage: number) => {
    handleFilterChange("page", newPage);
  };

  const handleFilterChange = (name: string, value: string | number) => {
    setAwardParams((prevParams) => ({
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
            columns={columns}
            options={{
              country: countries,
            }}
            onEdit={handleEditAward}
            onDelete={handleDeleteAward}
            onPageChange={handlePageChange}
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            filters={{
              country: countries,
              sortBy: columns.map((column) => column.key),
              sortOrder: SORT_ORDER_DROPDOWN,
              pageSize: PAGE_SIZE_DROPDOWN,
            }}
            onFilterChange={handleFilterChange}
            applySearch
            realtimeSearch
            placeholderSearch="Search award..."
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
