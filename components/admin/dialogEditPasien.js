import { useRef, useState, forwardRef, useEffect } from 'react'
import Router from 'next/router';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// this is for number format
import NumberFormat from 'react-number-format';

import moment from "moment"; //for converting date and time

// select
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';

// ini untuk date time picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// sweet alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

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
      // prefix="08"
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

function DialogEditPasien(props) {
  // console.log(props, "sini dialog edit pasien");

  // create new let no and remove index 0 and 1 from props.dataPasien.no_telp
  // let no = 
  // const ini_nik = props.openit ? props.dataPasien.nik : '';

  const [datanya, setData] = useState({});
  const nikInputRef = useRef();
  const no_telpInputRef = useRef();
  useEffect(() => {
    setData(props.dataPasienPeriksa);
  },[props.dataPasienPeriksa])

  
  const updatePasien = async (e) => {
    e.preventDefault();
    // let no_telpBaru = "08" + datanya.no_telp
    if (datanya.nik.length < 16) {
      props.toastnya('NIK harus 16 digit', false)
      // focus to nik
      nikInputRef.current.focus();
    } else if (datanya.no_telp.length < 11) {
      props.toastnya('No Telpon minimal harus 11 digit', false)
      // focus to nik
      no_telpInputRef.current.focus();
    }else if(datanya.no_telp[0] != "0" && datanya.no_telp[0] != "8"){
      props.toastnya('No Telpon harus diawali dengan 08 atau 0', false)
      // focus to nik
      no_telpInputRef.current.focus();
    }
    
    else{
      // props.toastnya('HEHEHEH LAMANYA', true)
      props.setClose(datanya,true)
      props.sweetalertnya(true);
      await MySwal.fire({
        title: 'Yakin ?',
        text: `Detail pasien dengan nik ${datanya.nik} akan diedit`,
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
          await confirm_update_data();
        }else{
          props.setOpenAgain()
          
        }
      })
      props.backdropnya(false);
      props.sweetalertnya(false);
    }
  }
  
  async function confirm_update_data(){
    try{
      const url = process.env.HTTP_URL + "/api/admin/pasien?nik=" + datanya.nik;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(datanya)
      })
      
      const data = await response.json();
      if(response.status == 200){
        props.toastnya('Data pasien berhasil diupdate', true)
        Router.replace(Router.asPath);
      }else{
        props.toastnya('Terjadi kesalahan, coba lagi', false)
        props.setOpenAgain()
      }
    }catch(err){
      console.log(err)
      props.toastnya('Terjadi kesalahan, coba lagi', false)
      props.setOpenAgain()
      
    }
  }

  // console.log(datanya, "ini data yang di edit");

  return (
    <>

      <BootstrapDialog
        onClose={
          () => {
            props.setClose()
          }
        }
        aria-labelledby="customized-dialog-title"
        open={props.openit}
        fullWidth={true}
        component="form" 
          onSubmit={
            updatePasien
          }
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={
          () => {
            props.setClose()
          }
        }>
          Data Pasien
        </BootstrapDialogTitle>
        <DialogContent dividers align="center" 
        >
          <TextField
            disabled
            inputRef={nikInputRef}
            value={datanya.nik}
            onChange={
              (e) => {
                setData({
                  ...datanya,
                  nik: e.target.value,
                })
              }
            }
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
          <>
            <TextField
              required
              value={
                datanya.nama
              }
              onChange={
                (e) => {
                  setData({
                    ...datanya,
                    nama: e.target.value,
                  })
                }
              }
              id="namaEditTextField"
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
                id="jenisKelaminSelectEdit"
                value={
                  datanya.jenis_kelamin
                }
                label="Jenis"
                onChange={
                  (e) => {
                    setData({
                      ...datanya,
                      jenis_kelamin: e.target.value,
                    })
                  }
                }
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Laki-Laki"} selected={
                  (datanya.jenis_kelamin === "Laki-Laki")
                    ?
                    true
                    :
                    false
                }>Laki-Laki</MenuItem>
                <MenuItem value={"Perempuan"} selected={
                  (datanya.jenis_kelamin == "Perempuan")
                    ?
                    true
                    :
                    false
                }>Perempuan</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ padding: "10px" }}></Box>
            <FormControl sx={{ width: "85%", boxShadow: 10 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  maxDate={new Date()}
                  label="Tanggal Lahir"
                  value={
                    datanya.tgl_lahir
                  }
                  onChange={(newValue) => {
                    console.log(newValue);
                    setData({
                      ...datanya,
                      tgl_lahir: moment(newValue).format('YYYY-MM-DD'),
                    })
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <Box sx={{ padding: "10px" }}></Box>
            <TextField
              required
              value={
                datanya.alamat
              }
              onChange={
                (e) => {
                  setData({
                    ...datanya,
                    alamat: e.target.value,
                  })
                }
              }
              id="alamatTextFieldEdit"
              label="Alamat"
              placeholder="Masukkan Alamat"
              sx={{ width: "85%", boxShadow: 10 }}
            />
          </>
          <>
            <Box sx={{ padding: "10px" }}></Box>
            <TextField
              required
              value={
                datanya.pekerjaan
              }
              onChange={
                (e) => {
                  setData({
                    ...datanya,
                    pekerjaan: e.target.value,
                  })
                }
              }
              id="pekerjaanTextFieldEdit"
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
                value={
                  datanya.golongan_darah
                }
                label="Jenis"
                onChange={
                  (e) => {
                    setData({
                      ...datanya,
                      golongan_darah: e.target.value,
                    })
                  }
                }
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"O+"} selected={
                  (datanya.golongan_darah == "O+")
                    ?
                    true
                    :
                    false
                }>O+</MenuItem>
                <MenuItem value={"O-"} selected={
                  (datanya.golongan_darah == "O-")
                    ?
                    true
                    :
                    false
                }>O-</MenuItem>
                <MenuItem value={"A+"} selected={
                  (datanya.golongan_darah == "A+")
                    ?
                    true
                    :
                    false
                }>A+</MenuItem>
                <MenuItem value={"A-"} selected={
                  (datanya.golongan_darah == "A-")
                    ?
                    true
                    :
                    false
                }>A-</MenuItem>
                <MenuItem value={"B+"} selected={
                  (datanya.golongan_darah == "B+")
                    ?
                    true
                    :
                    false
                }>B+</MenuItem>
                <MenuItem value={"B-"} selected={
                  (datanya.golongan_darah == "B-")
                    ?
                    true
                    :
                    false
                }>B-</MenuItem>
                <MenuItem value={"AB+"} selected={
                  (datanya.golongan_darah == "AB+")
                    ?
                    true
                    :
                    false
                }>AB+</MenuItem>
                <MenuItem value={"AB-"} selected={
                  (datanya.golongan_darah == "AB-")
                    ?
                    true
                    :
                    false
                }>AB-</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ padding: "10px" }}></Box>
            <FormControl sx={{ width: "85%", boxShadow: 10 }}>
              <InputLabel id="demo-simple-select-helper-label">Pendidikan</InputLabel>
              <Select
                required
                labelId="demo-simple-select-helper-label"
                id="pendidikanSelect"
                value={
                  datanya.pendidikan
                }
                label="Jenis"
                onChange={
                  (e) => {
                    setData({
                      ...datanya,
                      pendidikan: e.target.value,
                    })
                  }
                }
              >
                <MenuItem value="" selected disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Tiada"} selected={
                  (datanya.pendidikan == "Tiada")
                    ?
                    true
                    :
                    false
                }>Tiada</MenuItem>
                <MenuItem value={"SD"} selected={
                  (datanya.pendidikan == "SD")
                    ?
                    true
                    :
                    false
                }>SD</MenuItem>
                <MenuItem value={"SMP"} selected={
                  (datanya.pendidikan == "SMP")
                    ?
                    true
                    :
                    false
                }>SMP</MenuItem>
                <MenuItem value={"SMA"} selected={
                  (datanya.pendidikan == "SMA")
                    ?
                    true
                    :
                    false
                }>SMA</MenuItem>
                <MenuItem value={"Perguruan Tinggi"} selected={
                  (datanya.pendidikan == "Perguruan Tinggi")
                    ?
                    true
                    :
                    false
                }>Perguruan Tinggi</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ padding: "10px" }}></Box>
            <TextField
              inputRef={no_telpInputRef}
              required
              value={
                datanya.no_telp
              }
              onChange={
                (e) => {
                  setData({
                    ...datanya,
                    no_telp: e.target.value,
                  })
                }
              }
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
                value={
                  datanya.status_pernikahan
                }
                label="Jenis"
                onChange={
                  (e) => {
                    setData({
                      ...datanya,
                      status_pernikahan: e.target.value,
                    })
                  }
                }
              >
                <MenuItem value="" disabled>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Bujang"} selected={
                  (datanya.status_pernikahan == "Bujang")
                    ?
                    true
                    :
                    false
                }>Bujang</MenuItem>
                <MenuItem value={"Telah Menikah"} selected={
                  (datanya.status_pernikahan == "Telah Menikah")
                    ?
                    true
                    :
                    false
                }>Telah Menikah</MenuItem>
                <MenuItem value={"Duda"} selected={
                  (datanya.status_pernikahan == "Duda")
                    ?
                    true
                    :
                    false
                }>Duda</MenuItem>
                <MenuItem value={"Janda"} selected={
                  (datanya.status_pernikahan == "Janda")
                    ?
                    true
                    :
                    false
                }>Janda</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ padding: "10px" }}></Box>
            <TextField
              required
              value={
                datanya.nama_orang_tua_wali
              }
              onChange={
                (e) => {
                  setData({
                    ...datanya,
                    nama_orang_tua_wali: e.target.value,
                  })
                }
              }
              id="namaOrangTuaWaliTextField"
              label="Nama Orang Tua / Wali"
              placeholder="Masukkan Nama Orang Tua / Wali"
              sx={{ width: "85%", boxShadow: 10 }}
            />
            <Box sx={{ padding: "10px" }}></Box>
            <TextField
              required
              value={
                datanya.nama_pasangan
              }
              onChange={
                (e) => {
                  setData({
                    ...datanya,
                    nama_pasangan: e.target.value,
                  })
                }
              }
              id="namaPasanganTextField"
              label="Nama Pasangan"
              placeholder="Masukkan Nama Pasangan"
              sx={{ width: "85%", boxShadow: 10 }}
            />

            <Box sx={{ padding: "10px" }}></Box>
          </>

        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="outlined" color="primary">
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  )

}

export default DialogEditPasien;