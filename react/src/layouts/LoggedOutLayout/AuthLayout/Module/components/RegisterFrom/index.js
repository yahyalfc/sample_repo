import { useState } from "react";
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import { useFormik } from "formik";
import * as Yup from "yup";
import SocialLogin from "../SocialLogin";
import { Link } from "react-router-dom";
import { firebase_auth_service } from "../../../../../../services/firebase/auth_service";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import swal from "sweetalert";
import LoaderButton from "../../../../../../components/LoaderButton";
import { useDispatch } from 'react-redux'
import { setUser } from '../../../../../../redux/actions'

const initialValues = {
  full_name: "",
  email: "",
  password: "",
  confirm_password: "",
}
var regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/

const validationSchema = Yup.object({
  full_name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Full Name is Required"),
  email: Yup.string()
    .email("Invalid Email Format")
    .required("Email Is Required"),
  password: Yup.string().matches(
    regexPass,
    "Password should contain an upperCase, a lowerCase, symbol and a number."
  ),
  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
})

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const onSubmit = async ({ email, password, full_name }) => {

    setLoading(true);
    try {
      const result = await firebase_auth_service.signupWithEmail(
        email,
        password,
        full_name
      );
      if (result.status) {
        dispatch(setUser(result.user))
        window.location.href = "/onboarding";
      }
    } catch (err) {
      swal({
        icon: "error",
        text: err.message,
      })
    } finally {
      setLoading(false)
    }
  }
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })
  //formik.values gives us access to values entered in our form
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
    <Grid
      container
      style={{ display: "flex", justifyContent: "center", textAlign: "center" }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          size="small"
          variant="outlined"
          type="string"
          name="full_name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.full_name}
          required
          error={Boolean(touched.full_name && errors.full_name)}
          helperText={touched.full_name && errors.full_name}
          style={{ padding: "10px 0px 10px 0px", width: "80%" }}
        />
        {/*formik.errors.email ? <div>{formik.errors.email}</div> : null */}
        <TextField
          size="small"
          label="Email Address"
          variant="outlined"
          type="email"
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email}
          required
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
          style={{ padding: "10px 0px 10px 0px", width: "80%" }}
        />
        <TextField
          size="small"
          label="Password"
          variant="outlined"
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          required
          error={Boolean(touched.password && errors.password)}
          helperText={touched.password && errors.password}
          style={{ padding: "10px 0px 10px 0px", width: "80%" }}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  // id="password"
                  itemID="password"
                  name="password"
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          size="small"
          label="Confirm Password"
          variant="outlined"
          name="confirm_password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.confirm_password}
          required
          error={Boolean(touched.confirm_password && errors.confirm_password)}
          helperText={touched.confirm_password && errors.confirm_password}
          style={{ padding: "10px 0px 10px 0px", width: "80%" }}
          type={showConfirmPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoaderButton
          isLoading={loading}
          loadingProps={{
            size: 20,
            style: { color: "white" },
          }}
          style={{
            backgroundColor: "#42a5f5",
            color: "white",
            marginBottom: 10,
            width: "40%",
          }}
          type={"submit"}
        >
          Proceed
        </LoaderButton>

        <p>Or register with</p>
        <div
          style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}
        >
          <SocialLogin
            backgroundcolor="#f03800"
            text="Google"
            socialLoginClickHandler={() => {
              firebase_auth_service
                .loginWithGoogle()
                .then((res) => {
                  if (res.exists) {
                    dispatch(setUser(res.user))
                    window.location.href = '/app/dashboard'
                  } else {
                    dispatch(setUser(res.user))
                    window.location.href = '/onboarding'
                  }
                  // res.exists === true means user exists already so push them directly to dashboard.
                  /* rest.exists !== true means user doesnt already exist so we need to decide whether they seller or customer so push them to /UserRoleSelection
                and they can finish their signing up process*/
                })
                .catch((err) => {
                  console.log(err)
                })
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SocialLogin backgroundcolor="#3b5999" text="Facebook" />
        </div>
        <p>
          Or don't have an account?{" "}
          <Link
            to="/auth/login"
            style={{ textDecoration: "none", color: "#42a5f5" }}
          >
            Login
          </Link>
        </p>
      </form>
    </Grid>
  )
}

export default RegisterForm
