import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// button icon
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
// import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function TabelJadwalDokter(props) {

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
              props.add(props.harinya[i])
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
                  props.edit(props.harinya[i], props.dataJadwal[j].jam_mulai, props.dataJadwal[j].jam_selesai)
                }
              }
            >
              <ModeEditIcon />
            </IconButton>
            <IconButton color="error"
              onClick={
                () => {
                  props.delete(props.harinya[i])
                }
              }
            >
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
      {component}
    </>
  )

}

export default TabelJadwalDokter