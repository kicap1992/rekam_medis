import { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// backdrop
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// toast
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// sweet alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

// this for check session
let all_function = require('../../../function/all_function.js')
import { withIronSessionSsr } from "iron-session/next";

import AppBarDokter from '../../../components/dokter/appBar';
import TabelJadwalRekamMedis from '../../../components/dokter/tableJadwalRekamMedis';

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();
month = month < 10 ? '0' + month : month;
day = day < 10 ? '0' + day : day;
let today_date = year + '-' + month + '-' + day;




const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
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

function RekamMedisPage(props) {
  console.log(props, "ini propsnya")
  const [backdrop, setBackdrop] = useState(false); //this is for backdrop
  const [sweetAlertLoading, setSweetAlertLoading] = useState(false); //this is for sweet alert loading

  const [tanggal, setTanggal] = useState(today_date);

  const headerAwal = " Tanggal : " + tanggal
  const [header, setHeader] = useState(headerAwal);

  const dataAwal = (props.jadwal_ini_hari)

  const [data, setData] = useState(dataAwal);

  const inputanInputRef = useRef(null);

  const cariData = async (e) => {
    e.preventDefault();
    const inputan = inputanInputRef.current.value;
    const inputan_lower = inputan.toLowerCase();

    try {
      const url = process.env.HTTP_URL + "/api/dokter/cari_rekam_medis?data=" + inputan_lower + "&data2=" + inputan_lower + "&id_dokter=" + props.user;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
      })

      const data = await response.json();
      // console.log(data, "ini data cari data")
      if (response.status === 200) {
        setHeader(" Pencarian : " + inputan);
        setData(data.data);
      } else {
        toast.error("Data tidak ditemukan")
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengambil data")
    }


  }

  return (
    <>
      <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoClose={2000} Bounce={Bounce} theme="colored" style={{ textAlign: 'center' }} />
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarDokter menu="Rekam Medis" backdrop={backdrop} sweetalertload={sweetAlertLoading} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={2}>

            <Grid item xs={12} md={12}>
              <Card component="form" align="center"
                sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }}
                onSubmit={cariData}
              >
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Rekam Medis {header}</Typography>
                <Grid container spacing={1} sx={{ paddingTop: 2 }}>
                  <Grid item xs={1} md={3}></Grid>
                  <Grid item xs={10} md={6}>
                    <TextField
                      required
                      inputRef={inputanInputRef}
                      id="namaTextField"
                      label="NIK, Nama Pasien"
                      placeholder="Masukkan NIK, Nama Pasien"
                      sx={{ width: "85%", boxShadow: 10 }}
                      onChange={
                        () => {
                          if (inputanInputRef.current.value === "") {
                            setHeader(headerAwal);
                            setData(dataAwal);
                          }
                        }
                      }
                    />
                  </Grid>
                  <Grid item xs={1} md={3}></Grid>
                </Grid>
                <Box sx={{ padding: "10px" }}></Box>
                <Box sx={{ maxWidth: "100%", textAlign: "center" }}>
                  <Button variant="contained" type="submit">Cari</Button>
                </Box>
                <Box sx={{ padding: "5px" }}></Box>
                <Divider />
                <TableContainer component={Box} sx={{
                  padding: "15px",
                }}>
                  <Table aria-label="simple table" sx={{
                    minWidth: 500,
                    boxShadow: 3,
                    "& .MuiTableCell-root": {
                      borderLeft: "1px solid rgba(224, 224, 224, 1)"
                    }
                  }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>No</StyledTableCell>
                        <StyledTableCell>NIK</StyledTableCell>
                        <StyledTableCell>Nama</StyledTableCell>
                        <StyledTableCell>Waktu Periksa</StyledTableCell>
                        <StyledTableCell>Umur</StyledTableCell>
                        <StyledTableCell>Golongan Darah</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Aksi</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TabelJadwalRekamMedis data={data}
                        errornya={
                          (message) => {
                            toast.error(message)
                          }
                        }
                        user={props.user}
                        backdropnya={
                          (status) => {
                            setBackdrop(status)
                          }
                        }
                      />
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ padding: "5px" }}></Box>
                <Box textAlign="center">

                </Box>
                <Box sx={{ padding: "10px" }}></Box>
              </Card>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </>
  );
}


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    // console.log(user, "sini di server side props");
    // console.log(req.query)
    if (!user) {
      return {
        redirect: {
          destination: '/?error=true',
          permanent: false,
        }
      };
    }
    if (user.role != "Dokter") {
      try {
        const url = process.env.HTTP_URL + "/api/login/logout";
        await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'allow-cors-origin': '*',
            'crossDomain': true,
            'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
          },
        })
      } catch (err) {

      }

      return {
        redirect: {
          destination: '/?error=true',
          permanent: false,
        }
      };
    }

    let cek_user = await all_function.cek_user(user.username, user.password, user.role)
    // console.log(cek_user, "cek user")

    if (cek_user !== true) {
      return {
        redirect: {
          destination: '/?error=true',
          permanent: false,
        }
      };
    }

    let jadwal_ini_hari = await all_function.jadwal_ini_hari(user.nik)
    // const tindakan_all = await all_function.tindakan_all()
    // const obat_all = await all_function.obat_all()
    // console.log(user.nik, "ini niknya")
    return {
      props: {
        user: user.nik,
        jadwal_ini_hari: jadwal_ini_hari,
        // tindakan_all: tindakan_all,
        // obat_all: obat_all,
      },
      // revalidate: 10
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

export default RekamMedisPage;
