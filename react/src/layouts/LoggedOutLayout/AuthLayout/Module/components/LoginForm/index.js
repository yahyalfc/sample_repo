import { useState } from "react";
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import { useFormik } from "formik";
import * as Yup from "yup";
import { firebase_auth_service } from "../../../../../../services/firebase/auth_service";
import SocialLogin from "../SocialLogin";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import swal from "sweetalert";
import LoaderButton from "../../../../../../components/LoaderButton";
import { useDispatch } from 'react-redux'
import { setUser } from '../../../../../../redux/actions'

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch()
  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async ({ email, password }) => {
    setloading(true);

    try {
      const result = await firebase_auth_service.loginWithEmail(
        email,
        password
      );

      if (result.status) {
        dispatch(setUser(result.user))
        const { role } = result.user;
        // on basis of stuff user entered we push them to different paths
        // depending on role pushing to corresponding window
        if (role == "undefined") {
          window.location.href = "/onboarding";
        }
        if (role == "Customer") {
          window.location.href = "/app/dashboard";
        }
        if (role == "Supplier") {
          window.location.href = "/app/dashboard";
        }
      }
    } catch (e) {
      swal({
        text: e.message,
        icon: "error",
      });
    } finally {
      setloading(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid Email Format")
      .required("Email Is Required"),
    password: Yup.string().required("Password Is Required"),
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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
    <Grid
      container
      style={{ display: "flex", justifyContent: "center", textAlign: "center" }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          placeholder="Enter your email address"
          size="small"
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
        {/*formik.errors.email ? <div>{formik.errors.email}</div> : null */}
        <TextField
          label="Password"
          size="small"
          variant="outlined"
          placeholder="Enter your password"
          // type="password"
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
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
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
          Log In
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
                  console.log(err);
                });
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SocialLogin backgroundcolor="#3b5999" text="Facebook" />
        </div>
        <p>
          Or don't have an account?{" "}
          <Link
            to="/auth/register"
            style={{ textDecoration: "none", color: "#42a5f5" }}
          >
            Register
          </Link>
        </p>
      </form>
    </Grid>
  );
}

export default LoginForm;
