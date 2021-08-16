import { useTheme } from "@emotion/react";
import { Button, Card, CardActions, CardContent, CardHeader, Container, Grow, Stack } from "@material-ui/core";
import LogoAnimasi from "../components/LogoAnimasi";
import { Link } from 'react-router-dom';

import { AkunLoginContext } from '../App';
import { useContext } from 'react';

function Beranda() {
  const { akunLogin, setAkunLogin } = useContext(AkunLoginContext);

  return (
    <Container component="main" maxWidth="md" sx={{ p: useTheme().padding }}>
      <Stack spacing={useTheme().padding} justifyContent="space-between" alignItems={{ xs: 'center', sm: 'stretch' }}>

        <LogoAnimasi size={40} />

        {akunLogin ?
          <Grow in={true} style={{ transformOrigin: '50% 0' }}>
            <Card>
              <CardHeader title={'Hai, ' + akunLogin?.mahasiswa?.nama + '!'} sx={{ p: 3, pb: 0 }} />
              <CardContent sx={{ px: 3 }}>
                <p style={{ marginBlock: 0 }}>
                  Pemilihan Ketua PUB tahun 2021 insya Allah akan dilaksanakan pada tanggal 17 Agustus 2021.
                </p>
              </CardContent>
              <CardActions sx={{ pt: 0 }}>
                <Button color="secondary" sx={{ ml: 'auto' }} component={Link} to="/jadwal">Selengkapnya</Button>
              </CardActions>
            </Card>
          </Grow>
          :
          <Grow in={true} style={{ transformOrigin: '50% 0' }}>
            <Card>
              <CardHeader title="Pendaftaran Pemilu PUB 2021" sx={{ p: 3, pb: 0 }} />
              <CardContent sx={{ px: 3 }}>
                <p style={{ marginTop: 0 }}>
                  Pemilihan Ketua PUB tahun 2021 insya Allah akan dilaksanakan pada tanggal 17 Agustus 2021.
                  Untuk mengikutinya, Anda harus mengklaim hak pilih Anda dengan membuat Akun PUB. Daftar sekarang juga!
                </p>
                <p style={{ marginBottom: 0, fontSize: '.875rem' }}>
                  *Anda harus memiliki Akun Google yang diperlukan untuk otentikasi Google OAuth 2.0 nanti.
                </p>
              </CardContent>
              <CardActions sx={{ pt: 0, px: 3, pb: 3 }}>
                <Button color="secondary" sx={{ ml: 'auto' }} component={Link} to="/jadwal">Selengkapnya</Button>
                <Button variant="contained" component={Link} to="/daftar">Daftar</Button>
              </CardActions>
            </Card>
          </Grow>
        }

        <Grow in={true} timeout={1000} style={{ transformOrigin: '50% 0' }}>
          <Card>
            <CardHeader title="Kedua kandidat yang berbeda fakultas" sx={{ p: 3, pb: 0 }} />
            <CardContent sx={{ px: 3 }}>
              <img src="/gambar/foto_kandidat/kartun.png" height={192} alt="Kartun kandidat ketua/keamanan PUB 2021/2022" />
              <p style={{ marginTop: 8, marginBottom: 0 }}>
                Berbeda dengan pemilihan sebelumnya yang kedua kandidatnya berasal dari fakultas yang sama,
                Pemilu kali ini kedua kandidatnya berbeda fakultas, yaitu Fakultas Psikologi dan Fakultas Ilmu Komputer.
              </p>
              <ul style={{ paddingLeft: 18 }}>
                <li>01 Moh Afkarul Haq (S1 Psikologi)</li>
                <li>02 Habib Jannata (S1 Teknik Informatika)</li>
              </ul>
            </CardContent>
            <CardActions sx={{ pt: 0 }}>
              <Button color="secondary" sx={{ ml: 'auto' }} component={Link} to="/kandidat">Selengkapnya</Button>
            </CardActions>
          </Card>
        </Grow>

        <Card>
          <CardHeader title="Ingin mencoba pemilihan sekarang?" sx={{ p: 3, pb: 0 }} />
          <CardContent sx={{ px: 3 }}>
            Kami menyediakan simulasi pemilihan sebelum pemilihan yang sebenarnya nanti dilaksanakan.
            Anda dapat mencobanya agar tahu bagaimana cara memilih nanti.
          </CardContent>
          <CardActions sx={{ pt: 0, px: 3, pb: 3 }}>
            <Button variant="contained" sx={{ ml: 'auto' }} component={Link} to="/simulasi">Coba simulasi</Button>
          </CardActions>
        </Card>

        <Card>
          <CardHeader title="Berapa banyak yang sudah mendaftar?" sx={{ p: 3, pb: 0 }} />
          <CardContent sx={{ px: 3 }}>
            <p style={{ marginTop: 0 }}>
              Kami berharap semua mahasiswa PUB aktif sudah mendaftar sebelum hari pemilihan nanti, sehingga pemilihan dapat berjalan dengan lancar.
            </p>
            <p>
              Selain itu, kami juga sedang menyiapkan project sistem informasi PUB yang akan saling terintegrasi satu sama lain.
              Akun yang terdaftar nanti akan bisa dipakai di seluruh sistem itu.
            </p>
            <p style={{ marginBottom: 0 }}>
              Oleh karena itu, kami menghimbau kepada seluruh mahasiswa PUB aktif untuk mengkampanyekan pendaftaran Akun PUB ini.
            </p>
          </CardContent>
          <CardActions sx={{ pt: 0 }}>
            <Button color="secondary" sx={{ ml: 'auto' }} component={Link} to="/statistik">Selengkapnya</Button>
          </CardActions>
        </Card>

        <Card>
          <CardHeader title="Apakah sistem e-voting ini aman?" sx={{ p: 3, pb: 0 }} />
          <CardContent sx={{ px: 3 }}>
            <p style={{ marginTop: 0 }}>
              Sistem ini dibangun dengan 2 framework terbaik dan terpopuler di dunia,
              yaitu Django (framework Python) untuk back-end-nya, dan React untuk front-end-nya.
            </p>
            <p style={{ marginBottom: 0 }}>
              Selain itu, sistem ini dibangun dengan cara yang benar.
              Kami tidak menyimpan 1 digit pun kata sandi Anda,
              sehingga pihak KPU PUB, admin sistem, hingga orang yang memiliki akses ke basis data pun tidak akan dapat mengetahuinya.
            </p>
          </CardContent>
          <CardActions sx={{ pt: 0 }}>
            <Button color="secondary" sx={{ ml: 'auto' }} component={Link} to="/tentang">Selengkapnya</Button>
          </CardActions>
        </Card>

        <Card>
          <CardHeader title="Pengumuman hasil Pemilu PUB 2021" sx={{ p: 3, pb: 0 }} />
          <CardContent sx={{ px: 3 }}>
            <p style={{ marginBlock: 0 }}>
              Setelah pemilihan selesai, hasil dari Pemilu ini akan diumumkan oleh Ketua KPU PUB (yang sekaligus merupakan petahana saat ini) di grup WhatsApp PUB
              dan akan ditampilkan di halaman Hasil.
            </p>
          </CardContent>
          <CardActions sx={{ pt: 0 }}>
            <Button color="secondary" sx={{ ml: 'auto' }} component={Link} to="/hasil">Buka halaman Hasil</Button>
          </CardActions>
        </Card>

      </Stack>
    </Container>
  );
}

export default Beranda