import { useState, useEffect } from 'react'
import { makeStyles, Grid, Button } from '@material-ui/core'
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { location_service } from '../../../../utils/geolocation/reverse-geocoding';
import MapContainer from '../../../../components/MapContainer';
import { firebase_location_service } from '../../../../services/geofirestore/location_service';
import { useSelector } from 'react-redux'
import swal from 'sweetalert'

function AddNewSupplierLocation({ locationsArray, setLocationsArray, handleModalClose }) {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: theme.palette.background.paper,
      outline: "none",
      border: "none",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      minWidth: "60%",
      borderRadius: 3,
    },
  }));
  const classes = useStyles();
  const [coordinates, setCoordinates] = useState(null);
  const [customerLocation, setCustomerLocation] = useState("");
  const [customerLocationName, setCustomerLocationName] = useState("");
  //const [predictions, setPredictions] = useState("");
  //const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  const user = useSelector(state => state.user)
  const { id } = user

  useEffect(() => {
    setCustomerLocationName(customerLocation);
    //setPredictions([]);
  }, [customerLocation]);

  const AddNewLocation = async () => {
    const result = await firebase_location_service.AddNewSupplierLocation(id, coordinates, customerLocationName)
    setLocationsArray(locationsArray => [...locationsArray, { ...result }])
    swal({
      title: "Location Added Successfully",
      icon: "success",
      buttons: {
        Confirm: { text: "Okay", className: "okayButton" },
      },
    })
      .then((value) => {
        if (value == "Confirm") {
          handleModalClose()
        }
      })
  }

  const newSetLocation = async ({ lat, lng }) => {
    const locationName = await location_service.getAddressFromLocation(
      lat,
      lng
    );
    setCustomerLocation(locationName);
  };

  const coords = (res) => {
    setCoordinates(res);
    // setLoading(false);
  };

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

  return (
    <div className={classes.paper}>
      <Grid
        className="col-sm-12 col-md-12"
        style={{
          textAlign: "center",
          height: "60vh",
          minWidth: "50vw"
        }}
      >
        <h2>Add Location</h2>
        <MapContainer
          style={{
            left: "50%", top: "50%",
          }}
          mapStyle={{ height: "80%" }}
          coords={coordinates}
          coordsRes={(res) => {
            coords(res);
            newSetLocation(res);
          }}
        />
        <GooglePlacesAutocomplete
          apiKey="AIzaSyBt9I6muDiyEAJ9FhjaZBi6KTYdEU9wGVQ"
          selectProps={{
            placeholder: `${customerLocationName}`,
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
      <Grid container>
        <Grid item xs={12} md={4}></Grid>
        <Grid item xs={12} md={4} style={{ display: "flex", justifyContent: "center" }}>
          <Button fullWidth size="large" style={{ backgroundColor: '#42A5F5', color: 'white', marginTop: 10, alignSelf: "center" }} onClick={() => AddNewLocation()}>Done</Button>
        </Grid>
        <Grid item xs={12} md={4}></Grid>
      </Grid>
    </div>
  )
}

export default AddNewSupplierLocation
