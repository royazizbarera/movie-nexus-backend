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
import countryController from "../../../controllers/CountryController";
import {
  CountryModel,
  CountryModelTable,
  CountryParamsModel,
} from "../../../models/CountryModel";
import { PaginationModel } from "../../../models/PaginationModel";
import { PAGE_SIZE_DROPDOWN, SORT_ORDER_DROPDOWN } from "../../../configs/constants";

function convertCountryModelToTable(country: CountryModel): CountryModelTable {
  return {
    code: country.code,
    name: country.name,
  };
}

const columns: any[] = [
  {
    key: "code",
    label: "Code",
    type: "number",
    readonly: true,
    width: 70,
  },
  { key: "name", label: "Name", type: "string", width: "100%" },
];

export default function AdminCountryPage() {
  const [countries, setCountries] = React.useState<CountryModelTable[]>([]);
  const [pagination, setPagination] = React.useState<PaginationModel>({
    page: 1,
    pageSize: 24,
    totalItems: 0,
    totalPages: 1,
  });
  const [countryParams, setCountryParams] = React.useState<CountryParamsModel>({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  const fetchCountries = async (countryParamsModel: CountryParamsModel) => {
    try {
      const response = await countryController.getCountries(countryParamsModel);
      const { data: countries, pagination } = response;

      setCountries(countries.map(convertCountryModelToTable));
      setPagination(pagination!);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  React.useEffect(() => {
    fetchCountries(countryParams); // Pass current countryParams to fetchCountries
  }, [countryParams]);

  const handleEditCountry = async (updatedCountry: CountryModelTable) => {
    try {
      // Kirim data yang telah diubah ke endpoint tertentu
      // const response = await axios.put(`http://localhost:3001/country/${updatedCountry.id}`, updatedCountry);
      // console.log('Country updated successfully:', response.data);
      console.info("update country: ", updatedCountry);
    } catch (error) {
      console.error("Error updating country:", error);
    }
  };

  const handleDeleteCountry = async (country: CountryModelTable) => {
    try {
      const response = await countryController.deleteCountry(country.code);
      setCountries((prevCountries) =>
        prevCountries.filter((m) => m.code !== country.code)
      );
      setPagination((prevPagination) => ({
        ...prevPagination,
        totalItems: prevPagination.totalItems - 1,
      }));
      console.log("Country deleted successfully:", response.message);
      console.info("delete country with code: ", country.code);
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  const handlePageChange = async (newPage: number) => {
    handleFilterChange("page", newPage);
  };

  const handleFilterChange = (name: string, value: string | number) => {
    setCountryParams((prevParams) => ({
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
        <Sidebar selected="countries" />
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
                Countries
              </Typography>
            </Breadcrumbs>
          </Box>
          <GenericTable<CountryModelTable>
            title="Countries"
            data={countries}
            columns={columns}
            onEdit={handleEditCountry}
            onDelete={handleDeleteCountry}
            onPageChange={handlePageChange}
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            //
            filters={{
              sortBy: columns.map((column) => column.key),
              sortOrder: SORT_ORDER_DROPDOWN,
              pageSize: PAGE_SIZE_DROPDOWN,
            }}
            onFilterChange={handleFilterChange}
            applySearch
            realtimeSearch
            placeholderSearch="Search country..."
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
