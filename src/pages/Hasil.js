import { useTheme } from "@emotion/react";
import { Card, CardContent, CardHeader, Container, Grow, Stack } from "@material-ui/core";
import { useEffect, useState } from "react";
import { RadialChart } from 'react-vis';
import { API_URL } from "../App";

export default function Hasil(props) {
  const [kandidat, setKandidat] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/pemilu/kandidat/')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(kandidat => {
        setKandidat(kandidat);
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container component="main" maxWidth="sm" sx={{ p: useTheme().padding }}>
      <Stack spacing={useTheme().padding} justifyContent="space-between" alignItems={{ xs: 'center', sm: 'stretch' }}>

        <Grow in={true} style={{ transformOrigin: '50% 0' }}>
          <Card>
            <CardHeader title="Hasil" sx={{ p: 3, pb: 0 }} />
            <CardContent sx={{ px: 3 }}>
              <RadialChart
                data={[
                  {
                    angle: kandidat[0]?.suara,
                    label: '01 ' + kandidat[0]?.mahasiswa.nama + ' (' + kandidat[0]?.suara + ')',
                  },
                  {
                    angle: kandidat[1]?.suara,
                    label: '02 ' + kandidat[1]?.mahasiswa.nama + ' (' + kandidat[1]?.suara + ')',
                  },
                ]}
                width={256}
                height={256}
                showLabels={true} />
            </CardContent>
          </Card>
        </Grow>

      </Stack>
    </Container>
  );
}
