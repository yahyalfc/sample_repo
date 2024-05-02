import style from './style'
import Grid from '@material-ui/core/Grid'
import Button from "@material-ui/core/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormControl from "@material-ui/core/FormControl";
import { TextField, Tooltip, Typography } from '@material-ui/core';
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

function OrderBricks({ product, selection, submitVal }) {
  const onSubmit = (values) => {
    if (values) {
      submitVal(values)
    }
  }

  // if you've selected options already we set them here else its empty
  if (selection) {
    var initialValues = selection
  } else {
    var initialValues = {
      quantity: "",
      description: ""
    };
  }

  const validationSchema = Yup.object({
    quantity: Yup.number().min(1, 'Quantity cant be zero or negative').required("Value Is Required"),
    description: Yup.string(),
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
    <Grid container style={{ padding: 30 }}>
      <Grid container >
        <Grid item xs={12} md={1} style={{ textAlign: "left" }}>
          <ArrowBackIosIcon onClick={() => window.location.href = '/app/dashboard'} style={style.icon} />
        </Grid>
        <Grid item xs={12} md={11} style={style.orderPlacementTittle}>
          <h2 style={{ color: "GrayText" }}>Order {product.serviceName}</h2>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Grid item xs={12} md={10} style={{
          display: "block",
          justifyContent: "center",
          marginLeft: 50,
          marginRight: 50,
        }}>
          <FormControl fullWidth>
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
            />
          </FormControl>
          <FormControl fullWidth>
            <div style={{ display: 'flex' }}>
              <Typography>Keyword</Typography>
              <Tooltip title="Enter keyword for specific product">
                <HelpOutlineIcon style={{ marginLeft: 5, color: '#FA013B', fontSize: 22 }} />
              </Tooltip>
            </div>
            <TextField
              label=""
              size="small"
              variant="outlined"
              type="text"
              name="description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
              style={{ padding: "10px 0px ", width: "100%" }}
              error={Boolean(
                touched.description && errors.description
              )}
            />
          </FormControl>
        </Grid>


        <Grid container>
          <Grid item md={2} ></Grid>
          <Grid item xs={12} md={8}>
            <Button type={"submit"} fullWidth onClick={() => onSubmit()} style={style.nextButton}>Next </Button>
          </Grid>
          <Grid item md={2} ></Grid>
        </Grid>
      </form>
    </Grid>
  )
}

export default OrderBricks
