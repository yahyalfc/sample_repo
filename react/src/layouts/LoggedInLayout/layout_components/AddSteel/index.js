
import { useState } from 'react'
import style from './style'
import Grid from '@material-ui/core/Grid'
import Button from "@material-ui/core/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { TextField, Typography } from '@material-ui/core';
import { useSelector } from "react-redux"
import swal from "sweetalert";

function AddSteel({ selection, submitVal, supplierProducts, closeModal, disableButton }) {
  const services = useSelector((state) => state.services)
  const product = services.find((service) => service.serviceName === selection)
  const [range, setRange] = useState(product.type[0])

  // we are attaching subtype to our data. In case of Rectangular and square Mesh we will be making the useless properties null.
  const onSubmit = (values) => {
    if (values) {
      if (range.subtype == 'Reinforcement Bars') {
        let val = { ...values }
        val.productType = range.subtype

        const result = supplierProducts.find((product) => product.productType == val.productType && product.productSize == val.productSize && product.productClass == val.productClass && product.unit == val.unit)
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
          submitVal(val)
        }
      } else {
        let val = { ...values }
        val.productType = range.subtype
        val.productClass = null
        val.unit = null
        const result = supplierProducts.find((product) => product.productType == val.productType && product.productSize == val.productSize)

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
          submitVal(val)
        }
      }
    }
  }

  //If we are coming from next step show previously entered data in formik and in case user comes first time we set initial values of formik empty
  const initialValues = {
    productSize: "",
    productClass: "",
    unit: "",
    title: "",
    description: "",
  }

  // separate validation schema cuz formik throws and error if you've put a variable in formik but its not being utilized. 
  //Rectangular Mesh and Square mesh have same properties so we have same schema for them.
  let validationSchema

  if (range.subtype === 'Reinforcement Bars') {
    validationSchema = Yup.object({
      productSize: Yup.string().required("Value Is Required"),
      productClass: Yup.string().required("Value Is Required"),
      unit: Yup.string().required("Value Is Required"),
      title: Yup.string().required("Value Is Required"),
      description: Yup.string().required("Value Is Required"),
    });
  } else {
    validationSchema = Yup.object({
      productSize: Yup.string().required("Value Is Required"),
      title: Yup.string(),
      description: Yup.string(),
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
      setFieldValue('productClass', '')
      setFieldValue('unit', '')
      setFieldValue('title', '')
      setFieldValue('description', '')
    }
  }

  return (
    <Grid container style={{ padding: 30 }}>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "space-around",

        }}
      >
        <Grid item xs={12} md={8}>
          <Typography>Category</Typography>
          <FormControl fullWidth>
            <Select
              key={range.subtype}
              style={style.select}
              name="subtype"
              disableUnderLine
              required
              value={range.subtype}
              onChange={myHandleChange}
            >
              {
                product.subtypes.map((value) => (
                  <MenuItem key={value} value={value}>{value}</MenuItem>)
                )}
            </Select>
          </FormControl>
          <FormControl fullWidth>
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
        </Grid>
      </Grid>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "space-around",

        }}
      >
        <Grid item xs={12} md={8} >
          <form onSubmit={handleSubmit}>
            {
              range.subtype == 'Reinforcement Bars' ?
                <>
                  <Grid
                    container

                  >
                    <Typography>Size</Typography>


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
                    <Typography>Class</Typography>

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

                    <Typography>Unit</Typography>

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
                  </Grid>
                </>
                : (
                  <>
                    <Grid>
                      <Typography>Size</Typography>

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


                    </Grid>
                  </>)
            }
            <Grid container >
              <Grid item md={2} ></Grid>
              <Grid item xs={12} md={8}>
                <Button disabled={disableButton} type={"submit"} fullWidth onClick={() => onSubmit()} style={style.nextButton}>Add Item </Button>
              </Grid>
              <Grid item md={2} ></Grid>
            </Grid>

          </form>
        </Grid>
      </Grid>
    </Grid >
  )
}
export default AddSteel
