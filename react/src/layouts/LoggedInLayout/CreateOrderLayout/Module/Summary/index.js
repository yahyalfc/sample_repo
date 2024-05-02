import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useState, useEffect } from "react";
import { firebase_order_service } from "../../../../../services/firebase/order_service";
import style from "./style";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import swal from "sweetalert";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import LoaderButton from "../../../../../components/LoaderButton";
import { useSelector } from 'react-redux'
import { unit_service } from '../../../../../utils/convert/quantityUnit'
import { time_service } from "../../../../../utils/time/timeAndDate"
import { compute_service_data } from "../../../../../utils/convert/serviceName";
const _ = require("lodash");

function OrderSummary(props) {
  const order = props.getState('order')
  const services = useSelector(state => state.services)
  const { locationName, serviceID, quantity, deliveryDate, deliveryTime, price } = order;
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingPlace, setloadingPlace] = useState(false);
  const serviceName = compute_service_data.computeServiceName(serviceID, services)
  const munit = unit_service.convertStatus(serviceName)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const placeOrder = async () => {
    setloadingPlace(true);
    const orderDate = time_service.returnDate()
    const orderTime = time_service.returnTime()

    if (order) {
      const result = await firebase_order_service.createOrder({ ...order, orderDate, orderTime });

      if (result) {
        setloadingPlace(false);
        props.next();
      }
    }
  };

  const handleDelete = () => {
    swal({
      title: "Delete Order",
      text: "Are you sure?",
      icon: "error",
      buttons: {
        Confirm: { text: "Yes", className: "okayButton" },
        Cancel: { text: "No", className: "cancelButton" },
      },
    })
      .then((value) => {
        if (value == "Confirm") {
          setLoadingDelete(true);
          window.location.href = "/app/dashboard";
        }
      })
      .finally(setLoadingDelete(false));
  };

  return (
    <Grid style={{ height: "100vh" }}>
      <div style={{ display: !!order ? "" : "none" }}>
        <Grid container style={{ padding: "0px 20px" }}>
          <Grid item xs={12} md={4} style={style.titleGrid}>
            <ArrowBackIosIcon onClick={() => props.prev()} style={style.icon} />
            <Typography variant="h5" style={{ color: "GrayText" }}>
              Order Summary
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}></Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={6} style={style.mainGrid}>
            <Grid item xs={12} md={7} style={{ textAlign: "left" }}>
              <Grid Grid style={style.divMarginB}>
                <p style={style.pValue}>Location</p>
                <Grid style={style.divValue}>
                  <p style={style.pProp}>{locationName}</p>
                </Grid>
              </Grid>
              <Grid style={style.divMarginB}>
                <p style={style.pValue}>Product</p>
                <Grid style={style.divValue}>
                  <p style={style.pProp}>{serviceName}</p>
                </Grid>
              </Grid>
              {
                order.productType ?
                  <Grid style={style.divMarginB}>
                    <p style={style.pValue}>Product Type</p>
                    <Grid style={style.divValue}>
                      <p style={style.pProp}>{order.productType}</p>
                    </Grid>
                  </Grid>
                  : ''
              }
              <Grid Grid style={style.divMarginB}>
                <p style={style.pValue}>Quantity</p>
                <Grid style={style.divValue}>
                  <p style={style.pProp}>{quantity} {" "} {munit}</p>
                </Grid>
              </Grid>
              <Grid style={style.divMarginB}>
                <p style={style.pValue}>Delivery Date/Time</p>
                <Grid style={style.divValue}>
                  <p style={style.pProp}>
                    {deliveryDate} {deliveryTime}
                  </p>
                </Grid>
              </Grid>
            </Grid>
            {/* ///////////////////// */}
            <Grid
              item
              xs={12}
              md={7}
              style={{ textAlign: "right", position: "relative" }}
            >
              <Grid style={style.GridBtnDel}>
                <Grid>
                  <LoaderButton
                    isLoading={loadingDelete}
                    loadingProps={{
                      size: 24,
                      style: { color: "white" },
                    }}
                    endIcon={<ClearIcon />}
                    onClick={handleDelete}
                    style={style.btnDelete}
                  >
                    Delete
                  </LoaderButton>
                </Grid>

                <Grid style={style.divEstimatePosition}>
                  <Box>
                    <p style={style.pEstimateCost}>Estimated Cost</p>
                    <Box style={style.divValue}>
                      <p style={style.pProp}>${price.toFixed(2)} </p>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={6} style={style.placeOrderGrid}>
            <Grid item xs={12} md={8}>
              <strong>
                <p style={style.pEstimateCostValue}>
                  Estimated Cost :{" "}
                  <span style={{ color: "gray" }}>$ {price.toFixed(2)}</span>
                </p>
              </strong>
            </Grid>
            <Grid style={style.divAlignRight} item xs={12} md={4}>
              <LoaderButton
                isLoading={loadingPlace}
                loadingProps={{
                  size: 24,
                  style: { color: "white" },
                }}
                endIcon={<CheckIcon />}
                onClick={() => {
                  placeOrder();
                }}
                className="placeOrderButton"
                style={style.btnPlaceOrder}
              >
                Place Order
              </LoaderButton>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}></Grid>
        </Grid>
      </div>
    </Grid>
  );
}

export default OrderSummary;
