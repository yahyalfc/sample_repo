
import { useState } from "react"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { useFormik } from "formik"
import * as Yup from "yup"
import InputMask from "react-input-mask"
import { useSelector } from 'react-redux'
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function SupplierForm(props) {
  const user = useSelector(state => state.user)
  const initialValues = props.supplierformdata
  const [addressvalue, setaddressvalue] = useState();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, 'Must be at most 5 digits')
      .max(30, 'Must be at most 30 digits')
      .required("User Name is Required"),
    email: Yup.string()
      .email("Invalid Email Format")
      .required("Email Is Required"),
    businessName: Yup.string()
      .min(5, 'Must be at least 5 digits')
      .max(30, 'Must be at most 30 digits')
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
  })

  const onSubmit = (values) => {
    if (values) {
      //only runs if we have all the values
      const { id } = user

      const obj = {
        ...values,
        id,
        role: props.role,
        googleaddress: addressvalue.label,
        status: "unapproved",
        createdAt: user.createdAt
      }
      // Here we are setting user state in parent so we can send it to Location module in case of supplier
      props.setUser(obj)
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
    isSubmitting,
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
        <Grid item md={6} xs={12}>
          <TextField
            label="Full Name"
            size="small"
            variant="outlined"
            type="text"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
            required
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
            style={{ padding: "10px 0px", width: "80%" }}
          />
          <TextField
            label="Email"
            size="small"
            variant="outlined"
            disabled={true}

            type="email"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
            required
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            style={{ padding: "10px 0px ", width: "80%" }}
          />
          <TextField
            label="Business Name"
            size="small"
            variant="outlined"
            type="text"
            name="businessName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.businessName}
            required
            error={Boolean(touched.businessName && errors.businessName)}
            helperText={touched.businessName && errors.businessName}
            style={{ padding: "10px 0px ", width: "80%" }}
          />

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
            label="Business Address"
            size="small"
            variant="outlined"
            type="text"
            name="address"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.address}
            required
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
            style={{ padding: "10px 0px ", width: "80%" }}
          />
        </Grid>
        <Grid container style={{ display: "flex", justifyContent: "center" }}>
          <Grid item xs={9} sm={9} md={4} lg={2}>
            <Button
              fullWidth
              onClick={() => onSubmit()}
              style={{
                backgroundColor: "#42a5f5",
                color: "white",
                marginBottom: 10,
                marginTop: 20,
              }}
              type={"submit"}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

export default SupplierForm
