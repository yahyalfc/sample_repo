import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import images from "../../../../images/invoiceNotFound.png";
import style from "./style";

function NoOrders(props) {
  return (
    <Grid style={style.root}>
      <img alt="" style={style.image} src={images} />
      <p style={style.text}>No Invoices to show at the moment</p>
      <Box style={{ marginTop: 40 }}></Box>
    </Grid>
  );
}

export default NoOrders;
