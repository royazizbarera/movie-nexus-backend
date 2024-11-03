import React from "react";

import { Box, Grid, Button, Input, Autocomplete, FormControl } from "@mui/joy";
import MainLayout from "../layouts/MainLayout";
import ActorCard from "../components/ActorCard";

import AppAppBar from "../components/AppAppBar";
import actorController from "../../controllers/ActorController";
import { ActorModel, ActorParamsModel } from "../../models/ActorModel";
import getYearsFromXtoY from "../../helpers/getYearsFromXtoY";
import {
  PAGE_SIZE_DROPDOWN,
  SORT_ORDER_DROPDOWN,
} from "../../configs/constants";
import { PaginationModel } from "../../models/PaginationModel";
import genreController from "../../controllers/GenreController";
import { GenreModel } from "../../models/GenreModel";
import PaginationComponent from "../admin/components/PaginationComponent";

const styleSelect = {
  width: "100%",
  [`& .MuiSelect-indicator`]: {
    transition: "0.2s",
    [`&.Mui-expanded`]: {
      transform: "rotate(-180deg)",
    },
  },
};

export default function ActorsPage() {
  const [actors, setActors] = React.useState<ActorModel[]>([]);
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

  const [genres, setGenres] = React.useState<string[]>([]);

  const filters = [
    {
      name: "genre",
      placeholder: "Genre",
      options: genres,
    },
    {
      name: "year",
      placeholder: "Year",
      options: getYearsFromXtoY(1950, new Date().getFullYear()),
    },
    {
      name: "sortBy",
      placeholder: "Sort By",
      options: [
        "title",
        "genre",
        "actor",
        "award",
        "country",
        "year",
        "rating",
      ],
    },
    {
      name: "pageSize",
      placeholder: "Page Size",
      options: PAGE_SIZE_DROPDOWN,
    },
    {
      name: "sortOrder",
      placeholder: "Sort Order",
      options: SORT_ORDER_DROPDOWN,
    },
  ];

  const fetchActors = async (actorParamsModel?: ActorParamsModel) => {
    try {
      const response = await actorController.getActors(actorParamsModel);
      const { data: actors, pagination } = response;
      setActors(actors);
      setPagination(pagination!);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };

  const getGenres = async () => {
    try {
      const response = await genreController.getGenres();
      const data = response.data;
      setGenres(
        data.map((genre: GenreModel) => {
          return genre.name;
        })
      );
    } catch (error) {}
  };

  React.useEffect(() => {
    getGenres();
  }, []);

  React.useEffect(() => {
    fetchActors(actorParams); // Pass current page to fetchActors
  }, [actorParams]);

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
    <>
      <AppAppBar />
      <MainLayout giveSpace pt={14}>
        {/* Toolbar Filtering */}
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column" }}>
          {/* Filter Dropdowns */}
          <Grid
            container
            spacing={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
            sx={{ flexGrow: 1, justifyContent: "left" }}
          >
            {filters.map((filter) => (
              <Grid
                key={filter.name}
                xs={6}
                sm={4}
                md={4}
                lg={2}
                xl={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Autocomplete
                  placeholder={"All " + filter.name}
                  sx={styleSelect}
                  options={filter.options.map((opt) => opt)}
                  onChange={(e, value) => {
                    handleFilterChange(filter.name, value ? value : "");
                    console.info(filter.name, value);
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Search & Apply */}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());

              handleFilterChange("searchTerm", formJson.searchTerm);

              console.info("Form JSON: ", formJson);
            }}
          >
            <Grid
              container
              spacing={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
              sx={{ flexGrow: 1, justifyContent: "left", m: 0 }}
            >
              <Grid
                xs={12}
                sm={12}
                md={8}
                lg={10}
                xl={10}
                sx={{ display: "flex", justifyContent: "center", pl: 0 }}
              >
                <FormControl key={"searchTerm"} sx={{ width: "100%", mt: 2 }}>
                  <Input name="searchTerm" placeholder={"Search actors..."} />
                </FormControl>
              </Grid>
              <Grid
                xs={12}
                sm={12}
                md={4}
                lg={2}
                xl={2}
                sx={{ display: "flex", justifyContent: "center", pr: 0 }}
              >
                <Button type="submit" sx={{ flexGrow: 1, mt: 2 }}>
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Actors */}
        <Box>
          <Grid
            container
            spacing={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
            sx={{ flexGrow: 1, justifyContent: "left" }}
          >
            {actors.map((actor: any, index: number) => (
              <Grid
                xs={6}
                sm={4}
                md={3}
                lg={2}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ActorCard
                  key={index}
                  id={actor.id}
                  name={actor.name}
                  photoUrl={actor.photoUrl}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <PaginationComponent
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          handlePageChange={handlePageChange}
          handleNextPage={() => handlePageChange((pagination.page || 1) + 1)}
          handlePrevPage={() => handlePageChange(pagination.page - 1)}
        />
      </MainLayout>
    </>
  );
}
