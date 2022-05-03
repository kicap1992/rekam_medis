import Router from 'next/router'
import { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

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


import AppBarDokter from '../../../components/dokter/appBar';
import RekamMedisSelectedObat from '../../../components/dokter/selectedObat';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



const DataRekamMedisPage = (props) => {
  // console.log(props)
  const [backdrop, setBackdrop] = useState(false); //this is for backdrop
  const [sweetAlertLoading, setSweetAlertLoading] = useState(false); //this is for sweet alert loading

  const keluhanInputRef = useRef(null);
  const diagnosaInputRef = useRef(null);
  const keterangannInputRef = useRef(null);


  const dataPasien = props.data_rekam_medis.tb_pasien;
  const tindakan_all = props.tindakan_all;
  const [tindakan_selected, setTindakanSelected] = useState([]);
  const [tindakan_selected_id, setTindakanSelectedId] = useState([]);
  const obat_all = props.obat_all;
  const [obat_selected, setObatSelected] = useState([]);
  const [obat_selected_id, setObatSelectedId] = useState([]);

  const [data_obat, setDataObat] = useState([]);

  async function add_rekam_medis(e) {
    e.preventDefault();
    const id_rekam_medis = props.data_rekam_medis.id_rekam_medis;
    const keluhan = keluhanInputRef.current.value;
    const diagnosa = diagnosaInputRef.current.value;
    const keterangan = keterangannInputRef.current.value;
    const tindakan = tindakan_selected_id;
    const obat = data_obat;
    console.log(obat)

    let cek_error = false

    if(obat.length > 0) {
      //loop obat using for and check in jumlah if null
      for(let i = 0; i < obat.length; i++) {
        if(obat[i].jumlah == null) {
          cek_error = true
          break;
        }
      }

      if(cek_error) {
        toast.error('Jumlah obat tidak boleh kosong')
        return ;
      }
    }

    setSweetAlertLoading(true);
    await MySwal.fire({
      title: 'Yakin ?',
      text: `Rekam medis pasien ${props.data_rekam_medis.tb_pasien.nama} akan disimpan`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, simpan!'
    }).then(async (result) => {
      if (result.value) {
        setBackdrop(true);

        

        //  await 4 sec
        // await new Promise(resolve => setTimeout(resolve, 4000));
        let data_all = {
          keluhan,
          diagnosa,
          keterangan,
          tindakan,
          obat,
        }

        await confirm_add_rekam_medis(id_rekam_medis, data_all)

      }
    })
    setBackdrop(false);
    setSweetAlertLoading(false);

  }

  async function confirm_add_rekam_medis(id_rekam_medis, data_all) {
    try {
      let url = process.env.HTTP_URL + "/api/dokter/rekam_medis_update?id_rekam_medis=" + id_rekam_medis + "&id_dokter=" + props.user;
      let data = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify(data_all)
      })
      // let data_json = await data.json();
      // console.log(data, "ini data dari cek dokter")
      if (data.status === 200) {
        // create toast
        toast.success('Rekam medis berhasil disimpan')
        Router.push('/')
        return true
      }else{
        toast.error('Rekam medis gagal disimpan')
        return false
      }
    }catch(err) {
      toast.error('Rekam medis gagal disimpan')
      return false
    }
  }


  return (
    <>
      <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoClose={2000} Bounce={Bounce} theme="colored" />
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Card sx={{ display: 'flex' }} onSubmit={add_rekam_medis} component="form">
        <CssBaseline />
        <AppBarDokter menu="Rekam Medis" backdrop={backdrop} sweetalertload={sweetAlertLoading} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} >
          <DrawerHeader />
          <Grid container spacing={2}

          >
            <Grid item xs={12} md={7} >
              <Card align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '8%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Tambah Jadwal</Typography>
                <Box sx={{ padding: "5px" }}></Box>
                <TextField
                  id="nikPasienTextField"
                  label="NIK Pasien"
                  // placeholder="Masukkan Nama Pasien"
                  value={dataPasien.nik}
                  disabled
                  sx={{ width: "90%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  id="namaPasienTextField"
                  label="Nama Pasien"
                  // placeholder="Masukkan Nama Pasien"
                  disabled
                  value={dataPasien.nama}
                  sx={{ width: "90%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  id="tanggalPeriksaTextField"
                  label="Tanggal Daftar"
                  // placeholder="Masukkan Tanggal Periksa"
                  disabled
                  value={formatInTimeZone(new Date(dataPasien.createdAt), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd | HH:mm:ss')}
                  sx={{ width: "90%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  inputRef={keluhanInputRef}
                  id="keluhanPasienTextField"
                  label="Keluhan Pasien"
                  placeholder="Masukkan Keluhan Pasien"
                  multiline
                  rows={6}
                  // maxRows={6}
                  sx={{ width: "90%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  inputRef={diagnosaInputRef}
                  id="diagnosaTextField"
                  label="Diagnosa"
                  placeholder="Masukkan Diagnosa"
                  multiline
                  rows={6}
                  // maxRows={6}
                  sx={{ width: "90%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  required
                  inputRef={keterangannInputRef}
                  id="keteranganTextField"
                  label="Keterangan"
                  placeholder="Masukkan Keterangan"
                  multiline
                  rows={6}
                  // maxRows={6}
                  sx={{ width: "90%", boxShadow: 10 }}
                />

                <Box sx={{ padding: "10px" }}></Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>

              <Card align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 100, boxShadow: 10 }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}> Daftar Tindakan</Typography>
                <FormControl sx={{ m: 1, width: "85%" }}>
                  <InputLabel id="demo-multiple-checkbox-label">Tindakan</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={tindakan_selected}
                    onChange={
                      (event) => {
                        setTindakanSelected(event.target.value);
                        let data_selected = event.target.value
                        let datanya = []
                        for (let i = 0; i < data_selected.length; i++) {
                          datanya.push(data_selected[i].split('-')[0])
                        }
                        setTindakanSelectedId(datanya)
                      }
                    }
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value.split("-")[0]} label={value.split("-")[1]} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {tindakan_all.map((name) => (
                      <MenuItem key={name.id_tindakan} value={name.id_tindakan + "-" + name.nama_tindakan}>
                        <Checkbox checked={tindakan_selected.indexOf(name.id_tindakan + "-" + name.nama_tindakan) > -1} />
                        <ListItemText primary={name.nama_tindakan} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Kosongkan Jika Tiada Tindakan</FormHelperText>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
              </Card>
              <Box sx={{ padding: "15px" }}></Box>
              <Card align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 100, boxShadow: 10 }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Daftar Obat</Typography>
                <FormControl sx={{ m: 1, width: "85%" }}>
                  <InputLabel id="demo-multiple-checkbox-label">Obat</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={obat_selected}
                    onChange={
                      (event) => {
                        setObatSelected(event.target.value);
                        let data_selected = event.target.value
                        let datanya = []
                        let data_obat = []
                        for (let i = 0; i < data_selected.length; i++) {
                          datanya.push(data_selected[i].split('-')[0])
                          // push to data_obat id:data_selected[i].split('-')[0] and jumlah:null
                          data_obat.push({ id_obat: data_selected[i].split('-')[0], jumlah: null })
                        }
                        setObatSelectedId(datanya)
                        setDataObat(data_obat)

                      }
                    }
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={
                            // value split by '-'
                            value.split('-')[0]
                          } label={value.split('-')[1]} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {obat_all.map((name) => (
                      <MenuItem key={name.id_obat + "-" + name.nama_obat} value={name.id_obat + "-" + name.nama_obat}>
                        <Checkbox checked={obat_selected.indexOf(name.id_obat + "-" + name.nama_obat) > -1} />
                        <ListItemText primary={name.nama_obat} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Kosongkan Jika Tiada Obat</FormHelperText>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <RekamMedisSelectedObat obat={obat_selected}
                  datanya={
                    (data) => {
                      console.log(data)
                      setDataObat(data)
                    }
                  }
                  errornya={
                    (message) => {
                      toast.error(message)
                    }
                  }
                />
              </Card>
              <Box sx={{ padding: "10px" }}></Box>
              <Box sx={{ padding: "10px", maxWidth: "100%" }} textAlign="center">
                <Button variant="contained" color="primary" sx={{ width: 100 }} type="submit">
                  Simpan
                </Button>
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Card>
    </>
  );
}


// // ini untuk get query dari url
// DataRekamMedisPage.getInitialProps = async ({ query }) => {
//   // console.log(query)
//   return {query }
// }

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

    const id = req.query.id;
    if (!id) {
      return {
        redirect: {
          destination: '/dokter/rekam-medis',
          permanent: false,
        }
      };
    }
    console.log(id, "ini idnya")
    const cek_data_rekam_medis = await all_function.cek_data_rekam_medis(id, user.nik)
    
    // if(ce)
    if(!cek_data_rekam_medis){
      return {
        redirect: {
          destination: '/dokter/rekam-medis',
          permanent: false,
        }
      };
    }

    if(cek_data_rekam_medis.diagnosa != null && cek_data_rekam_medis.diagnosa != '' && cek_data_rekam_medis.keluhan != null && cek_data_rekam_medis.keluhan != ''){
      return {
        redirect: {
          destination: '/dokter/rekam-medis',
          permanent: false,
        }
      };
    }

    const tindakan_all = await all_function.tindakan_all()
    const obat_all = await all_function.obat_all()

    

    return {
      props: {
        user: user.nik,
        data_rekam_medis: cek_data_rekam_medis,
        tindakan_all: tindakan_all,
        obat_all: obat_all,
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

export default DataRekamMedisPage