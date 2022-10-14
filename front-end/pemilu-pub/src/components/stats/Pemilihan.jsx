import { Card, CardContent, CardHeader, Grow, useTheme } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { API_URL } from "../../App";

export default function Pemilihan(props) {
  const [pemilihan, setPemilihan] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    fetch(API_URL + "/statistik/pemilihan/")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((pemilihan) => {
        setPemilihan({
          ...pemilihan,
          total: pemilihan.sudah + pemilihan.belum,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Grow in={true} style={{ transformOrigin: "50% 0" }}>
      <Card>
        <CardHeader title="Pemilihan" sx={{ p: 3, pb: 0 }} />
        <CardContent sx={{ px: 3 }}>
          <ResponsiveContainer width="100%" height={256}>
            <PieChart width={256} height={256}>
              <Pie
                data={[
                  {
                    name: "Sudah memilih",
                    value: pemilihan.sudah,
                  },
                  {
                    name: "Belum memilih",
                    value: pemilihan.belum,
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
            Sudah memilih:{" "}
            {(pemilihan.sudah / (pemilihan.total || 1)).toLocaleString(
              "id-ID",
              {
                maximumFractionDigits: 2,
                style: "percent",
              }
            )}{" "}
            ({pemilihan.sudah})
          </p>
          <p>
            Belum memilih:{" "}
            {(pemilihan.belum / pemilihan.total || 1).toLocaleString("id-ID", {
              maximumFractionDigits: 2,
              style: "percent",
            })}{" "}
            ({pemilihan.belum})
          </p>
          <p>Total: {pemilihan.total}</p>
        </CardContent>
      </Card>
    </Grow>
  );
}
