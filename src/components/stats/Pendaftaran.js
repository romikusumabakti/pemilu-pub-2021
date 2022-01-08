import { Card, CardContent, CardHeader, Grow } from "@material-ui/core";
import { useEffect, useState } from "react";
import { RadialChart } from 'react-vis';
import { API_URL } from "../../App";

export default function Pendaftaran(props) {
  const [pendaftaran, setPendaftaran] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/pemilu/statistik/pendaftaran/')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(pendaftaran => {
        setPendaftaran({...pendaftaran, total: pendaftaran.sudah + pendaftaran.belum});
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Grow in={true} style={{ transformOrigin: '50% 0' }}>
      <Card>
        <CardHeader title="Pendaftaran" sx={{ p: 3, pb: 0 }} />
        <CardContent sx={{ px: 3 }}>
          <RadialChart
            data={[
              {
                angle: pendaftaran.sudah,
                label: 'Sudah mendaftar',
              },
              {
                angle: pendaftaran.belum,
                label: 'Belum mendaftar',
              },
            ]}
            width={256}
            height={256}
            showLabels={true} />
            <p>Sudah mendaftar: {(pendaftaran.sudah / pendaftaran.total * 100).toFixed(2).replace('.', ',')}% ({pendaftaran.sudah})</p>
            <p>Belum mendaftar: {(pendaftaran.belum / pendaftaran.total * 100).toFixed(2).replace('.', ',')}% ({pendaftaran.belum})</p>
            <p>Total: {pendaftaran.total}</p>
        </CardContent>
      </Card>
    </Grow>
  );
}
