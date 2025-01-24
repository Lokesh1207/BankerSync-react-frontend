import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useNavigate } from 'react-router-dom';
import ClientIcon from '@mui/icons-material/Person'; 
import LoanIcon from '@mui/icons-material/AttachMoney'; 
import ReportIcon from '@mui/icons-material/Assessment'; 
import { Outlet } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import './App.css';

const drawerWidth = 240;

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

const StyledLogout = styled('div')(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  padding: "2px 2px",
  cursor: 'pointer', 
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));


const HomeLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0, 
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })( 
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  })
);

export default function SideNav() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); 
    navigate("/login"); 
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[ 
              { marginRight: 5 }, 
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component={HomeLink} to="/" sx={{color: 'white'}}>
            BankerSync
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem button component={StyledLink} to="/client">
            <ListItemIcon
              sx={{
                opacity: open ? 1 : 0, 
              }}
            >
              <ClientIcon />
            </ListItemIcon>
            <ListItemText
              primary="Client"
              sx={{
                opacity: open ? 1 : 0, 
              }}
            />
          </ListItem>
          <ListItem button component={StyledLink} to="/client/getClients">
            <ListItemIcon
              sx={{
                opacity: open ? 1 : 0, 
              }}
            >
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Manage Client"
              sx={{
                opacity: open ? 1 : 0, 
              }}
            />
          </ListItem>
          <ListItem button component={StyledLink} to="/loan">
            <ListItemIcon
              sx={{
                opacity: open ? 1 : 0, 
              }}
            >
              <LoanIcon />
            </ListItemIcon>
            <ListItemText
              primary="Loan"
              sx={{
                opacity: open ? 1 : 0, 
              }}
            />
          </ListItem>
          <ListItem button component={StyledLink} to="/loan/getLoans">
            <ListItemIcon
              sx={{
                opacity: open ? 1 : 0, 
              }}
            >
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Manage Loans"
              sx={{
                opacity: open ? 1 : 0, 
              }}
            />
          </ListItem>
          <ListItem button component={StyledLink} to="/reports">
            <ListItemIcon
              sx={{
                opacity: open ? 1 : 0, 
              }}
            >
              <ReportIcon />
            </ListItemIcon>
            <ListItemText
              primary="Reports"
              sx={{
                opacity: open ? 1 : 0, 
              }}
            />
          </ListItem>
          <ListItem button component={StyledLink} to="">
            <ListItemIcon
              sx={{
                opacity: open ? 1 : 0, 
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              sx={{
                opacity: open ? 1 : 0, 
              }}
            />
          </ListItem>
          <ListItem button onClick={handleLogout} sx={{borderRadius: "8px"}}>
            <StyledLogout>
            <ListItemIcon
              sx={{
                opacity: open ? 1 : 0, 
              }}
            >
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                opacity: open ? 1 : 0, 
              }}
            />
            </StyledLogout>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader /> 
        <Outlet /> 
      </Box>
    </Box>
  );
}
