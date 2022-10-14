import { Card, CardContent, CardHeader, Grow, useTheme } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { API_URL } from "../../App";

export default function Pendaftaran() {
  const [pendaftaran, setPendaftaran] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    fetch(API_URL + "/statistik/pendaftaran/")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((pendaftaran) => {
        setPendaftaran({
          ...pendaftaran,
          total: pendaftaran.sudah + pendaftaran.belum,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Grow in={true} style={{ transformOrigin: "50% 0" }}>
      <Card>
        <CardHeader title="Pendaftaran" sx={{ p: 3, pb: 0 }} />
        <CardContent sx={{ px: 3 }}>
          <ResponsiveContainer width="100%" height={256}>
            <PieChart width={256} height={256}>
              <Pie
                data={[
                  {
                    name: "Sudah mendaftar",
                    value: pendaftaran.sudah,
                  },
                  {
                    name: "Belum mendaftar",
                    value: pendaftaran.belum,
                  },
                ]}
                outerRadius={65}
                label
              >
                <Cell fill={green[theme.palette.mode === "dark" ? 300 : 700]} />
                <Cell fill={grey[theme.palette.mode === "dark" ? 300 : 700]} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p>
            Sudah mendaftar:{" "}
            {(pendaftaran.sudah / (pendaftaran.total || 1)).toLocaleString(
              "id-ID",
              {
                maximumFractionDigits: 2,
                style: "percent",
              }
            )}{" "}
            ({pendaftaran.sudah})
          </p>
          <p>
            Belum mendaftar:{" "}
            {(pendaftaran.belum / (pendaftaran.total || 1)).toLocaleString(
              "id-ID",
              {
                maximumFractionDigits: 2,
                style: "percent",
              }
            )}{" "}
            ({pendaftaran.belum})
          </p>
          <p>Total: {pendaftaran.total}</p>
        </CardContent>
      </Card>
    </Grow>
  );
}
