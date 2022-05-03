import { useState, useRef, forwardRef, Fragment } from 'react';
import Router from 'next/router';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
// import Paper from '@mui/material/Paper';
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

// this is for number format
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

// button icon
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

// for modal edit
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

// for modal history
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';

// colapsing table
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const Transition = forwardRef(function Transition(props, ref) { // for modal history
  return <Slide direction="up" ref={ref} {...props} />;
});


const BootstrapDialog = styled(Dialog)(({ theme }) => ({ // for modal edit
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

const BootstrapDialogTitle = (props) => { // for modal edit
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

BootstrapDialogTitle.propTypes = { // for modal edit
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  }
}));

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  let tableCell, tableCellDetail

  if (row.keterangan == 'Input Obat Baru') {
    tableCell = (
      <>
        <StyledTableCell>Obat</StyledTableCell>
        <StyledTableCell>Harga</StyledTableCell>
        <StyledTableCell align="right">Jenis</StyledTableCell>
        <StyledTableCell align="right">Jumlah</StyledTableCell>
      </>
    )

    tableCellDetail = (
      <>
        <TableCell>{row.detail.obat}</TableCell>
        <TableCell>{"Rp. " + all_function.thousandSeparator(row.detail.harga)}</TableCell>
        <TableCell align="right">{row.detail.jenis}</TableCell>
        <TableCell align="right">{row.detail.jumlah}</TableCell>
      </>
    )
  } else {
    tableCell = (
      <>
        {(row.detail.obat_lama != row.detail.obat_baru) ? <><StyledTableCell>Nama Lama</StyledTableCell><StyledTableCell>Nama Baru</StyledTableCell></> : <></>}

        {(row.detail.harga_lama != row.detail.harga_baru) ? <><StyledTableCell>Harga Lama</StyledTableCell><StyledTableCell>Harga Baru</StyledTableCell></> : <></>}

        {(row.detail.jenis_lama != row.detail.jenis_baru) ? <><StyledTableCell>Jenis Lama</StyledTableCell><StyledTableCell>Jenis Baru</StyledTableCell></> : <></>}

        {(row.detail.jumlah_lama != row.detail.jumlah_baru) ? <><StyledTableCell>Jumlah Lama</StyledTableCell><StyledTableCell>Jumlah Baru</StyledTableCell></> : <></>}
      </>
    )

    tableCellDetail = (
      <>
        {(row.detail.obat_lama != row.detail.obat_baru) ? <><TableCell>{row.detail.obat_lama}</TableCell><TableCell>{row.detail.obat_baru}</TableCell></> : <></>}

        {(row.detail.harga_lama != row.detail.harga_baru) ? <><TableCell>{"Rp. " + all_function.thousandSeparator(row.detail.harga_lama)}</TableCell><TableCell>{"Rp. " + all_function.thousandSeparator(row.detail.harga_baru)}</TableCell></> : <></>}

        {(row.detail.jenis_lama != row.detail.jenis_baru) ? <><TableCell>{row.detail.jenis_lama}</TableCell><TableCell>{row.detail.jenis_baru}</TableCell></> : <></>}

        {(row.detail.jumlah_lama != row.detail.jumlah_baru) ? <><TableCell>{row.detail.jumlah_lama}</TableCell><TableCell>{row.detail.jumlah_baru}</TableCell></> : <></>}
      </>
    )
  }

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {row.waktu}
        </StyledTableCell>
        <StyledTableCell align="right">{row.keterangan}</StyledTableCell>
        <StyledTableCell align="right">{row.waktu}</StyledTableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detail History
              </Typography>
              <Table size="small" aria-label="purchases" sx={{
                boxShadow: 3,
                "& .MuiTableCell-root": {
                  borderLeft: "1px solid rgba(224, 224, 224, 1)"
                }
              }}>
                <TableHead>
                  <TableRow>
                    {tableCell}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow >
                    {tableCellDetail}
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

    </Fragment>
  );
}


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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
      thousandSeparator
      isNumericString
      prefix="Rp. "
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function DataObatPage(props) {
  const obatInputRef = useRef();
  const jumlahInputRef = useRef();
  // const hargaInputRef = useRef();

  const url = process.env.HTTP_URL + "/api/admin/obat"

  const [backdrop, setBackdrop] = useState(false); //this is for backdrop
  const [sweetAlertLoading, setSweetAlertLoading] = useState(false); //this is for sweet alert loading

  const [jenis, setJenis] = useState('');

  const jenisHandleChange = (event) => {
    setJenis(event.target.value);
  };

  const [harga, setHarga] = useState('');

  const hargaHandleChange = (event) => {
    // console.log(event.target.value)
    setHarga(event.target.value);
  };

  // for modal edit obat
  const [headerModalEdit, setHeaderModalEdit] = useState('');
  const [idObatModalEdit, setIdObatModalEdit] = useState('');
  const obatEditInputRef = useRef();
  const [obatEdit, setObatEdit] = useState('');
  const [jumlahEdit, setJumlahEdit] = useState('');
  const [jenisEdit, setJenisEdit] = useState('');
  const [hargaEdit, setHargaEdit] = useState('');
  // 
  const [dataObatEdit, setDataObatEdit] = useState({});
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const handleClickOpenModalEdit = (id, obat, jenis, jumlah, harga) => {
    console.log(id, obat, jenis, jumlah, harga, "sini buka modal edit")
    setHeaderModalEdit(obat)
    setIdObatModalEdit(id)
    setObatEdit(obat)
    setJumlahEdit(jumlah)
    setJenisEdit(jenis)
    setHargaEdit(harga)
    setDataObatEdit({
      id: id,
      obat: obat,
      jenis: jenis,
      jumlah: jumlah,
      harga: harga
    })
    setOpenModalEdit(true);
  };
  const handleCloseModalEdit = (event, reason) => {
    if (reason && reason == "backdropClick")
      return;
    setOpenModalEdit(false);
  };


  // for modal history obat
  const [headerModalHistory, setHeaderModalHistory] = useState('');
  const [dataObatHistory, setDataObatHistory] = useState([]);
  const [isLoadingDataHistory, setIsLoadingDataHistory] = useState(false);


  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const handleClickOpenModalHistory = async (id, nama) => {
    console.log(id, nama, "sini buka modal history")
    setOpenHistoryModal(true);
    setHeaderModalHistory(nama)
    setIsLoadingDataHistory(true)
    // await 5 sec
    // await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      let urlnya = `${url}?id=${id}`
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
      console.log(data, "ini data dari cek tindakan")
      if (response.status === 200) {
        setDataObatHistory(data.data)

      } else {
        console.log("error")
      }

    } catch (err) {
      console.log(err)
    }
    setIsLoadingDataHistory(false)

  };

  const handleCloseModalHistory = () => {
    setOpenHistoryModal(false);
  };

  // before tambah obat
  async function beforeTambahObat(event) {
    event.preventDefault();
    const obat = obatInputRef.current.value;
    const jumlah = jumlahInputRef.current.value;
    console.log(harga, "sini dalam sebelum add")
    // remove Rp. and , from harga
    // let harga = harga;

    const history = [{
      admin: props.user.nik,
      keterangan: "Input Obat Baru",
      waktu: new Date().toLocaleString(),
      detail: {
        obat: obat,
        jumlah: jumlah,
        harga: harga,
        jenis: jenis
      }
    }]




    setSweetAlertLoading(true);

    // create sweet alert
    await MySwal.fire({
      title: 'Yakin ?',
      text: `Anda akan menambahkan obat ${obat} dengan jumlah ${jumlah} dan harga ${harga}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Tambahkan!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.value) {
        let data = {
          obat: obat,
          jumlah: jumlah,
          harga: harga,
          jenis: jenis,
          history: history
        }
        setBackdrop(true);
        // await 4 second
        let response = await tambahObat(data);
        if (!response) {
          // focus to input
          obatInputRef.current.focus();
        } else {
          // clear all input and select 
          obatInputRef.current.value = '';
          jumlahInputRef.current.value = '';
          // hargaInputRef.current.value = '';
          setJenis('');
          setHarga('');

          // clear input in textfield id hargaTextField

          Router.replace(Router.asPath);
        }
      }
    })

    setBackdrop(false);
    setSweetAlertLoading(false);
  }

  // tambah obat
  async function tambahObat(datanya) {
    console.log(datanya, " ini data di tambah obat");
    // console.log(props.user)

    try {
      console.log(url)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify({
          obat: datanya.obat,
          jumlah: datanya.jumlah,
          harga: datanya.harga,
          jenis: datanya.jenis,
          history: datanya.history
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
      toast.error("Terjadi kesalahan pada server")
      return false
    }

  }

  // before edit obat
  async function beforeEditObat() {

    if (obatEdit == dataObatEdit.obat && jenisEdit == dataObatEdit.jenis && hargaEdit == dataObatEdit.harga && jumlahEdit == dataObatEdit.jumlah) {
      toast.error("Tidak ada perubahan data")
      handleClickOpenModalEdit(idObatModalEdit, obatEdit, jenisEdit, jumlahEdit, hargaEdit)
      // return false
    } else {
      setSweetAlertLoading(true);
      await MySwal.fire({
        title: 'Yakin ?',
        text: `Anda akan mengubah detail obat ${headerModalEdit}`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Ubah!',
        cancelButtonText: 'Batal',
      }).then(async (result) => {
        if (result.value) {
          // run handleCloseModalEdit
          let history = {
            admin: props.user.nik,
            keterangan: "Edit Obat",
            waktu: new Date().toLocaleString(),
            detail: {
              obat_lama: dataObatEdit.obat,
              jumlah_lama: dataObatEdit.jumlah,
              harga_lama: dataObatEdit.harga,
              jenis_lama: dataObatEdit.jenis,
              obat_baru: obatEdit,
              jumlah_baru: jumlahEdit,
              harga_baru: hargaEdit,
              jenis_baru: jenisEdit
            }
          }
          let data = {
            id: idObatModalEdit,
            obat: obatEdit,
            jumlah: jumlahEdit,
            harga: hargaEdit,
            jenis: jenisEdit,
            history: history
          }
          setBackdrop(true);
          // await 4 second

          let response = await editObat(data);
          if (!response) {
            // focus to input
            obatInputRef.current.focus();
          } else {
            Router.replace(Router.asPath);
          }

        } else {
          // run handleClickOpenModalEdit
          handleClickOpenModalEdit(idObatModalEdit, obatEdit, jenisEdit, jumlahEdit, hargaEdit)
        }
      })

      setBackdrop(false);
      setSweetAlertLoading(false);
    }


  }

  // edit obat
  async function editObat(datanya) {
    console.log(datanya, " ini data di edit obat");
    // console.log(props.user)

    try {
      console.log(url)
      let urlnya = `${url}?id=${datanya.id}&detail=edit_data`
      // console.log(urlnya)
      const response = await fetch(urlnya, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
        body: JSON.stringify({
          // id: datanya.id,
          obat: datanya.obat,
          jumlah: datanya.jumlah,
          harga: datanya.harga,
          jenis: datanya.jenis,
          history: datanya.history
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
      toast.error("Terjadi kesalahan pada server")
      return false
    }

  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleCloseModalEdit}
        aria-labelledby="customized-dialog-title"
        open={openModalEdit}
        align="center"
        // maxWidth="lg"
        fullWidth={true}
        component="form"
        onSubmit={
          async (e) => {
            e.preventDefault();
            await handleCloseModalEdit()
            beforeEditObat()
          }
        }
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseModalEdit}>
          Edit Detail {headerModalEdit}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {/* <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }} onSubmit={beforeTambahObat} > */}
          <Box sx={{ padding: "5px" }}></Box>
          <TextField
            inputRef={obatEditInputRef}
            id="obatEditTextField"
            label="Obat"
            placeholder="Masukkan Obat"
            sx={{ width: "85%", boxShadow: 10 }}
            required
            value={obatEdit}
            onChange={(e) => setObatEdit(e.target.value)}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <FormControl sx={{ width: "85%", boxShadow: 10 }}>
            <InputLabel id="demo-simple-select-helper-label">Jenis</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="jenisEditSelect"
              value={jenisEdit}
              label="Jenis"
              onChange={(e) => setJenisEdit(e.target.value)}
              required
            >
              <MenuItem value="" disabled >
                <em>-Pilih Jenis Obat</em>
              </MenuItem>
              <MenuItem value={"Jenis 1"} selected={
                jenisEdit === "Jenis 1"
              }>Jenis 1</MenuItem>
              <MenuItem value={"Jenis 2"} selected={
                jenisEdit === "Jenis 2"
              }>Jenis 2</MenuItem>
              <MenuItem value={"Jenis 3"} selected={
                jenisEdit === "Jenis 3"
              }>Jenis 3</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ padding: "10px" }}></Box>
          <TextField
            type="number"
            id="jumlahEditTextField"
            label="Jumlah"
            placeholder="Masukkan Jumlah"
            sx={{ width: "85%", boxShadow: 10 }}
            // inputRef={jumlahEditInputRef}
            required
            value={jumlahEdit}
            onChange={(e) => setJumlahEdit(e.target.value)}
          />
          <Box sx={{ padding: "10px" }}></Box>
          <TextField
            // inputRef={hargaInputRef}
            onChange={(e) => setHargaEdit(e.target.value)}
            required
            id="hargaEditTextField"
            label="Harga"
            placeholder="Masukkan Harga"
            sx={{ width: "85%", boxShadow: 10 }}
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
            name="harga"
            value={hargaEdit}
          />
          {/* <Box sx={{ padding: "10px" }}></Box>
                <Box textAlign="center">
                  <Button variant="contained" type="submit">Tambah</Button>
                </Box>
                <Box sx={{ padding: "10px" }}></Box> */}
          {/* </Card> */}
        </DialogContent>
        <DialogActions>
          {/* <Button autoFocus onClick={
            async () => {
              await handleCloseModalEdit()
              beforeEditObat()
            }
          } variant="outlined"> */}
          <Button autoFocus variant="outlined" type='submit'>
            Simpan Perubahan
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Dialog
        fullScreen
        open={openHistoryModal}
        onClose={handleCloseModalHistory}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseModalHistory}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              History Log {headerModalHistory}
            </Typography>

          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 0, p: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={2}></Grid>
            <Grid item xs={12} md={8}>
              {
                isLoadingDataHistory ?
                  <Box textAlign="center" sx={{ paddingBottom: 7 }}><CircularProgress color="inherit" /></Box>
                  : <div>
                    <TableContainer component={Paper}>
                      <Table aria-label="collapsible table" sx={{
                        boxShadow: 3,
                        "& .MuiTableCell-root": {
                          borderLeft: "1px solid rgba(224, 224, 224, 1)"
                        }
                      }}>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell />
                            <StyledTableCell>Waktu</StyledTableCell>
                            <StyledTableCell align="right">Keterangan</StyledTableCell>
                            <StyledTableCell align="right">Jumlah</StyledTableCell>

                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataObatHistory.map((row, index) => (
                            <Row key={index} row={row} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
              }

              <Box sx={{ padding: "5px" }}></Box>
              <Box textAlign="center">
                <Button variant="contained" onClick={handleCloseModalHistory}>Close History</Button>
              </Box>
              <Box sx={{ padding: "10px" }}></Box>
            </Grid>
            <Grid item md={2}></Grid>
          </Grid>
        </Box>
      </Dialog>

      <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoClose={2000} Bounce={Bounce} theme="colored" />
      <Backdrop open={backdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarAdmin menu="Obat" backdrop={backdrop} sweetalertload={sweetAlertLoading} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }} onSubmit={beforeTambahObat} >
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '8%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}>Tambah Obat</Typography>
                <Box sx={{ padding: "5px" }}></Box>
                <TextField
                  inputRef={obatInputRef}
                  id="obatTextField"
                  label="Obat"
                  placeholder="Masukkan Obat"
                  sx={{ width: "85%", boxShadow: 10 }}
                  required
                />
                <Box sx={{ padding: "10px" }}></Box>
                <FormControl sx={{ width: "85%", boxShadow: 10 }}>
                  <InputLabel id="demo-simple-select-helper-label">Jenis</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="jenisSelect"
                    value={jenis}
                    label="Jenis"
                    onChange={jenisHandleChange}
                    required
                  >
                    <MenuItem value="" disabled selected>
                      <em>-Pilih Jenis Obat</em>
                    </MenuItem>
                    <MenuItem value={"Jenis 1"}>Jenis 1</MenuItem>
                    <MenuItem value={"Jenis 2"}>Jenis 2</MenuItem>
                    <MenuItem value={"Jenis 3"}>Jenis 3</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  type="number"
                  id="jumlahTextField"
                  label="Jumlah"
                  placeholder="Masukkan Jumlah"
                  sx={{ width: "85%", boxShadow: 10 }}
                  inputRef={jumlahInputRef}
                  required
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  // inputRef={hargaInputRef}
                  onChange={hargaHandleChange}
                  required
                  id="hargaTextField"
                  label="Harga"
                  placeholder="Masukkan Harga"
                  sx={{ width: "85%", boxShadow: 10 }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  name="harga"
                  value={harga}
                />
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
                }}> List Tindakan</Typography>
                <TableContainer component={Box} sx={{
                  padding: "15px",
                }}>
                  <Table aria-label="simple table" sx={{
                    minWidth: 400,
                    boxShadow: 3,
                    "& .MuiTableCell-root": {
                      borderLeft: "1px solid rgba(224, 224, 224, 1)"
                    }
                  }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Obat</StyledTableCell>
                        <StyledTableCell>Jenis</StyledTableCell>
                        <StyledTableCell>Jumlah</StyledTableCell>
                        <StyledTableCell>Harga</StyledTableCell>
                        <StyledTableCell>Aksi</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.obat.map((row) => (
                        <TableRow
                          key={row.id_obat}
                        >
                          <TableCell component="th" scope="row">
                            {row.nama_obat}
                          </TableCell>
                          <TableCell>{row.jenis}</TableCell>
                          <TableCell>{row.jumlah}</TableCell>
                          <TableCell>{"Rp. " + all_function.thousandSeparator(row.harga)}</TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary" title="Edit Detail" onClick={
                              () => { handleClickOpenModalEdit(row.id_obat, row.nama_obat, row.jenis, row.jumlah, row.harga) }
                            }>
                              <ModeEditIcon />
                            </IconButton>
                            {/* <IconButton size="small" color="success" title="Tambah Jumlah">
                              <AddCircleIcon />
                            </IconButton> */}
                            <IconButton size="small" color="info" title="Lihat Log History" onClick={
                              () => { handleClickOpenModalHistory(row.id_obat, row.nama_obat) }
                            }>
                              <ManageSearchIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
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
    </div>
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

    let all_obat = await all_function.obat_all();
    console.log(all_obat, "ini all obat");

    return {
      props: {
        user: req.session.user,
        obat: all_obat
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

export default DataObatPage;
