import * as React from 'react';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Settings from '@material-ui/icons/Settings';
import Logout from '@material-ui/icons/Logout';

import { AkunLoginContext } from '../App';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function MenuAkun() {
    const { akunLogin, setAkunLogin } = useContext(AkunLoginContext);

    const handleKeluarClick = () => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('profilePicture');
        setAkunLogin(null);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Setelan akun">
                    <IconButton onClick={handleClick} size="small">
                        <Avatar alt={akunLogin?.mahasiswa?.nama} src={localStorage.getItem('profilePicture')} />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    sx: {
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <Avatar alt={akunLogin?.mahasiswa?.nama} src={localStorage.getItem('profilePicture')} /> {akunLogin?.mahasiswa?.nama}
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Setelan
                </MenuItem>
                <MenuItem onClick={handleKeluarClick} component={RouterLink} to="/">
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Keluar
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
