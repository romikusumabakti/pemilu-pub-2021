import { Card, CardContent, CardHeader, Grow } from "@material-ui/core";
import { useEffect, useState } from "react";
import { RadialChart } from 'react-vis';
import { API_URL } from "../../App";

export default function Pemilihan(props) {
  const [pemilihan, setPemilihan] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/pemilu/statistik/pemilihan/')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(pemilihan => {
        setPemilihan({...pemilihan, total: pemilihan.sudah + pemilihan.belum});
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Grow in={true} style={{ transformOrigin: '50% 0' }}>
      <Card>
        <CardHeader title="Pemilihan" sx={{ p: 3, pb: 0 }} />
        <CardContent sx={{ px: 3 }}>
          <RadialChart
            data={[
              {
                angle: pemilihan.sudah,
                label: 'Sudah memilih',
              },
              {
                angle: pemilihan.belum,
                label: 'Belum memilih',
              },
            ]}
            width={256}
            height={256}
            showLabels={true} />
            <p>Sudah memilih: {(pemilihan.sudah / pemilihan.total * 100).toFixed(2).replace('.', ',')}% ({pemilihan.sudah})</p>
            <p>Belum memilih: {(pemilihan.belum / pemilihan.total * 100).toFixed(2).replace('.', ',')}% ({pemilihan.belum})</p>
            <p>Total: {pemilihan.total}</p>
        </CardContent>
      </Card>
    </Grow>
  );
}
