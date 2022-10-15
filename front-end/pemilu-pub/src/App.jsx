import "./App.css";

import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CssBaseline, Divider, Toolbar, useMediaQuery } from "@mui/material";
import { colors, createTheme, ThemeProvider } from "@mui/material";
import { blue, red } from "@mui/material/colors";

import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleIcon from "@mui/icons-material/People";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import BarChartIcon from "@mui/icons-material/BarChart";
import DataUsageIcon from "@mui/icons-material/DataUsage";

import LoginIcon from "@mui/icons-material/Login";
import AssignmentIcon from "@mui/icons-material/Assignment";

// import CodeIcon from "@mui/icons-material/Code";
import InfoIcon from "@mui/icons-material/Info";

import Header from "./components/Header";
import DrawerNav from "./components/DrawerNav";
import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";
import Footer, { Copyright } from "./components/Footer";
import Tentang from "./pages/Tentang";
import Pemilihan from "./pages/Pemilihan";

const Beranda = lazy(() => import("./pages/Beranda"));
const Jadwal = lazy(() => import("./pages/Jadwal"));
const Kandidat = lazy(() => import("./pages/Kandidat"));
const Pemilih = lazy(() => import("./pages/Pemilih"));
const Simulasi = lazy(() => import("./pages/Simulasi"));
const Statistik = lazy(() => import("./pages/Statistik"));
const Hasil = lazy(() => import("./pages/Hasil"));
const Login = lazy(() => import("./pages/Login"));
const Daftar = lazy(() => import("./pages/Daftar"));
// const ReactStart = lazy(() => import("./pages/ReactStart"));

const Admin = {
  Login: lazy(() => import("./pages/admin/Login")),
  Kandidat: lazy(() => import("./pages/admin/Kandidat")),
  Anggota: lazy(() => import("./pages/admin/Anggota")),
  Dapil: lazy(() => import("./pages/admin/Dapil")),
  Angkatan: lazy(() => import("./pages/admin/Angkatan")),
};

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://pemilu-api.pubpasim.org"
    : "http://127.0.0.1:8000";

const daftarHalaman = [
  [
    {
      jalur: "/",
      component: <Beranda />,
      title: "Beranda",
      icon: <HomeIcon />,
    },
    {
      jalur: "/jadwal",
      component: <Jadwal />,
      title: "Jadwal",
      icon: <EventIcon />,
    },
    {
      jalur: "/kandidat",
      component: <Kandidat />,
      title: "Kandidat",
      icon: <AccountBoxIcon />,
    },
    {
      jalur: "/pemilih",
      component: <Pemilih />,
      title: "Pemilih",
      icon: <PeopleIcon />,
    },
    {
      jalur: "/simulasi",
      component: <Simulasi />,
      title: "Simulasi",
      icon: <HowToVoteIcon />,
    },
    {
      jalur: "/statistik",
      component: <Statistik />,
      title: "Statistik",
      icon: <BarChartIcon />,
    },
    {
      jalur: "/hasil",
      component: <Hasil />,
      title: "Hasil",
      icon: <DataUsageIcon />,
    },
  ],
  [
    {
      jalur: "/login",
      component: <Login />,
      title: "Login",
      icon: <LoginIcon />,
    },
    {
      jalur: "/daftar",
      component: <Daftar />,
      title: "Daftar",
      icon: <AssignmentIcon />,
    },
  ],
  [
    // {
    //   jalur: "/api",
    //   component: <ReactStart />,
    //   title: "API",
    //   icon: <CodeIcon />,
    // },
    {
      jalur: "/tentang",
      component: <Tentang />,
      title: "Tentang",
      icon: <InfoIcon />,
    },
  ],
];

const daftarHalamanAdmin = [
  [
    // {
    //   jalur: "/admin",
    //   component: <Beranda />,
    //   title: "Dasbor",
    //   icon: <HomeIcon />,
    // },
    {
      jalur: "/admin/kandidat",
      component: <Admin.Kandidat />,
      title: "Kandidat",
      icon: <AccountBoxIcon />,
    },
    {
      jalur: "/admin/anggota",
      component: <Admin.Anggota />,
      title: "Anggota",
      icon: <PeopleIcon />,
    },
    {
      jalur: "/admin/dapil",
      component: <Admin.Dapil />,
      title: "Dapil",
      icon: <AccountBoxIcon />,
    },
    {
      jalur: "/admin/angkatan",
      component: <Admin.Angkatan />,
      title: "Angkatan",
      icon: <AccountBoxIcon />,
    },
  ],
  [
    {
      jalur: "/admin/login",
      component: <Admin.Login />,
      title: "Login",
      icon: <LoginIcon />,
    },
  ],
  [],
];

export const AuthContext = createContext();
export const AdminAuthContext = createContext();

async function getToken(refresh) {
  return fetch(API_URL + "/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh,
    }),
  })
    .then((response) => response.json())
    .then((json) => json.access);
}

function App() {
  const [account, setAccount] = useState();
  const [adminToken, setAdminToken] = useState();

  const getAccount = useCallback(() => {
    fetch(API_URL + "/akun_login/", {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.code === "token_not_valid") {
          getToken(
            sessionStorage
              .getItem("refreshToken")
              .then((accessToken) =>
                sessionStorage.setItem("accessToken", accessToken)
              )
          );
        } else {
          setAccount(json);
        }
      });
  }, []);

  useEffect(() => {
    const urlParams = new URL(window.location.href).searchParams;
    const token = {
      refresh: urlParams.get("refresh"),
      access: urlParams.get("access"),
    };
    const profilePicture = urlParams.get("picture");
    if (token.refresh && token.access) {
      sessionStorage.setItem("refreshToken", token.refresh);
      sessionStorage.setItem("accessToken", token.access);
      if (profilePicture) {
        sessionStorage.setItem("profilePicture", profilePicture);
        window.history.pushState(null, "", "/");
      }
      window.history.pushState(null, "", "/");
    } else {
      token.refresh = sessionStorage.getItem("refreshToken");
      token.access = sessionStorage.getItem("accessToken");
    }
    if (token.refresh && token.access) {
      getAccount();
    }

    const adminRefreshToken = sessionStorage.getItem("adminRefreshToken");
    if (adminRefreshToken) {
      getToken(adminRefreshToken).then((token) => setAdminToken(token));
    }
  }, [getAccount]);

  const [mode, setMode] = useState(localStorage.getItem("mode"));

  let dark = useMediaQuery("(prefers-color-scheme: dark)");

  if (mode === "dark") {
    dark = true;
  } else if (mode === "light") {
    dark = false;
  }

  let theme = createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      background: {
        paper: dark ? "#333" : "#fff",
      },
    },
  });

  theme = createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      primary: blue,
      secondary: red,
      background: {
        default: dark ? "#1b1b1b" : "#eee",
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
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.background.paper,
            backgroundImage: "none",
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
      theme.palette.primary.contrastText = "#fff";
      return theme;
    },
  });
  const handleMode = () => {
    if (!mode) {
      if (dark) {
        localStorage.setItem("mode", "light");
      } else {
        localStorage.setItem("mode", "dark");
      }
    } else {
      localStorage.removeItem("mode");
    }
    setMode(localStorage.getItem("mode"));
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(!drawerOpen);

  return (
    <AdminAuthContext.Provider value={{ adminToken, setAdminToken }}>
      <AuthContext.Provider value={{ account, setAccount }}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route
                path="/*"
                element={
                  <>
                    <Header
                      drawerOpen={drawerOpen}
                      handleDrawerOpen={handleDrawerOpen}
                      mode={mode}
                      handleMode={handleMode}
                      dark={dark}
                      daftarHalaman={daftarHalaman}
                    />
                    <DrawerNav
                      open={drawerOpen}
                      handleDrawerOpen={handleDrawerOpen}
                      daftarHalaman={daftarHalaman}
                    />
                  </>
                }
              />
              <Route
                path="admin/*"
                element={
                  <>
                    <Header
                      drawerOpen={drawerOpen}
                      handleDrawerOpen={handleDrawerOpen}
                      mode={mode}
                      handleMode={handleMode}
                      dark={dark}
                      daftarHalaman={daftarHalamanAdmin}
                      admin
                    />
                    <DrawerNav
                      open={drawerOpen}
                      handleDrawerOpen={handleDrawerOpen}
                      daftarHalaman={daftarHalamanAdmin}
                    />
                  </>
                }
              />
            </Routes>
            <Toolbar />
            <ScrollToTop />
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/">
                  {daftarHalaman.map((daftar) =>
                    daftar.map((item) => (
                      <Route
                        key={item.jalur}
                        path={item.jalur}
                        element={item.component}
                      />
                    ))
                  )}
                  <Route path="/pemilihan" element={<Pemilihan />} />
                </Route>
                <Route path="admin">
                  {daftarHalamanAdmin.map((daftar) =>
                    daftar.map((item) => (
                      <Route
                        key={item.jalur}
                        path={item.jalur}
                        element={item.component}
                      />
                    ))
                  )}
                </Route>
              </Routes>
            </Suspense>
            <Divider />
            <Routes>
              <Route path="/*" element={<Footer />} />
              <Route
                path="/admin/*"
                element={
                  <footer style={{ padding: 8 }}>
                    <Copyright />
                  </footer>
                }
              />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </AuthContext.Provider>
    </AdminAuthContext.Provider>
  );
}

export default App;
