import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import { AuthContext } from "../App";
import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function MenuAkun() {
  const { account, setAccount } = useContext(AuthContext);

  const handleKeluarClick = () => {
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("profilePicture");
    setAccount(null);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title={"Akun PUB (" + account?.anggota?.nama + ")"}>
          <IconButton onClick={handleClick} size="small">
            <Avatar
              alt={account?.anggota?.nama}
              src={localStorage.getItem("profilePicture")}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar
            alt={account?.anggota?.nama}
            src={sessionStorage.getItem("profilePicture")}
          />{" "}
          {account?.anggota?.nama}
        </MenuItem>
        <Divider />
        {/* <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Setelan
        </MenuItem> */}
        <MenuItem onClick={handleKeluarClick} component={RouterLink} to="/">
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Keluar
        </MenuItem>
      </Menu>
    </>
  );
}
