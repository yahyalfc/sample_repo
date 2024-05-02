import { useEffect } from "react";
import style from "./style";
import "./index.css";
import Product from "../../../../../components/Product";
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { firebase_product_service } from '../../../../../services/firebase/product_service'
// We shall put services in redux so we dont fetch them on every load to reduce calls
import { useSelector, useDispatch } from 'react-redux'
import { setServices } from "../../../../../redux/actions";

function CustomerDashboard() {
  const dispatch = useDispatch()
  const services = useSelector(state => state.services)
  // only recall firebase when products are not in our local machine
  useEffect(() => {
    if (services.length === 0 || services === undefined) {
      (async () => {
        const services = await firebase_product_service.newServices()
        dispatch(setServices(services))
      })()
    }
  }, [])

  return (
    <div style={{ display: !!services ? "" : "none" }}>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Typography style={style.textheading}> Services</Typography>
        </Grid>
        <Grid md={2}></Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            padding: "35px 15px 15px 15px",
            marginBottom: 15,
          }}
        >
          {
            services.map(service =>
              <Product
                key={service.serviceID}
                name={service.serviceName}
                imageSource={`${service.image}.png`}
                service={service}
              />
            )
          }
        </Grid>
        <Grid md={2}></Grid>
      </Grid>
    </div>
  );
}

export default CustomerDashboard;
