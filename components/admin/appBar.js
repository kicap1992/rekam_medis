import * as React from 'react';
import Router from 'next/router';
// import { styled, useTheme } from '@mui/material/styles';
import { styled, useTheme, alpha } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// icon
import HomeIcon from '@mui/icons-material/Home';
import SickIcon from '@mui/icons-material/Sick';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AddAlertIcon from '@mui/icons-material/AddAlert';

// coba
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

// import Link from "next/link";

const listmenu = [
  {
    name: 'Home',
    name2 : 'Halaman Utama',
    icon: <HomeIcon />,
    router: '/admin',
  },
  {
    name: 'Dokter',
    name2 : 'Halaman Dokter',
    icon: <MedicationIcon />,
    router: '/admin/data-dokter',
  },
  {
    name: 'Pasien',
    name2 : 'Halaman Pasien',
    icon: <SickIcon />,
    router: '/admin/data-pasien',
  },
  {
    name: 'Obat',
    name2 : 'Halaman Obat',
    icon: <VaccinesIcon />,
    router: '/admin/data-obat',
  },
  {
    name: 'Tindakan',
    name2 : 'Halaman Tindakan',
    icon: <AddAlertIcon />,
    router: '/admin/data-tindakan',
  }
]


const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function AppBarAdmin(props) {
  // const router = useRouter();
  // console.log(props) 
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  }

  // coba
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'primary-search-account-menu';
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

 
  async function logout(){
    try{
      const url = process.env.HTTP_URL + "/api/login/logout";
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
      })
      // get response
      const data_response = await response.json()
      console.log(data_response, "ini data response")
      // console.log(data, "ini data dari cek dokter")
      if (response.status === 200) {
        // create toast
        Router.push('/')
        return true
      } else if (response.status === 400) {
        Router.push('/')
        return false
      } else {
        // create toast
        Router.push('/')
        return false
      }
      
    }catch (err){
      Router.push('/')
      console.log(err)
    }
  }


  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={
        () => {
          logout()
          handleMenuClose()
        }
      }>Logout</MenuItem>
    </Menu>
  );

  function handleMenuRoute(menu){
    // console.log(menu + " sini menunya di appbar")
    Router.push(menu)
  }


  return (
    <>
        
        <AppBar position="fixed" open={open} >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // onClick={handleDrawerOpen}
              onClick={(!props.backdrop && !props.sweetalertload) ? handleDrawerOpen : null}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
                cursor : (!props.backdrop && !props.sweetalertload)  ? 'pointer' : 'default'
              }}
              
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {/* check the listmenu name if same as props.menu then load the listmenu.name2  */}
              {
                listmenu.map((listmenu, index) => {
                  if(listmenu.name === props.menu){
                    return listmenu.name2
                  }
                })
              }
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "flex", md: 'flex' } }}>
              
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={(!props.backdrop && !props.sweetalertload) ? handleProfileMenuOpen : null}
                color="inherit"
                sx={{
                  cursor : (!props.backdrop && !props.sweetalertload)  ? 'pointer' : 'default'
                }}
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {renderMenu}
     
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography variant="h6" noWrap>Rekam Medis</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>        
        </DrawerHeader>
        <Divider />
        <List>
          {/* 
            loop listmenu and render
          */}
          {
            listmenu.map((menu, index) => (
              <ListItemButton
                key={index}
                // onClick={handleMenuRoute("hehe")}
                // onClick={() => props.handleMenuRoute(menu.router)}
                onClick={ (!props.backdrop && !props.sweetalertload && props.menu != menu.name) ? () => handleMenuRoute(menu.router) : null}
                // disableElevation
                // disableRipple
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: (props.menu == menu.name) ? theme.palette.primary.main : null, // ini
                  color: (props.menu == menu.name) ? "white" : "grey", // ini
                  '&:hover': {
                    background: (props.menu == menu.name) ? theme.palette.primary.main : null, // ini
                  },
                  cursor:   (props.backdrop || props.sweetalertload || props.menu == menu.name) ? 'default' : "pointer",
                  // cursor:  "alias",
                }}
              >
                <ListItemIcon
                  sx={{
                    color:  (props.menu == menu.name) ? "white" : "grey", // ini
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {
                    menu.icon
                  }
                </ListItemIcon>
                <ListItemText primary={menu.name2} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            ))
          }
        </List>

        
          
      </Drawer>
    </>
  )
}

export default AppBarAdmin;