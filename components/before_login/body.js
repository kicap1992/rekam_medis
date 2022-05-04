
import { useRef, useState ,useEffect } from "react";
import { useRouter } from "next/router";


import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { styled } from '@mui/material/styles';
// import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// sweet alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const md5 = require('md5');

function createData(name, calories) {
  return { name, calories };
}

const rows = [
  createData('Frozen yoghurt', 159),
  createData('Ice cream sandwich', 237),
  createData('Eclair', 262),
  createData('Cupcake', 305),
  createData('Gingerbread', 356),
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  }
}));


export default function GridIndex(props) {
  console.log(props)
  const [errornya, setError] = useState(props.errornya)
  const [jadwal_dokter, setJadwalDokter] = useState(false);

  useEffect(() => {
    setJadwalDokter(props.jadwal_dokter)
  },[props.jadwal_dokter])

  if (errornya == true) {
    MySwal.fire({
      title: `<strong>Error</strong>`,
      html: "Anda Harus Login Terlebih Dahulu",
      icon: 'error',
      showConfirmButton: false,
    })
    setError(false)
  }
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const [role, setRole] = useState('');
  const [backdrop, setBackdrop] = useState(false);

  const router = useRouter();

  const roleHandleChange = (event) => {
    setRole(event.target.value);
  };

  async function submitHandler(event) {
    event.preventDefault();
    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;
    setBackdrop(true);
    // try {
    let http_server = process.env.HTTP_URL + "/api/login?username=" + username + "&password=" + md5(password) + "&role=" + role;
    // console.log(http_server);
    const response = await fetch(http_server, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'allow-cors-origin': '*',
        'crossDomain': true,
      }
    });
    const data = await response.json();
    // console.log(response);
    if (response.status == 200) {
      console.log(data);
      toast.success("Login Success")
      // pause 2 seconds

      setTimeout(async function () {
        // // put data to local storage

        // await localStorage.setItem('user_data', JSON.stringify(data));
        // // localStorage.removeItem('user_data');
        // document.cookie = data;
        if (role == 'Admin') {
          // redirect to dashboard
          await router.replace('/admin');
        } else if (role == 'Dokter') {
          // redirect to dashboard
          await router.replace('/dokter');
        }




      }, 2000);
    } else if (response.status == 400) {
      // console.log(data);
      toast.warning(data.message);
      // focus on username input
      usernameInputRef.current.focus();
    } else {
      toast.error("Server Error");
    }
    // } catch (error) {
    //   console.log(error)
    // }
    setBackdrop(false);
  }


  // const classes = useStyles();
  return (
    <div >
      <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoClose={2000} Bounce={Bounce} theme="colored" />
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <div style={{ maxWidth: "100%", padding: 30 }}>
        <div sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Jadwal Praktek Hari :</Typography>
                <Box sx={{ padding: "5px" }}></Box>
                <TableContainer sx={{
                  maxHeight: 500,
                  minWidth: 500,
                  // padding: "15px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                  paddingBottom: "15px",
                }}>
                  <Table stickyHeader aria-label="sticky table" sx={{
                    boxShadow: 3,
                    "& .MuiTableCell-root": {
                      borderLeft: "1px solid rgba(224, 224, 224, 1)"
                    }
                  }}>
                    <TableHead>
                      <TableRow hover>
                        <StyledTableCell>Nama</StyledTableCell>
                        <StyledTableCell>Spesialis</StyledTableCell>
                        <StyledTableCell>Jam Mulai</StyledTableCell>
                        <StyledTableCell>Jam Selesai</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        // (jadwal_dokter == false)
                        //   ?
                        //   <TableRow>
                        //     <TableCell colSpan={4} align="center">
                        //       Masalah Dengan Server
                        //     </TableCell>
                        //   </TableRow>
                        //   :
                          (jadwal_dokter.length > 0)
                            ?
                            jadwal_dokter.map((jadwal, index) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell>{jadwal.tb_dokter.nama}</TableCell>
                                  <TableCell>{jadwal.tb_dokter.spesialis}</TableCell>
                                  <TableCell>{jadwal.jam_mulai}</TableCell>
                                  <TableCell>{jadwal.jam_selesai}</TableCell>
                                </TableRow>
                              )
                            })
                            :
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                Tidak Ada Jadwal Praktek
                              </TableCell>
                            </TableRow>
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <Box sx={{ padding: "5px" }}></Box>
                <Box textAlign="center">
                  <Button variant="contained">Cetak</Button>
                </Box>
                <Box sx={{ padding: "10px" }}></Box> */}
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              {/* <form onSubmit={submitHandler}> */}
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 400, paddingTop: 1, boxShadow: 10 }} onSubmit={submitHandler}>
                <h2>Login Form</h2>
                <TextField
                  inputRef={usernameInputRef}
                  id="usernameTextField"
                  label="Username"
                  placeholder="Masukkan Username"
                  sx={{ width: "85%", boxShadow: 10 }}
                  required
                />
                <br /><br />
                <TextField
                  inputRef={passwordInputRef}
                  id="passwordTextField"
                  type="password"
                  label="Password"
                  placeholder="Masukkan Password"
                  sx={{ width: "85%", boxShadow: 10 }}
                  required
                />
                <br /> <br />
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={role}
                    label="Role"
                    onChange={roleHandleChange}
                    required
                  >
                    <MenuItem value="" disabled selected>
                      <em>-Pilih Role</em>
                    </MenuItem>
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Dokter"}>Dokter</MenuItem>
                  </Select>
                </FormControl>
                <br /> <br />
                <Box textAlign="center">
                  <Button variant="contained" type="submit"
                  >Login</Button>
                </Box>
              </Card>
              {/* </form> */}
            </Grid>

          </Grid>


        </div>
      </div>
    </div>
  );
}