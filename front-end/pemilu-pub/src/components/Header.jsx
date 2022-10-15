import { useTheme } from "@emotion/react";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  AppBar,
  Button,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import Logo from "./Logo";
import TabsNav from "./TabsNav";

import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { AdminAuthContext, AuthContext } from "../App";
import { useContext } from "react";
import MenuAkun from "./MenuAkun";

function Header(props) {
  const theme = useTheme();
  const { account } = useContext(AuthContext) || {};
  const { adminToken, setAdminToken } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          onClick={props.handleDrawerOpen}
          sx={{ mr: 2, display: { lg: "none" } }}
        >
          {props.drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Link
          underline="none"
          component={RouterLink}
          to="/"
          sx={{
            alignSelf: "stretch",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Logo size={28} sx={{ mr: 3 }} admin={props.admin} />
        </Link>
        {(!props.admin || adminToken) && (
          <TabsNav
            daftarHalaman={props.daftarHalaman}
            sx={{
              display: { xs: "none", sm: "none", md: "none", lg: "flex" },
              alignSelf: "stretch",
              "& .MuiTabs-scroller": { display: "inline-flex" },
            }}
          />
        )}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ ml: "auto" }}
        >
          <IconButton onClick={props.handleMode}>
            {theme.palette.mode === props.mode ? (
              <Tooltip title="Ubah ke tema sistem">
                <BrightnessAutoIcon />
              </Tooltip>
            ) : props.dark ? (
              <Tooltip title="Ubah ke tema terang">
                <Brightness7Icon />
              </Tooltip>
            ) : (
              <Tooltip title="Ubah ke tema gelap">
                <Brightness4Icon />
              </Tooltip>
            )}
          </IconButton>
          {props.admin ? (
            adminToken ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  sessionStorage.removeItem("adminRefreshToken");
                  setAdminToken();
                  navigate("/admin/login");
                }}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Keluar
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                component={RouterLink}
                to="/admin/login"
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Login
              </Button>
            )
          ) : account ? (
            <MenuAkun />
          ) : (
            <>
              <Button
                variant="outlined"
                color="secondary"
                component={RouterLink}
                to="/login"
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Login
              </Button>
              <Button variant="contained" component={RouterLink} to="/daftar">
                Daftar
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
