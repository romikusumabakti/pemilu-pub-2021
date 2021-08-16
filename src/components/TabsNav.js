import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link, useRouteMatch } from 'react-router-dom';
import { daftarHalaman } from '../App';

export default function TabsNav(props) {
  const routeMatch = useRouteMatch(daftarHalaman.flat().map(halaman => halaman.jalur).reverse());
  const currentTab = routeMatch?.path;
  return (
    <Tabs value={currentTab} indicatorColor="secondary" {...props}>
      {daftarHalaman[0].map((halaman) => (
        <Tab key={halaman.jalur} label={halaman.title} value={halaman.jalur} component={Link} to={halaman.jalur} />
      ))}
      {daftarHalaman[2].map((halaman) => (
        <Tab sx={{ display: { md: 'none', lg: 'flex' } }} key={halaman.jalur} label={halaman.title} value={halaman.jalur} component={Link} to={halaman.jalur} />
      ))}
    </Tabs>
  );
}
