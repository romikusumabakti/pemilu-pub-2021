import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import { AdminAuthContext, API_URL } from "../../App";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function Login() {
  const { setAdminToken } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(API_URL + "/admin/login/", {
      method: "POST",
      body: new FormData(document.login),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            alert("NIM/NIDN tidak valid.");
          } else if (response.status === 401) {
            alert("Kata sandi salah.");
          }
          throw new Error();
        }
        return response.json();
      })
      .then((json) => {
        sessionStorage.setItem("adminRefreshToken", json.refresh);
        setAdminToken(json.access);
        navigate("/admin/kandidat");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ p: useTheme().padding }}>
      <Stack spacing={useTheme().padding}>
        <Card
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Typography component="h2" variant="subtitle1">
            sebagai admin
          </Typography>
          <Stack
            spacing={2}
            component="form"
            name="login"
            onSubmit={handleSubmit}
            sx={{ alignSelf: "stretch", mt: 2 }}
          >
            <TextField
              required
              fullWidth
              id="username"
              label="Nama pengguna"
              name="username"
              autoComplete="username"
              autoFocus
              InputLabelProps={{ required: false }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Kata sandi"
              type="password"
              id="password"
              autoComplete="current-password"
              InputLabelProps={{ required: false }}
            />
            <Grid container>
              <Grid item sx={{ ml: "auto" }}>
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
