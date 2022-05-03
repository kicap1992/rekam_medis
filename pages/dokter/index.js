import { useState, useRef } from 'react';
import Router from 'next/router';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';

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
let all_function = require('../../function/all_function.js')
import { withIronSessionSsr } from "iron-session/next";

// for add dialog
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// for time select
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import moment from "moment"; //for converting date and time


import AppBarDokter from '../../components/dokter/appBar';

import TabelJadwalDokter from '../../components/dokter/tabelJadwalDokter';


// for add dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const mingguan = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu"
]


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

function DokterIndexPage(props) {
  // console.log(props)
  const url = process.env.HTTP_URL + "/api/dokter"; // ini url

  const [backdrop, setBackdrop] = useState(false); //this is for backdrop
  const [sweetAlertLoading, setSweetAlertLoading] = useState(false); //this is for sweet alert loading

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [titleDialog, setTitleDialog] = useState('');
  const [jam_mulai, setJamMulai] = useState(null);
  const [jam_selesai, setJamSelesai] = useState(null);
  const jam_mulaiInputRef = useRef(null);
  const jam_selesaiInputRef = useRef(null);
  const [hari, setHari] = useState('');
  const [idnya, setIdnya] = useState('');
  const [dataEdit, setDataEdit] = useState(null);

  // open add dialog
  async function before_add_jadwal(hari) {
    setTitleDialog(`Tambah Jadwal Hari ${hari}`);
    setHari(hari);
    setJamMulai(null);
    setJamSelesai(null);
    setIdnya('tambah');
    setOpenAddDialog(true);
  }

  // before tambah jadwal with dialog and time checker
  async function tambah_jadwal(stat) {
    // console.log(jam_mulai, jam_selesai, hari, "ini cek data tambah")
    if (jam_mulai == null) {
      jam_mulaiInputRef.current.focus();
      toast.error("Jam mulai harus diisi")
      return false;
    } else if (jam_selesai == null) {
      jam_selesaiInputRef.current.focus();
      toast.error("Jam selesai harus diisi")
      return false;
    } else if (jam_mulai >= jam_selesai) {
      jam_mulaiInputRef.current.focus();
      toast.error("Jam mulai harus lebih kecil dari jam selesai")
      return false;
    } else {
      setOpenAddDialog(false);
      setSweetAlertLoading(true);
      if (stat == 'tambah') {
        console.log(jam_mulai, jam_selesai, hari, "ini jalankan data tambah")

        await MySwal.fire({
          title: 'Yakin ?',
          text: `Jadwal Baru Pada Hari ${hari} Akan Ditambahkan`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, tambah!'
        }).then(async (result) => {
          if (result.value) {
            setBackdrop(true);
            // await 4 second
            // await new Promise(resolve => setTimeout(resolve, 4000));
            // await edit_data_dokter(nik,datanya);
            // clear hari ,jam_mulai,jam_selesai
            await confirm_tambah_jadwal(hari, jam_mulai, jam_selesai);
            setHari('');
            setJamMulai(null);
            setJamSelesai(null);
          } else {
            setOpenAddDialog(true);
          }
        })
      } else if (stat == 'edit') {
        if (dataEdit.jam_mulai == jam_mulai && dataEdit.jam_selesai == jam_selesai) {
          toast.error("Jadwal tidak berubah")
          // open dialog
          setOpenAddDialog(true);
          // focus to jam_mulai
          jam_mulaiInputRef.current.focus();
          return false;
        }

        await MySwal.fire({
          title: 'Yakin ?',
          text: `Jadwal  Pada Hari ${hari} Akan Diedit`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, edit!'
        }).then(async (result) => {
          if (result.value) {
            setBackdrop(true);
            // await 4 second
            // await new Promise(resolve => setTimeout(resolve, 4000));
            console.log(hari, "ini hari")
            await confirm_edit_jadwal(hari, jam_mulai, jam_selesai);

            setHari('');
            setJamMulai(null);
            setJamSelesai(null);
          } else {
            setOpenAddDialog(true);
          }
        })
      }

      setBackdrop(false);
      setSweetAlertLoading(false);
    }
  }

  // confirm tambah jadwal
  async function confirm_tambah_jadwal(hari, jam_mulai, jam_selesai) {
    try {
      // moment format jam_mulai to only hour and minute
      jam_mulai = moment(jam_mulai).format("HH:mm");
      jam_selesai = moment(jam_selesai).format("HH:mm");
      // console.log(url)
      const urlnya = url + "/jadwal_dokter";
      const response = await fetch(urlnya, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(
          {
            hari,
            jam_mulai,
            jam_selesai,
            nik: props.user
          }
        )
      })
      // get response
      const data = await response.json()
      console.log(data, "ini data tambah jadwal")
      if (response.status === 200) {
        // create toast

        toast.success(data.message)
        Router.replace(Router.asPath);
        return true
      } else if (response.status === 400) {

        toast.success(data.message)
        return false
      } else {
        // create toast

        toast.error(data.message)
        return false
      }
    } catch (err) {
      toast.error("Terjadi kesalahan pada server")
      return false
    }
  }

  // confirm edit jadwal
  async function confirm_edit_jadwal(hari, jam_mulai, jam_selesai) {
    try {
      // moment format jam_mulai to only hour and minute
      jam_mulai = moment(jam_mulai).format("HH:mm");
      jam_selesai = moment(jam_selesai).format("HH:mm");
      // console.log(url)
      const urlnya = url + "/jadwal_dokter?id=" + props.user;
      const response = await fetch(urlnya, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(
          {
            hari,
            jam_mulai,
            jam_selesai
          }
        )
      })
      // get response
      const data = await response.json()
      console.log(data, "ini data edit jadwal")
      if (response.status === 200) {
        // create toast

        toast.success(data.message)
        Router.replace(Router.asPath);
        return true
      } else if (response.status === 400) {

        toast.success(data.message)
        return false
      } else {
        // create toast

        toast.error(data.message)
        return false
      }
    } catch (err) {
      toast.error("Terjadi kesalahan pada server")
      return false
    }
  }

  // confirm hapus jadwal
  async function confirm_hapus_jadwal(hari) {
    try {
      // moment format jam_mulai to only hour and minute
      // console.log(url)
      const urlnya = url + "/jadwal_dokter?id=" + props.user;
      const response = await fetch(urlnya, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(
          {
            hari
          }
        )
      })
      // get response
      const data = await response.json()
      console.log(data, "ini data hapus jadwal")
      if (response.status === 200) {
        // create toast

        toast.success(data.message)
        Router.replace(Router.asPath);
        return true
      } else if (response.status === 400) {

        toast.success(data.message)
        return false
      } else {
        // create toast

        toast.error(data.message)
        return false
      }
    } catch (err) {
      toast.error("Terjadi kesalahan pada server")
      return false
    }
  }

  return (
    <>
      <BootstrapDialog
        onClose={
          (event, reason) => {
            if (reason && reason == "backdropClick")
              return;
            setOpenAddDialog(false)
          }
        }
        aria-labelledby="customized-dialog-title"
        open={openAddDialog}
        fullWidth={true}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={
          (event, reason) => {
            if (reason && reason == "backdropClick")
              return;
            setOpenAddDialog(false)
          }
        }>
          {titleDialog}
        </BootstrapDialogTitle>
        <DialogContent dividers align="center">
          <FormControl sx={{ width: "85%", boxShadow: 10 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                inputRef={jam_mulaiInputRef}
                required
                label="Jam Mulai"
                value={jam_mulai}
                onChange={(newValue) => {
                  setJamMulai(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <Box sx={{ padding: "10px" }}></Box>
          <FormControl sx={{ width: "85%", boxShadow: 10 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                inputRef={jam_selesaiInputRef}
                required
                label="Jam Selesai"
                value={jam_selesai}
                onChange={(newValue) => {
                  setJamSelesai(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={
            () => {
              tambah_jadwal(idnya)
            }
          } variant="outlined" >
            {idnya === 'tambah' ? 'Tambah Jadwal' : 'Edit Jadwal'}
          </Button>
        </DialogActions>
      </BootstrapDialog>


      <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoClose={2000} Bounce={Bounce} theme="colored" />
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarDokter menu="Home" backdrop={backdrop} sweetalertload={sweetAlertLoading} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={2}>
            <Grid item xs={12} md={2} ></Grid>
            <Grid item xs={12} md={8}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>List Jadwal</Typography>
                <TableContainer component={Box} sx={{
                  padding: "15px",
                }}>
                  <Table aria-label="simple table" sx={{
                    minWidth: 500,
                    boxShadow: 3,
                  }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Hari</StyledTableCell>
                        <StyledTableCell>Jam Mulai</StyledTableCell>
                        <StyledTableCell>Jam Selesai</StyledTableCell>
                        <StyledTableCell>Aksi</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TabelJadwalDokter harinya={mingguan} dataJadwal={props.data_jadwal}
                        add={
                          (hari) => {
                            // console.log(hari,jam_mulai,jam_selesai, "ini data add nya")
                            before_add_jadwal(hari)
                          }
                        }
                        edit={
                          (hari, jam_mulai, jam_selesai) => {
                            setTitleDialog("Edit Jadwal Hari " + hari)

                            //get hours and minutes
                            let jamMulaiGetHours = jam_mulai[0] + jam_mulai[1]
                            let jamMulaiGetMinutes = jam_mulai[3] + jam_mulai[4]

                            // convert to GMT String
                            let jam_mulai_baru = new Date()
                            jam_mulai_baru.setHours(jamMulaiGetHours)
                            jam_mulai_baru.setMinutes(jamMulaiGetMinutes)
                            jam_mulai_baru.setSeconds(0)
                            jam_mulai_baru.toString()

                            // get hours and minutes
                            let jamSelesaiGetHours = jam_selesai[0] + jam_selesai[1]
                            let jamSelesaiGetMinutes = jam_selesai[3] + jam_selesai[4]

                            // convert to GMT String
                            let jam_selesai_baru = new Date()
                            jam_selesai_baru.setHours(jamSelesaiGetHours)
                            jam_selesai_baru.setMinutes(jamSelesaiGetMinutes)
                            jam_selesai_baru.setSeconds(0)
                            jam_selesai_baru.toString()

                            setDataEdit(
                              {
                                jam_mulai: jam_mulai_baru,
                                jam_selesai: jam_selesai_baru,
                              }
                            )

                            setHari(hari)
                            setJamMulai(jam_mulai_baru)
                            setJamSelesai(jam_selesai_baru)
                            setIdnya("edit")
                            setOpenAddDialog(true);
                          }
                        }
                        delete={
                          (hari) => {
                            // create sweetalert
                            MySwal.fire({
                              title: 'Yakin?',
                              text: "Jadwal Hari " + hari + " Akan dihapus",
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#d33',
                              confirmButtonText: 'Ya, Hapus!'
                            }).then((result) => {
                              if (result.value) {
                                // console.log(hari, "ini data delete nya")
                                confirm_hapus_jadwal(hari)
                              }
                            })
                          }
                        }
                      />
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ padding: "10px" }}></Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={2} ></Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    console.log(user, "sini di server side props");
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
        console.log("jalankannya ini di dokter")
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
    console.log(cek_user, "cek user")

    if (cek_user !== true) {
      return {
        redirect: {
          destination: '/?error=true',
          permanent: false,
        }
      };
    }

    const data_jadwal = await all_function.get_jadwal_dokter(user.nik)
    console.log(data_jadwal, "ini data jadwal")
    return {
      props: {
        user: user.nik,
        data_jadwal: data_jadwal,
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

export default DokterIndexPage;