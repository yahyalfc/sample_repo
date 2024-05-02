import { useEffect, useState } from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import MapStyles from "./mapStyle";
import CustomMarker from "./CustomMarker";

const MapContainer = (props) => {
  const [markers, setMarkers] = useState({});
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    props.inputCoords ? setInputCoords() : setPosition();
  }, []);

  useEffect(() => {
    setPosition(props.coords);
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

  const updateCoords = ({ latitude, longitude }) => {
    setCoords({ latitude, longitude });
    coordsToParent({ lat: latitude, lng: longitude });
  };

  return (
    <div style={{ ...props.mapStyle }}>
      {coords && (
        <MyMapComponent
          isMarkerShown
          style={props.style}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBt9I6muDiyEAJ9FhjaZBi6KTYdEU9wGVQ"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          coords={coords}
          updateCoords={updateCoords}
          onClick={() => setMarkers(markers.push(updateCoords))}
        />
      )
      }
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

export default MapContainer;

