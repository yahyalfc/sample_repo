import { createStyles } from "@material-ui/core"
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import { useEffect, useState } from "react"
import image from "../../../images/background2.jpg"
import CustomerDashboard from "./Module/CustomerDashboard"
import SupplierDashboard from "./Module/SupplierDashboard"
import { useSelector } from "react-redux"

const style = createStyles({
  ImageGrid: {
    backgroundImage: `url( ${image})`,
    paddingTop: "10%",
    paddingBottom: "10%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  },

  pText: {
    textAlign: "center",
    color: "white",
    // WebkitTextStroke: "0.2px white",
  },
})

const DashboardLayout = () => {
  const user = useSelector(state => state.user)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    // get products from firebase
    if (user?.role == "undefined") {
      window.location.href = "/onboarding"
    }
    setPending(false)
  }, [])

  // Render
  if (pending) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <CircularProgress
            style={{
              outline: "none",
              border: "none",
            }}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div style={{ minHeight: "100vh", padding: "20px " }}>
        <Grid container style={style.ImageGrid}>
          <Grid item lg={7} md={7}></Grid>
          <Grid item lg={4} md={4}>
            <p style={style.pText}>
              Klinker is here to help handymen, contractors, or anyone who’s
              into a bit of DIY to find the best supplier, at the right price
              for their civil construction materials. We’re here to take the
              hassle out of finding quotes and matching invoices so you can
              focus on getting the job done on time.
            </p>
            <Grid
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Button
                style={{
                  backgroundColor: "white",
                  color: "#42A5F5",
                  textTransform: "capitalize",
                }}
              >
                Read More
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {/* <Outlet /> */}
        {user?.role == "Supplier" && <SupplierDashboard />}
        {user?.role == "Customer" && <CustomerDashboard />}
      </div>
    )
  }
}

export default DashboardLayout
