import { Grid, Typography } from "@mui/joy";
import ContentLayout from "../layouts/ContentLayout";

// icon

import MainLayout from "../layouts/MainLayout";
import MovieCard from "../components/MovieCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import getTrailerMovie from "../../helpers/getTrailerMovie";
import AppAppBar from "../components/AppAppBar";
import movieController from "../../controllers/MovieController";
import DetailMovieComponent from "../components/DetailMovieComponent";

export default function DetailMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>({});
  const [movies, setMovies] = useState<any[]>([]);

  // fetch using controller
  useEffect(() => {
    movieController
      .getMovies()
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // Ambil detail movie
    try {
      movieController.getMovieById(parseInt(id!)).then((data) => {
        setMovie(data.data);
      });
    } catch (error) {}
  }, [id]);

  return (
    <>
      <AppAppBar />
      <DetailMovieComponent movie={movie} />
      <MainLayout>
        <ContentLayout giveSpace>
          <Typography level="title-lg">Movies Recomendation</Typography>
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
    </>
  );
}
