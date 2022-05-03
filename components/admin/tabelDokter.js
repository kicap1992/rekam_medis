import { useState, useRef, forwardRef } from 'react';
// import { useTheme } from '@mui/material';
import { useTheme } from '@mui/system';
import { useMediaQuery } from '@mui/material';
// for table
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// button icon
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// for dialog box
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


// this is for number format
import NumberFormat from 'react-number-format';

// this is for circular progress
import CircularProgress from '@mui/material/CircularProgress';

// for edit jadwal dialog
import DialogContentText from '@mui/material/DialogContentText';

// for table
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  }
}));

// this for dialog jadwal
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TabelJadwalDokter from './tabelJadwalDokter';
const Transition = forwardRef(function Transition(props, ref) { // for modal history
  return <Slide direction="up" ref={ref} {...props} />;
});


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



function TabelDokterAll(props) {
  // console.log(props.dataDokterAll, "ini di bagian tabel all");
  const url = process.env.HTTP_URL + "/api/admin/dokter"; // ini url

  const namaInputRef = useRef();
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const noTelpInputRef = useRef();
  const [noTelp, setNoTelp] = useState('');
  const [spesialis, setSpesialis] = useState('');


  // for dialog box
  const [dataDokterEdit, setDataDokterEdit] = useState({});
  const [headerDialog, setHeaderDialog] = useState('');
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [isGet, setIsGet] = useState(false);
  const handleClickOpenModalEdit = () => {

    setOpenModalEdit(true);
  };
  const handleCloseModalEdit = (event, reason) => {
    if (reason && reason == "backdropClick")
      return;
    setOpenModalEdit(false);
  };

  // for dialog jadwal
  const [dataJadwal, setDataJadwal] = useState([]);
  const [openJadwalModal, setOpenJadwalModal] = useState(false);
  const handleCloseModalJadwal = () => {
    setBukaJadwal(false)
    setOpenJadwalModal(false);
    setHariTambahEdit('');
    setJamMulaiTambahEdit(null);
    setJamSelesaiTambahEdit(null);

  };
  const handleClickOpenModalJadwal = async (id) => {
    setIsLoadingDataJadwal
    console.log(id)
    setNik(id);
    setOpenJadwalModal(true);
    // await 3 sec
    // await new Promise(resolve => setTimeout(resolve, 3000));
    await cekJadwal(id);

    // setOpenEditJadwal(true);
  };

  // Edit Jadwal Dialog
  const harinya = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const [openEditJadwal, setOpenEditJadwal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoadingDataJadwal, setIsLoadingDataJadwal] = useState(false);
  const [bukaJadwal, setBukaJadwal] = useState(false);
  const [hariTambahEdit, setHariTambahEdit] = useState('');
  const [jamMulaiTambahEdit, setJamMulaiTambahEdit] = useState(null);
  const [jamSelesaiTambahEdit, setJamSelesaiTambahEdit] = useState(null);

  const handleClickOpenEditJadwal = () => {
    setOpenEditJadwal(true);
  };

  const handleCloseEditJadwal = () => {
    setOpenEditJadwal(false);
  };

  async function edit_dokter(id) {
    setIsGet(false);
    try {
      const urlnya = `${url}?nik=${id}`;
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
      // console.log(data.data, "ini data dokter");

      // props.toastnya("Berhasil mengambil data dokter");
      if (response.status === 200) {
        let theData = data.data
        // console.log(theData, "ini data dokter");
        setDataDokterEdit(theData);
        setHeaderDialog(theData.nama)
        setNik(theData.nik);
        setNama(theData.nama);
        setAlamat(theData.alamat);
        setNoTelp(theData.no_telp);
        setSpesialis(theData.spesialis);
        setIsGet(true);
        setOpenModalEdit(true);
      } else {
        props.toastnya("Data dokter tidak ditemukan");
      }
    } catch (error) {
      props.toastnya("Terjadi kesalahan");
    }
    handleClickOpenModalEdit();
  }

  const beforeEditDokter = async () => {

    if (nama == dataDokterEdit.nama && alamat == dataDokterEdit.alamat && noTelp == dataDokterEdit.no_telp && spesialis == dataDokterEdit.spesialis) {
      props.toastnya("Tidak ada perubahan");
    } else {
      let datanya = {
        nama,
        alamat,
        no_telp: noTelp,
        spesialis
      }
      handleCloseModalEdit()
      await props.editDokter(nik, datanya);

    }



    // console.log(nik, nama, alamat, noTelp, spesialis, dataDokterEdit, "ini data dokter");

  }

  async function cekJadwal(id) {
    try {
      let urlnya = `${url}?nik=${id}&detail=jadwal`;
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
      // console.log(data.data, "ini data dokter");
      setDataJadwal(data.data);
      // console.log(dataJadwal, "ini data jadwal");

    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openEditJadwal}
        onClose={handleCloseEditJadwal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseEditJadwal}>
            Disagree
          </Button>
          <Button onClick={handleCloseEditJadwal} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen
        open={openJadwalModal}
        onClose={handleCloseModalJadwal}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseModalJadwal}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Jadwal Dokter NIK {nik}
            </Typography>

          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 0, p: 2 }}>
          <Grid container spacing={4}>
            <Grid item md={2}></Grid>
            <Grid item xs={12} md={8}>
              {
                isLoadingDataJadwal ?
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
                            <StyledTableCell>Hari</StyledTableCell>
                            <StyledTableCell>Jam Masuk</StyledTableCell>
                            <StyledTableCell>Jam Keluar</StyledTableCell>
                            <StyledTableCell>Aksi</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TabelJadwalDokter dataJadwal={dataJadwal} harinya={harinya} niknya={nik}
                            toastnya={
                              (message, stat) => {
                                props.toastnya(message, stat)
                              }
                            }

                            closeJadwal={handleCloseModalJadwal}
                            backdropnya={
                              (stat) => {
                                props.backdropnya(stat)
                              }
                            }
                            sweetAlertLoadingnya={
                              (stat) => {
                                props.sweetAlertLoadingnya(stat)
                              }
                            }
                            openback={
                              async (nik, hari, jam_mulai, jam_selesai,stat) => {
                                // await 500 milisec
                                await new Promise(resolve => setTimeout(resolve, 500));
                                handleClickOpenModalJadwal(nik)
                                setHariTambahEdit(hari)
                                setJamMulaiTambahEdit(jam_mulai)
                                setJamSelesaiTambahEdit(jam_selesai)
                                if(stat){
                                  setBukaJadwal(true)
                                }else{
                                  setBukaJadwal(false)
                                }
                                
                              }
                            }
                            bukaJadwal={
                              bukaJadwal
                            }
                            jam_mulainya={jamMulaiTambahEdit}
                            jam_selesainya={jamSelesaiTambahEdit}
                            hari_nya={hariTambahEdit}
                          />
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
              }
              <Box sx={{ padding: "5px" }}></Box>
              <Box textAlign="center">
                <Button variant="contained" onClick={handleCloseModalJadwal}>Close Jadwal</Button>
              </Box>
              <Box sx={{ padding: "10px" }}></Box>
            </Grid>
            <Grid item md={2}></Grid>
          </Grid>
        </Box>
      </Dialog>


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
            // await handleCloseModalEdit()
            beforeEditDokter()
          }
        }
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseModalEdit}>
          Edit Detail {isGet ? headerDialog : null}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ padding: "5px" }}></Box>
          {
            isGet ?
              <>
                <TextField
                  disabled

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
                  inputRef={namaInputRef}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  id="namaTextField"
                  label="Nama"
                  placeholder="Masukkan Nama"
                  sx={{ width: "85%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  required
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

              </>
              :
              <>
                <Box align="center">
                  <CircularProgress color="inherit" />
                </Box>
              </>
          }



          <Box sx={{ padding: "5px" }}></Box>



        </DialogContent>
        {
          isGet ?
            <>
              <DialogActions>

                <Button autoFocus variant="outlined" type='submit'>
                  Simpan Perubahan
                </Button>
              </DialogActions>
            </>
            : <></>
        }

      </BootstrapDialog>


      {props.dataDokterAll.map((row, index) => (
        <TableRow
          key={"tablerowdokter" + index}
        >
          <TableCell component="th" scope="row">
            {row.nik}
          </TableCell>
          <TableCell>{row.nama}</TableCell>
          <TableCell>{row.spesialis}</TableCell>
          <TableCell>{row.no_telp}</TableCell>
          <TableCell>{row.status}</TableCell>
          <TableCell>
            <IconButton size="small" color="primary" onClick={() => edit_dokter(row.nik)}>
              <ModeEditIcon />
            </IconButton>
            <IconButton size="small" color="success" onClick={
              () => { handleClickOpenModalJadwal(row.nik) }
            }>
              <EventAvailableIcon />
            </IconButton>
            <IconButton size="small" color="error">
              <DisabledByDefaultIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default TabelDokterAll;