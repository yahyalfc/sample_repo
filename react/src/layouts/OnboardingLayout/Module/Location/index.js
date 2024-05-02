import { useEffect, useState } from "react";
import "firebase/firestore";
import MapContainer from "../../../../components/MapContainer";
import SelectLocationSuccess from "./SelectLocationSuccess";
import style from "./style";
import { location_service } from "../../../../utils/geolocation/reverse-geocoding";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { firebase_user_services } from "../../../../services/firebase/firebase_user";
import { firebase_location_service } from "../../../../services/geofirestore/location_service";
import MapSkeletonLocation from "./MapSkeletonLocation/index.js";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useDispatch } from 'react-redux'
import { setUser } from "../../../../redux/actions";
import { firebase_product_service } from "../../../../services/firebase/product_service";
import swal from "sweetalert";

const EnterLocation = (props) => {
  const [coordinates, setCoordinates] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerLocation, setCustomerLocation] = useState("");
  const [customerLocationName, setCustomerLocationName] = useState("");
  //const [predictions, setPredictions] = useState("");
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  const dispatch = useDispatch()
  const [disableButton, setDisabledButton] = useState(false)

  useEffect(() => {
    setCustomerLocationName(customerLocation);
    // setPredictions([]);
  }, [customerLocation]);

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

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const newSetLocation = async ({ lat, lng }) => {
    const locationName = await location_service.getAddressFromLocation(
      lat,
      lng
    );
    setCustomerLocation(locationName);
  };


  const coords = (res) => {
    setCoordinates(res);
    setLoading(false);
  };

  const proceed = async () => {
    setDisabledButton(true);

    let data = props.getState("data");
    const { id } = data
    try {
      const result = await firebase_user_services.updateUserData(id, data);
      if (result.status) {
        dispatch(setUser(result.user))
        // save coordinates to supplierGeoFirestore
        if (coordinates) {
          const res = await firebase_location_service.AddNewSupplierLocation(id, coordinates, customerLocation)

          if (res) {
            const enteries = await firebase_product_service.extraItems()
            const finished = await firebase_product_service.addExtraItems(enteries, id)

            if (finished) {
              swal({
                title: "SignUp Successful",
                icon: "success",
                buttons: {
                  Confirm: { text: "Okay", className: "okayButton" },
                },
              })
                .then((value) => {
                  if (value == "Confirm") {
                    window.location.href = "/app/dashboard";
                  }
                })
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    //sweet alert open hona chaiye yahaan instead of a modal
    // setShowSuccess(true);
  };

  return (
    <>
      {/* <Grid className="col-sm-12 col-md-12"> */}
      <Grid xs={6} md={12} style={style.div1}>
        <h5 style={{ color: "gray", fontSize: 18 }}>Please Select Location</h5>
        <Box width="100%" ml={2.5}>
          <GooglePlacesAutocomplete
            apiKey="AIzaSyBt9I6muDiyEAJ9FhjaZBi6KTYdEU9wGVQ"
            selectProps={{
              placeholder: "Start typing to search..",
              value,
              onChange: setValue,
            }}
            autocompletionRequest={{
              componentRestrictions: {
                country: ['aus'],
              }
            }}
          />
        </Box>
        <Button onClick={proceed} disabled={disableButton} className="btn" style={style.color}>
          Proceed
        </Button>
      </Grid>
      {/* </Grid> */}

      <div style={{ display: loading ? "" : "none" }}>
        <MapSkeletonLocation />
      </div>

      <Grid
        className="col-sm-12 col-md-12"
        style={{ ...style.div3, display: loading ? "none" : "" }}
      >
        <MapContainer
          mapStyle={{ height: "100vh" }}
          style={{ left: "50%", top: "50%" }}
          coords={coordinates}
          coordsRes={(res) => {
            coords(res);
            newSetLocation(res);
          }}
        />
      </Grid>

      <SelectLocationSuccess
        showSuccess={showSuccess}
        handleCloseSuccess={handleCloseSuccess}
      />
    </>
  );
};

export default EnterLocation;
