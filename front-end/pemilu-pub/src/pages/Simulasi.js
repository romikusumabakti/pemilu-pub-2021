import { useTheme } from "@emotion/react";
import { Container, Grow, Stack, Typography } from "@mui/material";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import KartuPilihKandidat from "../components/KartuPilihKandidat";
import KonfirmasiPilih from "../components/KonfirmasiPilih";
import { useEffect, useState } from "react";
import { API_URL } from "../App";
import Loading from "../components/Loading";

export default function Simulasi(props) {
  const [daftarKandidat, setDaftarKandidat] = useState([]);

  useEffect(() => {
    fetch(API_URL + "/simulasi/kandidat/")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((daftarKandidat) => {
        setDaftarKandidat(daftarKandidat);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [pilihan, setPilihan] = useState(null);

  const handleClose = (pilih) => {
    if (pilih) {
      const formData = new FormData();
      formData.append("pilihan", pilihan.nomor);
      const pilihanBatal = localStorage.getItem("pilihan");
      if (pilihanBatal) {
        formData.append("pilihan_batal", pilihanBatal);
      }
      fetch(API_URL + "/pilih/", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error();
          }
          window.location.href = "/";
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("pilihan", pilihan.nomor);
          setPilihan(null);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setPilihan(null);
    }
  };

  const theme = useTheme();

  if (daftarKandidat.length > 0) {
    return (
      <Container component="main" maxWidth="md" sx={{ p: theme.padding }}>
        <Stack spacing={theme.padding}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <HowToVoteIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="h1">
              Simulasi Pemilihan Ketua PUB
            </Typography>
          </Stack>
          <Grow in={true} style={{ transformOrigin: "50% 0" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={theme.padding}
            >
              {daftarKandidat.map((kandidat) => (
                <KartuPilihKandidat
                  key={kandidat.nomor}
                  {...kandidat}
                  onClick={() => setPilihan(kandidat)}
                />
              ))}
            </Stack>
          </Grow>
        </Stack>
        <KonfirmasiPilih keepMounted onClose={handleClose} pilihan={pilihan} />
      </Container>
    );
  } else {
    return <Loading />;
  }
}
