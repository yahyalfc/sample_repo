import {
  Grid,
  makeStyles,
  Modal,
  Typography,
  Box,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import LoaderButton from "../../../../../../components/LoaderButton";
import { firebase_invoice_service } from "../../../../../../services/firebase/invoice_service";
import swal from "sweetalert";
import { firebase_order_service } from "../../../../../../services/firebase/order_service";
import { useSelector, useDispatch } from "react-redux";
import { setOrders } from "../../../../../../redux/actions";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "75vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "50px ",
    // padding: theme.spacing(5, 4, 5),
  },
}));
function GenarateInvoice(props) {
  const [fullDate, setFullDate] = useState(Date.now());
  const [dueDate, setDueDate] = useState(Date.now());
  const classes = useStyles();
  const { open, handleClose, order } = props;
  const orders = useSelector((state) => state.orders);
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();

  useEffect(() => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    setDueDate(today)
  }, [])
  const handleDateChange = (formatdate, date) => {
    setFullDate(formatdate);
    setDueDate(date);
  };

  const handleGenerate = async () => {
    console.log('hi o');

    const {
      ABN,
      address,
      accountName,
      accountNumber,
      bankName,
      bsbnumber,
    } = user;

    if (bankName && accountName && accountNumber && bsbnumber) {
      const invoiceObj = {
        ...order,
        dueDate,
        ABN,
        supplierAddress: address,
        accountName,
        accountNumber,
        bankName,
        bsbnumber,
      };

      try {
        const res = await firebase_invoice_service.createInvoice(invoiceObj);
        const result = await firebase_order_service.generateInvoice(
          invoiceObj,
          invoiceObj.orderID
        );
        console.log({ res });
        console.log({ result });
        if (result) {
          const updatedorders = orders.map((x) =>
            x.orderID == invoiceObj.orderID ? { ...x, invoiceGenerated: true } : x
          );
          dispatch(setOrders(updatedorders));
          // props.handleStatusGenerateInvoice()
          handleClose();

          swal({
            text: "Invoice generated successfully!",
            icon: "success",
            buttons: {
              Confirm: { text: "Ok", className: "okayButton" },
            },
          }).then(() => {
            window.location.href = "/app/supplier/invoice";
          })

          // move invoiceGenerated to redux
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      swal({
        title: "No Payment Details",
        text: "Enter payment details in profile",
        icon: "error",
        buttons: {
          Confirm: { text: "Okay", className: "okayButton" },
        },
      })
        .then((value) => {
          window.location.href = "/app/supplier/profile";
        })
    };
  };

  const body = (
    <Grid
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 20,
        // width: "60%",
      }}
    >
      <Grid className={classes.paper} style={{ width: "50%", top: "30%" }}>
        <Grid
          container
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box fullWidth mb={10}>
            <Typography variant="h6" style={{ marginBottom: 20 }}>
              Select Due Date for this Invoice
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                minDate={Date.now()}
                fullWidth
                autoOk={true}
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                placeholder={"Due Date"}
                value={fullDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Grid
            style={{
              display: "flex",
              alignSelf: "flex-end",
              marginTop: 40,
            }}
          >
            <LoaderButton
              // isLoading={loadingFinalise}
              loadingProps={{
                size: 24,
                style: { color: "white" },
              }}
              onClick={handleGenerate}
              style={{ backgroundColor: "#42a5f5", color: "white" }}
            >
              Generate Invoice
            </LoaderButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
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

export default GenarateInvoice;
