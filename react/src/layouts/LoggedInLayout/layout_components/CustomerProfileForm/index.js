import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import { useFormik } from 'formik'
import * as Yup from 'yup'
const initialValues = {
  fullname: '',
  email: '',
  password: ''
}

const onSubmit = (values) => {

}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid Email Format').required('Email Is Required'),
  password: Yup.string().required('Password Is Required')
})

function CustomerProfileForm() {
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })
  //values gives us access to values entered in our form
  const { errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values } = formik

  return (

    <form onSubmit={handleSubmit}>
      <Grid container style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} >
        <Grid item md={6} xs={12}>
          <TextField
            label="Full Name"
            size="small"
            variant="outlined"
            type="text"
            name="text"
            onChange={handleChange}
            value={values.email}
            required
            error={Boolean(errors.email)}
            helperText={touched.email}
            style={{ padding: "20px 0px 10px 0px", width: '80%' }}
          />
          {/*errors.email ? <div>{errors.email}</div> : null */}
          <TextField
            size="small"
            label="ABN"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            required
            error={Boolean(errors.password)}
            helperText={touched.password}
            style={{ padding: "10px 0px 20px 0px", width: '80%' }}
          />
          <TextField
            size="small"
            label="Phone Number"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            required
            error={Boolean(errors.password)}
            helperText={touched.password}
            style={{ padding: "10px 0px 20px 0px", width: '80%' }}
          />
          <TextField
            size="small"
            label="Address"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            required
            error={Boolean(errors.password)}
            helperText={touched.password}
            style={{ padding: "10px 0px 20px 0px", width: '80%' }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          {/* <h2> Bank Account Detail</h2> */}

          <TextField
            size="small"
            label="Bussiness Name"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            required
            error={Boolean(errors.password)}
            helperText={touched.password}
            style={{ padding: "10px 0px 20px 0px", width: '80%' }}
          /><TextField
            size="small"
            label="Email Address"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            required
            error={Boolean(errors.password)}
            helperText={touched.password}
            style={{ padding: "10px 0px 20px 0px", width: '80%' }}
          />
          <TextField
            size="small"
            label="Phone Number"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            required
            error={Boolean(errors.password)}
            helperText={touched.password}
            style={{ padding: "10px 0px 20px 0px", width: '80%' }}
          />
          <TextField
            size="small"
            label="Phone Number"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            required
            error={Boolean(errors.password)}
            helperText={touched.password}
            style={{ padding: "10px 0px 20px 0px", width: '80%' }}
          />

          {/* <Select
            size="small"
            label="Phone Number"
            variant="outlined"
            style={{ padding: "10px 0px 20px 0px", width: '80%', marginLeft: "35px" }}
          >
            <MenuItem>Online</MenuItem>
            <MenuItem>Cash</MenuItem>
          </Select> */}


        </Grid>
      </Grid>
    </form>
  )
}

export default CustomerProfileForm
