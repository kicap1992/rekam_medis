import Router from 'next/router';
import { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// button icon
import IconButton from '@mui/material/IconButton';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';

// for dialog
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { formatInTimeZone } from 'date-fns-tz' // format timezone

// for tindakan select
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

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

function Umur(props) {

  let umur = props.tgl_lahir;
  let tahun = new Date().getFullYear();
  let tahun_lahir = umur.substr(0, 4);
  let umur_ini = tahun - tahun_lahir;



  return (
    <>
      {umur_ini}
    </>
  )
}

function TabelJadwalRekamMedis(props) {
  let component = [];

  const [openDialog, setOpenDialog] = useState(false);
  const [dataRekamMedis, setDataRekamMedis] = useState(null);
  const [selectedTindakan, setSelectedTindakan] = useState([]);
  const [selectedObat, setSelectedObat] = useState([]);
  const [listObat, setListObat] = useState([]);

  const preview_rekam_medis = async (id_rekam_medis) => {
    props.backdropnya(true)
    setDataRekamMedis(null)
    setSelectedTindakan([])
    setSelectedObat([])
    try {
      const url = process.env.HTTP_URL + "/api/dokter/cek_data_rekam_medis?id=" + id_rekam_medis + "&id_dokter=" + props.user;
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
      if (response.status === 200) {
        setDataRekamMedis(data.data);
        const tindakan = JSON.parse(data.data.tindakan);
        if (tindakan.length > 0) {
          await cek_tindakan(tindakan);
        }
        const obat = JSON.parse(data.data.obat);
        if (obat.length > 0) {
          await cek_obat(obat);
        }

        // setSelectedTindakan(tindakan);
        // console.log(tindakan, "ini tindakan");


        setOpenDialog(true);
      } else {
        props.errornya(data.message);
      }
    } catch (err) {
      console.log(err)
      props.errornya("Terjadi kesalahan saat mengambil data rekam medis")
    }
    props.backdropnya(false)
  }

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
      console.log(tindakan_array, "ini tindakan array");


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
        console.log(data_obat, "ini data obat");
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




  if (props.data.length == 0) {
    component = (
      <TableRow>
        <TableCell colSpan={8} align="center">
          Tiada Data
        </TableCell>
      </TableRow>
    )
  } else {
    for (let i = 0; i < props.data.length; i++) {
      let ii = 0;
      ii = i + 1;
      component.push(
        <TableRow key={i}>
          <TableCell>{ii}</TableCell>
          <TableCell>{props.data[i].tb_pasien.nik}</TableCell>
          <TableCell>{props.data[i].tb_pasien.nama}</TableCell>
          <TableCell>{props.data[i].tanggal_periksa} | {props.data[i].jam_periksa}</TableCell>
          <TableCell><Umur tgl_lahir={props.data[i].tb_pasien.tgl_lahir} /></TableCell>
          <TableCell>{props.data[i].tb_pasien.golongan_darah}</TableCell>
          <TableCell>
            {
              (props.data[i].diagnosa == '' || props.data[i].diagnosa == null) ?
                <>
                  <IconButton color="error" title="Belum Diperiksa">
                    <HelpOutlineIcon />
                  </IconButton>
                </> :
                <>
                  <IconButton color="success" title="Sudah Diperiksa"
                    onClick={
                      () => {
                        preview_rekam_medis(props.data[i].id_rekam_medis)
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
              (props.data[i].diagnosa == '' || props.data[i].diagnosa == null) ?
                <>
                  <IconButton color="primary"
                    onClick={
                      () => {
                        Router.push('/dokter/rekam-medis/data?id=' + props.data[i].id_rekam_medis)
                      }
                    }
                  >
                    <QuestionAnswerIcon />
                  </IconButton>
                </> :
                <>
                  <IconButton color="success" onClick={
                      () => {
                        preview_rekam_medis(props.data[i].id_rekam_medis)
                      }
                    }>
                    <InfoIcon />
                  </IconButton>
                </>
            }

          </TableCell>
        </TableRow>
      )
    }
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
      {component}
    </>
  )

}

export default TabelJadwalRekamMedis