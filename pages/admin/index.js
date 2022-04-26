import {  useState } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


// icon
import SickIcon from '@mui/icons-material/Sick';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AddAlertIcon from '@mui/icons-material/AddAlert';

import AppBarAdmin from '../../components/admin/appBar';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// this for check session
let all_function = require('../../function/all_function.js')
import { withIronSessionSsr } from "iron-session/next";

// import { createTheme, ThemeProvider } from '@mui/material/styles'; // for custom theme

// for theme
// const theme = createTheme({
//   fontFamily: '"Arial", "Times New Roman"',
//   typography: {
//     "fontFamily": '"Arial", "Times New Roman"',
//   }
// })

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  '&:hover': {
    opacity: 0.7,
  }
}));


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function AdminIndexPage() {
  // console.log(localStorage.getItem("user_data"))
  const [backdrop, setBackdrop] = useState(false);

  // async function cek_user(){
  //   setBackdrop(true);
  //   let response = await all_function.cek_user("kicap92", "5c188ab394811451656f8c7f33680127", "admin")
  //   if(response == true){
  //     setBackdrop(false);
  //   }
  // }
  // cek_user()
  
  return (
    <div>
      {/* <ThemeProvider theme={theme}>  */}
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarAdmin menu="Home" />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={2}>
            <Grid item xs={6} md={3} >
              <Item
                sx={{
                  backgroundColor: 'yellow',
                  cursor: 'pointer',
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12} md={3} >
                    <SickIcon sx={{
                      fontSize: 60,
                    }} />
                  </Grid>
                  <Grid item xs={12} md={9} >
                    <Typography variant="h6" gutterBottom sx={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                    }}>
                      Pasien
                    </Typography>
                    <Typography variant="p" gutterBottom sx={{

                      fontWeight: 'bold',
                    }}>Jumlah : 101</Typography>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
            <Grid item xs={6} md={3}>
              <Item
                sx={{
                  backgroundColor: 'aqua',
                  cursor: 'pointer',
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12} md={3} >
                    <MedicationIcon sx={{
                      fontSize: 60,
                    }} />
                  </Grid>
                  <Grid item xs={12} md={9} >
                    <Typography variant="h6" gutterBottom sx={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                    }}>
                      Dokter
                    </Typography>
                    <Typography variant="p" gutterBottom sx={{

                      fontWeight: 'bold',
                    }}>Jumlah : 30</Typography>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
            <Grid item xs={6} md={3}>
              <Item
                sx={{
                  backgroundColor: 'lime',
                  cursor: 'pointer',
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12} md={3} >
                    <VaccinesIcon sx={{
                      fontSize: 60,
                    }} />
                  </Grid>
                  <Grid item xs={12} md={9} >
                    <Typography variant="h6" gutterBottom sx={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                    }}>
                      Obat
                    </Typography>
                    <Typography variant="p" gutterBottom sx={{

                      fontWeight: 'bold',
                    }}>Jumlah : 30</Typography>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
            <Grid item xs={6} md={3}>
              <Item
                sx={{
                  cursor: 'pointer',
                  backgroundColor: 'silver',
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12} md={3} >
                    <AddAlertIcon sx={{
                      fontSize: 60,
                    }} />
                  </Grid>
                  <Grid item xs={12} md={9} >
                    <Typography variant="h6" gutterBottom sx={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                    }}>
                      Tindakan
                    </Typography>
                    <Typography variant="p" gutterBottom sx={{

                      fontWeight: 'bold',
                    }}>Jumlah : 30</Typography>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* </ThemeProvider> */}
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    console.log(user, "sini di server side props");
    // console.log(req.query)

    let cek_user = await all_function.cek_user(user.username, user.password, user.role)
    console.log(cek_user, "cek user")

    if (cek_user !== true) {
      return {
        redirect: {
          destination: '/?error=true',
          permanent: false,
        }
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
  {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
);



export default AdminIndexPage;