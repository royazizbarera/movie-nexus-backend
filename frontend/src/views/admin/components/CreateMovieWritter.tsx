import {
  Button,
  Checkbox,
  Typography,
  ModalOverflow,
  Modal,
  ModalDialog,
  ModalClose,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Autocomplete,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Grid,
  Accordion,
  AccordionGroup,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
} from "@mui/joy";
import React from "react";
import { MovieModel, MovieModelTable } from "../../../models/MovieModel";
import { SnackbarState } from "./SnackbarState";

// icon
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import { Column } from "./GenericTable";
import { CountryModel } from "../../../models/CountryModel";
import { DirectorModel } from "../../../models/DirectorModel";
import { GenreModel } from "../../../models/GenreModel";
import { ActorModel } from "../../../models/ActorModel";
import { AwardModel } from "../../../models/AwardModel";
import genreController from "../../../controllers/GenreController";
import actorController from "../../../controllers/ActorController";
import awardController from "../../../controllers/AwardController";
import { count } from "console";
import countryController from "../../../controllers/CountryController";
import directorController from "../../../controllers/DirectorController";
import movieController from "../../../controllers/MovieController";
import { useAuthStore } from "../../../contexts/authStore";

const defaultSnackbarState: SnackbarState = {
  title: "default_snackbar",
  key: "default_snackbar",
  open: false,
  vertical: "top",
  horizontal: "center",
  variant: "solid",
  size: "md",
  color: "primary",
  autoHideDuration: 5000,
};

const columns: Column<MovieModelTable>[] = [
  {
    key: "id",
    label: "ID",
    type: "number",
    readonly: true,
    width: 70,
  },
  { key: "title", label: "Title", type: "string" },
  { key: "synopsis", label: "Synopsis", type: "string" },
  { key: "posterUrl", label: "Poster", type: "string" },
  { key: "backdropUrl", label: "Backdrop", type: "string" },
  { key: "videoUrl", label: "Video", type: "string" },
  { key: "releaseDate", label: "Release Date", type: "date" },
  { key: "country", label: "Country", type: "string_autocomplete" },
  {
    key: "director",
    label: "Director",
    type: "string_autocomplete",
  },
  { key: "genres", label: "Genres", type: "string[]" },
  { key: "actors", label: "Actors", type: "string[]" },
  { key: "awards", label: "Awards", type: "string[]" },
];

export default function CreateMovieWritter({
  openAddModal,
  handleCloseAddModal,
}: {
  openAddModal: boolean;
  handleCloseAddModal: () => void;
}) {
  const { user } = useAuthStore();
  const [newItem, setNewItem] = React.useState<MovieModelTable>(
    {} as MovieModelTable
  );
  const [multiSelectValues, setMultiSelectValues] = React.useState<{
    [key: string]: string[];
  }>({
    genres: [],
    actors: [],
    awards: [],
  });
  const [boolSelectValues, setBoolSelectValues] = React.useState<{
    [key: string]: boolean;
  }>({});

  const [country, setCountry] = React.useState<CountryModel[]>([]);
  const [director, setDirector] = React.useState<DirectorModel[]>([]);
  const [genre, setGenre] = React.useState<GenreModel[]>([]);
  const [actor, setActor] = React.useState<ActorModel[]>([]);
  const [award, setAward] = React.useState<AwardModel[]>([]);

  const [options, setOptions] = React.useState<{ [key: string]: string[] }>({
    country: [],
    director: [],
    genres: [],
    actors: [],
    awards: [],
  });

  const [snackbarState, setSnackbarState] =
    React.useState<SnackbarState>(defaultSnackbarState);

  // Fetch data from API
  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          countryResponse,
          directorResponse,
          genreResponse,
          actorResponse,
          awardResponse,
        ] = await Promise.all([
          countryController.getCountries(),
          directorController.getDirectors(),
          genreController.getGenres(),
          actorController.getActors(),
          awardController.getAwards(),
        ]);
        setOptions({
          country: countryResponse.data.map(
            (country: CountryModel) => country.name
          ),
          director: directorResponse.data.map(
            (director: DirectorModel) => director.name
          ),
          genres: genreResponse.data.map((genre: GenreModel) => genre.name),
          actors: actorResponse.data.map((actor: ActorModel) => actor.name),
          awards: awardResponse.data.map((award: AwardModel) => award.name),
        });
        setCountry(countryResponse.data);
        setDirector(directorResponse.data);
        setGenre(genreResponse.data);
        setActor(actorResponse.data);
        setAward(awardResponse.data);
      } catch (error) {
        console.error("Failed to fetch options", error);
      }
    };
    fetchOptions();
  }, []);

  const handleOpenSnackbar = (newSnackbarState: SnackbarState) => {
    setSnackbarState({ ...newSnackbarState, open: true });
  };

  const handleCloseSnackbar = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const onAdd = async (newMovie: MovieModelTable) => {
    try {
      const parsedMovie: MovieModel = {
        id: newMovie.id,
        title: newMovie.title,
        synopsis: newMovie.synopsis,
        posterUrl: newMovie.posterUrl,
        backdropUrl: newMovie.backdropUrl,
        videoUrl: newMovie.videoUrl,
        releaseDate: newMovie.releaseDate,
        approvalStatus: newMovie.approvalStatus || false,
        rating: newMovie.rating || 0,
        country: country.find((c) => c.name === newMovie.country) || null,
        countryCode:
          country.find((c) => c.name === newMovie.country)?.code || "",
        director: director.find((d) => d.name === newMovie.director) || null,
        directorId: director.find((d) => d.name === newMovie.director)?.id || 0,
        genres: newMovie.genres.map((genreMovie) => {
          return (
            genre.find((g) => g.name === genreMovie)! || { id: 0, name: "" }
          );
        }),
        actors: newMovie.actors.map((actorMovie) => {
          return actor.find((a) => a.name === actorMovie)!;
        }),
        awards:
          newMovie.awards.map((awardMovie) => {
            return award.find((a) => a.name === awardMovie)!;
          }) || [],
        reviews: null,
        addedBy: user || null,
        userId: user?.id || 2606,
      };
      console.info("add movie: ", parsedMovie);
      const response = await movieController.addMovie(parsedMovie);
      if (response.code !== 201) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error adding movie:", error);
      return false;
    }
  };

  const handleFormAddSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Mengambil data dari form menggunakan FormData
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries()); // Konversi FormData ke objek

    // Gabungkan data multi-select dengan formJson
    const finalData = {
      ...newItem,
      ...formJson,
      ...multiSelectValues, // Gabungkan nilai multiSelectValues
      ...boolSelectValues,
    };

    console.log("Submitted add data:", finalData);
    if (newItem) {
      console.info("Adding new item", finalData);
      try {
        const success = await onAdd(finalData as MovieModelTable);
        success
          ? handleOpenSnackbar({
              ...defaultSnackbarState,
              open: true,
              title: "Item added successfully",
              key: "item_added_success",
              color: "success",
              variant: "solid",
              autoHideDuration: 5000,
            })
          : handleOpenSnackbar({
              ...defaultSnackbarState,
              open: true,
              title: "Failed to add item",
              key: "failed_add_item",
              color: "danger",
              variant: "solid",
              autoHideDuration: 5000,
            });
      } catch (error) {
        console.error("Failed to add data", error);
        handleOpenSnackbar({
          ...defaultSnackbarState,
          open: true,
          title: "Failed to add item",
          key: "failed_add_item",
          color: "danger",
          variant: "solid",
          autoHideDuration: 5000,
        });
      } finally {
        setNewItem({} as MovieModelTable);
      }
    }
  };

  const renderInputField = (
    value: any,
    col: Column<MovieModelTable>,
    options: string[] = []
  ) => {
    console.info("col: multiSelectValues: ", col.key, value);
    switch (col.type) {
      case "string":
        return (
          <Input
            readOnly={col.readonly}
            name={String(col.key)} // Menggunakan name untuk FormData
            defaultValue={value as string}
          />
        );
      case "number":
        return (
          <Input
            readOnly={col.readonly}
            name={String(col.key)} // Menggunakan name untuk FormData
            type="number"
            defaultValue={String(value)}
          />
        );
      case "date":
        return (
          <Input
            readOnly={col.readonly}
            name={String(col.key)} // Menggunakan name untuk FormData
            type="date"
            defaultValue={
              value
                ? new Date(value as string).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
          />
        );
      case "boolean":
        return (
          <Checkbox
            readOnly={col.readonly}
            name={String(col.key)} // Menggunakan name untuk FormData
            checked={boolSelectValues[col.key as string] ?? false} // Ensure a boolean value
            onChange={(e) => {
              const newValue = e.target.checked;
              setBoolSelectValues((prev) => ({
                ...prev,
                [col.key as string]: newValue,
              }));
            }}
          />
        );
      case "string[]":
        return (
          <Autocomplete
            readOnly={col.readonly}
            multiple
            options={options}
            name={String(col.key)} // Menggunakan name untuk FormData
            value={multiSelectValues[col.key as string] || []}
            onChange={(e, value) => {
              setMultiSelectValues((prev) => ({
                ...prev,
                [col.key as string]: value as string[],
              }));
            }}
            slotProps={{
              listbox: { sx: { zIndex: 30000 } },
            }}
          />
        );

      case "string_autocomplete":
        return (
          <Autocomplete
            readOnly={col.readonly}
            options={options}
            name={String(col.key)} // Menggunakan name untuk FormData
            value={value as string}
            slotProps={{
              listbox: { sx: { zIndex: 30000 } },
            }}
          />
        );
      case "number[]":
        return (
          <Input
            readOnly={col.readonly}
            name={String(col.key)} // Menggunakan name untuk FormData
            defaultValue={(value as number[]).join(", ")}
          />
        );
      default:
        return (
          <Input
            readOnly={col.readonly}
            name={String(col.key)} // Menggunakan name untuk FormData
            defaultValue={String(value)}
          />
        );
    }
  };

  return (
    <React.Fragment>
      {/* Snackbar All */}
      <Snackbar
        key={snackbarState.key}
        open={snackbarState.open}
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
        variant={snackbarState.variant}
        size={snackbarState.size}
        color={snackbarState.color}
        autoHideDuration={snackbarState.autoHideDuration}
        onClose={handleCloseSnackbar}
        startDecorator={
          snackbarState.color === "success" ? (
            <CheckCircleOutlinedIcon />
          ) : snackbarState.color === "danger" ? (
            <DangerousOutlinedIcon />
          ) : (
            <WarningAmberOutlinedIcon />
          )
        }
        sx={{
          zIndex: 30000,
        }}
      >
        {snackbarState.title}
      </Snackbar>

      <Modal
        open={openAddModal}
        onClose={handleCloseAddModal} // Menutup modal tanpa mereset newItem
        sx={{ zIndex: 20000 }}
      >
        <ModalOverflow>
          <ModalDialog layout="fullscreen">
            <ModalClose />
            <Typography level="h2">Add Item</Typography>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleFormAddSubmit(event);
                event.currentTarget.reset();
              }}
              onReset={() => setNewItem({} as MovieModelTable)} // Tombol reset untuk menghapus input
            >
              <Stack spacing={2}>
                {columns.map((col) =>
                  col.readonly ? null : (
                    <FormControl key={col.key as string}>
                      <FormLabel>{col.label}</FormLabel>
                      {renderInputField(
                        newItem[col.key],
                        col,
                        options[col.key as string] || []
                      )}
                    </FormControl>
                  )
                )}
                <Button type="submit">Submit</Button>
              </Stack>
            </form>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </React.Fragment>
  );
}
