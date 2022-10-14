import { useTheme } from "@emotion/react";
import {
  Card,
  CardContent,
  CardHeader,
  colors,
  Container,
  Grow,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { API_URL } from "../App";

export default function Hasil() {
  const [daftarKandidat, setDaftarKandidat] = useState([]);
  const [total, setTotal] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    fetch(API_URL + "/kandidat/")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((daftarKandidat) => {
        setDaftarKandidat(daftarKandidat);
        let total = 0;
        for (let kandidat of daftarKandidat) {
          total += kandidat.suara;
        }
        setTotal(total);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container component="main" maxWidth="sm" sx={{ p: useTheme().padding }}>
      <Stack
        spacing={useTheme().padding}
        justifyContent="space-between"
        alignItems={{ xs: "center", sm: "stretch" }}
      >
        <Grow in={true} style={{ transformOrigin: "50% 0" }}>
          <Card>
            <CardHeader title="Hasil" sx={{ p: 3, pb: 0 }} />
            <CardContent sx={{ px: 3 }}>
              <ResponsiveContainer width="100%" height={256}>
                <PieChart width={256} height={256}>
                  <Pie
                    data={daftarKandidat.map((kandidat) => ({
                      name: `0${kandidat.nomor} ${kandidat.anggota.nama}`,
                      value: kandidat.suara,
                    }))}
                    outerRadius={65}
                    label={(entry) => entry.name}
                  >
                    {daftarKandidat.map((kandidat) => (
                      <Cell
                        fill={
                          colors[kandidat.warna][
                            theme.palette.mode === "dark" ? 300 : 700
                          ]
                        }
                        style={{ fontSize: "x-small" }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {daftarKandidat.map((kandidat) => (
                <p key={kandidat.nomor}>
                  0{kandidat.nomor} {kandidat.anggota.nama}:{" "}
                  {(kandidat.suara / (total || 1)).toLocaleString("id-ID", {
                    maximumFractionDigits: 2,
                    style: "percent",
                  })}{" "}
                  ({kandidat.suara})
                </p>
              ))}
              <p>Total: {total}</p>
            </CardContent>
          </Card>
        </Grow>
      </Stack>
    </Container>
  );
}
