import icon from '../assets/img/pemilu-pub-icon.svg';
import { useTheme } from "@emotion/react";
import { Card, CardContent, CardHeader, Container, Grow, Stack } from "@material-ui/core";

export default function Tentang(props) {
  return (
    <Container component="main" maxWidth="sm" sx={{ p: useTheme().padding }}>
      <Stack spacing={useTheme().padding} justifyContent="space-between" alignItems={{ xs: 'center', sm: 'stretch' }}>

        <Grow in={true} style={{ transformOrigin: '50% 0' }}>
          <Card>
            <CardHeader title="PUBVoting" sx={{ p: 3, pb: 0 }} />
            <CardContent sx={{ px: 3 }}>
              <img src={icon} className="App-icon" alt="icon" width={128} />
              <p style={{ marginTop: 0 }}>
                Versi 2.0.0 Alpha
              </p>
              <p>
                Framework Back-End: Django REST Framework<br />
                Framework Front-End: React<br />
                Library: Material-UI<br />
                Metode otentikasi: JWT & Google OAuth 2.0
              </p>
              <p style={{ marginBottom: 0 }}>
                © 2021 Pemberdayaan Umat Berkelanjutan<br />
                Hak cipta dilindungi oleh undang-undang.
              </p>
            </CardContent>
          </Card>
        </Grow>

      </Stack>
    </Container>
  );
}
