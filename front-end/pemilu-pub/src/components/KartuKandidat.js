import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import {
  CardHeader,
  colors,
  createTheme,
  Grid,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import FotoKandidat from "./FotoKandidat";

export default function KartuCalon(props) {
  let theme = createTheme({ ...useTheme() });
  theme.palette.primary = colors[props.warna];
  theme.palette.primary.light = colors[props.warna][100];
  theme.palette.primary.main = colors[props.warna][500];
  theme.palette.primary.dark = colors[props.warna][900];
  theme.palette.primary.contrastText = "#fff";
  return (
    <Grid item xs sx={{ minWidth: 256, maxWidth: 384 }}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardHeader
          title={props.nomor.toString().padStart(2, "0")}
          titleTypographyProps={{ variant: "h4", fontWeight: "bold" }}
          sx={{ color: colors[props.warna][500] }}
        />
        <FotoKandidat nama={props.foto} warna={props.warna} />
        <CardContent>
          <Typography variant="h5" component="div">
            {props.anggota.nama}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Calon Ketua/Keamanan
          </Typography>
          <Typography variant="body2">{props.visi}</Typography>
        </CardContent>
        <CardActions sx={{ mt: "auto" }}>
          <ThemeProvider theme={theme}>
            <Button sx={{ ml: "auto" }}>Selengkapnya</Button>
          </ThemeProvider>
        </CardActions>
      </Card>
    </Grid>
  );
}
