import CardMedia from "@mui/material/CardMedia";
import { colors } from "@mui/material";
import pubLogo from "../assets/img/pub-logo-background.svg";
import { API_URL } from "../App";

export default function FotoKandidat(props) {
  return (
    <CardMedia
      component="img"
      sx={{
        backgroundColor: colors[props.warna][100],
        backgroundImage: `url(${pubLogo})`,
        backgroundRepeat: "no-repeat",
        width: props.width,
      }}
      src={`${API_URL}/static/images/foto-kandidat/${props.nama}`}
    />
  );
}
