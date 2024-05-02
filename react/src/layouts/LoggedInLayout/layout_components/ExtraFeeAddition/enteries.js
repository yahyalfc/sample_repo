import { InputAdornment, TableBody, TableCell, TableRow, TextField } from '@material-ui/core'

function Enteries({ entry, sNo, enteries, setEnteries }) {

  const myChangeHandler = (e) => {
    const updatedenteries = enteries.map((x) =>
      x.itemID == e.target.name ? { ...x, price: e.target.value } : x
    );
    setEnteries(updatedenteries)
  }

  return (
    <TableBody>
      <TableRow>
        <TableCell style={{ textAlign: "center" }}>{sNo}</TableCell>
        <TableCell style={{ textAlign: "center" }}>{entry.itemName}</TableCell>
        <TableCell style={{ textAlign: "center", width: 140 }}>
          <TextField
            required
            variant="standard"
            InputProps={{
              startAdornment: <InputAdornment style={{ color: 'red' }} position="start">$</InputAdornment>,
            }}
            value={entry.price}
            name={entry.itemID}
            onChange={(e) => { myChangeHandler(e) }}
          />
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>{entry.UOM = entry.UOM ? entry.UOM : 'm³'}</TableCell>
      </TableRow>
    </TableBody>
  )
}

export default Enteries
