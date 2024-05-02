import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Grid, TextField, Typography } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import { firebase_user_services } from "../../../../../../services/firebase/firebase_user";
import { useFormik } from "formik";
import swal from "sweetalert";
import LoaderButton from "../../../../../../components/LoaderButton";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import "../../../../../../components/SwalStyle/SwalStyle.css";
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../../../../../../redux/actions'
const _ = require("lodash");

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundImage: " linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
    boxShadow: theme.shadows[5],
    padding: "35px",
    outline: "none",
    width: "45vw",
    display: "flex",
    flexDirection: "column",
    borderRadius: 5,
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();
  const { open, handleClose } = props;
  const [initialValues, setInitialValue] = useState({})
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    var subset = _.pick(user, ['accountName', 'bankName', 'bsbnumber', 'accountNumber']);
    setInitialValue(subset);
  }, [])

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    accountName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .min(5, "Must be at least 5 letters")
      .max(30, "Must be at most 30 letters")
      .required("Account Name is Required"),
    bankName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .min(5, "Must be at least 5 letters")
      .max(30, "Must be at most 30 letters")
      .required("Bank Name is Required"),
    bsbnumber: Yup.string()
      .trim()
      .matches(/^\d{3}\s\d{3}$/, "Bsb Number must be 6 digits")
      .required(),
    accountNumber: Yup.string()
      .min(5, "Must be at least 5 digits")
      .max(30, "Must be at most 30 digits")
      .required('Account Number is Required'),
  });

  const onSubmit = async (values) => {
    // console.log("This on submit is working!");
    swal({
      text: "Update Payment Data ?",
      buttons: {
        Confirm: { text: "Yes", className: "okayButton" },
        Cancel: { text: "No", className: "cancelButton" },
      },
    }).then((value) => {
      if (value == "Confirm") {
        handleDataUpdate(values);
      }
    });
  };

  const handleDataUpdate = async (values) => {
    if (values) {
      const { id } = user

      try {
        setLoading(true);
        const result = await firebase_user_services.updateSupplierPaymentData({
          id,
          ...values,
        });
        if (result) {
          dispatch(setUser({ ...user, ...values }))
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        handleClose();
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validationSchema,
  });

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    values,
  } = formik;

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <form onSubmit={handleSubmit}>
              <Typography
                variant="body1"
                style={{
                  color: "#42a5f5",
                  paddingBottom: 40,
                  fontSize: 28,
                  textAlign: "center",
                }}
              >
                Payment Detail
              </Typography>
              <TextField
                label="Account Name"
                size="small"
                variant="outlined"
                type="text"
                name="accountName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.accountName}
                required
                error={Boolean(touched.accountName && errors.accountName)}
                helperText={touched.accountName && errors.accountName}
                fullWidth
                style={{ marginBottom: 15 }}
              />

              <TextField
                label="Bank Name"
                size="small"
                variant="outlined"
                type="string"
                name="bankName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bankName}
                error={Boolean(touched.bankName && errors.bankName)}
                helperText={touched.bankName && errors.bankName}
                required
                fullWidth
                style={{ marginBottom: 15 }}
              />
              <InputMask
                mask="999 999"
                maskChar="-"
                alwaysShowMask={true}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.bsbnumber}
              >
                {() => (
                  <TextField
                    label=" BSB Number"
                    size="small"
                    variant="outlined"
                    type="string"
                    name="bsbnumber"
                    error={Boolean(touched.bsbnumber && errors.bsbnumber)}
                    helperText={touched.bsbnumber && errors.bsbnumber}
                    required
                    fullWidth
                    style={{ marginBottom: 15 }}
                  />
                )}
              </InputMask>
              <TextField
                label="Account Number"
                size="small"
                variant="outlined"
                type="text"
                name="accountNumber"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.accountNumber}
                required
                error={Boolean(touched.accountNumber && errors.accountNumber)}
                helperText={touched.accountNumber && errors.accountNumber}
                fullWidth
                style={{ marginBottom: 15 }}
              />

              <Grid
                container
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item md={4}>
                  <LoaderButton
                    isLoading={loading}
                    loadingProps={{
                      size: 24,
                      style: { color: "white" },
                    }}
                    type="submit"
                    endIcon={<CreateIcon />}
                    fullWidth
                    style={{
                      color: "white",
                      backgroundColor: "#42a5f5",
                      textTransform: "capitalize",
                    }}
                  >
                    Update
                  </LoaderButton>
                </Grid>
              </Grid>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}