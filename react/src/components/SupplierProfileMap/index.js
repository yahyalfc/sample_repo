import { useEffect, useState } from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import MapStyles from "./mapStyle";
import CustomMarker from "../MapContainer/CustomMarker";
import style from "./style";
import { Button, Grid, InputAdornment, OutlinedInput } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { location_service } from '../../utils/geolocation/reverse-geocoding'
import swal from "sweetalert";
import DeleteIcon from '@material-ui/icons/Delete';
import { firebase_location_service } from "../../services/geofirestore/location_service";

const SupplierProfileMap = (props) => {
  const [markers, setMarkers] = useState({});
  const [coords, setCoords] = useState(null);
  const [didChange, setDidChange] = useState(false);
  const [showmap, setShowmap] = useState(false);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    props.inputCoords ? setInputCoords() : setPosition();

  }, []);

  useEffect(() => {
    setPosition(props.coords);
    newSetLocation({ lat: props.coords.lat, lng: props.coords.lng })
  }, [props.coords?.lat, props.coords?.lng]);

  const coordsToParent = (res) => {
    props.coordsRes(res);
  };

  const setInputCoords = () => {
    setCoords(props.inputCoords);
    const { inputCoords } = props;

    coordsToParent({
      lat: inputCoords.location?.lat
        ? inputCoords.location.lat
        : inputCoords.latitude,
      lng: inputCoords.location?.lng
        ? inputCoords.location.lng
        : inputCoords.longitude,
    });
  };

  const setPosition = (coordinates) => {
    if (coordinates) {
      setCoords({
        // object that we want to update
        ...coords, // keep all other key-value pairs
        latitude: coordinates.lat,
        longitude: coordinates.lng, // update the value of specific key
      });
      coordsToParent({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords(position.coords);
        coordsToParent({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  const newSetLocation = async ({ lat, lng }) => {
    const locationName = await location_service.getAddressFromLocation(
      lat,
      lng
    );
    setLocationName(locationName);
  };

  const updateCoords = ({ latitude, longitude }) => {
    setCoords({ latitude, longitude });

    newSetLocation({ lat: latitude, lng: longitude })
    setDidChange(true);
    //coordsToParent({ lat: latitude, lng: longitude });
  };

  const submitCoords = () => {
    coordsToParent({ lat: coords.latitude, lng: coords.longitude });
    swal({
      title: "Location Changed",
      icon: "success",
      buttons: {
        Confirm: { text: "Okay", className: "okayButton" },
      },
    })
      .then((value) => {
        if (value == "Confirm") {
          setDidChange(false);
        }
      })
  };
  const showMap = () => {
    const { mapHeight, setMapHeight, index, setIndexValue, indexValue } = props;
    setShowmap(!showmap);
    setMapHeight(!mapHeight);
    setIndexValue(index);
  };

  const deleteEntry = async () => {
    const { location, locationsArray, setLocationsArray } = props;
    const res = await firebase_location_service.deleteSupplierLocation(location.id)
    if (res) {
      const array = locationsArray.filter((loc) => loc.id !== location.id)
      setLocationsArray(array)
      swal({
        title: "Location Deleted",
        icon: "success",
        buttons: {
          Confirm: { text: "Okay", className: "okayButton" },
        },
      })
    }
  }

  return (
    <div
      style={{
        height: showmap ? "50vh" : "10vh",
        marginBottom: showmap ? 95 : 15,
      }}
    >
      <OutlinedInput
        style={{ color: 'black' }}
        disabled
        fullWidth
        placeholder={locationName}
        endAdornment={
          <>
            <InputAdornment>
              <DeleteIcon onClick={() => deleteEntry()} style={{ color: 'red' }} />
            </InputAdornment>
            <InputAdornment>
              {showmap ? (
                <ExpandLess style={style.Icon} onClick={() => showMap()} />
              ) : (
                <ExpandMore onClick={() => showMap()} style={style.Icon} />
              )}
            </InputAdornment>

          </>
        }
      ></OutlinedInput>
      {showmap
        ? coords && (
          <>
            <MyMapComponent
              isMarkerShown
              style={props.style}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              coords={coords}
              updateCoords={updateCoords}
              onClick={() => setMarkers(markers.push(updateCoords))}
            />
            {didChange ? (
              <Grid container>
                <Grid item xs={4} md={4}></Grid>

                <Grid item xs={4} md={4}>
                  {" "}
                  <Button
                    fullWidth
                    style={{
                      backgroundColor: "#42A5F5",
                      color: "white",
                      marginTop: 10,
                    }}
                    onClick={() => submitCoords()}
                  >
                    Submit
                    </Button>
                </Grid>

                <Grid item xs={4} md={4}></Grid>
              </Grid>
            ) : (
              ""
            )}
          </>
        )
        : ""}
    </div>
  );
};

const defaultMapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
};

let _mapRef;
const MyMapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      onCenterChanged={() => {
        props.updateCoords({
          latitude: _mapRef.getCenter().lat(),
          longitude: _mapRef.getCenter().lng(),
        });
      }}
      onDragEnd={() => {
        props.updateCoords({
          latitude: _mapRef.getCenter().lat(),
          longitude: _mapRef.getCenter().lng(),
        });
      }}
      ref={(ref) => (_mapRef = ref)}
      defaultZoom={14}
      options={defaultMapOptions}
      fullscreenControl={false}
      defaultOptions={{ styles: MapStyles }}
      center={{
        lat: props.coords.latitude
          ? props.coords.latitude
          : props.coords.location.lat,
        lng: props.coords.longitude
          ? props.coords.longitude
          : props.coords.location.lng,
      }}
      onClick={(position) => {
        props.updateCoords({
          latitude: position.latLng.lat(),
          longitude: position.latLng.lng(),
        });
      }}
    >
      {props.isMarkerShown && (
        <CustomMarker
          style={props.style}
          lat={11.0168}
          lng={76.9558}
          name="myMarker"
          color="#42A5F5"
        />
      )}
    </GoogleMap>
  ))
);

export default SupplierProfileMap;
