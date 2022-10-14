import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import { API_URL } from "../App";

export function Copyright() {
  return (
    <Typography variant="subtitle2" align="center">
      {"© "}
      {new Date().getFullYear()}{" "}
      <Link component={RouterLink} to="/">
        Pemberdayaan Umat Berkelanjutan
      </Link>
    </Typography>
  );
}

function Footer(props) {
  return (
    <Stack align="center" spacing={1.5} p={3} component="footer" {...props}>
      <img
        src={`${API_URL}/static/images/logo-kabinet${
          useTheme().palette.mode === "dark" ? "-gelap" : ""
        }.svg`}
        alt="Logo Kabinet Jarvis-Neophyte 2021/2022"
        height={96}
      />
      <Typography component="p" fontStyle="italic">
        Berani melakukan perubahan, untuk PUB yang lebih baik.
      </Typography>
      <Copyright />
    </Stack>
  );
}

export default Footer;
