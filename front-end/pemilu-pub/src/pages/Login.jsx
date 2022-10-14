import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link } from "@mui/material";
import { AuthContext, API_URL } from "../App";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function Login() {
  const { setAccount } = useContext(AuthContext);

  function getAccount(token) {
    fetch(API_URL + "/akun_login/", {
      headers: {
        Authorization: "Bearer " + token.access,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAccount(data);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(API_URL + "/login/", {
      method: "POST",
      body: new FormData(document.periksaId),
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
      .then((token) => {
        sessionStorage.setItem("accessToken", token.access);
        sessionStorage.setItem("refreshToken", token.refresh);
        getAccount(token);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ p: useTheme().padding }}>
      <Stack spacing={useTheme().padding}>
        <Button
          variant="contained"
          component={Link}
          href={API_URL + "/authorize/"}
          alignSelf="center"
        >
          Login dengan Akun Google
        </Button>
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
            menggunakan Akun PUB
          </Typography>
          <Stack
            spacing={2}
            component="form"
            name="periksaId"
            onSubmit={handleSubmit}
            sx={{ alignSelf: "stretch", mt: 2 }}
          >
            <TextField
              required
              fullWidth
              id="username"
              label="NIM/NIDN"
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
              <Grid item xs>
                <Button color="secondary" component={RouterLink} to="/daftar">
                  Daftar
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Card>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/admin/login"
          sx={{ alignSelf: "center" }}
        >
          Login sebagai admin
        </Button>
      </Stack>
    </Container>
  );
}
