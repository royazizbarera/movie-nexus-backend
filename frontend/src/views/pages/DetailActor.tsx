import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import getTrailerActor from "../../helpers/getTrailerActor";
import AppAppBar from "../components/AppAppBar";
import actorController from "../../controllers/ActorController";
import DetailActorComponent from "../components/DetailActorComponent";

export default function DetailActor() {
  const { id } = useParams();
  const [actor, setActor] = useState<any>({});

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
