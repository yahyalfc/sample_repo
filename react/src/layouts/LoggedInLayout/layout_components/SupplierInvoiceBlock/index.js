import { useState, useEffect, useRef, forwardRef } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import "./OrderBlock.css";
import style from "./style";
import { useSelector, useDispatch } from "react-redux";
import InvoiceBlock from "../InvoiceBlock";
//import ReactToPrint from "react-to-print";
import ReactToPrint from "react-to-print";
import PersonIcon from "@material-ui/icons/Person";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import CallIcon from "@material-ui/icons/Call";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import EventIcon from "@material-ui/icons/Event";
import { Typography } from "@material-ui/core";
import { unit_service } from "../../../../utils/convert/quantityUnit";
import { firebase_invoice_service } from "../../../../services/firebase/invoice_service";
import { setInvoices } from '../../../../redux/actions'
import swal from 'sweetalert'
import { compute_service_data } from "../../../../utils/convert/serviceName";

const SupplierInvoiceBlock = forwardRef((props, ref) => {
  const [invoice, setInvoice] = useState(props.invoice);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const services = useSelector((state) => state.services);
  const [totalprice, setTotalPrice] = useState(0);
  const invoiceRef = useRef();
  const dispatch = useDispatch()
  const allinvoices = useSelector(state => state.invoices)

  useEffect(() => {
    setInvoice(props.invoice);
  }, [props.invoice]);

  useEffect(() => {
    const { supplierItems = [], price } = invoice;
    if (supplierItems.length !== 0) {
      const itemArray = supplierItems;
      let tprice = 0;
      itemArray.forEach(({ total }) => (tprice += Number(total)));
      setTotalPrice(tprice + price);
    } else {
      setTotalPrice(price);
    }
  }, []);

  const handleClose = () => {
    setInvoiceModal(false);
  };

  const {
    serviceID,
    quantity,
    deliveryDate,
    customerPhone,
    customerEmail,
    dueDate,
    orderID
  } = props.invoice;

  const serviceName = compute_service_data.computeServiceName(serviceID, services)
  const munit = unit_service.convertStatus(serviceName)

  const paymentRecieved = async () => {
    let paymentBy = 'Supplier'
    const result = await firebase_invoice_service.updateInvoiceStatus(props.invoice, paymentBy, 'payment-recieved', orderID, 'recieved')

    if (result.status) {
      swal({
        title: "Payment Status Updated",
        icon: "success",
        buttons: {
          Confirm: { text: "Okay", className: "okayButton" },
        },
      })
        .then((value) => {
          const updatedorders = allinvoices.map((x) =>
            x.orderID == orderID ? { ...x, paymentStatus: 'recieved', updatedAt: result.updatedAt } : x
          );
          dispatch(setInvoices(updatedorders))
        })
      // setInvoice({ ...invoice, paymentRecieved: 'recieved' })
    }
  }

  return (
    <div ref={ref}>
      <Grid style={{ display: !!invoice ? "" : "none" }}>
        <Grid style={{ textAlign: "left" }}>
          <Grid
            container
            style={{ ...style.orderCard, borderLeft: "15px solid #42a5f5" }}
          >
            <Grid
              item
              sm={12}
              md={5}
              style={{
                padding: 20,
              }}
            >
              <ul
                style={{
                  color: "#42a5f5",
                  listStyle: "disc",
                  padding: "5px 0px 0px 30px",
                }}
              >
                <>
                  <h5>{orderID}</h5>
                  <li style={style.pLocation}>
                    <PersonIcon style={style.cardIcon} />
                    <Typography style={style.listItemHeading}>
                      Customer Name{" "}
                    </Typography>
                  </li>
                  <li style={style.orderList}>
                    {invoice.customerName
                      ? invoice.customerName.charAt(0).toUpperCase() +
                      invoice.customerName.slice(1)
                      : ""}
                  </li>
                </>
                <>
                  <li style={style.pLocation}>
                    <AlternateEmailIcon style={style.cardIcon} />
                    <Typography style={style.listItemHeading}>
                      {" "}
                    Customer Email
                  </Typography>
                  </li>{" "}
                  <li style={style.orderList}>{customerEmail}</li>
                </>
                <>
                  <li style={style.pLocation}>
                    {" "}
                    <CallIcon style={style.cardIcon} />
                    <Typography style={style.listItemHeading}>
                      {" "}
                    Customer Phone
                  </Typography>
                  </li>
                  <li style={style.orderList}>{customerPhone}</li>
                </>
                {
                  invoice.paymentStatus == 'sent' ? <>
                    <li style={style.pLocation}>
                      <Typography style={{ ...style.listItemHeading, color: '#3CB371' }}>
                        {" "}
                  Payment Sent By Customer
                </Typography>
                    </li> </> : ''
                }
                {
                  invoice.paymentStatus == 'recieved' ? <>
                    <li style={style.pLocation}>
                      <Typography style={{ ...style.listItemHeading, color: '#3CB371' }}>
                        {" "}
                  Payment Recieved
                </Typography>
                    </li> </> : ''
                }
              </ul>
              <Grid style={{ marginLeft: 20 }}></Grid>
            </Grid>
            <Grid item sm={12} md={2}></Grid>
            <Grid item sm={12} md={5} style={{ paddingTop: 25 }}>
              <ul style={{ color: "#42a5f5", paddingLeft: " 50px" }}>
                <li style={style.pLocation}>
                  <ShoppingBasketIcon style={style.rightCardIcon} />
                  <Typography
                    style={{
                      fontWeight: "bold",
                      paddingRight: 18,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      // textOverflow: "ellipsis",
                    }}
                  >
                    Product :
                </Typography>

                  <Typography
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      color: "gray",
                      fontSize: "16px",
                      fontWeight: "normal",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {compute_service_data.computeServiceName(serviceID, services)}
                  </Typography>
                </li>
                <li style={style.pLocation}>
                  <AddShoppingCartIcon style={style.rightCardIcon} />
                Quantity :
                <label
                    style={{
                      marginLeft: 5,
                      color: "gray",
                      fontSize: "16px",
                      fontWeight: "normal",
                    }}
                  >
                    {quantity} {" "} {munit}
                  </label>
                </li>

                <li style={style.pLocation}>
                  <AttachMoneyIcon style={style.rightCardIcon} />
                Price :{""}
                  <label
                    style={{
                      marginLeft: 5,
                      color: "gray",
                      fontSize: "16px",
                      fontWeight: "normal",
                    }}
                  >
                    $ {totalprice ? totalprice.toFixed(2) : ""}
                  </label>
                </li>
                <li style={style.pLocation}>
                  <EventIcon style={style.rightCardIcon} />
                Dispatch Date :
                <label
                    style={{
                      color: "gray",
                      fontSize: "16px",
                      fontWeight: "normal",
                      marginLeft: 5,
                    }}
                  >
                    {deliveryDate}
                  </label>
                </li>

                <li style={style.pLocation}>
                  <EventIcon style={style.rightCardIcon} />
                Due Date :{" "}
                  <label
                    style={{
                      color: "gray",
                      fontSize: "16px",
                      fontWeight: "normal",
                      marginLeft: 5,
                    }}
                  >
                    {dueDate}
                  </label>
                </li>
              </ul>
              <Grid
                container
                md={11}
                sm={11}
                style={{
                  display: "flex",
                  paddingLeft: 20
                }}
              >
                <Button
                  fullWidth
                  style={{
                    backgroundColor: "#42a5f5",
                    color: "white",
                    marginLeft: 32,
                    marginTop: 28,
                    textTransform: "capitalize",
                    color: "white",
                  }}
                  onClick={() => {
                    setInvoiceModal(true);
                  }}
                >
                  View Invoice
              </Button>
                <Button
                  fullWidth
                  style={{
                    backgroundColor: "#42a5f5",
                    color: "white",
                    marginLeft: 32,
                    marginTop: 10,
                    textTransform: "capitalize",
                    color: "white",
                    display: invoice.paymentStatus == 'sent' ? '' : "none"
                  }}
                  onClick={() => paymentRecieved()}
                >
                  Mark as payment received
              </Button>
              </Grid>
            </Grid>
          </Grid>
          <div>
            <Modal
              open={invoiceModal}
              onClose={handleClose}
              style={{ overflow: "scroll" }}
              // hideBackdrop={true}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <>
                <ReactToPrint
                  trigger={() => (
                    <Button
                      style={{
                        borderRadius: 5,
                        backgroundColor: "#42a5f5",
                        color: "white",
                        position: "absolute",
                        top: "1%",
                        left: "45%",
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    >
                      Download Invoice
                    </Button>
                  )}
                  content={() => invoiceRef.current}
                />
                <InvoiceBlock
                  ref={invoiceRef}
                  invoice={invoice}
                  totalprice={totalprice}
                />
              </>
            </Modal>
          </div>
        </Grid>
      </Grid>
    </div>
  );
})
export default SupplierInvoiceBlock;
