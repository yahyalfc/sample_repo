import Grid from "@material-ui/core/Grid"
import style from "./style";
import images from "../../../../images/vendorNotFound.png";

function NoVendorFound(props) {
  return (
    <Grid style={style.root}>
      <img alt="" style={style.image} src={images} />
      <p style={style.text}>Please try changing order details</p>
    </Grid>
  );
}

export default NoVendorFound;
