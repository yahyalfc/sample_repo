import { useEffect, useState } from 'react'
import style from './style'
import Grid from '@material-ui/core/Grid'
import Button from "@material-ui/core/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { TextField, Typography } from '@material-ui/core';

function OrderSteel({ product, selection, submitVal }) {
  const [range, setRange] = useState(product.type[0])

  // we are attaching subtype to our data. In case of Rectangular and square Mesh we will be making the useless properties null.
  const onSubmit = (values) => {
    if (values) {
      if (range.subtype == 'Reinforcement Bars') {
        let val = { ...values }
        val.productType = range.subtype
        submitVal(val)
      } else {
        let val = { ...values }
        val.productType = range.subtype
        val.productClass = null
        val.unit = null
        submitVal(val)
      }
    }
  }

  //on basisi of selection setting the range
  useEffect(() => {
    if (selection) {
      setRange(product.type.find((type) => type.subtype === selection.productType))
    }
  }, [])

  //If we are coming from next step show previously entered data in formik and in case user comes first time we set initial values of formik empty
  let initialValues
  if (selection) {
    initialValues = selection
  } else {
    initialValues = {
      productSize: "",
      quantity: "",
      productClass: "",
      unit: ""
    }
  }

  // separate validation schema cuz formik throws and error if you've put a variable in formik but its not being utilized. 
  //Rectangular Mesh and Square mesh have same properties so we have same schema for them.
  let validationSchema
  if (range.subtype === 'Reinforcement Bars') {
    validationSchema = Yup.object({
      productSize: Yup.string().required("Value Is Required"),
      quantity: Yup.number().min(1, 'Quantity cant be zero or negative').required("Value Is Required"),
      productClass: Yup.string().required("Value Is Required"),
      unit: Yup.string().required("Value Is Required"),
    });
  } else {
    validationSchema = Yup.object({
      productSize: Yup.string().required("Value Is Required"),
      quantity: Yup.number().min(1, 'Quantity cant be zero or negative').required("Value Is Required")
    });
  }

  const formik = useFormik({
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
    setFieldValue
  } = formik;

  // On selecting an option the fields should be emptied so that previosuly set data isnt being sent to onSubmit.
  const myHandleChange = (event) => {
    if (event.target.name === 'subtype') {
      setRange(product.type.find((type) => type.subtype === event.target.value))
      setFieldValue('productSize', '')
      setFieldValue('quantity', '')
      setFieldValue('productClass', '')
      setFieldValue('unit', '')
    }
  }
  return (
    <div>
      <Grid container style={{ padding: 30 }}>
        <Grid item xs={12} md={1} style={{ textAlign: "left" }}>
          <ArrowBackIosIcon onClick={() => window.location.href = '/app/dashboard'} style={style.icon} />
        </Grid>
        <Grid item xs={12} md={11} style={style.orderPlacementTittle}>
          <h2 style={{ color: "GrayText" }}>Order {product.serviceName}</h2>
        </Grid>
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Grid item xs={12} md={10}>
            <Typography style={{ marginTop: 10 }}>I would like to order</Typography>
            <FormControl fullWidth>
              <Select
                style={style.select}
                name="subtype"
                disableUnderLine
                required
                value={range.subtype}
                onChange={myHandleChange}
              >
                {
                  product.subtypes.map((value) => (
                    <MenuItem value={value}>{value}</MenuItem>)
                  )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Grid item xs={12} md={10}>
            <form onSubmit={handleSubmit}>
              {
                range.subtype == 'Reinforcement Bars' ?
                  <>
                    <Grid
                      container
                      style={{
                        // display: "flex",
                        // justifyContent: "space-around",

                      }}
                    >
                      <Typography style={{ marginTop: 10 }}>Size</Typography>
                      <FormControl fullWidth>
                        <Select
                          style={style.select}
                          name="productSize"
                          disableUnderLine
                          required
                          value={values.productSize}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(
                            touched.productSize && errors.productSize
                          )}
                        >
                          {
                            range.size.map((value) => (
                              <MenuItem value={value}>{value}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <Typography style={{ marginTop: 10 }}>Class</Typography>

                      <FormControl fullWidth>
                        <Select
                          style={style.select}
                          name="productClass"
                          disableUnderLine
                          required
                          value={values.productClass}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(
                            touched.productClass && errors.productClass
                          )}
                        >
                          {
                            range.class.map((value) => (
                              <MenuItem value={value}>{value}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      {/*  */}
                      <FormControl fullWidth>
                        <Typography style={{ margin: '10px 0px -5px 0px' }}>Quantity</Typography>
                        <TextField
                          label=""
                          size="small"
                          variant="outlined"
                          type="text"
                          name="quantity"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.quantity}
                          required
                          error={Boolean(touched.quantity && errors.quantity)}
                          helperText={touched.quantity && errors.quantity}
                          style={{ padding: "10px 0px ", width: "100%" }}
                          error={Boolean(
                            touched.quantity && errors.quantity
                          )}
                          InputProps={{
                            endAdornment: <>kg/m<sup>3</sup></>
                          }}
                        />
                      </FormControl>
                      <Typography >Unit</Typography>
                      <FormControl fullWidth>
                        <Select
                          style={style.select}
                          name="unit"
                          disableUnderLine
                          required
                          value={values.unit}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(
                            touched.unit && errors.unit
                          )}
                        >
                          {
                            range.units.map((value) => (
                              <MenuItem value={value}>{value}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <Typography style={{ marginTop: 10 }}> Total Length: {values.quantity * parseFloat(values.unit.split('M'))}m</Typography>
                    </Grid>
                  </>
                  : (
                    <>
                      <Grid
                        container
                        style={{
                          // display: "flex",
                          // justifyContent: "space-around",

                        }}
                      >
                        <Typography style={{ margin: '10px 0px 0px 0px' }}>Size</Typography>

                        <FormControl fullWidth>
                          <Select
                            style={style.select}
                            name="productSize"
                            disableUnderLine
                            required
                            value={values.productSize}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(
                              touched.productSize && errors.productSize
                            )}
                          >
                            {
                              range.size.map((value) => (
                                <MenuItem value={value}>{value}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth>
                          <Typography style={{ margin: '10px 0px -5px 0px' }}>Quantity</Typography>
                          <TextField
                            label=""
                            size="small"
                            variant="outlined"
                            type="text"
                            name="quantity"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.quantity}
                            required
                            error={Boolean(touched.quantity && errors.quantity)}
                            helperText={touched.quantity && errors.quantity}
                            style={{ padding: "10px 0px ", width: "100%" }}
                            error={Boolean(
                              touched.quantity && errors.quantity
                            )}
                            InputProps={{
                              endAdornment: <>kg/m<sup>3</sup></>
                            }}
                          />
                        </FormControl>
                        <Typography> Units of 6000mm x 2400mm <br /> Total Area {values.quantity * 14.4} m<sup>2</sup></Typography>
                      </Grid>
                    </>)
              }
              <Grid container style={{ paddingLeft: 80 }}>
                <Grid item md={2} ></Grid>
                <Grid item xs={12} md={8}>
                  <Button type={"submit"} fullWidth onClick={() => onSubmit()} style={style.nextButton}>Next </Button>
                </Grid>
                <Grid item md={2} ></Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </div >
  )

}
export default OrderSteel