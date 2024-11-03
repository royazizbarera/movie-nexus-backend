import {
  Box,
  Breadcrumbs,
  CssBaseline,
  CssVarsProvider,
  Typography,
  Card,
  CardContent,
  Button,
  CardActions,
  Grid,
} from "@mui/joy";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import BreadcrumbsHome from "../components/BreadcrumbsHome";
import BreadcrumbsDashboard from "../components/BreadcrumbsDashboard";
import React from "react";

// Icon
import MovieRoundedIcon from "@mui/icons-material/MovieRounded";

import SportsMartialArtsRoundedIcon from "@mui/icons-material/SportsMartialArtsRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import AutoAwesomeMotionRoundedIcon from "@mui/icons-material/AutoAwesomeMotionRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";

const iconStyle = {
  width: 40,
  height: 40,
};

interface CardTotalItemsProps {
  totalItems: number;
  title: string;
  icon: React.ReactNode;
}

function CardTotalItems({ totalItems, title, icon }: CardTotalItemsProps) {
  return (
    <Card variant="solid" color="primary" invertedColors>
      <CardContent orientation="horizontal">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
          }}
        >
          {icon}
        </Box>
        <CardContent>
          <Typography level="title-md">{title}</Typography>
          <Typography level="h2">{totalItems}</Typography>
        </CardContent>
      </CardContent>
      <CardActions>
        <Button variant="solid" size="sm">
          View table
        </Button>
      </CardActions>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Header />
        <Sidebar selected="dashboard" />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mt: 3, mx: 6 }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{ pl: 0 }}
        >
          <BreadcrumbsHome />
          <BreadcrumbsDashboard />
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
            mx: 6,
          }}
        >
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <CardTotalItems
                totalItems={10}
                title="Movies"
                icon={
                  <MovieRoundedIcon
                    sx={{
                      ...iconStyle,
                    }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <CardTotalItems
                totalItems={10}
                title="Countries"
                icon={
                  <PublicRoundedIcon
                    sx={{
                      ...iconStyle,
                    }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <CardTotalItems
                totalItems={10}
                title="Awards"
                icon={
                  <EmojiEventsRoundedIcon
                    sx={{
                      ...iconStyle,
                    }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <CardTotalItems
                totalItems={10}
                title="Genres"
                icon={
                  <SportsMartialArtsRoundedIcon
                    sx={{
                      ...iconStyle,
                    }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <CardTotalItems
                totalItems={10}
                title="Directors"
                icon={
                  <AutoAwesomeMotionRoundedIcon
                    sx={{
                      ...iconStyle,
                    }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <CardTotalItems
                totalItems={10}
                title="Actors"
                icon={
                  <TaskAltRoundedIcon
                    sx={{
                      ...iconStyle,
                    }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <CardTotalItems
                totalItems={10}
                title="User"
                icon={
                  <AccountCircleRoundedIcon
                    sx={{
                      ...iconStyle,
                    }}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <CardTotalItems
                totalItems={10}
                title="Reviews"
                icon={
                  <RateReviewRoundedIcon
                    sx={{
                      ...iconStyle,
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
