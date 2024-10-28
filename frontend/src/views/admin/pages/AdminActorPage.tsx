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
import GenericTable, { Column } from "../components/GenericTable";
import actorController from "../../../controllers/ActorController";
import {
  ActorModel,
  ActorModelTable,
  ActorParamsModel,
} from "../../../models/ActorModel";
import countryController from "../../../controllers/CountryController";
import { PaginationModel } from "../../../models/PaginationModel";
import { PAGE_SIZE_DROPDOWN, SORT_ORDER_DROPDOWN } from "../../../configs/constants";

function convertActorModelToTable(actor: ActorModel): ActorModelTable {
  return {
    id: actor.id,
    name: actor.name,
    birthDate: actor.birthDate.toString(),
    photoUrl: actor.photoUrl,
    country: actor.country.name,
  };
}

const columns: Column<ActorModelTable>[] = [
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
]

export default function AdminActorPage() {
  const [actors, setActors] = React.useState<ActorModelTable[]>([]);
  const [pagination, setPagination] = React.useState<PaginationModel>({
    page: 1,
    pageSize: 24,
    totalItems: 0,
    totalPages: 1,
  });
  const [actorParams, setActorParams] = React.useState<ActorParamsModel>({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  const [countries, setCountries] = React.useState<string[]>([]);

  const fetchActors = async (actorParamsModel?: ActorParamsModel) => {
    try {
      const response = await actorController.getActors(actorParamsModel);
      const { data: actors, pagination } = response;

      setActors(actors.map(convertActorModelToTable));
      setPagination(pagination!);
    } catch (error) {
      console.error("Error fetching actors:", error);
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
    fetchCountries(); // Pass current page to fetchActors
  }, []);

  React.useEffect(() => {
    fetchActors(actorParams); // Pass current actorParamsModel to fetchActors
  }, [actorParams]);

  const handleEditActor = async (updatedActor: ActorModelTable) => {
    try {
      // Kirim data yang telah diubah ke endpoint tertentu
      // const response = await axios.put(`http://localhost:3001/actor/${updatedActor.id}`, updatedActor);
      // console.log('Actor updated successfully:', response.data);
      console.info("update actor: ", updatedActor);
    } catch (error) {
      console.error("Error updating actor:", error);
    }
  };

  const handleDeleteActor = async (actor: ActorModelTable) => {
    try {
      const response = await actorController.deleteActor(actor.id);
      setActors((prevActors) => prevActors.filter((m) => m.id !== actor.id));
      setPagination((prevPagination) => ({
        ...prevPagination,
        totalItems: prevPagination.totalItems - 1,
      }));
      console.log("Actor deleted successfully:", response.message);
      console.info("delete actor with id: ", actor.id);
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };

  const handlePageChange = async (newPage: number) => {
    handleFilterChange("page", newPage);
  };

  const handleFilterChange = (name: string, value: string | number) => {
    setActorParams((prevParams) => ({
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
        <Sidebar selected="actors" />
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
                Actors
              </Typography>
            </Breadcrumbs>
          </Box>

          <GenericTable<ActorModelTable>
            title="Actors"
            data={actors}
            columns={columns}
            options={{
              country: countries,
            }}
            onEdit={handleEditActor}
            onDelete={handleDeleteActor}
            onPageChange={handlePageChange}
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}

            // filter and search
            filters={{
              country: countries,
              sortBy: columns.map((column) => column.key),
              sortOrder: SORT_ORDER_DROPDOWN,
              pageSize: PAGE_SIZE_DROPDOWN,
            }}
            onFilterChange={handleFilterChange}
            applySearch
            realtimeSearch
            placeholderSearch="Search actor..."
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
