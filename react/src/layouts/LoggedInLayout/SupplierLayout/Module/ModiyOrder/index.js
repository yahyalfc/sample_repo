import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { Rating } from "@material-ui/lab";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "../../../../../components/SwalStyle/SwalStyle.css";
import Swal from "sweetalert2";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import EditItemModal from "../../../layout_components/EditItemModel";
import AddItemModal from "../../../layout_components/AddItemModel";
import { firebase_order_service } from "../../../../../services/firebase/order_service";
import style from "./style.js";
import swal from "sweetalert";
import LoaderButton from "../../../../../components/LoaderButton";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSelector, useDispatch } from "react-redux";
import { setOrders } from "../../../../../redux/actions";
import InvoiceModal from "./InvoiceModal";
import GenerateInvoiceModal from "./GenerateInvoiceModal";
import GenerateDeliveryDocketModal from './GenerateDeliveryDocketModal'
import ViewDeliveryDocketModal from './ViewDeliveryDocketModal'
import CustomLoader from "../../../../../components/CustomLoader";
import { time_service } from "../../../../../utils/time/timeAndDate";
import { firebase_product_service } from "../../../../../services/firebase/product_service";
import { compute_service_data } from "../../../../../utils/convert/serviceName";

const ModifyOrder = (history) => {
  const services = useSelector((state) => state.services);
  const [pending, setPending] = useState(true);
  const [orderID, setOrderID] = useState("");
  const [isFinalised, setIsFinalised] = useState(false);
  const [orderRdx, setOrderRdx] = useState("");
  const [table, setTable] = useState([
    {
      itemName: "",
      quantity: "",
      unitCost: "",
      total: "",
    },
  ]);
  const [allItems, setAllItems] = useState([])
  const [supplierItems, setSupplierItems] = useState([]);
  const [isOpenAddItemModal, setIsOpenAddItemModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenInvoiceModal, setIsOpenInvoiceModal] = useState(false);
  const [isOpenGenerateInvoiceModal, setIsOpenGenerateInvoiceModal] = useState(
    false
  );
  const [isOpenGenerateDocketModal, setisOpenGenerateDocketModal] = useState(false)
  const [isOpenViewDocketModal, setisOpenViewDocketModal] = useState(false)

  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingFinalise, setLoadingFinalise] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const url_string = window.location.href;
  const url = new URL(url_string);
  const id = url.searchParams.get("id");
  const reduxOrders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user)
  const [serviceName, setServiceName] = useState("")

  useEffect(() => {
    setOrderID(id);
    if (!!orderID) {
      setItems();
    }
  }, [orderID]);

  useEffect(() => {
    //setOrderRdx
    if (orderRdx !== "") {
      const updatedOrder = reduxOrders.filter((item) => item.orderID == orderRdx.orderID)
      //here we set updated order into orderRdx 
      setOrderRdx(updatedOrder[0])
    }
  }, [reduxOrders])

  useEffect(() => {
    const { id } = user;
    (async () => {
      const res = await firebase_product_service.getExtraItems(id)
      const result = res.map((item) => ({ ...item, price: '$' + item.price }))
      setAllItems(result)
    })()
  }, []);

  useEffect(() => {
    if (orderRdx != "") {
      const res = compute_service_data.computeServiceName(orderRdx.serviceID, services)
      setServiceName(res)
    }
  }, [orderRdx])

  const handleEditModal = (item) => {
    setCurrentItem(item);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  const handleAddItemModal = () => {
    setIsOpenAddItemModal(true);
  };

  const handleCloseAddItemModal = () => {
    setIsOpenAddItemModal(false);
  };

  const handleOpenInvoice = () => {
    setIsOpenInvoiceModal(true);
  };
  const handleCloseInvoice = () => {
    setIsOpenInvoiceModal(false);
  };
  const handleOpenGenerateInvoice = () => {
    setIsOpenGenerateInvoiceModal(true);
  };
  const handleCloseGenerateInvoice = () => {
    setIsOpenGenerateInvoiceModal(false);
  };
  const handleOpenGenerateDocket = () => {
    setisOpenGenerateDocketModal(true)
  }
  const handleCloseGenerateDocket = () => {
    setisOpenGenerateDocketModal(false)
  }
  const handleOpenViewDocket = () => {
    setisOpenViewDocketModal(true)
  }
  const handleCloseViewDocket = () => {
    setisOpenViewDocketModal(false)
  }

  const editItem = (items) => {
    setSupplierItems(items);
    // addSupplierItemsToOrder(items)
  };

  const handleDeleteItem = (item) => {
    swal({
      text: "Are you sure you want to delete!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      buttons: {
        Confirm: { text: "Yes", className: "okayButton" },
        Cancel: { text: "No", className: "cancelButton" },
      },
    }).then((value) => {
      if (value == "Confirm") {
        const newItems = supplierItems.filter(
          (val) => val.itemName !== item.itemName
        );
        handleDelete(newItems);
      }
    });
  };

  const handleDelete = (items) => {
    setSupplierItems(items);
    // addSupplierItemsToOrder(items)
  };

  const updateItems = (data) => {
    const thePrice = parseFloat(data.price.replace(/^\D+/g, ""));
    const estimatedCost = thePrice * data.quantity;
    const updatedItems = [
      ...supplierItems,
      {
        itemName: data.productName ? data.productName : "",
        quantity: data.quantity ? data.quantity : "",
        unitCost: data.price ? data.price : "",
        total: estimatedCost ? estimatedCost : "",
      },
    ];
    setSupplierItems(updatedItems);
    // addSupplierItemsToOrder(updatedItems)
  };

  const setItems = async () => {
    try {
      const resItems = await firebase_order_service.returnSupplierItemsToOrder(
        orderID
      );
      if (resItems) {
        setSupplierItems(resItems);
      }
      const resOrder = await firebase_order_service.getOrder(orderID);

      if (resOrder) {
        setPending(false);
        setOrderRdx(resOrder);
        if (resOrder.status == "fulfilled") setIsFinalised(true);
        if (resOrder.status == "cancelled") {
          window.location.href = "/";
        }

        setTable([
          {
            itemName: resOrder.productName ? resOrder.productName : "",
            quantity: resOrder.quantity ? resOrder.quantity : "",
            unitCost: resOrder.price ? resOrder.price : "",
            total: resOrder.estimatedCost ? resOrder.estimatedCost : "",
          },
        ]);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const cancelOrder = (orderID, status) => {
    Swal.fire({
      title: "Are You Sure You Want to Cancel order",
      text: "Please Enter the reason for the cancellation of order",
      input: "text",
      showCancelButton: true,
      confirmButtonColor: "#1c8fec",
      cancelButtonColor: "#fa013b",

      // buttons: {
      //   Confirm: { text: "Yes", className: "okayButton" },
      //   Cancel: { text: "No", className: "cancelButton" },
      // },
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
          let cancelledBy = 'Supplier'
          let cancelDate = time_service.returnDate()
          let cancelTime = time_service.returnTime()
          firebase_order_service
            .cancelOrder(orderRdx, orderID, status, cancelledBy, result?.value, cancelDate, cancelTime)
            .then((res) => {
              if (res.status) {
                const updatedorders = reduxOrders.map((x) =>
                  x.orderID == orderID
                    ? {
                      ...x,
                      status: "cancelled",
                      cancelledBy,
                      cancellationReason: result?.value,
                      cancelDate,
                      cancelTime,
                      updatedAt: res.updatedAt
                    }
                    : x
                );
                dispatch(setOrders(updatedorders));
                window.location.href = "/app/supplier/order";
              }
            })
        } catch (err) {
          console.log(err);
        } finally {
          setLoadingCancel(false);
        }
      }
    });
  };

  const finaliseOrder = (orderID, status) => {
    // ? updatedOrder is the current order on the screen
    swal({
      text: "Are you sure you want to finalise your Order !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      // confirmButtonColor: "black",
      buttons: {
        Confirm: { text: "Yes", className: "okayButton" },
        Cancel: { text: "No", className: "cancelButton" },
      },
    }).then((value) => {
      if (value == "Confirm") {
        const fulfillDate = time_service.returnDate()
        const fulfillTime = time_service.returnTime()

        const updatedOrder = {
          ...orderRdx,
          supplierItems,
          status,
          fulfillDate,
          fulfillTime
        };
        setOrderRdx(updatedOrder);
        const updatedOrders = reduxOrders.map((item) =>
          item.orderID == orderID
            ? {
              ...item,
              supplierItems: supplierItems,
              status: status,
              fulfillDate,
              fulfillTime
            }
            : item
        );
        // ? updatedOrders is the allOrders for redux and firebase update
        orderStatusFinalise(orderID, status, fulfillDate, fulfillTime);
        addSupplierItemsToOrder(supplierItems);
        dispatch(setOrders(updatedOrders));
      }
    });
  };

  const handleSaveChanges = (orderID) => {
    // ? updatedOrder is the current order on the screen
    const updatedOrder = {
      ...orderRdx,
      supplierItems,
    };
    setOrderRdx(updatedOrder);

    const updatedOrders = reduxOrders.map((item) =>
      item.orderID == orderID
        ? {
          ...item,
          supplierItems: supplierItems,
        }
        : item
    );
    // ? updatedOrders is the allOrders for redux and firebase update
    dispatch(setOrders(updatedOrders));
    addSupplierItemsToOrder(supplierItems);
  };

  const addSupplierItemsToOrder = async (items) => {
    try {
      const res = await firebase_order_service.addSupplierItemsToOrder(
        orderID,
        items,
        orderRdx
      );
      if (res) {
        swal({
          text: "Order updated Successfully!",
          icon: "success",
          buttons: {
            Confirm: { text: "Ok", className: "okayButton" },
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const orderStatusFinalise = async (orderID, status, fulfillDate, fulfillTime) => {
    setLoadingFinalise(true);
    try {
      const result = await firebase_order_service.fulfillSupplierOrder(
        orderRdx,
        orderID,
        status,
        fulfillDate,
        fulfillTime
      );
      if (result) {
        setIsFinalised(true);
        // window.location.href = "/app/supplier/order"
      }
    } catch (err) {
      console.log({ err });
    } finally {
      setLoadingFinalise(false);
    }
  };

  const computeProductName = (productID) => {
    if (productID) {
      return services.find(({ uid }) => uid === productID).serviceName;
    }
  };

  if (pending) {
    return <CustomLoader />;
  }

  return (
    <div className="profilePageContainer">
      {/* <LoadingScreen
          // animate={state.animate}
          text="Please wait while your updating ..."
        /> */}
      <div className="profileContainer">
        <Grid container style={style.mainContainer}>
          {/* <Grid container style={style.backButtonGrid}>
            <Grid md={1} style={{ textAlign: "right" }}>
              <ArrowBackIosIcon style={style.iconStyle} />
            </Grid>
            <Grid md={11}></Grid>
          </Grid> */}
          <Grid
            item
            xl={2}
            lg={2}
            md={2}
            sm={12}
            xs={12}
            style={style.backButtonGrid}
          >
            <ArrowBackIosIcon
              style={style.iconStyle}
              onClick={() => {
                window.location.href = "/app/supplier/order";
              }}
            />
          </Grid>
          <Grid
            item
            xl={8}
            lg={8}
            md={8}
            sm={12}
            xs={12}
            style={style.cardGrid}
          >
            <Grid container>
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <Grid style={{ marginTop: 20 }}>
                  {orderRdx.invoiceGenerated ||
                    orderRdx.status == "fulfilled" ? (
                    <h3 style={{ color: "#42a5f5" }}>Order Summary </h3>
                  ) : (
                    <h3 style={{ color: "#42a5f5" }}>Fulfill Order </h3>
                  )}
                  <>
                    <p style={style.dataFieldStyle}>Customer</p>
                    <TextField
                      disabled={true}
                      value={orderRdx.customerName ? orderRdx.customerName : ""}
                    ></TextField>
                  </>
                  <>
                    <p style={style.dataFieldStyle}>Customer Phone Number</p>
                    <TextField
                      disabled={true}
                      value={
                        orderRdx.customerPhone ? orderRdx.customerPhone : ""
                      }
                    ></TextField>
                  </>
                  <>
                    <p style={style.dataFieldStyle}>Customer Mobile</p>
                    <TextField
                      disabled={true}
                      value={
                        orderRdx.customerMobile ? orderRdx.customerMobile : ""
                      }
                    ></TextField>
                  </>
                  <>
                    <p style={style.dataFieldStyle}>Date & Time When Order</p>
                    {
                      <TextField
                        disabled={true}
                        value={orderRdx.time ? orderRdx.time : ""}
                      ></TextField>
                    }
                  </>
                  <>
                    <p style={style.dataFieldStyle}>Delivery Date</p>
                    <TextField
                      disabled={true}
                      value={orderRdx.deliveryDate ? orderRdx.deliveryDate : ""}
                    ></TextField>
                  </>
                  <>
                    <p style={style.dataFieldStyle}>Delivery Time</p>
                    <TextField
                      disabled={true}
                      value={orderRdx.deliveryTime ? orderRdx.deliveryTime : ""}
                    ></TextField>
                  </>
                  <>
                    <p style={style.dataFieldStyle}>Site Location</p>
                    <TextField
                      disabled={true}
                      value={orderRdx.locationName ? orderRdx.locationName : ""}
                    ></TextField>
                  </>
                  <>
                    <p style={style.dataFieldStyle}>Order No</p>
                    <TextField
                      disabled={true}
                      value={orderRdx.orderNo ? orderRdx.orderNo : ""}
                    ></TextField>
                  </>
                  <>
                    <p style={style.dataFieldStyle}>Balance</p>
                    {
                      <TextField
                        disabled={true}
                        value={orderRdx.price ? orderRdx.price.toFixed(2) : ""}
                      ></TextField>
                    }
                  </>
                  <Typography style={style.dataFieldStyle}>Due Date</Typography>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      style={{ marginTop: 0 }}
                      margin="normal"
                      id="date-picker-dialog"
                      format="dd/MM/yyyy"
                      disabled={true}
                      variant="inline"
                      value={orderRdx.deliveryDate ? new Date(orderRdx.deliveryDate.split("/").reverse().join("/")) : ''}
                    // onChange={handleDateChange}
                    // KeyboardButtonProps={{
                    //   'aria-label': 'change date',
                    // }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>

              <Grid container xl={9} lg={9} md={9} sm={12} xs={12}>
                <Grid container style={style.ratingGrid}>
                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    component="fieldset"
                    borderColor="transparent"
                  >
                    <Rating name="pristine" value={null} />
                    <Typography component="legend">Rate Customer</Typography>
                  </Grid>
                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    style={{
                      paddingLeft: 100,
                      display: "flex",
                      float: "right",
                      // alignContent: "right",
                    }}
                  >
                    <TableContainer>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{ color: "#42a5f5", textAlign: "center" }}
                          >
                            Item
                          </TableCell>
                          <TableCell
                            style={{ color: "#42a5f5", textAlign: "center" }}
                          >
                            Quantity
                          </TableCell>
                          <TableCell
                            style={{ color: "#42a5f5", textAlign: "center" }}
                          >
                            Unit Cost
                          </TableCell>
                          <TableCell
                            style={{ color: "#42a5f5", textAlign: "center" }}
                          >
                            Total
                          </TableCell>
                          <TableCell
                            style={{
                              color: "#42a5f5",
                              textAlign: "center",
                              display: isFinalised ? "none" : "",
                            }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="center">
                            {orderRdx.serviceID ? computeProductName(orderRdx.serviceID) : ''}
                          </TableCell>
                          <TableCell align="center">
                            {orderRdx?.quantity}{' '}{orderRdx.serviceID ? compute_service_data.computeServiceUnit(orderRdx.serviceID, services) : ''}
                          </TableCell>
                          <TableCell align="center">
                            $ {(orderRdx.price / orderRdx.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            $ {orderRdx.price ? orderRdx.price.toFixed(2) : ""}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ display: isFinalised ? "none" : "" }}
                          ></TableCell>
                        </TableRow>
                        {supplierItems.map((item) => (
                          <TableRow>
                            <TableCell align="center">
                              {item.itemName}
                            </TableCell>
                            <TableCell align="center">
                              {item.quantity}
                            </TableCell>
                            <TableCell align="center">
                              {item.unitCost}
                            </TableCell>
                            <TableCell align="center">
                              {item.total.toFixed(2)}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ display: isFinalised ? "none" : "" }}
                            >
                              <IconButton
                                disabled={!supplierItems.length}
                                onClick={() => handleEditModal(item)}
                                style={{
                                  color: "#42a5f5",
                                }}
                              >
                                <CreateIcon />
                              </IconButton>
                              <IconButton
                                disabled={!supplierItems.length}
                                onClick={() => handleDeleteItem(item)}
                                style={{
                                  color: "red",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </TableContainer>
                  </Grid>
                  <Grid container style={{}}>
                    <Grid md={12} sm={12}
                      item
                      style={{
                        display: serviceName == 'Premix Concrete' && !isFinalised ? "" : "none",
                        marginTop: 5
                      }}>
                      <Button
                        onClick={handleOpenGenerateDocket}
                        style={{
                          backgroundColor: "#42a5f5",
                          color: "white",
                          textTransform: 'capitalize'
                        }}
                      >
                        Generate Delivery Docket
                </Button>
                    </Grid>
                    <Grid md={12} sm={12}
                      item
                      style={{
                        display: orderRdx?.docket?.length ? "" : "none",
                        marginTop: 5,
                      }}>
                      <Button
                        onClick={handleOpenViewDocket}
                        style={{
                          backgroundColor: "#42a5f5",
                          color: "white", padding: "5px 10px",
                          textTransform: 'capitalize'
                        }}
                      >
                        View Dispatched Dockets
                </Button>
                    </Grid>
                    <Grid
                      md={12} sm={12}
                      item
                      style={{
                        display: isFinalised ? "none" : "",
                        marginTop: 5
                      }}
                    >
                      <Button
                        onClick={handleAddItemModal}
                        style={{
                          backgroundColor: "#42a5f5",
                          color: "white",
                          marginRight: 10,
                          textTransform: 'capitalize'
                        }}
                      >
                        Add Item
                    </Button>
                      <Button
                        onClick={handleSaveChanges}
                        style={{
                          backgroundColor: "#42a5f5",
                          color: "white",
                          textTransform: 'capitalize'
                          // marginRight: 10,
                        }}
                      >
                        Save Changes
                    </Button>
                    </Grid>
                  </Grid>
                  <AddItemModal
                    showAddItemModal={isOpenAddItemModal}
                    handleCloseAddItemModal={handleCloseAddItemModal}
                    updateItems={updateItems}
                    supplierItems={supplierItems}
                    allItems={allItems}
                    setAllItems={setAllItems}
                  />
                  <GenerateDeliveryDocketModal
                    showDeliveryDocketModal={isOpenGenerateDocketModal}
                    handleCloseGenerateDocket={handleCloseGenerateDocket}
                  />
                  <ViewDeliveryDocketModal
                    showViewDeliveryDocketModal={isOpenViewDocketModal}
                    handleCloseViewDocket={handleCloseViewDocket}
                  />
                  <EditItemModal
                    showEditModal={isOpenEditModal}
                    handleCloseEditModal={handleCloseEditModal}
                    editItem={editItem}
                    supplierItems={supplierItems}
                    currentItem={currentItem}
                  />
                  <Grid
                    item
                    md={12}
                    style={{ alignSelf: "flex-end" }}
                    item
                    style={{
                      display: isFinalised ? "none" : "",
                      marginTop: 10,
                    }}
                  >
                    <LoaderButton
                      isLoading={loadingCancel}
                      loadingProps={{
                        size: 24,
                        style: { color: "white" },
                      }}
                      onClick={() => cancelOrder(orderID, "cancelled")}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        marginRight: 10,
                        textTransform: 'capitalize'
                      }}
                    >
                      Cancel Order
                    </LoaderButton>

                    <LoaderButton
                      isLoading={loadingFinalise}
                      loadingProps={{
                        size: 24,
                        style: { color: "white" },
                        textTransform: 'capitalize'
                      }}
                      onClick={() => finaliseOrder(orderID, "fulfilled")}
                      style={{ backgroundColor: "#42a5f5", color: "white" }}
                    >
                      Finalise Order
                    </LoaderButton>
                  </Grid>
                  <Grid
                    md={12}
                    // style={{ alignSelf: "flex-end" }}
                    item
                    style={{
                      display: isFinalised ? "" : "none",
                      marginTop: 10,
                    }}
                  >
                    <div>
                      <LoaderButton
                        isLoading={loadingCancel}
                        loadingProps={{
                          size: 24,
                          style: { color: "white" },
                        }}
                        onClick={handleOpenInvoice}
                        style={{
                          backgroundColor: "#42a5f5",
                          color: "white",
                          textTransform: 'capitalize'
                        }}
                      >
                        <Typography
                          style={{ paddingLeft: 19, paddingRight: 19 }}
                        >
                          View Invoice
                        </Typography>
                      </LoaderButton>
                    </div>
                    <div
                      style={{
                        display: !orderRdx.invoiceGenerated ? "" : "none",
                        marginTop: 10,
                      }}
                    >
                      <LoaderButton
                        isLoading={loadingFinalise}
                        loadingProps={{
                          size: 24,
                          style: { color: "white" },
                        }}
                        onClick={handleOpenGenerateInvoice}
                        style={{ backgroundColor: "#42a5f5", color: "white", textTransform: 'capitalize' }}
                      >
                        <Typography> Generate Invoice</Typography>
                      </LoaderButton>
                    </div>
                    {isOpenGenerateDocketModal &&
                      _renderDocketModal(
                        isOpenGenerateDocketModal,
                        handleCloseGenerateDocket,
                        orderRdx
                      )}
                    {
                      isOpenViewDocketModal &&
                      _renderViewDocketModal(
                        isOpenViewDocketModal,
                        handleCloseViewDocket,
                        orderRdx
                      )
                    }
                    {isOpenInvoiceModal &&
                      _renderInvoiceModal(
                        isOpenInvoiceModal,
                        handleCloseInvoice,
                        orderRdx
                      )}
                    {isOpenGenerateInvoiceModal &&
                      _renderGenerateInvoiceModal(
                        isOpenGenerateInvoiceModal,
                        handleCloseGenerateInvoice,
                        orderRdx
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={12} xs={12}></Grid>
        </Grid>
      </div>
    </div >
  );
};

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

const _renderDocketModal = (
  isOpenGenerateDocketModal,
  handleCloseGenerateDocket,
  orderRdx
) => (
  <GenerateDeliveryDocketModal
    open={isOpenGenerateDocketModal}
    handleClose={handleCloseGenerateDocket}
    order={orderRdx}
  />
)
const _renderInvoiceModal = (
  isOpenInvoiceModal,
  handleCloseInvoice,
  orderRdx
) => (
  <InvoiceModal
    open={isOpenInvoiceModal}
    handleClose={handleCloseInvoice}
    order={orderRdx}
  />
);

const _renderGenerateInvoiceModal = (
  isOpenGenerateInvoiceModal,
  handleCloseGenerateInvoice,
  orderRdx
) => (
  <GenerateInvoiceModal
    open={isOpenGenerateInvoiceModal}
    handleClose={handleCloseGenerateInvoice}
    order={orderRdx}
  />
);

export default ModifyOrder;
