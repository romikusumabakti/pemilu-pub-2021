import * as React from 'react';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';

import { Link, useRouteMatch } from 'react-router-dom';
import { useContext } from 'react';
import { AkunLoginContext } from '../App';

import Settings from '@material-ui/icons/Settings';
import Logout from '@material-ui/icons/Logout';

const drawerWidth = 240;

function DrawerNav(props) {
    const { akunLogin, setAkunLogin } = useContext(AkunLoginContext);

    const handleKeluarClick = () => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('profilePicture');
        setAkunLogin(null);
    }

    const routeMatch = useRouteMatch(props.daftarHalaman.flat().map(halaman => halaman.jalur).reverse());
    const currentTab = routeMatch?.path;
    return (
        <Drawer
            variant="temporary"
            open={props.open}
            onClose={props.handleDrawerOpen}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                display: { md: 'block', lg: 'none' },
                '& .MuiDrawer-paper': { width: drawerWidth },
            }}
        >
            <Toolbar />
            <Divider />
            <List>
                {props.daftarHalaman[0].map((halaman) => (
                    <ListItemButton key={halaman.jalur} onClick={props.handleDrawerOpen} selected={currentTab === halaman.jalur} component={Link} to={halaman.jalur}>
                        <ListItemIcon>
                            {halaman.icon}
                        </ListItemIcon>
                        <ListItemText primary={halaman.title} />
                    </ListItemButton>
                ))}
            </List>
            <Divider />
            <List>
                {akunLogin ?
                    <>
                        <ListItemButton>
                            <ListItemIcon>
                                <Settings />
                            </ListItemIcon>
                            <ListItemText primary="Setelan" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { handleKeluarClick(); props.handleDrawerOpen(); }} component={Link} to="/">
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Keluar" />
                        </ListItemButton>
                    </>
                    :
                    props.daftarHalaman[1].map((halaman) => (
                        <ListItemButton key={halaman.jalur} onClick={props.handleDrawerOpen} selected={currentTab === halaman.jalur} component={Link} to={halaman.jalur}>
                            <ListItemIcon>
                                {halaman.icon}
                            </ListItemIcon>
                            <ListItemText primary={halaman.title} />
                        </ListItemButton>
                    ))
                }
            </List>
            <Divider />
            <List>
                {props.daftarHalaman[2].map((halaman) => (
                    <ListItemButton key={halaman.jalur} onClick={props.handleDrawerOpen} selected={currentTab === halaman.jalur} component={Link} to={halaman.jalur}>
                        <ListItemIcon>
                            {halaman.icon}
                        </ListItemIcon>
                        <ListItemText primary={halaman.title} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
}

export default DrawerNav;