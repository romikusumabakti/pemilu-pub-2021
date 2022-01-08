import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Card, Stack } from '@material-ui/core';
import { useTheme } from '@emotion/react';
import { Link } from '@material-ui/core';
import { AkunLoginContext, API_URL } from '../App';

export default function Login() {
    const { setAkunLogin } = React.useContext(AkunLoginContext);
    
    function getAkunLogin(token) {
        fetch(API_URL + '/akun_login/', {
          headers: {
            'Authorization': 'Bearer ' + token.access,
          }
        })
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log(data);
            setAkunLogin(data);
            window.location.href = '/';
          })
          .catch((error) => {
            console.error(error);
          });
      }
    
    const handleSubmit = (event) => {
        event.preventDefault();

        fetch(API_URL + '/login/', {
            method: 'POST',
            body: new FormData(document.periksaId),
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        alert('NIM/NIDN tidak valid.');
                    } else if (response.status === 401) {
                        alert('Kata sandi salah.');
                    }
                    throw new Error();
                }
                return response.json();
            })
            .then(token => {
                localStorage.setItem('accessToken', token.access);
                localStorage.setItem('refreshToken', token.refresh);
                getAkunLogin(token);
            }).catch((error) => {
                console.error(error);
            });
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ p: useTheme().padding }}>
            <Stack spacing={useTheme().padding}>
                <Button type="submit" variant="contained" component={Link} href={API_URL + '/authorize/'} alignSelf="center">
                    Login dengan Akun Google
                </Button>
                <Card
                    sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Typography component="h2" variant="subtitle1">
                        menggunakan Akun PUB
                    </Typography>
                    <Stack spacing={2} component="form" name="periksaId" onSubmit={handleSubmit} sx={{ alignSelf: 'stretch', mt: 2 }}>
                        <TextField
                            required
                            fullWidth
                            id="username"
                            label="NIM/NIDN"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            InputLabelProps={{ required: false }}
                        />
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Kata sandi"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            InputLabelProps={{ required: false }}
                        />
                        <Grid container>
                            <Grid item xs>
                                <Button color="secondary" component={Link} to="/daftar">
                                    Daftar
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained">
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Card>
            </Stack>
        </Container>
    );
}