import {
  Grid,
  makeStyles,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { unit_service } from "../../../../../../utils/convert/quantityUnit";
import { compute_service_data } from "../../../../../../utils/convert/serviceName";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "75vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #fff",
    boxShadow: theme.shadows[5],
    padding: "20px ",
    overflowY: "scroll",
    height: "100%",
  },
}));

function Invoice(props) {
  const services = useSelector(state => state.services)
  const classes = useStyles();
  const { open, handleClose, order } = props;
  const [totalprice, setTotalPrice] = useState(0);
  const user = useSelector(state => state.user)

  useEffect(() => {
    const { supplierItems = [], price } = props.order;

    if (supplierItems.length !== 0) {
      let tprice = 0;
      supplierItems.forEach(({ total }) => (tprice += Number(total)));
      setTotalPrice(tprice + price);
    } else {
      setTotalPrice(price);
    }
  }, [])

  const body = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <div className={classes.paper}>
        <Grid
          container
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid
            item
            md={4}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Typography
              variant="p"
              style={{ fontSize: 20, fontWeight: "bold", color: "#42aff5" }}
            >
              {order.businessName}
            </Typography>
            <Typography variant="p" style={{ fontSize: 15, color: "gray" }}>
              ABN Number: {user.ABN}
            </Typography>

            {
              order.customerType == 'business' ? <>
                <Typography
                  variant="p"
                  style={{ color: "#42aff5" }}
                  style={{
                    paddingTop: 40,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#42aff5",
                  }}
                >
                  To:
                 </Typography>
                <Typography variant="p" style={{ color: "gray", fontSize: 15, }}>
                  Name: {order.customerName ? order.customerName : ""}
                </Typography>
                <Typography variant="p" style={{ color: "gray", fontSize: 15, }}>
                  Business Name: {order.customerBusinessName ? order.customerBusinessName : ""}
                </Typography>
                <Typography variant="p" style={{ color: "gray", fontSize: 15, }}>
                  Business Address: {order.customerBusinessAddress ? order.customerBusinessAddress : ""}
                </Typography>
                <Typography variant="p" style={{ color: "gray", fontSize: 15, }}>
                  Contact: {order.customerMobile ? order.customerMobile : ""}
                </Typography> </>
                :
                <>
                  <Typography
                    variant="p"
                    style={{ color: "#42aff5" }}
                    style={{
                      paddingTop: 40,
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#42aff5",
                    }}
                  >
                    To:
            </Typography>
                  <Typography variant="p" style={{ color: "gray", fontSize: 15, }}>
                    Name: {order.customerName ? order.customerName : ""}
                  </Typography>
                  <Typography variant="p" style={{ color: "gray", fontSize: 15, }}>
                    Address: {order.customerAddress ? order.customerAddress : ""}
                  </Typography>
                  <Typography variant="p" style={{ color: "gray", fontSize: 15, }}>
                    Contact: {order.customerMobile ? order.customerMobile : ""}
                  </Typography>
                </>
            }
          </Grid>
          <Grid
            item
            md={4}
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
            }}
          >
            <Typography
              variant="h4"
              style={{ paddingBottom: 20, color: "#42a5f5" }}
            >
              INVOICE
            </Typography>
          </Grid>

          <Grid container style={{ paddingTop: 40 }}>
            <TableContainer style={{ border: "1px solid #42a5f5" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#42a5f5" }}>
                    <TableCell align="center" style={{ color: "white", fontSize: 15, }}>
                      Description
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: "white", fontSize: 13 }}
                    >
                      Fulfill Date/Time
                    </TableCell>
                    <TableCell align="center" style={{ color: "white", fontSize: 15, }}>
                      Quantity
                    </TableCell>
                    <TableCell align="center" style={{ color: "white", fontSize: 15, }}>
                      Unit Cost
                    </TableCell>
                    <TableCell align="center" style={{ color: "white", fontSize: 15, }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" style={{ fontSize: 15 }}>
                      <>
                        <p style={{ fontWeight: 'bold' }}>{order.serviceID ? compute_service_data.computeServiceName(order.serviceID, services) : ''}</p>
                        {`${order.productType ? order.productType : ''}
                         ${order.productSize ? order.productSize : ''} 
                         ${order.productClass ? order.productClass : ''}`}
                        <br />
                        {order.locationName}
                      </>
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 15 }}>
                      {order.fulfillDate ? order.fulfillDate : ""} {order.fulfillTime ? order.fulfillTime : ''}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 15 }}>
                      {order.quantity ? order.quantity : ""} {unit_service.convertStatus(compute_service_data.computeServiceName(order.serviceID, services))}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 15 }}>
                      ${order.price ? order.price : ""}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 15 }}>
                      ${order.price ? order.price : ""}
                    </TableCell>
                  </TableRow>
                  {order.supplierItems &&
                    order.supplierItems.map((item) => (
                      <TableRow>
                        <TableCell align="center" style={{ fontSize: 15 }}>
                          {item.itemName ? item.itemName : ""}
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 15 }}>
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 15 }}>
                          {item.quantity ? item.quantity : ""}
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 15 }}>
                          {item.unitCost ? item.unitCost : ""}
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 15 }}>
                          ${item.total ? item.total : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell
                      style={{ fontSize: 13 }}
                      align="center"
                    >

                    </TableCell>
                    <TableCell
                      style={{ fontSize: 13 }}
                      align="center"
                    >

                    </TableCell>
                    <TableCell
                      style={{ fontSize: 13 }}
                      align="center"
                    >

                    </TableCell>
                    <TableCell
                      style={{ fontSize: 13 }}
                      align="center"
                    >
                      Net Total{" "}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: 13 }}
                      align="center"
                    >
                      ${totalprice}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="p"
              style={{ color: "gray" }}
              style={{
                paddingTop: 20,
                fontSize: 18,
                fontWeight: "bold",
                color: "#42aff5",
              }}
            >
              EFT Details
            </Typography>
            <Typography variant="p" style={{ fontSize: 15, color: "gray" }}>
              Account Name: {user.accountName}
            </Typography>
            <Typography variant="p" style={{ fontSize: 15, color: "gray" }}>
              Account Number: {user.accountNumber}
            </Typography>
            <Typography variant="p" style={{ fontSize: 15, color: "gray" }}>
              Bank Name: {user.bankName}
            </Typography>
            <Typography variant="p" style={{ fontSize: 15, color: "gray" }}>
              BSB Number: {user.bsbnumber}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
  return (
    <Grid style={{ paddingBottom: 70, paddingTop: 30 }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </Grid>
  );
}

export default Invoice;
