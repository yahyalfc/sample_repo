import Grid from '@material-ui/core/Grid'
import style from './style'
import Button from "@material-ui/core/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormControl, Select, FormHelperText, MenuItem, Typography, TextField } from '@material-ui/core';
import { useSelector } from "react-redux"
import swal from "sweetalert";

function AddRock({ selection, submitVal, supplierProducts, closeModal, disableButton }) {
  const services = useSelector((state) => state.services)
  const product = services.find((service) => service.serviceName === selection)

  const onSubmit = (values) => {
    if (values) {
      const result = supplierProducts.find((product) => product.productType == values.productType)
      if (result) {
        swal({
          title: "This Product Already Exists",
          showCancelButton: true,
          confirmButtonColor: "#1c8fec",
          cancelButtonColor: "#fa013b",
          buttons: {
            Confirm: { text: "Okay", className: "okayButton" },
          },
        });
        closeModal(false)
      }
      else {
        submitVal(values)
      }
    }
  }

  var initialValues = {
    productType: "",
    title: "",
    description: ""
  };

  const validationSchema = Yup.object({
    productType: Yup.string().required("Value Is Required"),
    title: Yup.string().required("Value Is Required"),
    description: Yup.string().required("Value Is Required"),
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

      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "space-around",

        }}
      >
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <Typography>Category</Typography>
            <FormControl fullWidth>
              <Select
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
                {product.type.map((value) => (
                  <MenuItem value={value}>{value}</MenuItem>
                ))}
              </Select>
              <FormHelperText style={{ color: "red" }}>
                {touched.productType && errors.productType}
              </FormHelperText>
            </FormControl>
            <Typography>Title</Typography>
            <TextField
              label=""
              size="small"
              variant="outlined"
              type="text"
              name="title"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
              required
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              style={{ padding: "10px 0px ", width: "100%" }}
              error={Boolean(
                touched.title && errors.title
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography>Description</Typography>
            <TextField
              label=""
              size="small"
              variant="outlined"
              type="text"
              name="description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              required
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
              style={{ padding: "10px 0px ", width: "100%" }}
              error={Boolean(
                touched.description && errors.description
              )}
            />
          </FormControl>
          <Grid container >
            <Grid item md={2} ></Grid>
            <Grid item xs={12} md={8}>
              <Button disabled={disableButton} type={"submit"} fullWidth onClick={() => onSubmit()} style={style.nextButton}>Add Item</Button>
            </Grid>
            <Grid item md={2} ></Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}

export default AddRock
