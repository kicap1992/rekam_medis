import { useRef, useState, forwardRef, useEffect } from 'react';
import Router from 'next/router';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// select
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

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

// this is for number format
import NumberFormat from 'react-number-format';

import AppBarAdmin from '../../components/admin/appBar';

// ini untuk date time picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import moment from "moment"; //for converting date and time

// button icon
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// this for check session
let all_function = require('../../function/all_function.js')
import { withIronSessionSsr } from "iron-session/next";

import DialogEditPasien from '../../components/admin/dialogEditPasien';
import DialogLihatJadwalPasien from '../../components/admin/dialogLihatJadwalPasien';



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

let today_date = new Date();
let days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
let hari_ininya = days[today_date.getDay()];

function DataPasienPage(props) {
  // console.log(props, "ini jadwal pasien")
  const [awal, setAwal] = useState(false);
  const [backdrop, setBackdrop] = useState(false); //this is for backdrop
  const [sweetAlertLoading, setSweetAlertLoading] = useState(false); //this is for sweet alert loading

  const [hari_ini, setHariIni] = useState(hari_ininya);

  const url = process.env.HTTP_URL + "/api/admin/pasien";

  // ini untuk list tabel
  const [dataPasienAll, setDataPasienAll] = useState([]);
  const [jadwalPasien, setJadwalPasien] = useState([]);

  useState(() => {
    setJadwalPasien(props.jadwal_pasien)
  })


  const nikInputRef = useRef();
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const no_telpInputRef = useRef();
  const [no_telp, setNoTelp] = useState('');
  const [tanggal_lahir, setTanggalLahir] = useState('');
  const [jenis_kelamin, setJenisKelamin] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [status_pernikahan, setStatusPernikahan] = useState('');
  const [golongan_darah, setGolonganDarah] = useState('');
  const [pendidikan, setPendidikan] = useState('');
  const [nama_orang_tua_wali, setNamaOrangTuaWali] = useState('');
  const [nama_pasangan, setNamaPasangan] = useState('');

  const tanggal_periksaInputRef = useRef();
  const [tanggal_periksa, setTanggalPeriksa] = useState('');
  const [jam_periksa, setJamPeriksa] = useState('');
  const [dokterList, setDokterList] = useState([]);
  const [dokter, setDokter] = useState('');

  function Umur(props) {
    let today = new Date();
    let birthDate = new Date(props.tanggal_lahir);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }
    return (
      <>
        {age}
      </>
    );
  }

  // for dokter select
  async function cekDoktor(tanggal) {
    setDokter("")
    console.log(tanggal)
    // create let day and get the day from tanggal. example : Thu Apr 28 2022 03:36:00 GMT+0800 (Central Indonesia Time) , output : "Kamis"
    let day = new Date(tanggal).getDay();
    switch (day) {
      case 0:
        day = "Minggu";
        break;
      case 1:
        day = "Senin";
        break;
      case 2:
        day = "Selasa";
        break;
      case 3:
        day = "Rabu";
        break;
      case 4:
        day = "Kamis";
        break;
      case 5:
        day = "Jumat";
        break;
      case 6:
        day = "Sabtu";
        break;

    }
    // console.log(day, "ini day")
    // create let clock and get the hour,minute,second from tanggal. output example : "12:00:00"
    let hour = new Date(tanggal).getHours(); // if hour is less than 10, then add 0 before hour
    hour = hour < 10 ? "0" + hour : hour;
    let minute = new Date(tanggal).getMinutes(); // if minute is less than 10, then add 0 before minute
    minute = minute < 10 ? "0" + minute : minute;
    let second = new Date(tanggal).getSeconds(); // if second is less than 10, then add 0 before second
    second = second < 10 ? "0" + second : second;
    let clock = hour + ":" + minute + ":" + second;
    setJamPeriksa(clock)
    // console.log(clock, "ini clock")

    try {
      let urlnya = process.env.HTTP_URL + "/api/admin/cek_jadwal?hari=" + day + "&jam=" + clock;
      const response = await fetch(urlnya, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      })
      // get response
      const data = await response.json()
      console.log(data, "ini data")
      setDokterList(data.data)
    } catch (err) {
      console.log(err)
    }

  }

  // before add pasien
  async function beforeAddPasien(e) {
    e.preventDefault();
    // console.log("sini before add pasien")
    let no_telpBaru = "08" + no_telp
    if (nik.length < 16) {
      toast.error('NIK harus 16 digit')
      // focus to nik
      nikInputRef.current.focus();
    } else if (no_telpBaru.length < 11) {
      toast.error('No Telpon minimal harus 11 digit')
      // focus to nik
      no_telpInputRef.current.focus();
    } else if (tanggal_periksa == '') {
      toast.error('Tanggal periksa harus diisi')
      // focus to nik
      tanggal_periksaInputRef.current.focus();
    } else {
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

          let tgl_lahir_baru = moment(tanggal_lahir).format('YYYY-MM-DD');

          let data = {
            nik,
            nama,
            jenis_kelamin,
            tgl_lahir: tgl_lahir_baru,
            alamat,
            pekerjaan,
            golongan_darah,
            pendidikan,
            no_telp: no_telpBaru,
            status_pernikahan,
            nama_orang_tua_wali,
            nama_pasangan,
          }
          // console.log(tanggal_periksa, "ini sebelum add")
          // create let tanggal_baru and get the date from tanggal. example : Thu Apr 28 2022 03:36:00 GMT+0800 (Central Indonesia Time) , output : "28-04-2022"
          let formattedDate = moment(tanggal_periksa).format('YYYY-MM-DD');
          // console.log(formattedDate, "ini tanggal baru")

          let data_periksa = {
            tanggal_periksa: formattedDate,
            id_dokter: dokter,
            jam_periksa
          }

          // console.log(data.data)
          let response = await tambah_pasien(data, data_periksa);
          if (!response) {
            // await 1 second
            await new Promise(resolve => setTimeout(resolve, 500));
            setAwal(true);
            nikInputRef.current.focus();
          } else {
            // clear input
            setAwal(false);
            setNik('');
            setNama('');
            setJenisKelamin('');
            setTanggalLahir('');
            setAlamat('');
            setPekerjaan('');
            setGolonganDarah('');
            setPendidikan('');
            setNoTelp('');
            setStatusPernikahan('');
            setNamaOrangTuaWali('');
            setNamaPasangan('');
            setTanggalPeriksa('');
            setDokter('');
            setJamPeriksa('');
            setDokterList([]);
            Router.replace(Router.asPath);
          }

        }
      })
      setBackdrop(false);
      setSweetAlertLoading(false);
    }
  }

  // tambah pasien
  async function tambah_pasien(data, data_periksa) {
    // await 4 second
    // await new Promise(resolve => setTimeout(resolve, 4000));
    // console.log(data, data_periksa, "ini data pasien")

    // create new var data_combine and add datadata_periksa to data_periksa
    let data_combine = {
      ...data,
      ...data_periksa
    }
    console.log(data_combine, "ini data combine")

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(data_combine)
      })
      // get response
      const data_response = await response.json()
      console.log(data_response, "ini data response")
      // console.log(data, "ini data dari cek dokter")
      if (response.status === 200) {
        // create toast

        toast.success(data_response.message)
        return true
      } else if (response.status === 400) {
        toast.error(data_response.message)
        setDataPasienAll(data_response.data)
        return false
      } else {
        // create toast

        toast.error("Terjadi kesalahan")
        return false
      }
    } catch (err) {
      toast.error(err)
      console.log(err)
      return false
    }
  }

  const cariInputRef = useRef();

  // cari pasien 
  const cariDataPasien = async (e) => {
    e.preventDefault();
    const inputan = cariInputRef.current.value;
    setBackdrop(true);
    try {
      const urlnya = url + "?cariannya=" + inputan;
      const response = await fetch(urlnya, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      })

      const data = await response.json()
      console.log(data, "ini datanya")
      console.log(response.status, "ini responsenya")
      if (response.status == 200) {
        setAwal(true);
        setDataPasienAll(data.data)
      }

    } catch (err) {
      console.log(err)
      toast.error("Terjadi kesalahan")
    }
    setBackdrop(false);
  }

  // ini untuk dialog edit jadwal
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  // const [dataEditPasien, setDataEditPasien] = useState();
  const [dataPasienPeriksa, setDataPasienPeriksa] = useState({
    nik: '',
    nama: '',
    jenis_kelamin: '',
    tgl_lahir: '',
    alamat: '',
    pekerjaan: '',
    golongan_darah: '',
    pendidikan: '',
    no_telp: '',
    status_pernikahan: '',
    nama_orang_tua_wali: '',
    nama_pasangan: '',
  })
  // const [nikEdit, setNikEdit] = useState('');


  // ini untuk dialog jadwal
  const [openDialogJadwal, setOpenDialogJadwal] = useState(false);
  const [nikPasienJadwal, setNikPasienJadwal] = useState('');
  const [dataJadwalPasien, setDataJadwalPasien] = useState([])
  const lihatJadwal = async (id) => {
    setDataPasienPeriksa({
      nik: '',
      nama: '',
      jenis_kelamin: '',
      tgl_lahir: '',
      alamat: '',
      pekerjaan: '',
      golongan_darah: '',
      pendidikan: '',
      no_telp: '',
      status_pernikahan: '',
      nama_orang_tua_wali: '',
      nama_pasangan: '',
    })
    setNikPasienJadwal(id)
    setDataJadwalPasien([]);
    setBackdrop(true);
    // await 4 sec
    // await new  Promise(resolve => setTimeout(resolve, 4000));
    // setOpenDialogJadwal(true);
    try {
      const response = await fetch(url + "?id=" + id + "&jadwal=jadwal", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      })
      const data = await response.json()
      console.log(data, "ini data pasien")
      if (response.status === 200) {
        setDataJadwalPasien(data.data)
        setOpenDialogJadwal(true)
      } else {
        toast.error("Terjadi kesalahan")
      }
    } catch (err) {
      console.log(err)
      toast.error("Terjadi kesalahan")
    }

    setBackdrop(false);
  }

  async function updateJadwalTable() {
    setBackdrop(true);
    // try {
    const urlnya = process.env.HTTP_URL + "/api/admin/jadwal_pasien";
    const response = await fetch(urlnya, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'allow-cors-origin': '*',
        'crossDomain': true,
        'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
      }
    })
    const data = await response.json()
    console.log(data, "ini data pasien")

    if (response.status === 200) {
      setJadwalPasien(data.data)
      // setOpenDialogJadwal(true)
    } else {
      toast.error("Terjadi kesalahan")
    }
    // } catch (err) {
    //   console.log(err)
    //   toast.error("Terjadi kesalahan")
    // }

    setBackdrop(false);
  }

  return (
    <>
      <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoClose={2000} Bounce={Bounce} theme="colored" />
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <DialogEditPasien
        openit={openDialogEdit}
        // idPasien={idPasienEdit}
        // dataPasien={dataEditPasien}
        dataPasienPeriksa={dataPasienPeriksa}
        toastnya={
          (message, stat) => {
            if (stat) {
              toast.success(message)
            } else {
              toast.error(message)
            }
          }
        }
        backdropnya={(status) => setBackdrop(status)}
        sweetalertnya={(status) => setSweetAlertLoading(status)}
        setClose={
          (data = null, stat = false) => {
            if (stat) {
              setDataPasienPeriksa(data)
              setOpenDialogEdit(false);
            } else {
              setOpenDialogEdit(false);
              // setIdPasienEdit(null);
              // setDataEditPasien(null);
              setDataPasienPeriksa({
                nik: '',
                nama: '',
                jenis_kelamin: '',
                tgl_lahir: '',
                alamat: '',
                pekerjaan: '',
                golongan_darah: '',
                pendidikan: '',
                no_telp: '',
                status_pernikahan: '',
                nama_orang_tua_wali: '',
                nama_pasangan: '',
              })
            }

          }
        }
        setOpenAgain={
          () => {

            setOpenDialogEdit(true);
          }
        }

      />
      <DialogLihatJadwalPasien
        openit={openDialogJadwal}
        dataJadwal={dataJadwalPasien}
        dataPasien={dataPasienPeriksa}
        toastnya={
          (message, stat) => {
            if (stat) {
              toast.success(message)
            } else {
              toast.error(message)
            }
          }
        }
        setClose={
          (data = null, stat = false) => {
            if (stat) {
              setOpenDialogJadwal(false);
            } else {
              setOpenDialogJadwal(false);
              setNikPasienJadwal('');
              setDataJadwalPasien([]);
              setDataPasienPeriksa({
                nik: '',
                nama: '',
                jenis_kelamin: '',
                tgl_lahir: '',
                alamat: '',
                pekerjaan: '',
                golongan_darah: '',
                pendidikan: '',
                no_telp: '',
                status_pernikahan: '',
                nama_orang_tua_wali: '',
                nama_pasangan: '',
              })
            }
          }
        }
        backdropnya={(status) => setBackdrop(status)}
        sweetalertnya={(status) => setSweetAlertLoading(status)}
        setOpenAgain={
          () => {

            setOpenDialogJadwal(true);
          }
        }
        updateJadwalTable={
          () => {
            updateJadwalTable()
          }
        }
      />

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarAdmin menu="Pasien" backdrop={backdrop} sweetalertload={sweetAlertLoading} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }} onSubmit={beforeAddPasien}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '8%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Pasien Baru</Typography>
                <Box sx={{ padding: "5px" }}></Box>
                <TextField
                  required
                  inputRef={nikInputRef}
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  id="nikTextField"
                  label="NIK"
                  placeholder="Masukkan NIK"
                  sx={{ width: "85%", boxShadow: 10 }}
                  InputProps={{
                    inputComponent: NumberFormatCustomNIK,
                    inputProps: {
                      maxLength: 16,
                      minLength: 16,
                    }
                  }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  id="namaTextField"
                  label="Nama"
                  placeholder="Masukkan Nama"
                  sx={{ width: "85%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <InputLabel id="demo-simple-select-helper-label">Jenis Kelamin</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-helper-label"
                    id="jenisKelaminSelect"
                    value={jenis_kelamin}
                    label="Jenis"
                    onChange={(e) => setJenisKelamin(e.target.value)}
                  >
                    <MenuItem value="" selected disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Laki-Laki"}>Laki-Laki</MenuItem>
                    <MenuItem value={"Perempuan"}>Perempuan</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      maxDate={new Date()}
                      label="Tanggal Lahir"
                      value={tanggal_lahir || null}
                      onChange={(newValue) => {
                        setTanggalLahir(newValue)
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  id="alamatTextField"
                  label="Alamat"
                  placeholder="Masukkan Alamat"
                  sx={{ width: "85%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  id="pekerjaanTextField"
                  label="Pekerjaan"
                  placeholder="Masukkan Pekerjaan"
                  sx={{ width: "85%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <InputLabel id="demo-simple-select-helper-label">Golongan Darah</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-helper-label"
                    id="golonganDarahSelect"
                    value={golongan_darah}
                    label="Jenis"
                    onChange={(e) => setGolonganDarah(e.target.value)}
                  >
                    <MenuItem value="" selected disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"O+"}>O+</MenuItem>
                    <MenuItem value={"O-"}>O-</MenuItem>
                    <MenuItem value={"A+"}>A+</MenuItem>
                    <MenuItem value={"A-"}>A-</MenuItem>
                    <MenuItem value={"B+"}>B+</MenuItem>
                    <MenuItem value={"B-"}>B-</MenuItem>
                    <MenuItem value={"AB+"}>AB+</MenuItem>
                    <MenuItem value={"AB-"}>AB-</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <InputLabel id="demo-simple-select-helper-label">Pendidikan</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-helper-label"
                    id="pendidikanSelect"
                    value={pendidikan}
                    label="Jenis"
                    onChange={(e) => setPendidikan(e.target.value)}
                  >
                    <MenuItem value="" selected disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Tiada"}>Tiada</MenuItem>
                    <MenuItem value={"SD"}>SD</MenuItem>
                    <MenuItem value={"SMP"}>SMP</MenuItem>
                    <MenuItem value={"SMA"}>SMA</MenuItem>
                    <MenuItem value={"Perguruan Tinggi"}>Perguruan Tinggi</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  inputRef={no_telpInputRef}
                  required
                  value={no_telp}
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
                />
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <InputLabel id="demo-simple-select-helper-label">Status Pernikahan</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-helper-label"
                    id="statusPernikahanSelect"
                    value={status_pernikahan}
                    label="Jenis"
                    onChange={(e) => setStatusPernikahan(e.target.value)}
                  >
                    <MenuItem value="" selected disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Bujang"}>Bujang</MenuItem>
                    <MenuItem value={"Telah Menikah"}>Telah Menikah</MenuItem>
                    <MenuItem value={"Duda"}>Duda</MenuItem>
                    <MenuItem value={"Janda"}>Janda</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  value={nama_orang_tua_wali}
                  onChange={(e) => setNamaOrangTuaWali(e.target.value)}
                  id="namaOrangTuaWaliTextField"
                  label="Nama Orang Tua / Wali"
                  placeholder="Masukkan Nama Orang Tua / Wali"
                  sx={{ width: "85%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  value={nama_pasangan}
                  onChange={(e) => setNamaPasangan(e.target.value)}
                  id="namaPasanganTextField"
                  label="Nama Pasangan"
                  placeholder="Masukkan Nama Pasangan"
                  sx={{ width: "85%", boxShadow: 10 }}
                />

                <Box sx={{ padding: "10px" }}></Box>
                <Divider />
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }} >
                  <LocalizationProvider dateAdapter={AdapterDateFns} >
                    <DateTimePicker
                      required
                      inputRef={tanggal_periksaInputRef}
                      minDate={new Date()}
                      renderInput={(props) => <TextField {...props} />}
                      label="Tanggal Pemeriksaan"
                      value={tanggal_periksa || null}
                      onChange={(newValue) => {
                        cekDoktor(newValue)
                        setTanggalPeriksa(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }} >
                  <InputLabel id="demo-simple-select-helper-label">Dokter</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-helper-label"
                    id="jenisKelaminSelect"
                    value={dokter}
                    label="Jenis"
                    onChange={(e) => setDokter(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>
                        {
                          (dokterList.length == 0) ? "Tiada Jadwal Dokter" : "-Pilih Dokter"
                        }
                      </em>
                    </MenuItem>
                    {
                      (dokterList.length > 0) ?
                        dokterList.map((dokter, index) => {
                          return (
                            <MenuItem key={"dokter" + index} value={dokter.id_dokter}>{dokter.tb_dokter.nama} / {dokter.tb_dokter.spesialis}</MenuItem>
                          )
                        }) :
                        null
                    }
                  </Select>
                </FormControl>

                <Box sx={{ padding: "10px" }}></Box>
                <Box textAlign="center">
                  <Button variant="contained" type="submit">Tambah</Button>
                </Box>
                <Box sx={{ padding: "10px" }}></Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Grid item xs={12} md={12}>
                <Paper align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10, overflow: 'hidden' }}>
                  <Typography variant="h6" gutterBottom sx={{
                    fontWeight: 'bold',
                    textAlign: 'left',
                    paddingLeft: '3%',
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    backgroundColor: "silver",
                  }}>List Pasien</Typography>
                  <Box sx={{ padding: "5px" }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2} />
                    <Grid item xs={12} md={8} component="form"
                      onSubmit={cariDataPasien}
                    >
                      <TextField
                        required
                        inputRef={cariInputRef}
                        id="cariTextField"
                        label="Nama @ NIK Pasien"
                        placeholder="Masukkan Nama atau NIK Pasien"
                        sx={{ width: "85%", boxShadow: 10 }}
                        onChange={
                          (e) => {
                            if (e.target.value == "") {
                              setDataPasienAll(props.pasien)
                            }
                          }
                        }
                      />
                      <Box sx={{ padding: "5px" }} />
                      <Box textAlign="center">
                        <Button variant="contained" type="submit">Cari</Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2} />
                  </Grid>
                  <Box sx={{ padding: "10px" }} />
                  <TableContainer sx={{
                    maxHeight: 500,
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
                          <StyledTableCell>NIK</StyledTableCell>
                          <StyledTableCell>Nama</StyledTableCell>
                          <StyledTableCell>Umur</StyledTableCell>
                          <StyledTableCell>Golongan Darah</StyledTableCell>
                          <StyledTableCell>Aksi</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          !awal ?
                            // loop props.pasien and render table row
                            props.pasien.map((pasien, index) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell>{pasien.nik}</TableCell>
                                  <TableCell>{pasien.nama}</TableCell>
                                  <TableCell>{pasien.tgl_lahir}</TableCell>
                                  <TableCell>{pasien.golongan_darah}</TableCell>
                                  <TableCell>
                                    <IconButton size="small" color="primary"
                                      onClick={
                                        async () => {
                                          setOpenDialogEdit(true)
                                          setDataPasienPeriksa(pasien)
                                        }
                                      }
                                      title="Edit Data Pasien"
                                    >
                                      <ModeEditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="success"
                                      onClick={
                                        async () => {
                                          lihatJadwal(pasien.nik)
                                          setDataPasienPeriksa(pasien)
                                        }
                                      }
                                      title="Lihat Jadwal Pasien"
                                    >
                                      <EventAvailableIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                            :
                            (dataPasienAll.length > 0)
                              ?
                              // loop dataPasienAll and render table row
                              dataPasienAll.map((pasien, index) => {
                                return (
                                  <TableRow key={index}>
                                    <TableCell>{pasien.nik}</TableCell>
                                    <TableCell>{pasien.nama}</TableCell>
                                    <TableCell>{pasien.tgl_lahir}</TableCell>
                                    <TableCell>{pasien.golongan_darah}</TableCell>
                                    <TableCell>
                                      <IconButton size="small" color="primary"
                                        onClick={
                                          async () => {
                                            setOpenDialogEdit(true)
                                            setDataPasienPeriksa(pasien)
                                          }
                                        }
                                        title="Edit Data Pasien"
                                      >
                                        <ModeEditIcon />
                                      </IconButton>
                                      <IconButton size="small" color="success"
                                        onClick={
                                          async () => {
                                            lihatJadwal(pasien.nik)
                                          }
                                        }
                                        title="Lihat Jadwal Pasien"
                                      >
                                        <EventAvailableIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                              :
                              <TableRow>
                                <TableCell colSpan={5}
                                  align="center"
                                >Tiada Data</TableCell>
                              </TableRow>

                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ padding: "5px" }}></Box>
                  {/* <Box textAlign="center">
                    <Button variant="contained">Cetak</Button>
                  </Box>
                  <Box sx={{ padding: "10px" }}></Box> */}
                </Paper>
              </Grid>
              <Box sx={{ padding: "15px" }}></Box>
              <Grid item xs={12} md={12}>
                <Paper component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10, overflow: 'hidden' }}>
                  <Typography variant="h6" gutterBottom sx={{
                    fontWeight: 'bold',
                    textAlign: 'left',
                    paddingLeft: '3%',
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    backgroundColor: "silver",
                  }}>Jadwal Dokter Hari {hari_ini}</Typography>
                  <Box sx={{ padding: "10px" }}></Box>
                  <TableContainer sx={{
                    maxHeight: 500,
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
                          (props.jadwal_dokter.length > 0)
                            ?
                            props.jadwal_dokter.map((jadwal, index) => {
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
                                Tiada Jadwal Dokter
                              </TableCell>
                            </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ padding: "5px" }}></Box>
                  {/* <Box textAlign="center">
                    <Button variant="contained">Cetak</Button>
                  </Box>
                  <Box sx={{ padding: "10px" }}></Box> */}
                </Paper>
              </Grid>
              <Box sx={{ padding: "15px" }}></Box>
              <Grid item xs={12} md={12}>
                <Paper component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10, overflow: 'hidden' }}>
                  <Typography variant="h6" gutterBottom sx={{
                    fontWeight: 'bold',
                    textAlign: 'left',
                    paddingLeft: '3%',
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    backgroundColor: "silver",
                  }}>Jadwal Pasien Hari {hari_ini}</Typography>
                  <Box sx={{ padding: "10px" }}></Box>
                  <TableContainer sx={{
                    maxHeight: 500,
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
                          <StyledTableCell>Jam Periksa</StyledTableCell>
                          <StyledTableCell>Doktor</StyledTableCell>
                          <StyledTableCell>NIK</StyledTableCell>
                          <StyledTableCell>Nama</StyledTableCell>
                          <StyledTableCell>Umur</StyledTableCell>
                          <StyledTableCell>Golongan Darah</StyledTableCell>
                          <StyledTableCell>Status</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          (jadwalPasien.length > 0)
                            ?
                            jadwalPasien.map((jadwal, index) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    { 
                                      jadwal.jam_periksa
                                    }
                                  </TableCell>
                                  <TableCell>
                                    { 
                                      jadwal.tb_dokter.nama
                                    }
                                  </TableCell>
                                  <TableCell>{jadwal.id_pasien}</TableCell>
                                  <TableCell>{jadwal.tb_pasien.nama}</TableCell>
                                  <TableCell>
                                    <Umur tanggal_lahir={jadwal.tb_pasien.tgl_lahir} />
                                  </TableCell>
                                  <TableCell>{jadwal.tb_pasien.golongan_darah}</TableCell>
                                  <TableCell>
                                    {
                                      (jadwal.diagnosa == "" || jadwal.diagnosa == null) ? "Belum Diperiksa" : "Sudah Diperiksa"
                                    }
                                  </TableCell>
                                </TableRow>
                              )
                            })
                            :
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                Tiada Jadwal Pasien
                              </TableCell>
                            </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ padding: "5px" }}></Box>
                  {/* <Box textAlign="center">
                    <Button variant="contained">Cetak</Button>
                  </Box>
                  <Box sx={{ padding: "10px" }}></Box> */}
                </Paper>
              </Grid>
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

    let all_pasien = await all_function.pasien_all();
    let jadwal_dokter_today = await all_function.jadwal_dokter_today();
    let jadwal_pasien_today = await all_function.jadwal_pasien_today();
    // console.log(all_pasien, "ini all pasien");
    // console.log(jadwal_today, "ini jadwal today");

    return {
      props: {
        user: req.session.user,
        pasien: all_pasien,
        jadwal_dokter: jadwal_dokter_today,
        jadwal_pasien: jadwal_pasien_today,
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

export default DataPasienPage;
