import React from "react";
import { useTheme } from "@emotion/react";
import { Card, CardContent, Container, Grow, Link, Stack } from "@mui/material";
import Logo from "../components/Logo";

export default function Tentang(props) {
  return (
    <Container component="main" maxWidth="sm" sx={{ p: useTheme().padding }}>
      <Stack
        spacing={useTheme().padding}
        justifyContent="space-between"
        alignItems={{ xs: "center", sm: "stretch" }}
      >
        <Grow in={true} style={{ transformOrigin: "50% 0" }}>
          <Card>
            <CardContent sx={{ px: 3 }}>
              <Logo size={40} />
              <p style={{ marginTop: 0 }}>Versi 2.1 Alpha</p>
              <p>
                {/* Developer front-end: Romi Kusuma Bakti
                <br />
                Developer back-end: Romi Kusuma Bakti
                <br /> */}
                Framework front-end: React
                <br />
                Library UI: Material-UI
                <br />
                Framework back-end: Django REST Framework
                <br />
                Basis data: MySQL
                <br />
                Metode otentikasi: JWT & Google OAuth 2.0
                {/* <br />
                Repository GitHub:{" "}
                <Link
                  href="https://github.com/romikusumabakti/pemilu-pub"
                  target="_blank"
                  sx={{ wordBreak: "break-all" }}
                >
                  https://github.com/romikusumabakti/pemilu-pub
                </Link> */}
              </p>
              <p style={{ marginBottom: 0 }}>
                © 2021 Pemberdayaan Umat Berkelanjutan
                <br />
                Hak cipta dilindungi oleh undang-undang.
              </p>
            </CardContent>
          </Card>
        </Grow>
      </Stack>
    </Container>
  );
}
