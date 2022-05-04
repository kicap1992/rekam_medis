import { useState, useEffect, useRef } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// button icon
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

// for dialog
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// for time select
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// sweet alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)



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

function TabelJadwalDokter(props) {
  // console.log(props, "ini props di dalam jadwal")
  const [nik, setNik] = useState('');
  // const [bukaJadwal , setBukaJadwal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setNik(props.niknya)

  }, [props.niknya]);
  async function inbukajadwal() {
    await new Promise(resolve => setTimeout(resolve, 500));
    setOpenDialog(true)
  }

  useEffect(() => {
    if (props.bukaJadwal) {
      inbukajadwal()
    }
  }, [props.bukaJadwal])




  const [hari, setHari] = useState('');

  // for time select
  const jamMulaiInputRef = useRef();
  const jamSelesaiInputRef = useRef();
  const [jamMulai, setJamMulai] = useState(null);
  const [jamSelesai, setJamSelesai] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setHari(props.hari_nya)
    setJamMulai(props.jam_mulainya)
    setJamSelesai(props.jam_selesainya)
  }, [props.hari_nya, props.jam_mulainya, props.jam_selesainya])


  const tambahJadwal = async (e) => {
    e.preventDefault();
    if (jamMulai == null) {
      props.toastnya("Jam Mulai Harus Terisi")
      // focus jam mulai
      jamMulaiInputRef.current.focus();
    } else if (jamSelesai == null) {
      props.toastnya("Jam Selesai Harus Terisi")
      // focus jam selesai
      jamSelesaiInputRef.current.focus();
    } else if (jamMulai > jamSelesai) {
      props.toastnya("Jam Mulai Harus Lebih Kecil Dari Jam Selesai")
      // focus jam selesai
      jamSelesaiInputRef.current.focus();
    } else {
      let jam_mulai_converted = jamMulai.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });
      let jam_selesai_converted = jamSelesai.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });
      console.log(jam_mulai_converted, jam_selesai_converted, hari, nik, "ini data yang akan dikirim")

      let data = {
        jam_mulai: jam_mulai_converted,
        jam_selesai: jam_selesai_converted,
        hari: hari,
        id_dokter: nik
      }
      props.closeJadwal()
      props.sweetAlertLoadingnya(true)

      await MySwal.fire({
        title: 'Yakin ?',
        text: (status == 'tambah') ? `Jadwal Pada Hari ${hari} akan ditambahkan ke dokter dengan nik ${nik}` : `Jadwal Pada Hari ${hari} akan diubah ke dokter dengan nik ${nik}`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: (status == 'tambah') ? 'Ya, tambahkan!' : 'Ya, ubah!',
      }).then(async (result) => {
        if (result.value) {
          props.backdropnya(true);

          

          try {
            const url = process.env.HTTP_URL + "/api/admin/jadwal_dokter";
            const response = await fetch(url, {
              method: (status == 'tambah') ? 'POST' : 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'allow-cors-origin': '*',
                'crossDomain': true,
                'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
              },
              body: JSON.stringify(
                data
              )
            })

            const json = await response.json();

            if(response.status === 200){
              props.toastnya(json.message,true)
              await props.openback(nik, "", null, null, false)
            }else{
              props.toastnya(json.message,false)
              await props.openback(nik, hari, jamMulai, jamSelesai, true)
            }
          } catch {
            await props.openback(nik, hari, jamMulai, jamSelesai, true)
            props.toastnya("Terjadi Kesalahan, Coba Lagi Nanti",false)
          }

          // await props.openback(nik, "", null, null, false)
        } else {
          await props.openback(nik, hari, jamMulai, jamSelesai, true)

        }

      })
      props.backdropnya(false);
      props.sweetAlertLoadingnya(false);


      // props.closeJadwal()
    }
  }

  let component = []

  for (let i = 0; i < props.harinya.length; i++) {
    // clear component

    let componentnya = [
      <TableRow key={i}>
        <TableCell>{props.harinya[i]}</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>
          <IconButton color="primary" onClick={
            () => {
              setHari(props.harinya[i])
              setOpenDialog(true)
              setStatus("tambah")
            }
          }>
            <ModeEditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ]

    for (let j = 0; j < props.dataJadwal.length; j++) {
      if (props.dataJadwal[j].hari == props.harinya[i]) {
        // clear componentnya
        componentnya = [<TableRow key={i}>
          <TableCell>{props.harinya[i]}</TableCell>
          <TableCell>{props.dataJadwal[j].jam_mulai}</TableCell>
          <TableCell>{props.dataJadwal[j].jam_selesai}</TableCell>
          <TableCell>
            <IconButton color="success" 
              onClick={
                () => {
                  setHari(props.harinya[i])
                  let today = new Date()
                  let jam_mulai_new = new Date(today.getFullYear(), today.getMonth(), today.getDate(), props.dataJadwal[j].jam_mulai.split(":")[0], props.dataJadwal[j].jam_mulai.split(":")[1])
                  let jam_selesai_new = new Date(today.getFullYear(), today.getMonth(), today.getDate(), props.dataJadwal[j].jam_selesai.split(":")[0], props.dataJadwal[j].jam_selesai.split(":")[1])
                  
                  setJamMulai(jam_mulai_new)
                  setJamSelesai(jam_selesai_new)
                  setOpenDialog(true)
                  setStatus("edit")
                }
              }
            >
              <ModeEditIcon />
            </IconButton>
            <IconButton color="error">
              <DisabledByDefaultIcon />
            </IconButton>
          </TableCell>
        </TableRow>]
        // push jam mulai dan jam selesai
        break;
      }
    }

    // push componentnya to component
    component.push(componentnya)


  }
  // console.log(component, "ini component")

  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        component="form"
        onSubmit={tambahJadwal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={
          () => {
            setOpenDialog(false)
            setJamMulai(null)
            setJamSelesai(null)
          }
        }>
          Jadwal Hari {hari}
        </BootstrapDialogTitle>
        <DialogContent dividers align="center">
          <FormControl sx={{ width: "85%", boxShadow: 10 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                inputRef={jamMulaiInputRef}
                required
                label="Jam Mulai"
                value={jamMulai}
                onChange={(newValue) => {
                  console.log(newValue, "ini new value")
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
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" type="submit" color="primary">
            {
              status == "tambah" ? "Tambah" : "Edit"
            }
          </Button>

        </DialogActions>
      </BootstrapDialog>
      {component}
    </>
  )

}

export default TabelJadwalDokter