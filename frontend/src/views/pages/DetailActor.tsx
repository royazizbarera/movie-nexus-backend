import { Grid, Typography } from "@mui/joy";
import ContentLayout from "../layouts/ContentLayout";

// icon

import MainLayout from "../layouts/MainLayout";
import ActorCard from "../components/ActorCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import getTrailerActor from "../../helpers/getTrailerActor";
import AppAppBar from "../components/AppAppBar";
import actorController from "../../controllers/ActorController";
import DetailActorComponent from "../components/DetailActorComponent";

export default function DetailActor() {
  const { id } = useParams();
  const [actor, setActor] = useState<any>({});
  const [actors, setActors] = useState<any[]>([]);

  // fetch using controller
  useEffect(() => {
    actorController
      .getActors()
      .then((res) => {
        setActors(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // Ambil detail actor
    try {
      actorController.getActorById(parseInt(id!)).then((data) => {
        setActor(data.data);
      });
    } catch (error) {}
  }, [id]);

  return (
    <>
      <AppAppBar />
      <DetailActorComponent actor={actor} />
    </>
  );
}
