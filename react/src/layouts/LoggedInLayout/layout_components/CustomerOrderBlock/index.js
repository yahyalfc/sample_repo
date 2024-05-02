import { useState, useEffect, forwardRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Box from "@material-ui/core/Box";
import "./OrderBlock.css";
import style from "./style";
import "../../../../components/SwalStyle/SwalStyle.css";
import { firebase_order_service } from "../../../../services/firebase/order_service";
import status_array from "../../../../static/cutomer-status";
import swal from "sweetalert";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import LoaderButton from "../../../../components/LoaderButton";
import { useSelector, useDispatch } from "react-redux";
import BusinessIcon from "@material-ui/icons/Business";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import CallIcon from "@material-ui/icons/Call";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import EventIcon from "@material-ui/icons/Event";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { setOrders } from "../../../../redux/actions";
import Swal from "sweetalert2";
import { compute_service_data } from "../../../../utils/convert/serviceName";
import { time_service } from "../../../../utils/time/timeAndDate";

const CustomerOrderBlock = forwardRef((props, ref) => {
  const [order, setOrder] = useState(props.data);
  const services = useSelector((state) => state.services);
  const [loadingReconfirm, setLoadingReconfirm] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [supplierModal, setSupplierModal] = useState(false);
  const {
    status,
    businessName,
    supplierPhone,
    supplierMobile,
    supplierEmail,
    supplierName,
    quantity,
    serviceID,
    price,
    deliveryTime,
    deliveryDate,
    orderID,
    orderTime,
    orderDate,
  } = order;
  const serviceName = compute_service_data.computeServiceName(serviceID, services);
  const munit = compute_service_data.computeServiceUnit(serviceID, services)

  const allorders = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    setOrder(props.data);
    return () => { };
  }, [props.data]);

  const convertStatus = (status) => {
    if (status_array) {
      // Here we are matching our status with the config/customerStatus which we'll later move to db and only admin can change that.
      const convertstatus = status_array.find((item) => item.status == status);
      return convertstatus.text;
    } else return status;
  };

  const reconfirmOrder = async ({ orderID, status }) => {
    setLoadingReconfirm(true);
    let reconfirmDate = time_service.returnDate()
    let reconfirmTime = time_service.returnTime()
    let reconfirmedBy = 'Customer'

    const result = await firebase_order_service.reconfirmSupplierOrder(
      order,
      orderID,
      status,
      reconfirmedBy,
      reconfirmDate,
      reconfirmTime
    );

    if (result.status) {
      setLoadingCancel(false);
      setLoadingReconfirm(false);
      setOrder({ ...order, status, reconfirmDate, reconfirmTime, updatedAt: result.updatedAt });

      // status: status
      const updatedorders = allorders.map((x) =>
        x.orderID == orderID ? { ...x, status, reconfirmDate, reconfirmTime, updatedAt: result.updatedAt } : x
      );
      dispatch(setOrders(updatedorders))

      /*
      const updatedorders = orders.map((x) =>
        x.orderID == orderID ? { ...x, status: status } : x
      );
      dispatch(setOrders(updatedorders));
      */
    }
  };

  const handleReconfirm = () =>
    swal({
      title: "Reconfirm Order",
      text: "Are you sure?",
      // icon: "error",
      buttons: {
        Confirm: { text: "Yes", className: "okayButton" },
        Cancel: { text: "No", className: "cancelButton" },
      },
    }).then((value) => {
      if (value == "Confirm") {
        reconfirmOrder({
          orderID: orderID,
          status: "reconfirmed",
        });
      }
    });

  const handleCloseSupplierModal = () => {
    setSupplierModal(false);
  };

  const cancelOrder = (orderID, status) => {
    Swal.fire({
      title: "Are You Sure You Want to Cancel Order",
      text: "Please Enter the reason for the cancellation of order",
      input: "text",
      showCancelButton: true,
      confirmButtonColor: "#1c8fec",
      cancelButtonColor: "#fa013b",
    }).then((result) => {
      if (result.value == '') {
        swal({
          title: "You can not cancel without giving a reason",
          showCancelButton: true,
          confirmButtonColor: "#1c8fec",
          cancelButtonColor: "#fa013b",
          buttons: {
            Confirm: { text: "Okay", className: "okayButton" },
          },
        });
      }
      else if (result.isConfirmed) {
        try {
          let cancelDate = time_service.returnDate()
          let cancelTime = time_service.returnTime()
          let cancelledBy = "Customer"

          firebase_order_service
            .cancelOrder(order, orderID, status, cancelledBy, result?.value, cancelDate, cancelTime)
            .then((res) => {
              console.log({ res });
              setOrder({
                ...order,
                status: "cancelled",
                cancellationReason: result.value,
                cancelledBy,
                cancelDate,
                cancelTime,
                updatedAt: res.updatedAt
              });
              const updatedorders = allorders.map((x) =>
                x.orderID == orderID
                  ? {
                    ...x,
                    status: "cancelled",
                    cancellationReason: result.value,
                    cancelledBy,
                    cancelDate,
                    cancelTime,
                    updatedAt: res.updatedAt
                  }
                  : x
              );

              dispatch(setOrders(updatedorders));
            });
        } catch (err) {
          console.log(err);
        } finally {
          setLoadingCancel(false);
        }
      }
    });
  };

  const toTitleCase = (phrase) => {
    return phrase
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  return (
    <div ref={ref}>
      <Grid style={{ display: !!order ? "" : "none" }}>
        <Grid style={{ textAlign: "left" }}>
          <Grid
            container
            style={
              status == "confirmed"
                ? { ...style.orderCard, borderLeft: "15px solid #FFFF4e" }
                : status == "cancelled"
                  ? { ...style.orderCard, borderLeft: "15px solid #e50000" }
                  : status == "unapproved"
                    ? { ...style.orderCard, borderLeft: "15px solid #A9A9A9" }
                    : status == "reconfirmed"
                      ? { ...style.orderCard, borderLeft: "15px solid #42a5f5" }
                      : { ...style.orderCard, borderLeft: "15px solid #3CB371" }
            }
          >
            <Grid
              item
              sm={12}
              md={5}
              style={{
                padding: 20,
              }}
            >
              <h5>{orderID}</h5>
              <Typography
                variant="h6"
                style={{ fontSize: 18, color: "gray", fontWeight: "bold" }}
              >
                {convertStatus(status)}
              </Typography>
              <ul
                style={{
                  color: "#42a5f5",
                  padding: "5px 0px 0px 30px",
                }}
              >
                <>
                  <li style={style.pLocation}>
                    <BusinessIcon style={style.cardIcon} />
                    <Typography style={style.listItemHeading}>Product</Typography>
                  </li>
                  <li style={style.orderList}>{serviceName}</li>
                </>
                {order.productType ? (
                  <>
                    <li style={style.pLocation}>
                      <BusinessIcon style={style.cardIcon} />
                      <Typography style={style.listItemHeading}>
                        Product Type
                    </Typography>
                    </li>
                    <li style={style.orderList}>{order.productType}</li>
                  </>
                ) : (
                  ""
                )}
                <>
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
                </>
                <li
                  style={{
                    ...style.pLocation,
                    paddingLeft: 10,
                    fontWeight: "normal",
                  }}
                >
                  <a className="linkbtn" onClick={() => setSupplierModal(true)}>
                    {" "}
                  Supplier Info
                </a>
                </li>
              </ul>
              <Grid style={{ marginLeft: 20 }}></Grid>
            </Grid>
            <Grid item sm={12} md={1}></Grid>
            <Grid item sm={12} md={6} style={{ paddingTop: 50 }}>
              <ul style={{ color: "#42a5f5", paddingLeft: " 30px" }}>
                {order.placementMethod ? (
                  <li style={style.pLocation}>
                    <SettingsInputComponentIcon style={style.rightCardIcon} />
                  Placement Method :
                    <label
                      style={{
                        marginLeft: 5,
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      {order.placementMethod}
                    </label>
                  </li>
                ) : (
                  ""
                )}
                {order.productSize ? (
                  <li style={style.pLocation}>
                    <SettingsInputComponentIcon style={style.rightCardIcon} />
                  Product Size :
                    <label
                      style={{
                        marginLeft: 5,
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      {order.productSize}
                    </label>
                  </li>
                ) : (
                  ""
                )}
                {order.productClass ? (
                  <li style={style.pLocation}>
                    <SettingsInputComponentIcon style={style.rightCardIcon} />
                  Product Class :
                    <label
                      style={{
                        marginLeft: 5,
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      {order.productClass}
                    </label>
                  </li>
                ) : (
                  ""
                )}
                {order.unit ? (
                  <li style={style.pLocation}>
                    <SettingsInputComponentIcon style={style.rightCardIcon} />
                  Unit :
                    <label
                      style={{
                        marginLeft: 5,
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      {order.unit}
                    </label>
                  </li>
                ) : (
                  ""
                )}
                <li style={style.pLocation}>
                  <AttachMoneyIcon style={style.rightCardIcon} />
                Price :
                <label
                    style={{
                      marginLeft: 5,
                      color: "gray",
                      fontSize: "16px",
                      fontWeight: "normal",
                    }}
                  >
                    ${price.toFixed(2)}
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
                {deliveryTime && (
                  <li style={style.pLocation}>
                    <ScheduleIcon style={style.rightCardIcon} />
                  Dispatch Time :
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {deliveryTime}
                    </label>
                  </li>
                )}
                <li style={style.pLocation}>
                  <EventIcon style={style.rightCardIcon} />
                Order Creation Date :
                <label
                    style={{
                      color: "gray",
                      fontSize: "16px",
                      fontWeight: "normal",
                      marginLeft: 5,
                    }}
                  >
                    {orderDate}
                  </label>
                </li>
                <li style={style.pLocation}>
                  <ScheduleIcon style={style.rightCardIcon} />
                Order Creation Time :
                <label
                    style={{
                      color: "gray",
                      fontSize: "16px",
                      fontWeight: "normal",
                      marginLeft: 5,
                    }}
                  >
                    {orderTime}
                  </label>
                </li>
                {order.confirmDate && (
                  <li style={style.pLocation}>
                    <EventIcon style={style.rightCardIcon} />
                  Order Confirmation Date:
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {order.confirmDate}
                    </label>
                  </li>
                )}
                {order.confirmTime && (
                  <li style={style.pLocation}>
                    <ScheduleIcon style={style.rightCardIcon} />
                  Order Confirmation Time :
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {order.confirmTime}
                    </label>
                  </li>
                )}
                {order.reconfirmDate && (
                  <li style={style.pLocation}>
                    <EventIcon style={style.rightCardIcon} />
                  Order Reconfirmation Date:
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {order.reconfirmDate}
                    </label>
                  </li>
                )}
                {order.reconfirmTime && (
                  <li style={style.pLocation}>
                    <ScheduleIcon style={style.rightCardIcon} />
                  Order Reconfirmation Time :
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {order.reconfirmTime}
                    </label>
                  </li>
                )}
                {order.fulfillDate && (
                  <li style={style.pLocation}>
                    <EventIcon style={style.rightCardIcon} />
                  Order Fulfillment Date:
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {order.fulfillDate}
                    </label>
                  </li>
                )}
                {order.fulfillTime && (
                  <li style={style.pLocation}>
                    <ScheduleIcon style={style.rightCardIcon} />
                  Order Fulfillment Time :
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {order.fulfillTime}
                    </label>
                  </li>
                )}
                {order.cancelDate && (
                  <li style={style.pLocation}>
                    <EventIcon style={style.rightCardIcon} />
                  Order Cancellation Date:
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {order.cancelDate}
                    </label>
                  </li>
                )}
                {order.cancelTime && (
                  <li style={style.pLocation}>
                    <ScheduleIcon style={style.rightCardIcon} />
                  Order Cancellation Time :
                    <label
                      style={{
                        color: "gray",
                        fontSize: "16px",
                        fontWeight: "normal",
                        marginLeft: 5,
                      }}
                    >
                      {order.cancelTime}
                    </label>
                  </li>
                )}
              </ul>
              <Grid
                container
                md={12}
                sm={12}
                style={{
                  display: "flex",
                  paddingLeft: 55,
                  // flexDirection: "column", 
                  marginTop: 10,
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  lg={6}
                  style={{ display: status == "confirmed" ? "" : "none" }}
                >
                  <LoaderButton
                    isLoading={loadingReconfirm}
                    loadingProps={{
                      size: 24,
                      style: { color: "white" },
                    }}
                    endIcon={<CheckIcon />}
                    style={{
                      textTransform: "capitalize",
                      color: "white",
                      backgroundColor: "#42a5f5",
                      marginTop: 5

                    }}
                    onClick={handleReconfirm}
                  >
                    Reconfirm Order
                </LoaderButton>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  lg={6}
                  style={{
                    display:
                      status == "cancelled" || status == "fulfilled"
                        ? "none"
                        : "",
                  }}
                >
                  <LoaderButton
                    isLoading={loadingCancel}
                    loadingProps={{
                      size: 24,
                      style: { color: "white" },
                    }}
                    endIcon={<ClearIcon />}
                    style={{
                      // margin: 5,
                      textTransform: "capitalize",
                      color: "white",
                      backgroundColor: "#e50000",
                      marginTop: 5,
                      padding: '7px 19px'

                    }}
                    onClick={() => cancelOrder(orderID, "cancelled")}
                  >
                    Cancel Order
                </LoaderButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Modal
            open={supplierModal}
            onClose={handleCloseSupplierModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{ display: 'flex', placeItems: 'center', placeContent: 'center', }}

          >
            <Grid item md={4} style={style.cancelReasonModel}>
              <Box mb={2} pt={1}>
                <Typography style={{ marginBottom: 10, fontWeight: "600" }}>
                  Supplier Info
              </Typography>

                <Grid container>
                  <Grid item md={6} sm={12}>
                    <ul
                      style={{
                        color: "#42a5f5",
                        padding: "5px 10px 0px 20px",
                      }}
                    >
                      <>
                        <li style={style.pLocation}>
                          <BusinessIcon style={style.cardIcon} />
                          <Typography style={style.listItemHeading}>
                            Business Name{" "}
                          </Typography>
                        </li>
                        <li style={style.orderList}>{businessName}</li>
                      </>
                      <>
                        <li style={style.pLocation}>
                          <AlternateEmailIcon style={style.cardIcon} />
                          <Typography style={style.listItemHeading}>
                            {" "}
                      Supplier Name
                    </Typography>
                        </li>
                        <li style={style.orderList}>
                          {supplierName ? toTitleCase(supplierName) : ""}
                        </li>
                      </>
                      <>
                        <li style={style.pLocation}>
                          <AlternateEmailIcon style={style.cardIcon} />
                          <Typography style={style.listItemHeading}>
                            {" "}
                      Supplier Email
                    </Typography>
                        </li>
                        <li style={style.orderList}>{supplierEmail}</li>
                      </>

                    </ul>
                  </Grid>
                  <Grid item md={6} sm={12}>
                    <ul
                      style={{
                        color: "#42a5f5",
                        padding: "5px 0px 0px 30px",
                      }}
                    >
                      <>
                        <li style={style.pLocation}>
                          {" "}
                          <CallIcon style={style.cardIcon} />
                          <Typography style={style.listItemHeading}>
                            {" "}
                      Supplier Phone
                    </Typography>
                        </li>
                        <li style={style.orderList}>{supplierPhone}</li>
                      </>
                      <>
                        <li style={style.pLocation}>
                          {" "}
                          <CallIcon style={style.cardIcon} />
                          <Typography style={style.listItemHeading}>
                            {" "}
                      Supplier Mobile
                    </Typography>
                        </li>
                        <li style={style.orderList}>{supplierMobile}</li>
                      </>
                    </ul>
                  </Grid>
                </Grid>

              </Box>
            </Grid>
          </Modal>
        </Grid>
      </Grid>
    </div>
  )
})
export default CustomerOrderBlock;
