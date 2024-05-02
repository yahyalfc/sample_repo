import Grid from '@material-ui/core/Grid'
import style from './style'
import Button from "@material-ui/core/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { FormControl, Select, MenuItem, Typography, TextField, } from '@material-ui/core';

function OrderConcrete({ product, selection, submitVal }) {

  const onSubmit = (values) => {
    if (values) {
      submitVal(values)
    }
  }

  if (selection) {
    var initialValues = selection
  } else {
    var initialValues = {
      productType: "",
      placementMethod: "",
      quantity: "",
    };
  }

  const validationSchema = Yup.object({
    productType: Yup.string().required("Value Is Required"),
    placementMethod: Yup.string().required("Value Is Required"),
    quantity: Yup.number().min(1, 'Quantity cant be zero or negative').required("Value Is Required")
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  //formik.values gives us access to values entered in our form
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
      <Grid container style={{ padding: 30 }}>
        <Grid item xs={12} md={1} style={{ textAlign: "left" }}>
          <ArrowBackIosIcon onClick={() => window.location.href = '/app/dashboard'} style={style.icon} />
        </Grid>
        <Grid item xs={12} md={11} style={style.orderPlacementTittle}>
          <h2 style={{ color: "GrayText" }}>Order {product.serviceName}</h2>
        </Grid>
        {/* </Grid> */}
        {/* <Grid */}
        {/* container */}
        {/* style={{ */}
        {/* display: "flex", */}
        {/* justifyContent: "space-around", */}
        {/* }} */}
        {/* > */}
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 20 }}>
          <Grid container>
            <Grid item md={1} ></Grid>
            <Grid item xs={12} md={10} style={{}} >
              <Typography>I would like to order</Typography>
              <FormControl fullWidth
              // style={{ minWidth: 200, display: 'flex', flexWrap: 'nowrap' }}
              >
                <Select
                  fullWidth
                  style={style.select}
                  name="productType"
                  disableUnderLine
                  required
                  value={values.productType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(
                    touched.productType && errors.productType
                  )}
                >
                  {
                    product.class.map((value) => (
                      <MenuItem value={value}>{value}</MenuItem>
                    ))}
                </Select>
                <Typography>Placement Method</Typography>
                <Select
                  style={style.select}
                  name="placementMethod"
                  disableUnderLine
                  required
                  value={values.placementMethod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(
                    touched.placementMethod && errors.placementMethod
                  )}
                >
                  {
                    product.placementMethod.map((value) => (
                      <MenuItem value={value}>{value}</MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth >
                <Typography>Quantity</Typography>
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
                    endAdornment: <>m<sup>3</sup></>
                  }}
                />

              </FormControl>

              <Grid container>
                <Grid item md={2} ></Grid>
                <Grid item xs={12} md={8}>
                  <Button type={"submit"} fullWidth onClick={() => onSubmit()} style={style.nextButton}>Next </Button>
                </Grid>
                <Grid item md={2} ></Grid>

              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </div>
  )
}

export default OrderConcrete
