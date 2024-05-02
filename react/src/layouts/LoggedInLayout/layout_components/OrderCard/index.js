import { useState, useEffect } from "react";
import MapContainer from "../../../../components/SearchMap";
import style from "./style";
import { location_service } from "../../../../utils/geolocation/reverse-geocoding";
import { distance_service } from "../../../../utils/geolocation/calculate-distance";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";

function OrderCard(props) {
  // In props we are getting two objects. 'data' contains all the data customer input and 'supplierdata' contains the object from geofirestore which contains supplierID
  const [distance, setDistance] = useState(0);
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState(0);
  //ComponentDidMount
  useEffect(async () => {
    const { getDistanceBetweenTwoPoints } = distance_service;
    const { getAddressFromLocation } = location_service;
    const { productdata, orderdata } = props;
    const { suppliercoordinates } = productdata;
    const { coordinates } = orderdata;
    let distance = await getDistanceBetweenTwoPoints(
      suppliercoordinates,
      coordinates
    );
    const { lat, lng } = suppliercoordinates;
    let address = await getAddressFromLocation(lat, lng);
    setAddress(address);
    setDistance(distance / 1000);
  }, []);

  // Runs when distance is calculated
  useEffect(() => {
    try {
      //Cost estimation service. We need three totals
      const { productdata, orderdata } = props;
      const { quantities, shortfall } = productdata;
      const { quantity } = orderdata;
      //find range in which our quantity lies. then we multiply itss price to our quantity
      const range = quantities.find(
        ({ minQuantity, maxQuantity }) =>
          Number(quantity) <= Number(maxQuantity) &&
          Number(quantity) >= Number(minQuantity)
      );
      //Total1 - Find the range in which our entered quantity lies and then multiply the price of the range to quantity entered in order placement.
      let total = 0;
      if (range) {
        total += range.price * quantity;
      }
      // Total2 - If our quantity entered is less than the threshold we multiply the difference with shortfall price.
      const { threshold, price } = shortfall;
      if (quantity < threshold) {
        total += (threshold - quantity) * price;
      }
      //TOTAL 3: If distance is greater than 20km then multiply by quantity * 1.5
      if (distance && distance > 20) {
        total += (distance - 20) * quantity * 1.5;
      }
      setPrice(total);
    } catch (err) {
      console.log(err);
    }
  }, [distance]);

  const { productdata } = props;
  const {
    supplierID,
    name,
    suppliercoordinates,
    supplierEmail,
    supplierPhone,
    supplierMobile,
    supplierName,
    businessName,
    title,
    description,
    waterMix,
  } = productdata;

  const { lat, lng } = suppliercoordinates;

  const submitOrder = () => {
    props.onSelect({
      price,
      waterMix,
      supplierMobile,
      supplierName,
      supplierID,
      supplierEmail,
      supplierPhone,
      businessName,
    });
  };

  return (
    <Grid key={supplierID}>
      <Grid
        container
        style={{
          borderRadius: 10,
          borderLeftColor: "#42a5f5",
          borderLeftStyle: "solid",
          borderLeftWidth: 10,
          paddingBottom: 10,
          marginLeft: -10,
          paddingRight: 20,
          boxShadow: " 0 0 17px -5px #9E9E9E",
          marginBottom: 30,
        }}
      >
        <Grid item xs={12} md={8}>
          <Box style={{ margin: 10 }}>
            <p style={style.pUser}>
              <b>{name}</b>
            </p>
          </Box>
          <Box style={style.divMarginB}>
            <p style={style.pHeading}>Business Name</p>
            <Box style={style.divlocation}>
              <p style={style.pContent}>{businessName}</p>
            </Box>
          </Box>
          {
            title ? <Box style={style.divMarginB}>
              <p style={style.pEstimateCost}>Product Title</p>
              <Box style={style.divlocation}>
                <p style={style.pLocation}>{title}</p>
              </Box>
            </Box> : ''
          }
          {
            description ?
              <Box style={style.divMarginB}>
                <p style={style.pEstimateCost}>Product Description</p>
                <Box style={style.divlocation}>
                  <p style={style.pLocation}>{description}</p>
                </Box>
              </Box>
              : ''}
          <Box style={style.divMarginB}>
            <p style={style.pEstimateCost}>Estimated Cost</p>
            <Box style={style.divlocation}>
              <p style={style.pLocation}>$ {price.toFixed(2)}</p>
            </Box>
          </Box>
          <Box style={style.divMarginB}>
            <p style={style.pEstimateCost}>Distance</p>
            <Box style={style.divlocation}>
              <p style={style.pLocation}>{distance} km</p>
            </Box>
          </Box>

          <Box style={style.divMarginB}>
            <p style={style.pEstimateCost}>Business Address</p>
            <Box style={style.divlocation}>
              <p style={style.pLocation}>{address}</p>
            </Box>
          </Box>
          <Box style={style.divMarginB}>
            <p style={style.pEstimateCost}>Supplier Rating</p>
            <Box style={style.divlocation}>
              <p style={style.pLocation}>DummyVal</p>
            </Box>
          </Box>

        </Grid>

        <Grid item xs={12} md={4}>
          <Grid style={style.divMarginB}></Grid>
          <Grid style={style.divLink}>
            <Button style={style.linkStyle} onClick={() => submitOrder()}>
              Select
            </Button>
            <Grid style={style.divMargin}></Grid>
            <Grid style={style.divAlignRight}>
              <MapContainer
                inputCoords={{
                  latitude: lat,
                  longitude: lng,
                }}
                coords={{
                  latitude: lat,
                  longitude: lng,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default OrderCard;
