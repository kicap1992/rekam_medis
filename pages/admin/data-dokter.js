import { useRef, useState, forwardRef } from 'react';
import Router from 'next/router';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// select
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

// for time select
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// this is for number format
import NumberFormat from 'react-number-format';



import TabelDokterAll from '../../components/admin/tabelDokter'

// for select jadwal
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import { Edit } from '@mui/icons-material';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const hari = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
];




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

// ini untuk number
const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      // thousandSeparator
      isNumericString
      prefix="08"
    />
  );
});

const NumberFormatCustomNIK = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      // thousandSeparator
      isNumericString
    // prefix="08"
    />
  );
});




function DataDokterPage(props) {
  const url = process.env.HTTP_URL + "/api/admin/dokter"; // ini url

  // for loading table
  const [dataDokterAll, setDataDokterAll] = useState();
  const [awal, setAwal] = useState(false);

  const [backdrop, setBackdrop] = useState(false); //this is for backdrop
  const [sweetAlertLoading, setSweetAlertLoading] = useState(false); //this is for sweet alert loading
  const nikInputRef = useRef();
  const [nik, setNik] = useState('');
  const namaInputRef = useRef();
  const alamatInputRef = useRef();
  const noTelpInputRef = useRef();
  const [noTelp, setNoTelp] = useState('');
  const [spesialis, setSpesialis] = useState('');

  // for select jadwal
  const [jadwal, setJadwal] = useState([]);

  // for time select
  const jamMulaiInputRef = useRef();
  const jamSelesaiInputRef = useRef();
  const [jamMulai, setJamMulai] = useState(null);
  const [jamSelesai, setJamSelesai] = useState(null);



  // before add dokter
  const beforeTambahDokter = async (e) => {
    e.preventDefault();
    const nama = namaInputRef.current.value;
    const alamat = alamatInputRef.current.value;
    let no_telp = "08" + noTelp
    console.log(no_telp.length);
    if (nik.length < 16) {
      toast.error('NIK harus 16 digit')
      // focus to nik
      nikInputRef.current.focus();
    } else if (no_telp.length < 11) {
      toast.error('No Telpon minimal harus 11 digit')
      // focus to nik
      noTelpInputRef.current.focus();
    }
    else if (jamMulai == null) {
      toast.error('Jam harus diisi')
      // focus to jam mulai
      jamMulaiInputRef.current.focus();
    } else if (jamSelesai == null) {
      toast.error('Jam harus diisi')
      // focus to jam mulai
      jamSelesaiInputRef.current.focus();
    } else if (jamMulai >= jamSelesai) {
      toast.error('Jam mulai harus lebih kecil dari jam selesai')
      // focus to jam mulai
      jamSelesaiInputRef.current.focus();
    } else {
      console.log(nik, nama, alamat, noTelp, spesialis, jamMulai, jamSelesai, jadwal, "sini adalah datanya dokter");
      setSweetAlertLoading(true);
      await MySwal.fire({
        title: 'Yakin ?',
        text: `Dokter ${nama} akan ditambahkan`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, tambahkan!'
      }).then(async (result) => {
        if (result.value) {
          setBackdrop(true);
          // await 4 second
          // await new Promise(resolve => setTimeout(resolve, 4000));
          // create a new let jam_mulai_converted , and jam_selesai_converted, and only get the time. etc 08:00:00
          let jam_mulai_converted = jamMulai.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });
          let jam_selesai_converted = jamSelesai.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });

          let data = {
            nik,
            nama,
            alamat,
            no_telp,
            spesialis,
            jam_mulai: jam_mulai_converted,
            jam_selesai: jam_selesai_converted,
            jadwal
          }

          // console.log(data.data)
          let response = await tambah_dokter(data);
          // co
          if (!response) {
            // await 1 second
            await new Promise(resolve => setTimeout(resolve, 500));
            setAwal(true);
            nikInputRef.current.focus();
          } else {
            // clear input
            setAwal(false);
            setNik("");
            setNoTelp("");
            setSpesialis("");
            setJamMulai(null);
            setJamSelesai(null);
            setJadwal([]);
            namaInputRef.current.value = "";
            alamatInputRef.current.value = "";
            Router.replace(Router.asPath);
          }

        }
      })
      setBackdrop(false);
      setSweetAlertLoading(false);
    }


  }

  // add dokter
  async function tambah_dokter(datanya) {
    // console.log(datanya, "ini datanya");
    try {
      // console.log(url)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(
          datanya
        )
      })
      // get response
      const data = await response.json()
      // console.log(data, "ini data dari cek dokter")
      if (response.status === 200) {
        // create toast

        toast.success(data.message)
        return true
      } else if (response.status === 400) {
        setDataDokterAll(data.data)

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

  // before edit dokter
  const beforeEditDokter = async (nik, datanya) => {
    // console.log(datanya, "ini datanya");
    // console.log(nik, "ini nik");
    // create sweet alert
    setSweetAlertLoading(true);
    await MySwal.fire({
      title: 'Yakin ?',
      text: `Dokter dengan NIK ${nik} akan diubah`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, ubah!'
    }).then(async (result) => {
      if (result.value) {
        setBackdrop(true);
        // await 4 second
        await edit_data_dokter(nik, datanya);
      }
    })

    setBackdrop(false);
    setSweetAlertLoading(false);
  }

  // edit dokter
  async function edit_data_dokter(nik, datanya) {
    console.log(nik, datanya, "ini nik dan datanya");
    // await 4 sec
    try {
      let urlnya = `${url}?nik=${nik}&detail=datanya`;
      const response = await fetch(urlnya, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)

        },
        body: JSON.stringify(
          datanya
        )
      })

      // get response
      const data = await response.json()
      console.log(data, "ini data dari cek dokter")
      if (response.status === 200) {
        // create toast
        toast.success(data.message)
        setAwal(false);
        Router.replace(Router.asPath);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server")
    }
  }

  return (
    <>
      <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoClose={2000} Bounce={Bounce} theme="colored" />
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarAdmin menu="Dokter" backdrop={backdrop} sweetalertload={sweetAlertLoading} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} >
          <DrawerHeader />
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: 700, minHeight: 210, boxShadow: 10 }}
                onSubmit={beforeTambahDokter}
              >
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '8%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Tambah Dokter</Typography>
                <Box sx={{ padding: "5px" }}></Box>
                <TextField
                  required
                  inputRef={nikInputRef}
                  id="nikTextField"
                  label="NIK"
                  placeholder="Masukkan NIK"
                  sx={{ width: "85%", boxShadow: 10 }}
                  onChange={(e) => setNik(e.target.value)}
                  InputProps={{
                    inputComponent: NumberFormatCustomNIK,
                    inputProps: {
                      maxLength: 16,
                      minLength: 16,
                    }
                  }}
                  value={nik}
                  name="nik"

                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  inputRef={namaInputRef}
                  id="namaTextField"
                  label="Nama"
                  placeholder="Masukkan Nama"
                  sx={{ width: "85%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  inputRef={alamatInputRef}
                  id="alamatTextField"
                  label="Alamat"
                  placeholder="Masukkan Alamat"
                  sx={{ width: "85%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  inputRef={noTelpInputRef}
                  onChange={(e) => setNoTelp(e.target.value)}
                  id="NoTelpTextField"
                  label="No Telpon"
                  placeholder="Masukkan No Telpon"
                  sx={{ width: "85%", boxShadow: 10 }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    inputProps: {
                      maxLength: 13,
                      minLength: 11,
                    }
                  }}
                  value={noTelp}
                  name="jumlah"
                />
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <InputLabel id="demo-simple-select-helper-label">Spesialis</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-helper-label"
                    id="jenisSelect"
                    value={spesialis}
                    label="Jenis"
                    onChange={
                      (e) => { setSpesialis(e.target.value) }
                    }
                  >
                    <MenuItem value="" selected disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Spesialis 1"}>Spesialis 1</MenuItem>
                    <MenuItem value={"Spesialis 2"}>Spesialis 2</MenuItem>
                    <MenuItem value={"Spesialis 3"}>Spesialis 3</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <Divider />
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <InputLabel id="demo-multiple-checkbox-label">Jadwal Hari</InputLabel>
                  <Select
                    required
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={jadwal}
                    onChange={
                      (e) => {
                        const {
                          target: { value },
                        } = e;
                        setJadwal(
                          // On autofill we get a stringified value.
                          typeof value === 'string' ? value.split(',') : value,
                        );
                      }
                    }
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {hari.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={jadwal.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      inputRef={jamMulaiInputRef}
                      required
                      label="Jam Mulai"
                      value={jamMulai}
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
                      inputRef={jamSelesaiInputRef}
                      required
                      label="Jam Selesai"
                      value={jamSelesai}
                      onChange={(newValue) => {
                        setJamSelesai(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <Box textAlign="center">
                  <Button variant="contained" type="submit">Tambah</Button>
                </Box>
                <Box sx={{ padding: "10px" }}></Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}> List Dokter</Typography>
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
                        <StyledTableCell>NIK</StyledTableCell>
                        <StyledTableCell>Nama</StyledTableCell>
                        <StyledTableCell>Spesialis</StyledTableCell>
                        <StyledTableCell>Telepon</StyledTableCell>
                        <StyledTableCell width={"10%"}>Status</StyledTableCell>
                        <StyledTableCell>Aksi</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TabelDokterAll
                        dataDokterAll={!awal ? props.dokter : dataDokterAll}
                        toastnya={
                          (pesan, stat) => {
                            if (stat) {
                              toast.success(pesan)
                            } else {
                              toast.error(pesan)
                            }

                          }
                        }
                        setAwal={
                          (data) => {
                            setAwal(data)
                          }
                        }
                        editDokter={beforeEditDokter}
                        backdropnya={
                          (stat) => {
                            setBackdrop(stat)
                          }
                        }
                        sweetAlertLoadingnya={
                          (stat)=>{
                            setSweetAlertLoading(stat)
                          }
                        }
                      />
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

    let all_dokter = await all_function.dokter_all();
    console.log(all_dokter, "ini all dokter");

    return {
      props: {
        user: req.session.user,
        dokter: all_dokter
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

export default DataDokterPage;
