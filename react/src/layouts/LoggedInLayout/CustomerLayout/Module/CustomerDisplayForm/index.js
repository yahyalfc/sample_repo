import { useState, useEffect } from "react";
import { TextField, Grid, Typography } from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import { firebase_user_services } from "../../../../../services/firebase/firebase_user";
import swal from "sweetalert";
import CreateIcon from "@material-ui/icons/Create";
import LoaderButton from "../../../../../components/LoaderButton";
import InputMask from "react-input-mask";
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../../../../../redux/actions'
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function CustomerDisplayForm() {
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user)
  let initialValues = user
  const [googleaddress, setgoogleaddress] = useState(user.googleaddress)
  const [addressvalue, setaddressvalue] = useState(null);
  const dispatch = useDispatch()
  // const initialValues = props.customerDisplayformdata;

  useEffect(() => {
    (async () => {
      const res = await firebase_user_services.getLoginUser(user?.id)
      dispatch(setUser(res))
    })();
  }, [])

  useEffect(() => {
    initialValues = user
  }, [user])

  useEffect(() => {
    if (addressvalue) {
      setgoogleaddress(addressvalue.label)
    }
  }, [addressvalue])

  let validationSchema
  if (user.type == 'business') {
    validationSchema = Yup.object({
      name: Yup.string()
        .min(5, "Must be at least 5 ")
        .max(30, "Must be at most 30 letters")
        .required("User Name is Required"),
      email: Yup.string()
        .email("Invalid Email Format")
        .required("Email Is Required"),
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
      businessName: Yup.string()
        .min(5, 'Must be at least 5 digits')
        .max(30, 'Must be at most 30 digits'),
      ABN: Yup.string()
        .length(11, "ABN must be 11 digits!"),
      businessAddress: Yup.string().required('Address is required'),
    })
  }
  else {
    validationSchema = Yup.object({
      name: Yup.string()
        .min(5, 'Must be at least 5 digits')
        .max(30, "Must be at most 30 letters")
        .required("User Name is Required"),
      email: Yup.string()
        .email("Invalid Email Format")
        .required("Email Is Required"),
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
      address: Yup.string().required('Address is required')
        .max(5, "Must be at least 5 letters")
        .max(30, "Must be at most 30 letters")
    });
  }

  const onSubmit = (values) => {
    swal({
      title: "Update Profile",
      text: "Are you sure you want to update your profile?",
      icon: "info",
      buttons: {
        Confirm: { text: "Yes", className: "okayButton" },
        Cancel: { text: "No", className: "cancelButton" },
      },
    })
      .then(async (value) => {
        if (value == "Confirm") {
          await handleUserDataUpdate(values);
        }
      })
      .finally
      // setLoading(false)
      ();
  };

  const handleUserDataUpdate = async (values) => {

    if (values) {
      const { id } = user;
      let val = { ...values, googleaddress }

      const obj = {
        ...val,
        id,
        role: "Customer",
      };

      try {
        setLoading(true);
        const result = await firebase_user_services.updateUserData(id, obj);
        if (result.status) {
          dispatch(setUser({ ...user, ...val }));
        }
      } catch (err) {
        console.log(err);
        swal({
          icon: "error",
          text: err,
        });
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
    touched,
    values,
  } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <Typography
        style={{
          paddingBottom: "20px",
          fontSize: "20px",
          color: "#42A5F5",
          paddingBottom: "  15px",
          marginLeft: 40,
        }}
      >
        Profile Info
      </Typography>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {
          user.type == 'business' ?
            <>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Full Name"
                  d
                  onBlur={handleBlur}
                  size="small"
                  variant="outlined"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={values?.name}
                  required
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  style={{ padding: "10px 0px", width: "80%" }}
                />
                <TextField
                  label="Email"
                  onBlur={handleBlur}
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
                  style={{ padding: "10px 0px ", width: "80%" }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
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
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Business Address"
                  onBlur={handleBlur}
                  size="small"
                  variant="outlined"
                  type="text"
                  name="businessAddress"
                  onChange={handleChange}
                  value={values.businessAddress}
                  required
                  error={Boolean(touched.businessAddress && errors.businessAddress)}
                  helperText={touched.businessAddress && errors.businessAddress}
                  style={{ padding: "10px 0px", width: "80%", }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: -5 }}>
                  <div style={{ width: '80%' }}>
                    <label style={{ fontSize: 12, display: 'flex', justifyContent: 'left', color: 'rgb(170, 170, 170)', marginBottom: -5, paddingLeft: 15, backgroundColor: 'white', paddingBottom: 5 }} >Address*</label>
                    <GooglePlacesAutocomplete
                      apiKey="AIzaSyBt9I6muDiyEAJ9FhjaZBi6KTYdEU9wGVQ"
                      selectProps={{
                        placeholder: `${user.googleaddress}`,
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
                            border: 'none'
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
              <Grid item md={6} xs={12}>
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

              </Grid>
              <Grid
                container
                md={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item xs={9} sm={9} md={5} lg={3}>
                  <LoaderButton
                    isLoading={loading}
                    loadingProps={{
                      size: 24,
                      style: { color: "white" },
                    }}
                    fullWidth
                    startIcon={<CreateIcon />}
                    style={{
                      backgroundColor: "#42a5f5",
                      color: "white",
                      marginBottom: 10,
                      marginTop: 20,
                      textTransform: "capitalize",
                    }}
                    type={"submit"}
                  >
                    Update Profile
            </LoaderButton>
                </Grid>
              </Grid>
            </>
            :
            <>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Full Name"
                  size="small"
                  variant="outlined"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.name}
                  required
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  style={{ padding: "10px 0px", width: "80%" }}
                />
                <TextField
                  label="Email"
                  onBlur={handleBlur}
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
                  style={{ padding: "10px 0px ", width: "80%" }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: -5 }}>
                  <div style={{ width: '80%' }}>
                    <label style={{ fontSize: 12, display: 'flex', justifyContent: 'left', color: 'rgb(170, 170, 170)', marginBottom: -5, paddingLeft: 15, backgroundColor: 'white', paddingBottom: 5 }} >Address*</label>
                    <GooglePlacesAutocomplete
                      apiKey="AIzaSyBt9I6muDiyEAJ9FhjaZBi6KTYdEU9wGVQ"
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
              <Grid item md={6} xs={12}>
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
                  required
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                  style={{ padding: "10px 0px ", width: "80%" }}
                />
              </Grid>


              <Grid
                container
                md={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item xs={9} sm={9} md={5} lg={3}>
                  <LoaderButton
                    isLoading={loading}
                    loadingProps={{
                      size: 24,
                      style: { color: "white" },
                    }}
                    fullWidth
                    startIcon={<CreateIcon />}
                    style={{
                      backgroundColor: "#42a5f5",
                      color: "white",
                      marginBottom: 10,
                      marginTop: 20,
                      textTransform: "capitalize",
                    }}
                    type={"submit"}
                  >
                    Update Profile
            </LoaderButton>
                </Grid>
              </Grid>
            </>}
      </Grid>
    </form>
  );
}

export default CustomerDisplayForm;
