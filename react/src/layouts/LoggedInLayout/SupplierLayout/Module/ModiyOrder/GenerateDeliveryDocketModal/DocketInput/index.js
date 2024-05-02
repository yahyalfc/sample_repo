import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import { makeStyles } from '@material-ui/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useSelector } from "react-redux";
import { firebase_location_service } from "../../../../../../../services/geofirestore/location_service";
import additives from '../../../../../../../static/additives'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "75vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "50px ",
    // padding: theme.spacing(5, 4, 5),
  },
}));

function DocketInput(props) {
  const user = useSelector(state => state.user)
  const [locationsArray, setlocationsArray] = useState([])
  const [allstate, setallstate] = useState({
    location: '',
    truckNo: '',
    selectedDate: Date.now(),
    loadVolume: '',
    batchedWater: '',
    slumpStandWater: '',
    additive: ''
  })
  const classes = useStyles();

  useEffect(() => {
    const values = props.getState('data')
    if (values) {
      setallstate({ ...values })
      //here we set initial values if user comes from next page
    }
  }, [])


  useEffect(() => {
    if (user) {
      (async () => {
        const result = await firebase_location_service.getSupplierLocation(user.id);
        //
        setlocationsArray(result)
      })();
    }
  }, [user])

  console.log({ LOCATIONARR: locationsArray });
  const handleChange = (e) => {
    setallstate({ ...allstate, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    props.setState("data", allstate);
    props.next()
  }

  return (
    <Grid
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 20,
        // width: "60%",
      }}
    >
      <Grid className={classes.paper} style={{
        width: "70%"
      }}>
        <Grid
          container
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p style={{ fontWeight: 'bold', color: "#42a5f5" }}>
            Delivery Docket
          </p>
          <form onSubmit={handleSubmit}>
            <Grid container style={{ marginTop: 20 }}>
              <Grid item md={4} style={{ marginTop: 20 }}>
                Plant
                </Grid>
              <Grid item md={8}>
                <Select
                  // style={style.select}
                  // style={{ marginLeft: 20 }}
                  variant="outlined"
                  name="location"
                  disableUnderLine
                  required
                  value={allstate.location}
                  onChange={handleChange}
                  fullWidth
                >
                  {locationsArray.map((value) => (
                    <MenuItem value={value.locationName}>{value.locationName}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Grid item md={4} style={{ marginTop: 20 }}>
                Truck No.
                </Grid>
              <Grid item md={8}>
                <TextField
                  fullWidth
                  label="Truck Number"
                  variant="outlined"
                  type="text"
                  name="truckNo"
                  onChange={handleChange}
                  value={allstate.truckNo}
                  required
                />
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Grid item md={4}>
                Date/Time Dispatched
                </Grid>
              <Grid item md={8}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk={true}
                    fullWidth
                    //style={style.selectDateTime}
                    disableToolbar
                    minDate={Date.now()}
                    variant="inline"
                    disabled={true}
                    format="dd/MM/yyyy"
                    placeholder={"Delivery Date"}
                    value={allstate.selectedDate}
                    //  onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Grid item md={4} style={{ marginTop: 17 }}>
                Volume this load
                  </Grid>
              <Grid item md={8}>
                <OutlinedInput
                  //  style={style.field}
                  type="text"
                  placeholder="Volume this load"
                  required={true}
                  value={allstate.loadVolume}
                  fullWidth
                  name="loadVolume"
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="start">m³</InputAdornment>
                  }
                />
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Grid item md={4} style={{ marginTop: 17 }}>
                Design water
                  </Grid>
              <Grid item md={8}>
                <OutlinedInput
                  //  style={style.field}
                  type="text"
                  label="Volume this load"
                  required={true}
                  value={props.orderX?.waterMix}
                  fullWidth
                  disabled={true}
                  endAdornment={
                    <InputAdornment position="start">L</InputAdornment>
                  }
                />
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Grid item md={4} style={{ marginTop: 17 }}>
                Batched water
                  </Grid>
              <Grid item md={8}>
                <OutlinedInput
                  //  style={style.field}
                  type="text"
                  label="Batched Water"
                  required={true}
                  value={allstate.batchedWater}
                  name="batchedWater"
                  onChange={handleChange}
                  fullWidth
                  endAdornment={
                    <InputAdornment position="start">L</InputAdornment>
                  }
                />
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Grid item md={4} style={{ marginTop: 17 }}>
                Slump stand water                  </Grid>
              <Grid item md={8}>
                <OutlinedInput
                  //  style={style.field}
                  type="text"
                  label="Slump Stand Water"
                  required={true}
                  value={allstate.slumpStandWater}
                  name="slumpStandWater"
                  onChange={handleChange}
                  fullWidth
                  endAdornment={
                    <InputAdornment position="start">L</InputAdornment>
                  }
                />
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Grid item md={4} style={{ marginTop: 17 }}>
                Additives                  </Grid>
              <Grid item md={8}>
                <Select
                  // style={style.select}
                  // style={{ marginLeft: 20 }}
                  variant="outlined"
                  name="location"
                  disableUnderLine
                  required
                  value={allstate.additive}
                  name="additive"
                  onChange={handleChange}
                  fullWidth
                >
                  {additives.map((value) => (
                    <MenuItem value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid container style={{ display: "flex", justifyContent: "center" }} >

              <Button style={{ backgroundColor: '#42a4f5', marginTop: 20, color: "white" }} type="submit">View Docket</Button>
            </Grid>
          </form>
        </Grid>
      </Grid >
    </Grid >
  )
}

export default DocketInput
