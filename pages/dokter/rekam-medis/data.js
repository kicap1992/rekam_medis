import { useRouter } from 'next/router'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import AppBarDokter from '../../../components/dokter/appBar';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Post = () => {
  const router = useRouter() // ini untuk get query dari url


  
  
  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarDokter />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={2}>
            <Grid item xs={12} md={7} >
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }}>
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
                  id="namaPasienTextField"
                  label="Nama Pasien"
                  placeholder="Masukkan Nama Pasien"
                  sx={{ width: "90%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
                  id="tanggalPeriksaTextField"
                  label="Tanggal Periksa"
                  placeholder="Masukkan Tanggal Periksa"
                  sx={{ width: "90%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <TextField
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
                  id="diagnosaTextField"
                  label="Diagnosa"
                  placeholder="Masukkan Diagnosa"
                  multiline
                  rows={6}
                  // maxRows={6}
                  sx={{ width: "90%", boxShadow: 10 }}
                />
                <Box sx={{ padding: "10px" }}></Box>
                <Box textAlign="center">
                  <Button variant="contained">Tambah</Button>
                </Box>
                <Box sx={{ padding: "10px" }}></Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card component="form" align="center" sx={{ margin: "auto", maxWidth: "100%", minHeight: 210, boxShadow: 10 }}>
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: '3%',
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "silver",
                }}> List Tindakan</Typography>
                
                <Box sx={{ padding: "5px" }}></Box>
                <Box textAlign="center">
                  <Button variant="contained">Cetak</Button>
                </Box>
                <Box sx={{ padding: "10px" }}></Box>
              </Card>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </div>
  );
}


// ini untuk get query dari url
Post.getInitialProps = async ({ query }) => {
  // console.log(query)
  return {query }
}

export default Post