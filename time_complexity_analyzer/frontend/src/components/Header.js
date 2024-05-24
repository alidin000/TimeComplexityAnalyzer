import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/logo.png';

const Header = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box className="header-left">
          <IconButton edge="start" color="inherit" aria-label="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </IconButton>
        </Box>
        <Box className="header-center">
          <Typography variant="h6">
            {currentPath === '/learning' ? 'Learning' : 'Calculator'}
          </Typography>
        </Box>
        <Box className="header-right">
          <Button color="inherit" component={NavLink} to="/" exact>
            CALCULATOR
          </Button>
          <Button color="inherit" component={NavLink} to="/learning" exact>
            LEARNING
          </Button>
          <Button color="inherit" component={NavLink} to="/about-us">
            ABOUT US
          </Button>
          {isLoggedIn ? (
            <>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={NavLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={NavLink} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
