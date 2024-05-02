import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Box from "@material-ui/core/Box";
import { useEffect, useState, forwardRef } from "react";
import "./OrderBlock.css";
import style from "./style";
import { firebase_order_service } from "../../../../services/firebase/order_service";
import { Link } from "react-router-dom";
import status_array from "../../../../static/supplier-status";
import swal from "sweetalert";
import CreateIcon from "@material-ui/icons/Create";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import LoaderButton from "../../../../components/LoaderButton";
import { useSelector, useDispatch } from "react-redux";
import { setOrders } from "../../../../redux/actions";
import "../../../../components/SwalStyle/SwalStyle.css";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import CallIcon from "@material-ui/icons/Call";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import EventIcon from "@material-ui/icons/Event";
import ScheduleIcon from "@material-ui/icons/Schedule";
import BusinessIcon from "@material-ui/icons/Business";
import Swal from "sweetalert2";
import { unit_service } from '../../../../utils/convert/quantityUnit'
import { time_service } from "../../../../utils/time/timeAndDate";
import ViewDeliveryDocketModal from '../../SupplierLayout/Module/ModiyOrder/ViewDeliveryDocketModal'
import { compute_service_data } from "../../../../utils/convert/serviceName";

const SupplierOrderBlock = forwardRef((props, ref) => {
  const services = useSelector((state) => state.services);
  const [order, setOrder] = useState(props.data);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const allorders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [isOpenViewDocketModal, setisOpenViewDocketModal] = useState(false)

  const handleOpenViewDocket = () => {
    setisOpenViewDocketModal(true)
  }
  const handleCloseViewDocket = () => {
    setisOpenViewDocketModal(false)
  }

  useEffect(() => {
    setOrder(props.data);
  }, [props.data]);

  const convertStatus = (status) => {
    if (status_array) {
      // Here we are matching our status with the config/customerStatus which we'll later move to db and only admin can change that.
      const convertstatus = status_array.find((item) => item.status == status);
      return convertstatus.text;
    } else return status;
  };

  const confirmOrder = async ({ orderID, status }) => {
    setLoadingConfirm(true);
    let confirmDate = time_service.returnDate()
    let confirmTime = time_service.returnTime()
    let confirmedBy = 'Supplier'

    const result = await firebase_order_service.confirmSupplierOrder(
      order,
      orderID,
      status,
      confirmedBy,
      confirmDate,
      confirmTime
    );

    if (result.status) {
      setLoadingCancel(false);
      setLoadingConfirm(false);
      setOrder({ ...order, status, confirmDate, confirmTime });
      // status: status
      const updatedorders = allorders.map((x) =>
        x.orderID == orderID ? { ...x, status, confirmDate, confirmTime, updatedAt: result.updatedAt } : x
      );


      dispatch(setOrders(updatedorders))
    }
  };

  const handleConfirm = () =>
    swal({
      title: "Order Confirmation",
      text: "Are you sure?",
      buttons: {
        Confirm: { text: "Yes", className: "okayButton" },
        Cancel: { text: "No", className: "cancelButton" },
      },
    }).then((value) => {
      if (value == "Confirm") {
        if (serviceName == 'Premix Concrete') {
          confirmOrder({
            orderID: order.orderID,
            status: "confirmed",
          });
        } else {
          confirmOrder({
            orderID: order.orderID,
            status: "reconfirmed",
          });
        }
      }
    });

  const handleCloseCustomerModal = () => {
    setCustomerModal(false);
  };

  const {
    status,
    locationName,
    customerPhone,
    customerEmail,
    customerMobile,
    customerName,
    quantity,
    serviceID,
    price,
    deliveryTime,
    deliveryDate,
    orderID,
    orderDate,
    orderTime,
    updatedAt
  } = order;

  const serviceName = compute_service_data.computeServiceName(serviceID, services);
  const munit = unit_service.convertStatus(serviceName)

  const cancelOrder = (orderID, status) => {
    if (props.modal) {
      props.handleClose()
    }

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
          let cancelledBy = "Supplier"
          firebase_order_service
            .cancelOrder(order, orderID, status, cancelledBy, result?.value, cancelDate, cancelTime)
            .then((res) => {
              setOrder({
                ...order,
                status: "cancelled",
                cancelledBy,
                cancellationReason: result?.value,
                cancelDate,
                cancelTime,
                updatedAt: res.updatedAt
              });
              const updatedorders = allorders.map((x) =>
                x.orderID == orderID
                  ? {
                    ...x,
                    status: "cancelled",
                    cancelledBy,
                    cancellationReason: result.value,
                    cancelDate,
                    cancelTime,
                    updatedAt: res.updatedAt
                  }
                  : x
              );
              dispatch(setOrders(updatedorders));
              if (props.modal) {
                props.openModal()
              }
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
  //formik.values gives us access to values entered in our form

  return (
    <div ref={ref}>
      <Grid style={{ display: !!order ? "" : "none" }}>
        <Grid style={{ textAlign: "left" }}>
          <Grid
            container
            style={
              status == "confirmed"
                ? { ...style.orderCard, borderLeft: "15px solid #42a5f5" }
                : status == "cancelled"
                  ? { ...style.orderCard, borderLeft: "15px solid #A9A9A9" }
                  : status == "unapproved"
                    ? { ...style.orderCard, borderLeft: "15px solid #FFFF4e" }
                    : status == "reconfirmed"
                      ? { ...style.orderCard, borderLeft: "15px solid #FFA500" }
                      : { ...style.orderCard, borderLeft: "15px solid #3CB371" }
            }
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              // ml={50}
              alignSelf="flex-end"
              py={1}
              width="50%"
              style={{
                borderTopRightRadius: 50,
                display: order.invoiceGenerated ? "" : "none",
                backgroundColor: "#3CB371",
                textAlign: "center",
              }}
            >
              <Typography style={{ fontWeight: "bold", color: "white" }}>
                Invoice Generated
            </Typography>
            </Box>
            <Grid
              item
              sm={12}
              md={5}
              style={{
                padding: "20px 5px",
              }}
            >
              <h5>{orderID}</h5>
              <Typography
                variant="h6"
                style={{ fontSize: 18, color: "gray", fontWeight: "bold", paddingLeft: 30, }}
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
                      {quantity}  {munit}
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
                  <a className="linkbtn" onClick={() => setCustomerModal(true)}>
                    {" "}
                  Customer Info
                </a>
                </li>
              </ul>
            </Grid>

            <Grid item sm={12} md={1}></Grid>
            <Grid item sm={12} md={6} style={{ paddingTop: 57 }}>
              <ul
                style={{
                  color: "#42a5f5",
                  paddingLeft: " 30px",
                  paddingBottom: 3,
                }}
              >
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
                  // marginLeft: 50,
                  marginTop: 10,
                  padding: "0px 25px"
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={10}
                  lg={5}
                  style={{
                    display: order?.docket?.length ? "" : "none", marginRight: 10
                  }}>
                  <Button
                    fullWidth
                    onClick={handleOpenViewDocket}
                    style={{
                      backgroundColor: "#42a5f5",
                      color: "white",
                      margin: 5,
                      textTransform: "capitalize",

                    }}
                  >
                    View Dispatched Dockets
                </Button>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  lg={5}
                  style={{
                    display: status == "reconfirmed" ? "" : "none", marginRight: 10
                  }}
                >
                  <Link
                    to={{
                      pathname: `/app/modifyorder?id=${orderID}`,
                      state: { data: order },
                    }}
                  >
                    <Button
                      fullWidth
                      endIcon={<CreateIcon />}
                      style={{
                        margin: 5,
                        textTransform: "capitalize",
                        color: "white",
                        backgroundColor: "#42a5f5",
                        // padding: '7px 35px '
                      }}
                    >
                      Fulfill Order
                  </Button>
                  </Link>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  lg={5}
                  style={{
                    display: status == "fulfilled" ? "" : "none",
                  }}
                >
                  <Link
                    to={{
                      pathname: `/app/modifyorder?id=${orderID}`,
                      state: { data: order },
                    }}
                  >
                    <Button
                      fullWidth
                      endIcon={<CreateIcon />}
                      style={{
                        textTransform: "capitalize",
                        color: "white",
                        backgroundColor: "#42a5f5",
                        // padding: '7px 46px',
                        margin: 5
                      }}
                    >
                      Preview
                  </Button>
                  </Link>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  lg={5}
                  style={{
                    display: status == "unapproved" ? "" : "none", marginRight: 10
                  }}
                >
                  <LoaderButton
                    isLoading={loadingConfirm}
                    loadingProps={{
                      size: 24,
                      style: { color: "white" },
                    }}
                    fullWidth
                    endIcon={<CheckIcon />}
                    style={{
                      textTransform: "capitalize",
                      color: "white",
                      backgroundColor: "#42a5f5",
                      // padding: '7px 26px',
                      margin: 5
                    }}
                    onClick={handleConfirm}
                  >
                    Confirm Order
                </LoaderButton>
                </Grid>
                {/* for orders confirmed by customer */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  lg={5}
                  style={{
                    display:
                      status == "cancelled" || status == "fulfilled"
                        ? "none"
                        : "", marginRight: 10
                  }}
                >
                  <LoaderButton
                    fullWidth
                    isLoading={loadingCancel}
                    loadingProps={{
                      // size: 24,
                      style: { color: "white" },
                    }}
                    endIcon={<ClearIcon />}
                    style={{
                      margin: 5,
                      textTransform: "capitalize",
                      color: "white",
                      backgroundColor: "#e50000",
                      // padding: '7px 30px',

                    }}
                    onClick={() => cancelOrder(orderID, "cancelled")}
                  >
                    Cancel Order
                </LoaderButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {
            isOpenViewDocketModal &&
            _renderViewDocketModal(
              isOpenViewDocketModal,
              handleCloseViewDocket,
              order
            )
          }
          <Modal
            open={customerModal}
            onClose={handleCloseCustomerModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{ display: 'flex', placeItems: 'center', placeContent: 'center', }}
          >
            <Grid item md={5} style={style.cancelReasonModel}>
              <Box mb={2} pt={1}>
                <Typography style={{ marginBottom: 10, fontWeight: "600" }}>
                  Customer Info
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
                            Delivery Address{" "}
                          </Typography>
                        </li>
                        <li style={style.orderList}>{locationName}</li>
                      </>


                      <>
                        <li style={style.pLocation}>
                          <AlternateEmailIcon style={style.cardIcon} />
                          <Typography style={style.listItemHeading}>
                            {" "}
                      Customer Email
                    </Typography>
                        </li>
                        <li style={style.orderList}>{customerEmail}</li>
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
                          <AlternateEmailIcon style={style.cardIcon} />
                          <Typography style={style.listItemHeading}>
                            {" "}
                      Customer Name
                    </Typography>
                        </li>
                        <li style={style.orderList}>
                          {customerName ? toTitleCase(customerName) : ""}
                        </li>
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
                      <>
                        <li style={style.pLocation}>
                          {" "}
                          <CallIcon style={style.cardIcon} />
                          <Typography style={style.listItemHeading}>
                            {" "}
                      Customer Mobile
                    </Typography>
                        </li>
                        <li style={style.orderList}>{customerMobile}</li>
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
  );
})
export default SupplierOrderBlock;

const _renderViewDocketModal = (
  isOpenViewDocketModal,
  handleCloseViewDocket,
  orderRdx
) => (
  <ViewDeliveryDocketModal
    open={isOpenViewDocketModal}
    handleClose={handleCloseViewDocket}
    order={orderRdx}
  />
)
