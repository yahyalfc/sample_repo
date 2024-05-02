import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import ToggleButton from "../ToogleButton";
import img from "./../../../../images/background1.jpg";

function AuthNavbar() {
  return (
    <Box
      style={{
        backgroundImage: `url( ${img})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        backgroundPosition: "60% 50%",
        paddingTop: 20,
        height: "70vh",
      }}
    >
      <ToggleButton />
      <Typography style={{
        marginRight: "55%", paddingTop: '10%', paddingLeft: " 20px", color: 'white', fontSize: 19, fontFamily: 'sans-serif'
      }}>About Us</Typography>
      <p style={{
        marginRight: "55%", padding: "5px 20px", color: 'white', fontFamily: 'sans-serif'
      }}>
        Klinker is here to help handymen, contractors, or anyone who’s into a
        bit of DIY to find the best supplier, at the right price for their
        civil construction materials. We’re here to take the hassle out of
        finding quotes and matching invoices so you can focus on getting the
        job done on time.
        </p>
    </Box>
  );

};

export default AuthNavbar;
