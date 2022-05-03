import {forwardRef} from 'react'
import { Divider } from "@mui/material"
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// this is for number format
import NumberFormat from 'react-number-format';

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


function RekamMedisSelectedObat(props) {
  const url = process.env.HTTP_URL + "/api/dokter";
  async function cek_obat(jumlah ,id){
    try{
      let urlnya= url + "/cek_obat?id="+id;
      const response = await fetch(urlnya, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        },
      })

      const data = await response.json();
      let jumlahnya =  data.data.jumlah;
      let hitung = jumlahnya - jumlah;

      if(response.status == 200){
        if(hitung >= 0){
          return true;
        }else{
          props.errornya("Jumlah Obat Tidak Mencukupi");
          return false;
        }
      }else{
        return false;
      }
    }catch(error){
      console.log(error);
      return false;
    }
  }

  if (props.obat.length == 0) {
    return (
      <div>
        <Divider />
        <div style={{ marginTop: 20 }}>
          <p>Tidak ada obat yang dipilih</p>
        </div>
      </div>
    )
  } else {

    let data = []
    for (let i = 0; i < props.obat.length; i++) {
      // push to data id = props.obat[i].split('-')[0] and jumlah = null
      data.push({
        id: props.obat[i].split('-')[0],
        jumlah: null
      })
    }

    let divider =<Divider key="hehe" />
    let box = <Box sx={{ padding: "10px" }} key="haha"></Box>
    let component = []
    component.push(divider)
    component.push(box)
    for (let i = 0; i < props.obat.length; i++) {
      component.push(
        <div key={i}>
          <TextField
            id={props.obat[i].id_obat + "TextField"}
            label={"Jumlah " + props.obat[i].split("-")[1]}
            placeholder={"Masukkan Jumlah " + props.obat[i].split("-")[1]}
            sx={{ width: "90%", boxShadow: 10 }}
            onChange={(e) => {
              data[i].jumlah = e.target.value
              cek_obat(e.target.value, props.obat[i].split("-")[0])

              props.datanya(data)
            }}
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: {
                maxLength: 3,
                minLength: 1,
              }
            }}
          />
          <Box sx={{ padding: "10px" }}></Box>
        </div>
      )
    }

    return (
      <>
        {component}
      </>
    )
  }
}

export default RekamMedisSelectedObat