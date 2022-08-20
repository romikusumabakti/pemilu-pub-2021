import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link, useLocation } from "react-router-dom";

export default function TabsNav({ daftarHalaman, ...rest }) {
  const location = useLocation();

  return (
    <Tabs value={location.pathname} indicatorColor="secondary" {...rest}>
      {daftarHalaman[0].map((halaman) => (
        <Tab
          key={halaman.jalur}
          label={halaman.title}
          value={halaman.jalur}
          component={Link}
          to={halaman.jalur}
        />
      ))}
      {daftarHalaman[2].map((halaman) => (
        <Tab
          sx={{ display: { md: "none", lg: "flex" } }}
          key={halaman.jalur}
          label={halaman.title}
          value={halaman.jalur}
          component={Link}
          to={halaman.jalur}
        />
      ))}
    </Tabs>
  );
}
