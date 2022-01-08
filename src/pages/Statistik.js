import { useTheme } from "@emotion/react";
import { Container, Grid } from "@material-ui/core";
import Pendaftaran from "../components/stats/Pendaftaran";
import Pemilihan from "../components/stats/Pemilihan";
import Suara from "../components/stats/Suara";

export default function Statistik(props) {
  return (
    <Container component="main" maxWidth="xl">
      <Grid container spacing={useTheme().padding} padding={useTheme().padding} justifyContent="center">
        <Grid item>
          <Pendaftaran />
        </Grid>
        <Grid item>
          <Pemilihan />
        </Grid>
        <Grid item>
          <Suara />
        </Grid>
      </Grid>
    </Container>
  );
}
