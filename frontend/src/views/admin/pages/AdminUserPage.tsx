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
import userController from "../../../controllers/UserController";
import { UserModel, UserModelTable } from "../../../models/UserModel";
import countryController from "../../../controllers/CountryController";

function convertUserModelToTable(user: UserModel): UserModelTable {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.password,
    photoProfile: user.photoProfile,
    provider: user.provider,
    role: user.role?.toString(),
    isVerified: user.isVerified,
    verificationCode: user.verificationCode,
    verificationCodeExpired: user.verificationCodeExpired,
    verificationRequestDate: user.verificationRequestDate,
  };
}

export default function AdminUserPage() {
  const [users, setUsers] = React.useState<UserModelTable[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(24);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchUsers = async (page: number) => {
    try {
      const response = await userController.getUsers(page);
      const { data: users, pagination } = response;

      setUsers(users.map(convertUserModelToTable));
      setTotalItems(pagination!.totalItems);
      setPageSize(pagination!.pageSize);
      setTotalPages(pagination!.totalPages);
      setPage(pagination!.page); // Set current page explicitly
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await countryController.getCountries(
        undefined,
        undefined
      );
      const data = response.data;
      setCountries(data.map((country) => country.name));
    } catch (error) {
      console.error("Error fetching countrys:", error);
    }
  };

  React.useEffect(() => {
    fetchCountries(); // Pass current page to fetchUsers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchUsers(page); // Pass current page to fetchUsers
  }, [page]);

  const handleEditUser = async (updatedUser: UserModelTable) => {
    try {
      // Kirim data yang telah diubah ke endpoint tertentu
      // const response = await axios.put(`http://localhost:3001/user/${updatedUser.id}`, updatedUser);
      // console.log('User updated successfully:', response.data);
      console.info("update user: ", updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (user: UserModelTable) => {
    try {
      const response = await userController.deleteUser(user.id);
      setUsers((prevUsers) => prevUsers.filter((m) => m.id !== user.id));
      setTotalItems((prevTotal) => prevTotal - 1); // Mengurangi total items
      console.log("User deleted successfully:", response.message);
      console.info("delete user with id: ", user.id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar selected="users" />
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
                Users
              </Typography>
            </Breadcrumbs>
          </Box>

          <GenericTable<UserModelTable>
            title="Users"
            data={users}
            columns={[
              {
                key: "id",
                label: "ID",
                type: "number",
                readonly: true,
                width: 70,
              },
              { key: "username", label: "Username", type: "string" },
              { key: "email", label: "Email", type: "string" },
              { key: "password", label: "Password", type: "string" },
              { key: "photoProfile", label: "Photo Profile", type: "string" },
              { key: "provider", label: "Provider", type: "string" },
              { key: "role", label: "Role", type: "string" },
              { key: "isVerified", label: "Is Verified", type: "boolean" },
              {
                key: "verificationCode",
                label: "Verification Code",
                type: "string",
              },
              {
                key: "verificationCodeExpired",
                label: "Verification Code Expired",
                type: "string",
              },
              {
                key: "verificationRequestDate",
                label: "Verification Request Date",
                type: "string",
              },
            ]}
            options={{
              country: countries,
            }}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onPageChange={handlePageChange}
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
          />

          {/* <OrderList /> */}
        </AdminTableLayout>
      </Box>
    </CssVarsProvider>
  );
}
