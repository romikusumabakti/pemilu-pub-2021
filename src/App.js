import './App.css';

import React, { Suspense, useState } from 'react';

import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom';

import { CssBaseline, Divider, Toolbar, useMediaQuery } from '@material-ui/core';
import { colors, createTheme, ThemeProvider } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';

import HomeIcon from '@material-ui/icons/Home';
import EventIcon from '@material-ui/icons/Event';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import PeopleIcon from '@material-ui/icons/People';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import BarChartIcon from '@material-ui/icons/BarChart';
import DataUsageIcon from '@material-ui/icons/DataUsage';

import LoginIcon from '@material-ui/icons/Login';
import AssignmentIcon from '@material-ui/icons/Assignment';

import CodeIcon from '@material-ui/icons/Code';
import InfoIcon from '@material-ui/icons/Info';

import Header from './components/Header';
import DrawerNav from './components/DrawerNav';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Tentang from './pages/Tentang';
import { useEffect } from 'react';
import { useCallback } from 'react';

const Beranda = React.lazy(() => import('./pages/Beranda'));
const Jadwal = React.lazy(() => import('./pages/Jadwal'));
const Kandidat = React.lazy(() => import('./pages/Kandidat'));
const Pemilih = React.lazy(() => import('./pages/Pemilih'));
const Simulasi = React.lazy(() => import('./pages/Simulasi'));
const Statistik = React.lazy(() => import('./pages/Statistik'));
const Hasil = React.lazy(() => import('./pages/Hasil'));
const Login = React.lazy(() => import('./pages/Login'));
const Daftar = React.lazy(() => import('./pages/Daftar'));
const ReactStart = React.lazy(() => import('./pages/ReactStart'));

export const API_URL = process.env.NODE_ENV === 'production' ? 'https://pemilu-api.pubpasim.org' : 'http://127.0.0.1:8000';

export const daftarHalaman = [
  [{
    jalur: '/',
    component: <Beranda />,
    title: 'Beranda',
    icon: <HomeIcon />,
  }, {
    jalur: '/jadwal',
    component: <Jadwal />,
    title: 'Jadwal',
    icon: <EventIcon />
  }, {
    jalur: '/kandidat',
    component: <Kandidat />,
    title: 'Kandidat',
    icon: <AccountBoxIcon />
  }, {
    jalur: '/pemilih',
    component: <Pemilih />,
    title: 'Pemilih',
    icon: <PeopleIcon />
  }, {
    jalur: '/simulasi',
    component: <Simulasi />,
    title: 'Simulasi',
    icon: <HowToVoteIcon />
  }, {
    jalur: '/statistik',
    component: <Statistik />,
    title: 'Statistik',
    icon: <BarChartIcon />
  }, {
    jalur: '/hasil',
    component: <Hasil />,
    title: 'Hasil',
    icon: <DataUsageIcon />
  }], [{
    jalur: '/login',
    component: <Login />,
    title: 'Login',
    icon: <LoginIcon />
  }, {
    jalur: '/daftar',
    component: <Daftar />,
    title: 'Daftar',
    icon: <AssignmentIcon />
  }], [{
    jalur: '/api',
    component: <ReactStart />,
    title: 'API',
    icon: <CodeIcon />
  }, {
    jalur: '/tentang',
    component: <Tentang />,
    title: 'Tentang',
    icon: <InfoIcon />
  }],
];

const token = {
  refresh: localStorage.getItem('refreshToken'),
  access: localStorage.getItem('accessToken'),
}

export const AkunLoginContext = React.createContext();

function App(props) {

  let getAkunLogin = null;

  const refreshToken = useCallback(() => {
    fetch(API_URL + '/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: token.refresh,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(data => {
        token.access = data.access;
        getAkunLogin();
      })
      .catch((error) => {
        console.error(error);
      });
  }, [getAkunLogin]);

  const [akunLogin, setAkunLogin] = useState();

  getAkunLogin = useCallback(() => {
    fetch(API_URL + '/akun_login/', {
      headers: {
        'Authorization': 'Bearer ' + token.access,
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.code === 'token_not_valid') {
          refreshToken();
          throw new Error('Token tidak valid.');
        }
        console.log(data);
        setAkunLogin(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refreshToken]);

  useEffect(() => {
    const refreshToken = new URL(window.location.href).searchParams.get('refresh');
    const accessToken = new URL(window.location.href).searchParams.get('access');
    const profilePicture = new URL(window.location.href).searchParams.get('picture');

    if (refreshToken && accessToken) {
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accessToken', accessToken);
      if (profilePicture) {
        localStorage.setItem('profilePicture', profilePicture);
        window.history.pushState(null, '', '/');
      }
      window.history.pushState(null, '', '/');
    }

    token.refresh = localStorage.getItem('refreshToken');
    token.access = localStorage.getItem('accessToken');

    if (token.refresh && token.access) {
      getAkunLogin();
    }
  }, [getAkunLogin]);

  const [mode, setMode] = useState(window.localStorage.getItem('mode'));

  let dark = useMediaQuery('(prefers-color-scheme: dark)');

  if (mode === 'dark') {
    dark = true;
  } else if (mode === 'light') {
    dark = false;
  }

  let theme = createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      background: {
        paper: dark ? '#303030' : 'white',
      },
    },
  });

  theme = createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: blue,
      secondary: red,
      background: {
        default: dark ? '#1b1b1b' : '#eee',
      },
    },
    shape: {
      borderRadius: 24,
    },
    padding: { xs: 2, sm: 3 },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.background.paper,
            backgroundImage: 'none',
          },
        },
        defaultProps: {
          elevation: 4,
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            paddingInline: 16,
            borderRadius: 20,
          },
        },
      },
    },
    createCustomTheme: (theme, color) => {
      theme = createTheme(theme);
      theme.palette.primary = colors[color];
      theme.palette.primary.light = colors[color][100];
      theme.palette.primary.main = colors[color][500];
      theme.palette.primary.dark = colors[color][900];
      theme.palette.primary.contrastText = '#fff';
      return theme;
    },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(!drawerOpen);

  const handleMode = () => {
    if (!mode) {
      if (dark) {
        window.localStorage.setItem('mode', 'light');
      } else {
        window.localStorage.setItem('mode', 'dark');
      }
    } else {
      window.localStorage.removeItem('mode');
    }
    setMode(window.localStorage.getItem('mode'));
  };

  return (
    <AkunLoginContext.Provider value={{ akunLogin, setAkunLogin }}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header drawerOpen={drawerOpen} handleDrawerOpen={handleDrawerOpen} mode={mode} handleMode={handleMode} dark={dark} />
          <DrawerNav daftarHalaman={daftarHalaman} open={drawerOpen} handleDrawerOpen={handleDrawerOpen} />
          <Toolbar />
          <Suspense fallback={<Loading />}>
            <ScrollToTop />
            <Switch>
              {daftarHalaman[0].map((item) => (
                <Route exact key={item.jalur} path={item.jalur} value={item.jalur} render={() => {
                  document.title = item.title + ' - Pemilu PUB';
                  return item.component;
                }}
                />
              ))}
              {daftarHalaman[1].map((item) => (
                <Route key={item.jalur} path={item.jalur} value={item.jalur} render={() => {
                  document.title = item.title + ' - Pemilu PUB';
                  return item.component;
                }}
                />
              ))}
              {daftarHalaman[2].map((item) => (
                <Route key={item.jalur} path={item.jalur} value={item.jalur} render={() => {
                  document.title = item.title + ' - Pemilu PUB';
                  return item.component;
                }}
                />
              ))}
              <Route path="/loading" component={Loading} />
            </Switch>
          </Suspense>
          <Divider />
          <Footer />
        </ThemeProvider>
      </Router>
    </AkunLoginContext.Provider>
  );
}

export default App;