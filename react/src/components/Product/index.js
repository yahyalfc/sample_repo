import { Grid, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import LoaderButton from "../LoaderButton";

import "./productStyle.css";
import style from "./style";
function Product(props) {
  const [image, setImage] = useState("");
  const [loading, setloading] = useState(false);
  useEffect(() => {
    import(`../../images/${props.imageSource}`).then((data) => {
      setImage(data.default);
    });
  }, [props.imageSource]);

  const onClick = () => {
    setloading(true);
    window.location.href = `/app/createorder?product=${props.service.image}`
  };

  return (
    <Grid container md={12} className="productContainer">
      <Grid item xs={12} md={3}>
        <img
          src={image}
          style={{ ...style.img, display: image ? "" : "none" }}
          alt="Product"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={2}
        style={{
          marginTop: 10,
        }}
      >
        <Typography style={style.pProp}>{props.name}</Typography>
        <Typography style={style.pDescription}>{props.description}</Typography>
      </Grid>
      <Grid item xs={12} md={6} style={style.buttonGrid}>

        <Grid item xs={12} sm={12} md={5}>
          <LoaderButton
            fullWidth
            loadingProps={{
              size: 24,
              style: { color: "white" },
            }}
            isLoading={loading}
            onClick={onClick}
            style={style.orderNow}
          >
            Order Now
          </LoaderButton>
        </Grid>

      </Grid>
    </Grid>
  );
}
export default Product;
