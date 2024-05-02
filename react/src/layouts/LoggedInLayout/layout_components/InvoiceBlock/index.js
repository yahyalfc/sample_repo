import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import "./style.css";
import { compute_service_data } from "../../../../utils/convert/serviceName";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "85vw",
    //width: "auto",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #fffff",
    // boxShadow: theme.shadows[5],
    padding: "20px",
  },
  pdfHeight: {
    marginTop: 30,
    height: "100px",
    overflowY: "auto",
  },
}));

const InvoiceBlock = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const services = useSelector((state) => state.services);
  const { invoice, totalprice } = props;

  const {
    supplierPhone,
    productID,
    quantity,
    price,
    businessName,
    supplierEmail,
    deliveryDate,
    deliveryTime,
    customerName,
    customerMobile,
    customerPhone,
    customerEmail,
    locationName,
    supplierItems,
    dueDate,
    time,
    accountName,
    bankName,
    bsbnumber,
    accountNumber,
  } = invoice;

  return (
    <div className={classes.pdfHeight}>
      <div ref={ref}>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <div className={classes.paper}>
            <Grid
              container
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Grid
                item
                md={6}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Typography
                  variant="p"
                  style={{ fontSize: 20, fontWeight: "bold", color: "#42aff5" }}
                >
                  {businessName.toUpperCase()}
                </Typography>
                <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                  Business Address: {invoice?.supplierAddress}
                </Typography>
                <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                  Phone: {supplierPhone}
                </Typography>
                <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                  ABN: {invoice?.ABN}
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                  fontSize: 13,
                  height: "50%",
                }}
              >
                <Typography style={{ fontSize: 20, color: "#42a5f5" }}>
                  INVOICE
                </Typography>
                <Typography
                  variant="p"
                  style={{ color: "gray", fontSize: 13 }}
                  style={{ color: "gray" }}
                >
                  INVOICE NO: 000001
                </Typography>
                <Typography
                  variant="p"
                  style={{ color: "gray", fontSize: 13 }}
                  style={{ color: "gray" }}
                >
                  {time}
                </Typography>
              </Grid>
              <Grid container >
                <Grid item md={4} style={{ marginTop: 20 }}>
                  <Typography
                    variant="p"
                    style={{ color: "#42aff5" }}
                    style={{
                      paddingTop: 40,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#42aff5",
                    }}
                  >
                    To:
                </Typography>
                  <br />
                  {
                    invoice.customerType == 'business' ? <>
                      <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                        Name: {" "} {invoice.customerName}
                      </Typography>
                      <br />
                      <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                        Business Name: {" "} {invoice.customerBusinessName}
                      </Typography>
                      <br />
                      <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                        Business Address: {" "} {invoice.customerBusinessAddress}
                      </Typography>
                      <br />
                      <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                        Contact: {invoice.customerPhone}
                      </Typography>
                    </> :
                      <>
                        <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                          Name: {" "} {invoice.customerName}
                        </Typography>
                        <br />
                        <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                          Address: {invoice.customerAddress}
                        </Typography>
                        <br />
                        <Typography variant="p" style={{ color: "gray", fontSize: 13 }}>
                          Contact: {invoice.customerPhone}
                        </Typography>
                      </>
                  }
                </Grid>
              </Grid>

              <Grid container style={{ paddingTop: 40 }}>
                <TableContainer style={{ border: "1px solid #42a5f5" }}>
                  <Table>
                    <TableHead>
                      <TableRow style={{ backgroundColor: "#42a5f5" }}>
                        <TableCell
                          align="center"
                          style={{ color: "white", fontSize: 13 }}
                        >
                          Description
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ color: "white", fontSize: 13 }}
                        >
                          Fulfill Date/Time
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ color: "white", fontSize: 13 }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ color: "white", fontSize: 13 }}
                        >
                          Unit Cost
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ color: "white", fontSize: 13 }}
                        >
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ fontSize: 13 }} align="center">
                          <>
                            <p style={{ fontWeight: 'bold' }}>{invoice.serviceID ? compute_service_data.computeServiceName(invoice.serviceID, services) : ''}</p>
                            {`${invoice.productType ? invoice.productType : ''}
                         ${invoice.productSize ? invoice.productSize : ''} 
                         ${invoice.productClass ? invoice.productClass : ''} ${invoice.unit ? invoice.unit : ''}
                          `}
                            <br />
                            {invoice.locationName}
                          </>
                        </TableCell>
                        <TableCell style={{ fontSize: 13 }} align="center">
                          {invoice.fulfillDate ? invoice.fulfillDate : ''} {invoice.fulfillTime ? invoice.fulfillTime : ''}
                        </TableCell>
                        <TableCell style={{ fontSize: 13 }} align="center">
                          {quantity}
                        </TableCell>
                        <TableCell style={{ fontSize: 13 }} align="center">
                          ${Number(price / quantity).toFixed(2)}
                        </TableCell>
                        <TableCell style={{ fontSize: 13 }} align="center">
                          ${price ? price.toFixed(2) : ""}
                        </TableCell>
                      </TableRow>
                      {!!supplierItems
                        ? supplierItems.map(
                          ({ itemName, quantity, unitCost, total }) => (
                            <TableRow>
                              <TableCell
                                style={{ fontSize: 13 }}
                                align="center"
                              >
                                {itemName}
                              </TableCell>
                              <TableCell style={{ fontSize: 13 }} align="center">

                              </TableCell>
                              <TableCell
                                style={{ fontSize: 13 }}
                                align="center"
                              >
                                {quantity}
                              </TableCell>
                              <TableCell
                                style={{ fontSize: 13 }}
                                align="center"
                              >
                                {" "}
                                {unitCost}
                              </TableCell>
                              <TableCell
                                style={{ fontSize: 13 }}
                                align="center"
                              >
                                ${total.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          )
                        )
                        : null}
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

              <Grid
                style={{
                  display: "flex",
                  fontSize: 14,
                  flexDirection: "column",
                  pageBreakInside: "avoid",
                }}
              >

                <Typography variant="p" style={{ color: "gray", fontSize: 14, paddingTop: 20 }}>
                  Due Date: {dueDate}
                </Typography>

                <Typography
                  variant="p"
                  style={{ fontSize: 13, color: "gray" }}
                  style={{
                    paddingTop: 20,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#42aff5",
                  }}
                >
                  EFT Details
                </Typography>
                <Typography variant="p" style={{ fontSize: 13, color: "gray" }}>
                  Account Name: {invoice.accountName ? invoice.accountName : ''}
                </Typography>
                <Typography variant="p" style={{ fontSize: 13, color: "gray" }}>
                  Bank Name: {invoice.bankName ? invoice.bankName : ''}
                </Typography>
                <Typography variant="p" style={{ fontSize: 13, color: "gray" }}>
                  BSB Number: {invoice.bsbnumber ? invoice.bsbnumber : ''}
                </Typography>
                <Typography variant="p" style={{ fontSize: 13, color: "gray" }}>
                  Account Number: {invoice.accountNumber ? invoice.accountNumber : ''}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoiceBlock;