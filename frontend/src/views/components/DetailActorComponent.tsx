import { Box, Button, Grid, Typography } from "@mui/joy";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MainLayout from "../layouts/MainLayout";
import ContentLayout from "../layouts/ContentLayout";
import React from "react";
import { ActorModel } from "../../models/ActorModel";
import { MovieModel } from "../../models/MovieModel";
import movieController from "../../controllers/MovieController";
import VideoTrailer from "./movies/VideoTrailer";
import MovieCard from "./MovieCard";

interface DetailActorComponentProps {
  actor: ActorModel;
}

export default function DetailActorComponent({
  actor = {} as ActorModel,
}: DetailActorComponentProps) {
  const [movies, setMovies] = React.useState<MovieModel[]>([]);
  const [movieTrailer, setMovieTrailer] = React.useState<MovieModel | null>(
    null
  );
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await movieController.getMovies({
          actor: actor.name,
        });
        setMovies(response.data);
        setMovieTrailer(response.data[0] || null);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [actor.name]);

  return (
    <MainLayout>
      {/* Poster Trailer */}
      <ContentLayout giveSpace>
        <Box
          sx={{
            paddingTop: {
              xs: 8,
              md: 10,
            },
          }}
        />
        <Box position="relative" zIndex={1}>
          <Grid
            container
            spacing={2}
            alignItems="stretch"
            direction={{ xs: "column", md: "row" }}
            pb={2}
          >
            <Grid xs={12} md={3}>
              <Box
                component="img"
                src={actor.photoUrl} // URL gambar poster dari prop
                alt={`${actor.name}`}
                width="100%"
                height="100%" // Menetapkan tinggi penuh agar sejajar dengan trailer
                borderRadius="8px"
                sx={{
                  objectFit: "cover",
                  aspectRatio: "3/4", // Misalnya, 2:3 untuk poster film di layar besar dan 3:4 di layar kecil
                }}
              />
            </Grid>

            {/* Trailer */}
            <Grid xs={12} md={9}>
              {movieTrailer?.videoUrl ? (
                <VideoTrailer videoUrl={movieTrailer.videoUrl} />
              ) : (
                <Typography>No trailer available</Typography>
              )}
            </Grid>
          </Grid>
          {/* Title and Info with Ratings */}
          <Box
            display="flex"
            justifyContent={{ xs: "center", md: "space-between" }}
            alignItems="center"
            flexDirection={{ xs: "column", md: "row" }}
            mt={2}
            textAlign={{ xs: "center", md: "left" }}
          >
            <Box mb={{ xs: 2, md: 0 }}>
              <Typography
                level="h4"
                fontWeight="bold"
                sx={{
                  color: "common.white",
                }}
              >
                {movieTrailer?.title || "No movie available"}
              </Typography>
              <Typography
                level="title-md"
                sx={{
                  color: "common.white",
                }}
              >
                {movieTrailer?.releaseDate
                  ? new Date(movieTrailer.releaseDate).getFullYear()
                  : " "}{" "}
                ・ {movieTrailer?.rating || "Don't have rating yet"}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={4}>
              {/* IMDb Rating */}
              <Box display="table-column" alignItems="center" gap={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <StarIcon sx={{ color: "star.main" }} />
                  <Typography
                    level="h4"
                    sx={{
                      color: "common.white",
                    }}
                  >
                    {movieTrailer?.rating ? movieTrailer?.rating + '/10' : "Don't have rating yet"}
                  </Typography>
                </Box>
              </Box>
              {/* Your Rating */}
              {/* Text Button Rating */}
              <Box>
                <Button variant="plain" startDecorator={<StarBorderIcon />}>
                  Rate
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </ContentLayout>
      {/* Actor Description */}
      <ContentLayout giveSpace>
        {/* Space */}
        <Box
          sx={{
            paddingTop: {
              xs: 2,
              md: 2,
            },
          }}
        />
        {/* Movies */}
        <Typography level="title-lg">Involved in the movie</Typography>
        {/* Recomendation */}
        <Grid
          container
          spacing={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
          sx={{ flexGrow: 1, justifyContent: "left" }}
        >
          {movies.map((movie: any, index: number) => (
            <Grid
              key={index}
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
              <MovieCard
                key={index}
                id={movie.id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                rating={movie.rating}
                year={movie.releaseDate}
              />
            </Grid>
          ))}
        </Grid>
      </ContentLayout>
    </MainLayout>
  );
}
