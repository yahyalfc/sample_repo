import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CreateIcon from "@material-ui/icons/Create";
import { Rating } from "@material-ui/lab";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import * as Yup from "yup";
import LoaderButton from "../../../../../components/LoaderButton";
import { firebase_user_services } from "../../../../../services/firebase/firebase_user";
import { firebase_location_service } from "../../../../../services/geofirestore/location_service";
import PaymentDetailModal from "./paymentDetailModal";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../../../redux/actions";
import "../../../../../components/SwalStyle/SwalStyle.css";
import style from "./style";
import InputMask from "react-input-mask";
import { Modal } from "@material-ui/core";
import AddNewSupplierLocation from "../../../layout_components/AddNewSupplierLocation";
import SupplierProfileMap from "../../../../../components/SupplierProfileMap";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
const _ = require("lodash");

function SupplierProfile() {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(4);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [locationsArray, setLocationsArray] = useState([]);
  const [initialValues, setInitialValue] = useState(null);
  const [mapModal, setMapModal] = useState(false);
  const user = useSelector((state) => state.user);
  const { id } = user;
  const [mapHeight, setMapHeight] = useState(false);
  const [indexValue, setIndexValue] = useState("");
  const [addressvalue, setaddressvalue] = useState(null);
  const [googleaddress, setgoogleaddress] = useState(user.googleaddress)

  //ComponentDidMount
  useEffect(() => {
    (async () => {
      const result = await firebase_location_service.getSupplierLocation(id);
      const res = await firebase_user_services.getLoginUser(id)
      console.log({ res });
      console.log({ id });
      dispatch(setUser(res))
      setLocationsArray(result);
    })();
  }, []);

  useEffect(() => {
    var subset = _.pick(user, [
      "name",
      "email",
      "businessName",
      "ABN",
      "phone",
      "mobile",
      "address",
    ]);
    setInitialValue(subset);
  }, [user])

  useEffect(() => {
    if (addressvalue) {
      setgoogleaddress(addressvalue.label)
    }
  }, [addressvalue])

  // useEffect(() => {
  //   setaddressvalue(user.addressvalue)
  // }, [user])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMapClose = () => {
    setMapModal(false);
  };

  const coords = async (res, docID) => {
    if (res.lat || res.lng !== undefined) {
      // we get the updated document in responce which we will modify in locations array
      const result = await firebase_location_service.updateSupplierLocation(
        docID,
        res,
        id
      );
      const updatedorders = locationsArray.map((x) =>
        x.id == docID ? { ...x, coordinates: res } : x
      );
      setLocationsArray(updatedorders);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, "Must be at least 5 letters")
      .max(30, "Must be at most 30 digits")
      .required("User Name is Required"),
    email: Yup.string()
      .email("Invalid Email Format")
      .required("Email Is Required"),
    businessName: Yup.string()
      .min(5, "Must be at least 5 digits")
      .max(30, "Must be at most 30 digits")
      .required("Bussiness Name is Required"),
    ABN: Yup.string()
      .length(11, "ABN must be 11 digits!")
      .required("ABN is Required"),
    phone: Yup.string()
      .trim()
      .matches(
        /^\((0)\d{1}\)\s\d{4}\s\d{4}$/,
        "Phone number must be 10 digits, including area code"
      )
      .required(),
    mobile: Yup.string()
      .trim()
      .matches(
        /^(04)\d{2}\s\d{3}\s\d{3}$/,
        "Mobile number must be 10 digits, starting with '04'"
      )
      .required(),
    address: Yup.string()
      .required("Business Address is Required")
      .required("Please Enter Your Address"),
  });

  const onSubmit = async (values) => {
    swal({
      title: "Update Profile",
      text: "Are you sure you want to update your profile?",
      icon: "info",
      buttons: {
        Confirm: { text: "Yes", className: "okayButton" },
        Cancel: { text: "No", className: "cancelButton" },
      },
    }).then((value) => {
      if (value == "Confirm") {
        handleUserDataUpdate(values);
      }
    });
  };

  const handleUserDataUpdate = async (values) => {
    if (values) {
      try {
        let val = { ...values, googleaddress }
        setLoading(true);
        const result = await firebase_user_services.updateSupplierData(
          val,
          id
        );

        if (result.status) {
          dispatch(setUser({ ...user, ...val }));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  //values gives us access to values entered in our form
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
  } = formik;

  /*********************************************************************** */
  return (
    <div style={style.mainDiv}>
      <Grid container md={7} xs={12}>
        <Grid item md={12} xs={12}>
          <Box
            component="fieldset"
            mb={3}
            borderColor="transparent"
            style={{ float: "right" }}
          >
            <h2> Supplier Rating</h2>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </Box>
        </Grid>

        <Grid item md={12} xs={12} style={style.gridShadow}>
          <form onSubmit={handleSubmit}>
            <Typography style={style.title}>Profile </Typography>
            <Grid container style={style.centerGrid}>
              <Grid item md={6} xs={12} style={{ paddingTop: 5 }}>
                <TextField
                  label="Full Name"
                  size="small"
                  variant="outlined"
                  type="text"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.name}
                  required
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  style={style.field}

                />
                <TextField
                  label="Email"
                  size="small"
                  variant="outlined"
                  type="email"
                  name="email"
                  disabled={true}
                  onChange={handleChange}
                  value={values?.email}
                  required
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  style={style.field}

                />
                <TextField
                  label="Business Name"
                  size="small"
                  variant="outlined"
                  type="text"
                  name="businessName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.businessName}
                  required
                  error={Boolean(touched.businessName && errors.businessName)}
                  helperText={touched.businessName && errors.businessName}
                  style={style.field}

                />

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: -5 }}>
                  <div style={{ width: '80%' }}>
                    <label style={{ fontSize: 12, display: 'flex', justifyContent: 'left', color: 'rgb(170, 170, 170)', marginBottom: -5, paddingLeft: 15, backgroundColor: 'white', paddingBottom: 5 }} >Address*</label>
                    <GooglePlacesAutocomplete
          apiKey={process.env.GooglePlacesAutocompleteAPI}
          selectProps={{
                        placeholder: `${googleaddress}`,
                        addressvalue,
                        onChange: setaddressvalue,
                        styles: {
                          control: (props) => ({
                            ...props,
                            padding: '1px 0px',
                            width: '100%',
                          }),
                          option: (provided) => ({
                            ...provided,
                          }),
                          input: (provided) => ({
                            ...provided,
                          }),
                          placeholder: (props) => ({
                            ...props, textAlign: 'left', display: 'inline-block',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'pre',
                          })
                        }
                      }}
                      autocompletionRequest={{
                        componentRestrictions: {
                          country: ['aus'],
                        }
                      }}
                    />
                  </div>
                </div>

              </Grid>
              <Grid item md={6} xs={12} style={{ paddingTop: 5 }}>
                <InputMask
                  mask="99999999999"
                  maskChar=""
                  alwaysShowMask={true}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.ABN}
                >
                  {() => (
                    <TextField
                      label="ABN"
                      size="small"
                      variant="outlined"
                      type="text"
                      name="ABN"
                      required
                      error={Boolean(touched.ABN && errors.ABN)}
                      helperText={touched.ABN && errors.ABN}
                      style={{ padding: "10px 0px", width: "80%" }}

                    />
                  )}
                </InputMask>

                <InputMask
                  mask="(09) 9999 9999"
                  maskChar="-"
                  alwaysShowMask={true}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.phone}
                >
                  {() => (
                    <TextField
                      label="Phone"
                      size="small"
                      variant="outlined"
                      type="text"
                      name="phone"
                      required
                      error={Boolean(touched.phone && errors.phone)}
                      helperText={touched.phone && errors.phone}
                      style={{ padding: "10px 0px", width: "80%" }}

                    />
                  )}
                </InputMask>
                {/*errors.email ? <div>{errors.email}</div> : null */}
                <InputMask
                  mask="0499 999 999"
                  maskChar="-"
                  alwaysShowMask={true}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.mobile}
                >
                  {() => (
                    <TextField
                      label="Mobile"
                      size="small"
                      variant="outlined"
                      type="text"
                      name="mobile"
                      required
                      error={Boolean(touched.mobile && errors.mobile)}
                      helperText={touched.mobile && errors.mobile}
                      style={{ padding: "10px  0px", width: "80%" }}

                    />
                  )}
                </InputMask>
                <TextField
                  label="Additional Address Info"
                  size="small"
                  variant="outlined"
                  type="text"
                  name="address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.address}
                  // required
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                  style={style.field}

                />

              </Grid>
            </Grid>
            <Grid item >
              <Grid container md={12} xs={12} style={style.centerGrid}>
                <Grid md={5} sm={12}>
                  <Button
                    endIcon={<AttachMoneyIcon />}
                    onClick={handleOpen}
                    style={{
                      backgroundColor: "#3CB371",
                      color: "white",
                      // margin: "10px  0px",
                      width: "100%",
                      textTransform: "capitalize",
                    }}
                  >
                    Payment Detail
                </Button>
                  <PaymentDetailModal
                    open={open}
                    handleClose={handleClose}
                    setInitialValue={setInitialValue}
                  />
                </Grid>
                <Grid item md={5}>
                  <LoaderButton
                    isLoading={loading}
                    loadingProps={{
                      size: 24,
                      style: { color: "white" },
                    }}
                    startIcon={<CreateIcon />}
                    fullWidth
                    style={{ ...style.button, marginLeft: 20 }}
                    type={"submit"}
                  >
                    Update Profile
                  </LoaderButton>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
        {!!locationsArray.length
          ? locationsArray.map((location, index) => (
            <Grid
              item
              md={12}
              xs={12}
              style={{
                ...style.gridMap,
              }}
            >
              <SupplierProfileMap
                // mapStyle={{ height: "20vh" }}
                style={{ left: "50%", top: "50%" }}
                coordsRes={(res) => {
                  coords(res, location.id);
                }}
                location={location}
                locationsArray={locationsArray}
                setLocationsArray={setLocationsArray}
                coords={location.coordinates}
                inputCoords={location.coordinates}
                mapHeight={mapHeight}
                setMapHeight={setMapHeight}
                index={index}
                indexValue={indexValue}
                setIndexValue={setIndexValue}
              />
            </Grid>
          ))
          : ""}
        <Grid container style={{ marginTop: 30 }}>
          <Grid item xs={4} md={4}></Grid>
          <Grid item xs={4} md={4}>
            {" "}
            <Button
              fullWidth
              style={{
                backgroundColor: "#42A5F5",
                color: "white",
                marginBottom: 10,
              }}
              onClick={() => setMapModal(true)}
            >
              Add Another Location
            </Button>
          </Grid>
          <Grid item xs={4} md={4}></Grid>
        </Grid>
      </Grid>
      <Modal
        open={mapModal}
        onClose={handleMapClose}
        style={{ overflow: "scroll" }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AddNewSupplierLocation
          handleModalClose={handleMapClose}
          locationsArray={locationsArray}
          setLocationsArray={(data) => setLocationsArray(data)}
        />
      </Modal>
    </div >
  );
}

export default SupplierProfile;

