import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import style from "./style";

export default class MapContainer extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      isMarkerShown: false,
      markers: {},
      coords: null,
    };
  }

  componentDidMount() {
    this.setState({
      coords: this.props.coords,
    });
  }

  render() {
    const { coords } = this.state;

    return (
      <div style={style.divMapComponent}>
        {coords && (
          <MyMapComponent
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBt9I6muDiyEAJ9FhjaZBi6KTYdEU9wGVQ"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            coords={coords}
            updateCoords={this.updateCoords}
          />
        )}
      </div>
    );
  }
}

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{
        lat: props.coords.latitude,
        lng: props.coords.longitude,
      }}
    >
      {props.isMarkerShown && (
        <Marker
          position={{ lat: props.coords.latitude, lng: props.coords.longitude }}
        />
      )}
    </GoogleMap>
  ))
);
