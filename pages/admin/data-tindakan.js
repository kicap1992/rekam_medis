import { useRef, useState } from 'react';
import Router from 'next/router';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';


import AppBarAdmin from '../../components/admin/appBar';

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

// button icon
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// for dialog
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

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

function TindakanPage(props) {
  // console.log(props, 'ini di props')
  const tindakanInputRef = useRef();

  const [backdrop, setBackdrop] = useState(false); //this is for backdrop
  const [sweetAlertLoading, setSweetAlertLoading] = useState(false); //this is for sweet alert loading

  // check if exist before add tindakan
  async function cek_tindakan(tindakan) {
    // console.log(cek_tindakan, "disini proses untuk cek tindakan")
    // return false

    try {
      const url = process.env.HTTP_URL + "/api/admin/tindakan"
      // create fetch post request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify({
          tindakan: tindakan,
          username: props.user.username,
          role: props.user.role,
          password: props.user.password
        })
      })
      // get response
      const data = await response.json()

      console.log(data, "ini data dari cek tindakan")
      if (response.status === 200) {
        // create toast
        toast.success(data.message)
        return true
      } else {
        // create toast
        toast.error(data.message)
        return false
      }
    } catch (err) {
      // console.log(err)
      toast.error("Terjadi kesalahan pada server")
      return false
    }
  }

  // delete tindakan
  async function delete_tindakan(id) {
    // console.log(id, "ini id yang akan di delete")
    try {
      const url = process.env.HTTP_URL + "/api/admin/tindakan?id=" + id
      console.log(url, "ini url yang akan di delete")
      // create fetch post request
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },

      })
      // get response
      const data = await response.json()

      console.log(data, "ini data dari delete tindakan")
      if (response.status === 200) {
        // create toast
        toast.success(data.message)
        Router.replace(Router.asPath)
        // return true
      } else {
        // create toast
        toast.error(data.message)
        // return false
      }
    } catch (err) {
      console.log(err)
      toast.error("Terjadi kesalahan pada server")
    }
  }

  // before add tindakan
  async function tambahTindakanBaru(event) {
    event.preventDefault();
    // inidia();
    await setSweetAlertLoading(true);

    const tindakan = await tindakanInputRef.current.value;

    // create swal yakin untuk tambah tindakan
    await MySwal.fire({
      title: 'Yakin ?',
      text: `Tindakan ${tindakan} akan ditambahkan`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, tambahkan!'
    }).then(async (result) => {
      if (result.value) {
        setBackdrop(true);
        // console.log(tindakan)
        let response = await cek_tindakan(tindakan);
        if (!response) {
          // focus to input
          tindakanInputRef.current.focus();
        } else {
          // clear input
          tindakanInputRef.current.value = "";
          Router.replace(Router.asPath);
        }

      }
    })
    await setBackdrop(false);
    await setSweetAlertLoading(false);
  }

  // before delete tindakan
  async function deleteTindakan(id, nama) {
    console.log(id, "ini id yang akan di hapus")
    await setSweetAlertLoading(true);
    await MySwal.fire({
      title: 'Yakin ?',
      text: `Tindakan ${nama} akan dihapus`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!'
    }).then(async (result) => {
      if (result.value) {
        await setBackdrop(true);
        // console.log(tindakan)
        await delete_tindakan(id);

      }
    })

    await setBackdrop(false);
    await setSweetAlertLoading(false);
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const tindakanEditInputRef = useRef();
  const [tindakanEdit, setTindakanEdit] = useState(null);
  const [periksaTindakanEdit, setPeriksaTindakanEdit] = useState(null);

  const editTindakan = async (e) => {
    e.preventDefault();
    if(tindakanEdit == periksaTindakanEdit){
      toast.error("Tiada Perubahan")
      // focus input
      tindakanEditInputRef.current.focus();
      return
    }else{
      setSweetAlertLoading(true);
      setOpenDialog(false);
      await MySwal.fire({
        title: 'Yakin ?',
        text: `Anda akan mengubah detail Tindakan ${periksaTindakanEdit} ke ${tindakanEdit}`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Ubah!',
        cancelButtonText: 'Batal',
      }).then(async (result) => {
        if (result.value) {
          setBackdrop(true);
          // await 4 sec
          try {
            const url = process.env.HTTP_URL + "/api/admin/tindakan?id=" + idEdit
            // create fetch post request
            const response = await fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'allow-cors-origin': '*',
                'crossDomain': true,
                'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
              },
              body: JSON.stringify({
                tindakan: tindakanEdit
              })
            })

            // get response
            const data = await response.json()
            if( response.status === 200 ){
              // create toast
              toast.success(data.message)
              Router.replace(Router.asPath)
            }else{
              // create toast
              toast.error(data.message)
            }

          } catch (error) {
            toast.error("Terjadi kesalahan pada server")
            console.log(error)
          }

        } else {
          setOpenDialog(true);
        }
      })

      setBackdrop(false);
      setSweetAlertLoading(false);
    }
  }

  return (
    <>
      <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoClose={2000} Bounce={Bounce} theme="colored" />
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>

      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        component="form"
        onSubmit={editTindakan}
        fullWidth={true}
      >
        <BootstrapDialogTitle id="customized-dialog-title"
          onClose={
            () => {
              setOpenDialog(false);
            }
          }
        >
          Edit Tindakan
        </BootstrapDialogTitle>
        <DialogContent dividers align="center">
          <TextField
            id="tindakanEditTextField"
            value={tindakanEdit}
            inputRef={tindakanEditInputRef}
            label="Tindakan "
            onChange={(e) => {
              setTindakanEdit(e.target.value);
            }}
            placeholder="Masukkan Tindakan "
            sx={{ width: "85%", boxShadow: 10 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button 
            variant="outlined"
            color="primary"
            type="submit"
          >
            Simpan Perubahan
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarAdmin menu="Tindakan" backdrop={backdrop} sweetalertload={sweetAlertLoading}
          toRoute={
            () => {
              setBackdrop(true);
            }
          }
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} sm={4}>
              {/* <Item> */}
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }} onSubmit={tambahTindakanBaru}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '8%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Tambah Tindakan</Typography>
                <Box sx={{ padding: "5px" }}></Box>
                <TextField
                  id="tindakanTextField"
                  inputRef={tindakanInputRef}
                  label="Tindakan Baru"
                  placeholder="Masukkan Tindakan Baru"
                  sx={{ width: "85%", boxShadow: 10 }}
                  required
                />
                <Box sx={{ padding: "10px" }}></Box>
                <Box textAlign="center">
                  <Button variant="contained" type='submit'>Tambah</Button>
                </Box>
              </Card>
              {/* </Item> */}
            </Grid>

            <Grid item xs={12} md={8} sm={8}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}> List Tindakan</Typography>
                <TableContainer component={Box} sx={{
                  padding: "15px",
                }}>
                  <Table aria-label="simple table" sx={{
                    minWidth: 300,
                    boxShadow: 3,
                    "& .MuiTableCell-root": {
                      borderLeft: "1px solid rgba(224, 224, 224, 1)"
                    }
                  }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Tindakan</StyledTableCell>
                        <StyledTableCell sx={{
                          width: "30%",
                        }}>Aksi</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        (props.tindakan.length > 0)
                          ?
                          props.tindakan.map((row) => (
                            <TableRow
                              key={row.id_tindakan}
                            // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                {row.nama_tindakan}
                              </TableCell>
                              <TableCell>
                                <IconButton size="small" color="primary"
                                  onClick={
                                    () => {
                                      setOpenDialog(true);
                                      setIdEdit(row.id_tindakan);
                                      setTindakanEdit(row.nama_tindakan);
                                      setPeriksaTindakanEdit(row.nama_tindakan);
                                    }
                                  }
                                >
                                  <ModeEditIcon />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={
                                  () => {
                                    deleteTindakan(row.id_tindakan, row.nama_tindakan)
                                  }
                                } >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                          :
                          <TableRow>
                            <TableCell colSpan={2}>
                              Tiada Data
                            </TableCell>
                          </TableRow>
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <Box sx={{ padding: "5px" }}></Box>
                <Box textAlign="center">
                  <Button variant="contained">Cetak</Button>
                </Box> */}
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
    if (!user) {
      return {
        redirect: {
          destination: '/?error=true',
          permanent: false,
        }
      };
    }
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

    let all_tindakan = await all_function.tindakan_all();
    console.log(all_tindakan, "ini all tindakan");

    return {
      props: {
        user: req.session.user,
        tindakan: all_tindakan
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


export default TindakanPage;
