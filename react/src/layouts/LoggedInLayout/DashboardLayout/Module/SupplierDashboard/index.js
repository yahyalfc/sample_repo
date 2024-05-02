import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { useEffect } from "react"
import Reviews from "../../../layout_components/Reviews"
import style from "./style"
import SupplierDashboardDataTable from "../../../layout_components/SupplierDashboardDataTable"
import { useSelector, useDispatch } from "react-redux"
import { firebase_product_service } from "../../../../../services/firebase/product_service"
import { setServices } from "../../../../../redux/actions";

function SupplierDashboard() {
  const dispatch = useDispatch()
  const services = useSelector(state => state.services)

  // only recall firebase when products are not in our local machine
  // and when location object is empty
  useEffect(() => {
    if (services.length === 0 || services === undefined) {
      (async () => {
        const services = await firebase_product_service.newServices()
        dispatch(setServices(services))
      })()
    }
  }, [])

  return (
    <div style={{ display: !!services.length ? "" : "none" }}>
      <Grid
        container
        style={{ paddingTop: 50, display: "flex", justifyContent: "center" }}
      >
        <Grid item container xl={6} lg={8} md={8} style={style.newOrder}>
          <Grid item md={8} sm={12} xs={12} style={{ paddingBottom: 40 }}>
            <Typography variant="h5" style={style.title}>
              New Orders
            </Typography>
          </Grid>
          {
            !!services.length ? <SupplierDashboardDataTable /> : ''
          }
        </Grid>
      </Grid>

      <Grid
        container
        style={{ paddingBottom: 50, display: "flex", justifyContent: "center" }}
      >
        <Grid item xl={6} lg={8} md={8}>
          <Reviews />
        </Grid>
      </Grid>
    </div>
  )
}

export default SupplierDashboard

