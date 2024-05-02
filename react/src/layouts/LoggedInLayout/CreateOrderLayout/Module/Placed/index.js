import { Box, Button, Grid, Typography } from "@material-ui/core";
import style from "./style";
import { useSelector } from 'react-redux'
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { unit_service } from '../../../../../utils/convert/quantityUnit'
import { compute_service_data } from "../../../../../utils/convert/serviceName";

function OrderPlaced(props) {
  const order = props.getState("order");
  const services = useSelector(state => state.services)
  const { serviceID, quantity, price } = order;
  const serviceName = compute_service_data.computeServiceName(serviceID, services)
  const munit = unit_service.convertStatus(serviceName)

  return (
    <Grid style={{ minHeight: "100vh" }}>
      <div style={{ display: !!order ? "" : "none" }}>
        <Grid container style={{ padding: "0px 20px" }}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4} style={style.titleGrid}>
            <p style={style.ordersplaced}>Order Placed</p>
          </Grid>
          <Grid item xs={12} md={4}></Grid>
          <Grid container style={{ textAlign: "center" }}>
            <Grid item xs={12} md={4}></Grid>
            <Grid item xs={12} md={4}>
              <Box style={style.centertext}>
                The team at Klinker are working hard to fulfull your order as
                soon as possible.
                <br />
                <br />
                We will notify you when your order is confirmed. You can view
                your order status by going to my orders below.
              </Box>
            </Grid>
            <Grid item xs={12} md={4}></Grid>
          </Grid>

          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            <Grid
              container
              item
              xs={12}
              md={6}
              style={style.orderplacedcontainer}
            >
              <Grid item xs={12} md={12}>
                <Typography style={style.heading}>
                  {serviceName}
                </Typography>
                <Typography style={style.textcatagory}>
                  Quantity :{" "}
                  <span style={{ color: "gray", fontWeight: 500 }}>
                    {" "}
                    {quantity}{" "}{munit}
                  </span>
                </Typography>
                <Typography style={style.textcatagory}>
                  Price :{" "}
                  <span style={{ color: "gray", fontWeight: 500 }}>
                    {" "}
                    $ {price}
                  </span>
                </Typography>
                <Grid
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                      window.location.href = "/app/dashboard";
                    }}
                    style={style.Button}
                  >
                    Go to Home
                  </Button>
                  <Button
                    onClick={() => {
                      window.location.href = "/app/customer/order";
                    }}
                    style={style.Button}
                  >
                    My Orders
                  </Button>
                </Grid>
              </Grid>
              {/* </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}

export default OrderPlaced;
