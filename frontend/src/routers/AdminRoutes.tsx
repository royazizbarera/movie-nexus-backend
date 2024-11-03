import { Route, Routes } from "react-router-dom";

import { menu } from "../views/admin/components/Sidebar";
import AdminMoviePage from "../views/admin/pages/AdminMoviePage";
import AdminActorPage from "../views/admin/pages/AdminActorPage";
import AdminGenrePage from "../views/admin/pages/AdminGenrePage";
import AdminCountryPage from "../views/admin/pages/AdminCountryPage";
import AdminAwardPage from "../views/admin/pages/AdminAwardPage";
import AdminDirectorPage from "../views/admin/pages/AdminDirectorPage";
import AdminUserPage from "../views/admin/pages/AdminUserPage";
import AdminDashboardPage from "../views/admin/pages/AdminDashboardPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminMoviePage />} />
      <Route path={menu.dashboard.path} element={<AdminDashboardPage />} />
      <Route path={menu.movies.path} element={<AdminMoviePage />} />
      <Route path={menu.actors.path} element={<AdminActorPage />} />
      <Route path={menu.genres.path} element={<AdminGenrePage />} />
      <Route path={menu.countries.path} element={<AdminCountryPage />} />
      <Route path={menu.awards.path} element={<AdminAwardPage />} />
      <Route path={menu.directors.path} element={<AdminDirectorPage />} />
      <Route path={menu.users.path} element={<AdminUserPage />} />
      <Route
        path={menu.movies_approval.path}
        element={<AdminGenrePage />}
      />
      <Route
        path={menu.reviews_approval.path}
        element={<AdminGenrePage />}
      />
    </Routes>
  );
}
