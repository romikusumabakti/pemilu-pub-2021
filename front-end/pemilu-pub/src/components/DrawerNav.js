import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";

import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../App";

import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

const drawerWidth = 240;

function DrawerNav(props) {
  const { account, setAccount } = useContext(AuthContext);

  const handleKeluarClick = () => {
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("profilePicture");
    setAccount(null);
  };
  const location = useLocation();

  return (
    <Drawer
      variant="temporary"
      open={props.open}
      onClose={props.handleDrawerOpen}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { md: "block", lg: "none" },
        "& .MuiDrawer-paper": { width: drawerWidth },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {props.daftarHalaman[0].map((halaman) => (
          <ListItemButton
            key={halaman.jalur}
            onClick={props.handleDrawerOpen}
            selected={location.pathname === halaman.jalur}
            component={Link}
            to={halaman.jalur}
          >
            <ListItemIcon>{halaman.icon}</ListItemIcon>
            <ListItemText primary={halaman.title} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        {account ? (
          <>
            <ListItemButton>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Setelan" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                handleKeluarClick();
                props.handleDrawerOpen();
              }}
              component={Link}
              to="/"
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Keluar" />
            </ListItemButton>
          </>
        ) : (
          props.daftarHalaman[1].map((halaman) => (
            <ListItemButton
              key={halaman.jalur}
              onClick={props.handleDrawerOpen}
              selected={location.pathname === halaman.jalur}
              component={Link}
              to={halaman.jalur}
            >
              <ListItemIcon>{halaman.icon}</ListItemIcon>
              <ListItemText primary={halaman.title} />
            </ListItemButton>
          ))
        )}
      </List>
      <Divider />
      <List>
        {props.daftarHalaman[2].map((halaman) => (
          <ListItemButton
            key={halaman.jalur}
            onClick={props.handleDrawerOpen}
            selected={location.pathname === halaman.jalur}
            component={Link}
            to={halaman.jalur}
          >
            <ListItemIcon>{halaman.icon}</ListItemIcon>
            <ListItemText primary={halaman.title} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default DrawerNav;
