import Grid from "@material-ui/core/Grid"
import style from "./style";
import images from "../../../../images/orderNotFound.png";

function NoOrders(props) {
  return (
    <Grid style={style.root}>
      <img alt="" style={style.image} src={images} />
      <p style={style.heading}>Orders Not Found</p>
      <p style={style.text}>No Orders yet.</p>
    </Grid>
  );
}

export default NoOrders;
