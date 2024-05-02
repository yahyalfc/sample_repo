import { useState, useEffect } from "react";
import MapContainer from "../../../../../components/MapContainer";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { location_service } from "../../../../../utils/geolocation/reverse-geocoding";
import DateFnsUtils from "@date-io/date-fns";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import style from "./style";
import "./index.css";
import SkeletonOrderPlacementMap from "./SkeletonOrderPlacementMap";
import { useSelector } from 'react-redux'
import { compute_service_data } from "../../../../../utils/convert/serviceName";

function OrderPlacement(props) {
  const services = useSelector(state => state.services)
  const [deliveryDate, setDeliveryDate] = useState(Date.now());
  const [deliveryTime, setDeliveryTime] = useState("10:00 AM");
  const [selectedDate, setSelectedDate] = useState(Date.now());
  const [selectedTime, setSelectedTime] = useState("");
  const [anyTime, setAnyTime] = useState(false);
  //to make the google maps fucking shit work
  const [value, setValue] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [inputCoords, setInputCoords] = useState(null)
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);

  // If we have selected values previously then set to that again. 
  useEffect(() => {
    const selection = props.getState('secondary')
    if (selection) {
      setSelectedDate(selection.selectedDate)
      setSelectedTime(selection.selectedTime)
      setDeliveryTime(selection.deliveryTime)
      setDeliveryDate(selection.deliveryDate)
      setCoordinates(selection.coordinates)
      setInputCoords(selection.coordinates)
      setLocationName(selection.locationName)
    } else {
      // we set todays date
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;
      setDeliveryDate(today)
      setInputCoords(coordinates)
      setCoordinates(coordinates)
    }
  }, [])

  const selection = props.getState('selection')
  const serviceName = compute_service_data.computeServiceName(selection.serviceID, services)

  // google map predictions thing
  useEffect(() => {
    if (value) {
      (async () => {
        const details = await location_service.getLocationDetails(
          value.value.place_id
        );
        const geometrylocation = details.result.geometry.location;
        setCoordinates({
          ...coordinates,
          lat: geometrylocation.lat,
          lng: geometrylocation.lng,
        });
      })();
    }
  }, [value]);

  // Any Time selected then we set delivery Time to null
  useEffect(() => {
    if (anyTime) {
      setDeliveryTime(null);
    }
  }, [anyTime]);

  // Setting Any time
  const changeHandler = (event) => {
    if (event.target.name == "anyTime") {
      setAnyTime(!anyTime);
    }
  };

  //Setting Date From MUI Date picker
  const handleDateChange = (formatdate, date) => {
    setSelectedDate(formatdate);
    setDeliveryDate(date);
  };

  // Setting Time from Time picker
  const handleTimeChange = (formattime, time) => {
    setSelectedTime(formattime);
    setDeliveryTime(time);
  };

  //Setting Coordinates when we drag around
  const coords = (res) => {
    setCoordinates(res);
    setInputCoords(res)
    setLoading(false);
  };

  //Setting Site Location
  const newSetLocation = async ({ lat, lng }) => {
    const locationName = await location_service.getAddressFromLocation(
      lat,
      lng
    );
    setLocationName(locationName);
  };

  const handleSubmit = () => {
    if (deliveryDate && locationName && coordinates) {
      if (deliveryTime === null) {
        props.setState('secondary', { selectedDate, selectedTime: '', deliveryTime, deliveryDate, locationName, coordinates })
        props.next()
      }
      else {
        props.setState('secondary', { selectedDate, selectedTime, deliveryTime, deliveryDate, locationName, coordinates })
        props.next()
      }
    }
  }

  return (
    <div>
      <Grid container>
        <Grid container style={{ margin: 30 }}>
          <Grid item xs={12} md={1} style={{ textAlign: "right" }}>
            <ArrowBackIosIcon onClick={() => props.prev()} style={style.icon} />
          </Grid>
          <Grid item xs={12} md={3} style={style.orderPlacementTittle}>
            <h2 style={{ color: "GrayText" }}>{props.title}</h2>
          </Grid>
          <Grid item xs={12} md={9}></Grid>
        </Grid>
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginLeft: 50,
            marginRight: 50,
          }}
        >
          <Grid item xs={10} md={5}>
            <form onSubmit={handleSubmit}>
              <Grid container style={style.inputFieldStyle}>
                <Grid item xs={10} md={9}>
                  <Typography style={{ margin: 0 }}>Delivery Date</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={10}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      autoOk={true}
                      style={style.selectDateTime}
                      disableToolbar
                      minDate={Date.now()}
                      variant="inline"
                      format="dd/MM/yyyy"
                      placeholder={"Delivery Date"}
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
              <Grid container style={style.inputFieldStyle}>
                <Grid item xs={10} md={9}>
                  {
                    serviceName === 'Premix Concrete' ?
                      <Typography Typography > Delivery Time</Typography>
                      : ''
                  }
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={10}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {
                    serviceName == 'Premix Concrete' ?
                      <>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            style={style.selectDateTime}
                            disabled={anyTime}
                            minutesStep={15}
                            id="time-picker"
                            placeholder={"10:00 PM"}
                            value={selectedTime}
                            onChange={handleTimeChange}
                            KeyboardButtonProps={{
                              "aria-label": "change time",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                        <FormGroup
                          style={{
                            display: "flex",
                            alignSelf: "flex-end",
                          }}
                        >
                          <FormControlLabel
                            name="anyTime"
                            checked={anyTime}
                            onChange={changeHandler}
                            control={
                              <Checkbox
                                color="primary"
                                style={{ margin: 0, padding: 0 }}
                              />
                            }
                            label="Any Time"
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </>
                      : ''
                  }
                  <Grid container style={style.inputFieldStyle}>
                    <Grid item xs={10} md={9}>
                      <Typography style={{ margin: 0 }}>Site Location</Typography>
                    </Grid>
                    <TextField id="outlined-basic" variant="outlined" multiline={true} value={locationName} />
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Grid>
          {/* //////////////////////////////////////// */}

          <Grid xs={10} md={5} style={{ marginTop: 20 }}>
            <div>
              <p style={{ color: 'gray', fontWeight: 'bold' }}>Enter Delivery Address</p>
            </div>
            <div style={{ display: loading ? "" : "none" }}>
              <SkeletonOrderPlacementMap />
            </div>
            <Grid
              item
              md={12}
              xs={12}
              style={{
                marginBottom: 20,
                // marginLeft: 10,
                position: "relative",
                display: loading ? "none" : "",
              }}
            >

              <MapContainer
                mapStyle={{ height: "50vh" }}
                style={{ left: "45%", top: "40%" }}
                coords={coordinates}
                coordsRes={(res) => {
                  // setCoordinates(res);
                  coords(res);
                  newSetLocation(res);
                }}
                inputCoords={inputCoords}
              />

              <Grid item xs={12} md={12}>
                <GooglePlacesAutocomplete
                  apiKey="AIzaSyBt9I6muDiyEAJ9FhjaZBi6KTYdEU9wGVQ"
                  selectProps={{
                    styles: {
                      input: (provided) => ({
                        ...provided,
                        paddingTop: 10,
                        paddingBottom: 10,
                      }),
                    },
                    placeholder: 'Enter Location...',
                    value,
                    onChange: setValue,
                  }}
                  autocompletionRequest={{
                    componentRestrictions: {
                      country: ['aus'],
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={3} md={4}></Grid>
        <Grid xs={6} md={4}>
          <Grid md={2}></Grid>
          <Grid md={10}>
            <Button fullWidth onClick={handleSubmit} style={style.nextButton}>
              <Typography>Next</Typography>
            </Button>
          </Grid>
          {/* <Grid md={1}></Grid> */}
        </Grid>
        <Grid xs={3} md={4}></Grid>
      </Grid>
    </div >
  );
}

export default OrderPlacement;
