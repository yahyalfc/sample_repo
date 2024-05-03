import { useState } from "react"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { useFormik } from "formik"
import InputMask from "react-input-mask"
import * as Yup from "yup"
import { useSelector, useDispatch } from 'react-redux'
import { firebase_user_services } from "../../../../../services/firebase/firebase_user"
import { setUser } from "../../../../../redux/actions"
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function CustomerForm({ selection, role }) {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { name, email } = user
  const [addressvalue, setaddressvalue] = useState();


  let initialValues
  if (selection == 'Individual') {
    initialValues = {
      name,
      email,
      phone: '',
      mobile: '',
      address: ''
    }
  } else {
    initialValues = {
      name,
      email,
      phone: '',
      mobile: '',
      businessName: '',
      businessAddress: '',
      ABN: ''
    }
  }

  let validationSchema
  if (selection == 'Individual') {
    validationSchema = Yup.object().shape({
      name: Yup.string()
        .min(5, 'Must be at least 5 digits')
        .max(30, 'Must be most 30 digits')
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
        .required(
          'Phone is number is required'
        ),
      mobile: Yup.string()
        .trim()
        .matches(
          /^(04)\d{2}\s\d{3}\s\d{3}$/,
          "Mobile number must be 10 digits, starting with '04'"
        )
        .required('Mobile is required'),
      address: Yup.string().required('Address is required'),
    })
  } else {
    validationSchema = Yup.object().shape({
      name: Yup.string()
        .min(5, 'Must be at most 5 digits')
        .max(30, 'Must be at least 30 digits')
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
        .required('Phone Number is required'),
      mobile: Yup.string()
        .trim()
        .matches(
          /^(04)\d{2}\s\d{3}\s\d{3}$/,
          "Mobile number must be 10 digits, starting with '04'"
        )
        .required('Mobile Phone is required'),
      businessAddress: Yup.string().required('Business Address is required'),
      businessName: Yup.string()
        .min(5, 'Must be at least 5 digits')
        .max(30, 'Must be at most maximum')
        .required('Business Name is required'),
      ABN: Yup.string()
        .length(11, "ABN must be 11 digits!")
        .required('ABN is required'),
    })
  }

  const onSubmit = async (values) => {
    if (values) {
      const { id, createdAt } = user;
      try {
        if (selection == 'Business') {
          const result = await firebase_user_services.updateUserData(id, { ...values, googleaddress: addressvalue.label, status: 'unapproved', type: 'business', id, role, createdAt })
          if (result.status) {
            dispatch(setUser(result.user))
            window.location.href = "/app/dashboard"
          }
        } else {
          const result = await firebase_user_services.updateUserData(id, { ...values, googleaddress: addressvalue.label, status: 'unapproved', id, role, createdAt })
          if (result.status) {
            dispatch(setUser(result.user))
            window.location.href = "/app/dashboard"
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  })

  //values gives us access to values entered in our form
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    values,
  } = formik

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {
          selection == 'Individual' ?
            <>
              <Grid item md={6} xs={12}>
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
                  style={{ padding: "10px 0px", width: "80%" }}

                />
                <TextField
                  label="Email"
                  size="small"
                  variant="outlined"
                  type="email"
                  name="email"
                  disabled={true}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.email}
                  required
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  style={{ padding: "10px 0px ", width: "80%" }}

                />
                <TextField
                  label="Additional Address"
                  size="small"
                  variant="outlined"
                  type="text"
                  name="address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  // required
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
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
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: -5 }}>
                  <div style={{ width: '80%' }}>
                    <label style={{ fontSize: 12, display: 'flex', justifyContent: 'left', color: 'rgb(170, 170, 170)', marginBottom: -5, paddingLeft: 15, backgroundColor: 'white', paddingBottom: 5 }} >Address*</label>

                    <GooglePlacesAutocomplete
                      selectProps={{
                        placeholder: `${'Enter Address'}`,
                        addressvalue,
                        onChange: setaddressvalue,
                        styles: {
                          control: (props) => ({
                            ...props,
                            width: '100%',
                            padding: '1px 0px'
                          }),
                          option: (provided) => ({
                            ...provided,
                            border: 'none'
                          }),
                          input: (provided) => ({
                            ...provided,
                          }),
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

              </Grid>
              <Grid item md={6} xs={12}></Grid>
            </>
            : selection == 'Business' ?
              <>
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Contact Person"
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
                    style={{ padding: "10px 0px", width: "80%" }}
                  />
                  <TextField
                    label="Email"
                    size="small"
                    variant="outlined"
                    type="email"
                    name="email"
                    disabled={true}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.email}
                    required
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    style={{ padding: "10px 0px ", width: "80%" }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Business Name"
                    size="small"
                    variant="outlined"
                    type="text"
                    name="businessName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.businessName}
                    error={Boolean(touched.businessName && errors.businessName)}
                    helperText={touched.businessName && errors.businessName}
                    style={{ padding: "10px 0px ", width: "80%" }}
                  />

                  <TextField
                    label="Business Address"
                    size="small"
                    variant="outlined"
                    type="text"
                    name="businessAddress"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.businessAddress}
                    required
                    error={Boolean(touched.businessAddress && errors.businessAddress)}
                    helperText={touched.businessAddress && errors.businessAddress}
                    style={{ padding: "10px 0px ", width: "80%" }}
                  />

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
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: -5 }}>
                    <div style={{ width: '80%' }}>
                      <label style={{ fontSize: 12, display: 'flex', justifyContent: 'left', color: 'rgb(170, 170, 170)', marginBottom: -5, paddingLeft: 15, backgroundColor: 'white', paddingBottom: 5 }} >Address*</label>

                      <GooglePlacesAutocomplete
                        selectProps={{
                          placeholder: `${'Enter Address'}`,
                          addressvalue,
                          onChange: setaddressvalue,
                          styles: {
                            control: (props) => ({
                              ...props,
                              padding: '1px 0px ',
                              width: '100%',
                            }),
                            option: (provided) => ({
                              ...provided,
                              border: 'none'
                            }),
                            input: (provided) => ({
                              ...provided,
                            }),
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
                </Grid>
                <Grid item md={6} xs={12}></Grid>
              </> : ''
        }
        <Grid item md={6} xs={12}>
          <Grid
            container
            md={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              // onClick={onSubmit}
              style={{
                backgroundColor: "#42a5f5",
                color: "white",
                marginBottom: 10,
                marginTop: 20,
                width: '60%'
              }}
              type={"submit"}
            >
              Finish SignUp
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>)
}

export default CustomerForm
