import { useState, forwardRef, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import InfoIcon from '@mui/icons-material/Info';

// select
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// ini untuk date time picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import moment from "moment"; //for converting date and time

import { formatInTimeZone } from 'date-fns-tz' // format timezone

// for table
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  }
}));

// sweet alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

// for dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const CustomDisableInput = styled(TextField)(() => ({
  ".MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#000",
    color: "#000"
  },
  // change the mui textfield border color
  ".MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: "#339AFF"
  },
  // change the label color
  ".MuiInputLabel-root.Mui-disabled": {
    color: "#339AFF"
  }
}));

const PenjumlahanObat = (props) => {
  let datanya = props.listObat;
  let component = [];
  for (let i = 0; i < datanya.length; i++) {
    component.push(
      <div key={i}>
        <CustomDisableInput
          id={datanya[i].nama_obat}
          label={`Jumlah ${datanya[i].nama_obat}`}
          // placeholder="Masukkan Nama Pasien"
          value={datanya[i].jumlah}
          disabled
          sx={{ width: "90%", boxShadow: 10 }}
        />
      </div>
    )

  }

  return (
    <>
      {component}
    </>
  )
}

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

// ini untuk select
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

function DialogLihatJadwalPasien(props) {
  // console.log(props, "ini props di jadwal")
  const [dataJadwal, setDataJadwal] = useState([])
  const [dataPasien, setDataPasien] = useState({})

  const [dokterList, setDokterList] = useState([]);
  const [jam_periksa, setJamPeriksa] = useState('');
  const tanggal_periksaInputRef = useRef();
  const [tanggal_periksa, setTanggalPeriksa] = useState('');
  const [dokter, setDokter] = useState('');

  useEffect(() => {
    if (props.dataJadwal.length > 0) {
      setDataJadwal(props.dataJadwal)
    }else{
      setDataJadwal([])
    }
  }, [props.dataJadwal])

  useEffect(() => {
    if (props.openit == true) {
      setDataPasien(props.dataPasien)
    }
  }, [props.dataPasien, props.openit])

  // for dokter select
  async function cekDoktor(tanggal,stat) {
    setDokter("")
    setDokterEdit("")
    // console.log(tanggal)
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
    if(stat == "edit"){
      setJamPeriksaEdit(clock)
    }else{
      setJamPeriksa(clock)
    }
    
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
      if(stat == "edit"){
        setDokterListEdit(data.data)
      }else{
        setDokterList(data.data)
      }
      
    } catch (err) {
      console.log(err)
      props.toastnya("Terjadi kesalahan saat mengambil data dokter", false)
    }

  }

  const beforeAddJadwal = async (e) => {
    e.preventDefault()
    if (tanggal_periksa == '') {
      toast.error('Tanggal periksa harus diisi')
      // focus to nik
      tanggal_periksaInputRef.current.focus();
    } else {
      const formattedDate = moment(tanggal_periksa).format('YYYY-MM-DD');
      const data = {
        id_pasien: dataPasien.nik,
        tanggal_periksa: formattedDate,
        jam_periksa: jam_periksa,
        id_dokter: dokter
      }
      props.sweetalertnya(true);
      props.setClose(null, true)
      await MySwal.fire({
        title: 'Yakin ?',
        text: `Tambah Jadwal Baru Pada Pasien NIK : ${dataPasien.nik}`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, tambah!'
      }).then(async (result) => {
        if (result.value) {
          props.backdropnya(true);

          // await 4 second
          // await new Promise(resolve => setTimeout(resolve, 4000));
          await confirm_tambah_jadwal(data);

        }
        else {
          props.setOpenAgain()

        }
      })
      props.backdropnya(false);
      props.sweetalertnya(false);
    }

  }

  async function confirm_tambah_jadwal(data) {
    // console.log(data, "ini data dari client")
    const datanya = data
    try {
      const url = process.env.HTTP_URL + "/api/admin/jadwal_pasien";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(datanya)
      })

      const data = await response.json();
      // console.log(data, "sini datanya")
      if (response.status == 200) {
        props.toastnya('Data Jadwal Baru Berhasil Ditambahkan', true)
        setTanggalPeriksa('')
        setDokterList([])
        setJamPeriksa('')
        setDokter('')
        setDataJadwal(data.data)
        // Router.replace(Router.asPath);
        props.updateJadwalTable()
        props.setOpenAgain()
      } else {
        props.toastnya('Terjadi kesalahan, coba lagi', false)
        props.setOpenAgain()
      }
    } catch (err) {
      console.log(err)
      props.toastnya('Terjadi kesalahan, coba lagi', false)
      props.setOpenAgain()

    }
  }

  // ini untuk dialog detail rekam medis
  const [openDialog, setOpenDialog] = useState(false);
  const [dataRekamMedis, setDataRekamMedis] = useState(null);
  const [selectedTindakan, setSelectedTindakan] = useState([]);
  const [selectedObat, setSelectedObat] = useState([]);
  const [listObat, setListObat] = useState([]);

  const cek_tindakan = async (data) => {
    // console.log(data, "ini data tindakan");
    try {
      let tindakan_array = [];
      for (let i = 0; i < data.length; i++) {
        let url = process.env.HTTP_URL + "/api/dokter/tindakan?id=" + data[i];
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'allow-cors-origin': '*',
            'crossDomain': true,
            'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
          },
        })

        const data_tindakan = await response.json();
        // console.log(data_tindakan, "ini data tindakan");
        if (response.status === 200) {
          // tindakan_array.push();
          let ini_tindakan = data_tindakan.data.nama_tindakan;
          tindakan_array.push(ini_tindakan);
        }

      }
      setSelectedTindakan(tindakan_array);
      // console.log(tindakan_array, "ini tindakan array");


    } catch (err) {
      console.log(err)
    }
  }

  const cek_obat = async (data) => {
    try {
      let list_obat = [];
      let selected_obat = [];
      for (let i = 0; i < data.length; i++) {
        let url = process.env.HTTP_URL + "/api/dokter/cek_obat?id=" + data[i].id;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'allow-cors-origin': '*',
            'crossDomain': true,
            'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
          },
        })

        const data_obat = await response.json();
        // console.log(data_obat, "ini data obat");
        if (response.status === 200) {
          // tindakan_array.push();
          let nama_obat = data_obat.data.nama_obat;
          list_obat.push({
            nama_obat: nama_obat,
            jumlah: data[i].jumlah,
          });
          selected_obat.push(nama_obat);

        }

      }
      setListObat(list_obat);
      setSelectedObat(selected_obat);

    } catch (err) {
      console.log(err)
    }
  }

  async function preview_rekam_medis(data) {
    let datanya = data
    try {
      setDataRekamMedis(datanya)
      // console.log(dataRekamMedis, "ini data rekam medis")
    } catch (err) {

    }
    // console.log(data, "ini data rekam medis di luar")
    setOpenDialog(true);
  }

  // ini untuk dialog edit
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [idRekamMedisEdit, setIdRekamMedisEdit] = useState(null);
  
  const[minTime , setMinTime] = useState(new Date());
  const [dokterListEdit, setDokterListEdit] = useState([]);
  const [jam_periksaEdit, setJamPeriksaEdit] = useState('');
  const tanggal_periksaInputRefEdit = useRef();
  const [tanggal_periksaEdit, setTanggalPeriksaEdit] = useState(null);
  const [dokterEdit, setDokterEdit] = useState('');

  const beforeEditJadwal = async (e) => {
    e.preventDefault()
    if (tanggal_periksaEdit == '') {
      toast.error('Tanggal periksa harus diisi')
      // focus to nik
      tanggal_periksaInputRefEdit.current.focus();
    } else {
      const formattedDate = moment(tanggal_periksaEdit).format('YYYY-MM-DD');
      const data = {
        id_pasien: dataPasien.nik,
        tanggal_periksa: formattedDate,
        jam_periksa: jam_periksaEdit,
        id_dokter: dokterEdit
      }
      // console.log(data , "ini data edit jadwal")
      setOpenDialogEdit(false)
      props.sweetalertnya(true);
      props.setClose(null, true)
      await MySwal.fire({
        title: 'Yakin ?',
        text: `Edit  Jadwal `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, edit!'
      }).then(async (result) => {
        if (result.value) {
          props.backdropnya(true);

          // await 4 second
          // await new Promise(resolve => setTimeout(resolve, 4000));
          await confirm_edit_jadwal(data,idRekamMedisEdit);

        }
        else {
          props.setOpenAgain()
          await new Promise(resolve => setTimeout(resolve, 500));
          setOpenDialogEdit(true)

        }
      })
      props.backdropnya(false);
      props.sweetalertnya(false);
    }
  }

  async function confirm_edit_jadwal(datanya,id){
    let datanyanya = datanya
    let idnya = id
    // try{
      const url = process.env.HTTP_URL + "/api/admin/jadwal_pasien?id=" + idnya;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(datanyanya)
      })

      const data = await response.json();
      console.log(data, "sini datanya sudah edit")
      if (response.status == 200) {
        props.toastnya('Data Jadwal Baru Berhasil Diubah', true)
        setTanggalPeriksa('')
        setDokterList([])
        setJamPeriksa('')
        setDokter('')
        setDataJadwal(data.data)
        // Router.replace(Router.asPath);
        props.updateJadwalTable()
        props.setOpenAgain()
      } else {
        props.toastnya('Terjadi kesalahan, coba lagi', false)
        props.setOpenAgain()
      }
    // }catch(err){
    //   console.log(err)
    //   props.toastnya('Terjadi kesalahan, coba lagi', false)
    //   props.setOpenAgain()
    // }
  }

  return (
    <>
      <BootstrapDialog
        onClose={
          () => {
            setOpenDialog(false)
          }
        }
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        fullWidth={true}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={
          () => {
            setOpenDialog(false)
          }
        }>
          Detail Rekam Medis
        </BootstrapDialogTitle>
        <DialogContent dividers align="center">
          <CustomDisableInput
            id="nikPasienTextField"
            label="NIK Pasien"
            // placeholder="Masukkan Nama Pasien"
            value={
              (dataRekamMedis != null) ?
                dataRekamMedis.tb_pasien.nik :
                ""
            }
            disabled
            sx={{
              width: "90%", boxShadow: 10,
              "&.MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000",
                color: "#000"
              }
            }}

          />
          <Box sx={{ padding: "10px" }}></Box>
          <CustomDisableInput
            id="namaPasienTextField"
            label="Nama Pasien"
            // placeholder="Masukkan Nama Pasien"
            value={
              (dataRekamMedis != null) ?
                dataRekamMedis.tb_pasien.nama :
                ""
            }
            disabled
            sx={{ width: "90%", boxShadow: 10 }}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <CustomDisableInput
            id="dokterPemeriksaPasienTextField"
            label="Dokter Pemeriksa"
            // placeholder="Masukkan okter Pemeriksa"
            value={
              (dataRekamMedis != null) ?
                dataRekamMedis.tb_dokter.nama :
                ""
            }
            disabled
            sx={{ width: "90%", boxShadow: 10 }}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <CustomDisableInput
            id="tanggalDaftarTextField"
            label="Tanggal Daftar"
            // placeholder="Masukkan Nama Pasien"
            value={
              (dataRekamMedis != null)
                ?
                formatInTimeZone(new Date(dataRekamMedis.createdAt), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd | HH:mm:ss')
                :
                ""
            }
            disabled
            sx={{ width: "90%", boxShadow: 10 }}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <CustomDisableInput
            id="tanggalPeriksaTextField"
            label="Tanggal Periksa"
            // placeholder="Masukkan Nama Pasien"
            value={
              (dataRekamMedis != null)
                ?
                formatInTimeZone(new Date(dataRekamMedis.updatedAt), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd | HH:mm:ss')
                :
                ""
            }
            disabled
            sx={{ width: "90%", boxShadow: 10 }}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <CustomDisableInput
            disabled
            id="keluhanPasienTextField"
            label="Keluhan Pasien"
            // placeholder="Masukkan Keluhan Pasien"
            value={
              (dataRekamMedis != null) ?
                dataRekamMedis.keluhan :
                ""
            }
            multiline
            rows={6}
            // maxRows={6}
            sx={{ width: "90%", boxShadow: 10 }}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <CustomDisableInput
            disabled
            id="diagnosaTextField"
            label="Diagnosa"
            // placeholder="Masukkan Diagnosa"
            value={
              (dataRekamMedis != null) ?
                dataRekamMedis.diagnosa :
                ""
            }
            multiline
            rows={6}
            // maxRows={6}
            sx={{ width: "90%", boxShadow: 10 }}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <CustomDisableInput
            disabled
            id="keteranganTextField"
            label="Keterangan"
            placeholder="Masukkan Keterangan"
            multiline
            rows={6}
            // maxRows={6}
            value={
              (dataRekamMedis != null) ?
                dataRekamMedis.keterangan :
                ""
            }
            sx={{ width: "90%", boxShadow: 10 }}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <Divider />
          <Box sx={{ padding: "10px" }}></Box>
          {
            (selectedTindakan.length > 0)
              ?
              <FormControl sx={{ m: 1, width: "90%" }}>
                <InputLabel id="demo-multiple-checkbox-label">Tindakan</InputLabel>
                <Select
                  disabled
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={selectedTindakan}
                  placeholder="Tiada Tindakan"
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {selectedTindakan.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={selectedTindakan.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              :
              <Box align="center">Tiada Tindakan</Box>
          }
          <Box sx={{ padding: "10px" }}></Box>
          <Divider />
          <Box sx={{ padding: "10px" }}></Box>
          {
            (selectedTindakan.length > 0)
              ?
              <>
                <FormControl sx={{ m: 1, width: "90%" }}>
                  <InputLabel id="demo-multiple-checkbox-label">Obat</InputLabel>
                  <Select
                    disabled
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedObat}
                    // placeholder="Tiada Tindakan"
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {selectedObat.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={selectedObat.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <PenjumlahanObat listObat={listObat} />
              </>
              :
              <Box align="center">Tiada Tindakan</Box>
          }
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={
            () => {
              setOpenDialog(false)
            }

          } variant="outlined">
            Tutup
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        // onClose={
        //   () => {
        //     setOpenDialogEdit(false)
        //   }
        // }
        aria-labelledby="customized-dialog-title"
        open={openDialogEdit}
        component="form"
        onSubmit={beforeEditJadwal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={
          () => {
            setOpenDialogEdit(false)
          }
        }>
          Edit Data {
            idRekamMedisEdit
          }
        </BootstrapDialogTitle>
        <DialogContent dividers align="center">
          <FormControl sx={{ width: "85%", boxShadow: 10 }} >
            <LocalizationProvider dateAdapter={AdapterDateFns} >
              <DateTimePicker
                required
                inputRef={tanggal_periksaInputRefEdit}
                minDate={new Date()}
                minTime={minTime}
                renderInput={(props) => <TextField {...props} />}
                label="Tanggal Pemeriksaan"
                value={tanggal_periksaEdit}
                onChange={(newValue) => {
                  cekDoktor(newValue,"edit")
                  setTanggalPeriksaEdit(newValue);
                  // if newValue > today then set the minTime to null else set the minTime to today
                  if (newValue > new Date()) {
                    setMinTime(null)
                  }else{
                    setMinTime(new Date())
                  }
                }}
              />
            </LocalizationProvider>
          </FormControl>
          <Box sx={{ padding: "10px" }} />
          <FormControl sx={{ width: "85%", boxShadow: 10 }} >
            <InputLabel id="demo-simple-select-helper-label">Dokter</InputLabel>
            <Select
              required
              labelId="demo-simple-select-helper-label"
              id="jenisKelaminSelect"
              value={dokterEdit}
              label="Jenis"
              onChange={(e) => setDokterEdit(e.target.value)}
            >
              <MenuItem value="" selected disabled>
                <em>
                  {
                    (dokterListEdit.length == 0) ? "Tiada Jadwal Dokter" : "-Pilih Dokter"
                  }
                </em>
              </MenuItem>
              {
                (dokterListEdit.length > 0) ?
                  dokterListEdit.map((dokter, index) => {
                    return (
                      <MenuItem key={"dokter" + index} value={dokter.id_dokter}>{dokter.tb_dokter.nama} / {dokter.tb_dokter.spesialis}</MenuItem>
                    )
                  }) :
                  null
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" type='submit' color="primary">
            Simpan Perubahan
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Dialog
        fullScreen
        open={
          props.openit
        }
        // onClick={
        //   ()=>{
        //     console.log("clicked")
        //     props.setClose()
        //   }
        // }
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={
                () => {
                  // console.log("clicked")
                  setTanggalPeriksa('')
                  setDokterList([])
                  setJamPeriksa('')
                  setDokter('')
                  props.setClose()
                }
              }
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Jadwal Pasien {dataPasien.nama}
            </Typography>
            <Button autoFocus color="inherit"
              onClick={
                () => {
                  setTanggalPeriksa('')
                  setDokterList([])
                  setJamPeriksa('')
                  setDokter('')
                  props.setClose()
                }
              }
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, p: 2.5 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }} onSubmit={beforeAddJadwal}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '8%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Jadwal Baru</Typography>
                <Box sx={{ padding: "5px" }} />
                <Box sx={{ padding: "10px" }} />
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
                        cekDoktor(newValue,"tambah")
                        setTanggalPeriksa(newValue);
                        console.log(newValue)
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
                <Box sx={{ padding: "10px" }} />
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
                    <MenuItem value="" selected disabled>
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

                <Box sx={{ padding: "10px" }} />
                <Box textAlign="center">
                  <Button variant="contained" type="submit">Tambah</Button>
                </Box>
                <Box sx={{ padding: "10px" }} />
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10, overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>List Jadwal</Typography>
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
                        <StyledTableCell>Pendaftaran</StyledTableCell>
                        <StyledTableCell>Waktu Periksa</StyledTableCell>
                        <StyledTableCell>Dokter</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Aksi</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        (dataJadwal.length > 0)
                          ?

                          dataJadwal.map((jadwal, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  {
                                    formatInTimeZone(new Date(jadwal.createdAt), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd | HH:mm:ss')

                                    // "sini dulu"
                                  }
                                </TableCell>
                                <TableCell>
                                  {
                                    jadwal.tanggal_periksa + " | " + jadwal.jam_periksa
                                  }
                                </TableCell>
                                <TableCell>
                                  {
                                    jadwal.tb_dokter.nama
                                    // "sini nama"
                                  }
                                </TableCell>
                                <TableCell>
                                  {
                                    (jadwal.diagnosa == '' || jadwal.diagnosa == null)
                                      ?
                                      <>
                                        <IconButton color="error" title="Belum Diperiksa">
                                          <HelpOutlineIcon />
                                        </IconButton>
                                      </>
                                      :
                                      <>
                                        <IconButton color="success" title="Sudah Diperiksa"
                                          onClick={
                                            () => {
                                              // 
                                              // console.log("ini cek")
                                            }
                                          }
                                        >
                                          <CheckCircleOutlineIcon />
                                        </IconButton>
                                      </>
                                  }
                                </TableCell>
                                <TableCell>
                                  {
                                    (jadwal.diagnosa == '' || jadwal.diagnosa == null)
                                      ?
                                      <>
                                        <IconButton color="primary" title="Edit Jadwal"
                                          onClick={
                                            async () => {
                                              setTanggalPeriksaEdit(null)
                                              setDokterEdit("")
                                              setOpenDialogEdit(true)
                                              // setIdRekamMedisEdit(null)
                                              setIdRekamMedisEdit(jadwal.id_rekam_medis)
                                              
                                            }
                                          }
                                        >
                                          <ModeEditIcon />
                                        </IconButton>
                                      </>
                                      :
                                      <>
                                        <IconButton color="success" title="Lihat Hasil Pemeriksaan"
                                          onClick={
                                            async () => {
                                              // 
                                              // setDataRekamMedis(jadwal)
                                              const tindakan = JSON.parse(jadwal.tindakan)

                                              if (tindakan.length > 0) {
                                                await cek_tindakan(tindakan);
                                              }
                                              const obat = JSON.parse(jadwal.obat);
                                              if (obat.length > 0) {
                                                await cek_obat(obat);
                                              }
                                              // setOpenDialog(true)

                                              preview_rekam_medis(jadwal)
                                              // console.log("ini cek")
                                              // console.log(dataRekamMedis, "ini data rekam medis")
                                            }
                                          }
                                        >
                                          <InfoIcon />
                                        </IconButton>
                                      </>
                                  }
                                </TableCell>
                              </TableRow>
                            )
                          })
                          :
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              Tiada Data Jadwal
                            </TableCell>
                          </TableRow>
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ padding: "5px" }}></Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
}

export default DialogLihatJadwalPasien;