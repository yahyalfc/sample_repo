import { useEffect, useState } from "react"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import CustomerForm from "../../layout_comonents/CustomerForm"
import SupplierForm from "../../layout_comonents/SupplierForm"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import { useSelector } from 'react-redux'

function EnterData(props) {
  const [role, setRole] = useState("")
  const [user, setUser] = useState(null)
  const userRedux = useSelector(state => state.user)

  useEffect(() => {
    // this is for supplierForm
    if (user) {
      //useEffect hook only runs if info in suppllier form is updated cuz setUser is only sent to supplier
      // we shall set our step builder state here to this new thing
      props.setState("data", user)
      props.next()
    }

    return () => { }
  }, [user])

  const [supplierformdata, setSupplierFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    ABN: "",
    phone: "",
    mobile: "",
    address: "",
  })

  const [customerformdata, setCustomerFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mobile: "",
    businessName: '',
    ABN: '',
    address: ''
  })

  useEffect(() => {
    const { name, email } = userRedux
    // setting the state entered by our user
    const data = props.getState("data")
    setRole(data.role)

    if (data.role == "Supplier") {
      const object = {
        name: name,
        email: email,
        businessName: "",
        ABN: "",
        phone: "",
        mobile: "",
        address: "",
      }
      setSupplierFormData(object)
    }

    return () => { }
  }, [])

  return role && role == "Customer" ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 60,
        marginBottom: 60,
        paddingTop: 90,
      }}
    >
      <Grid
        md={8}
        sm={12}
        style={{
          backgroundColor: "white",
          padding: 40,
          borderRadius: 10,
          boxShadow: "0 0 17px -5px #9E9E9E",
        }}
      >
        <Grid
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Grid
            item
            md={3}
            sm={6}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ArrowBackIosIcon
              style={{
                color: "#42a5f5",
                fontSize: 25,
                marginLeft: 40,
              }}
              onClick={() => props.prev()}
            />
          </Grid>
          <Grid
            item
            md={6}
            sm={6}
            style={{
              flexDirection: "row",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              style={{
                padding: "10px 0px",
                color: "#42A5F5",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              User Info
            </Typography>
          </Grid>
          <Grid item md={3} sm={6}></Grid>
        </Grid>
        <Typography
          style={{ paddingBottom: "10px", color: "gray", textAlign: "center" }}
        >
          Please Enter all the fields
        </Typography>
        <CustomerForm
          customerformdata={customerformdata}
          setCustomerFormData={setCustomerFormData}
          role={role}
        />
      </Grid>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 60,
        marginBottom: 60,
        paddingTop: 80,
      }}
    >
      <Grid
        md={8}
        sm={12}
        style={{
          backgroundColor: "white",
          padding: 40,
          borderRadius: 10,
          boxShadow: "0 0 17px -5px #9E9E9E",
        }}
      >
        <Grid
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Grid
            item
            md={3}
            sm={6}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ArrowBackIosIcon
              style={{
                color: "#42a5f5",
                fontSize: 25,
                marginLeft: 40,
              }}
              onClick={() => props.prev()}
            />
          </Grid>
          <Grid
            item
            md={6}
            sm={6}
            style={{
              flexDirection: "row",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              style={{
                padding: "10px 0px",
                color: "#42A5F5",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              User Info
            </Typography>
          </Grid>
          <Grid item md={3} sm={6}></Grid>
        </Grid>
        <Typography
          style={{ paddingBottom: "20px", color: "gray", textAlign: "center" }}
        >
          Please Enter all the fields
        </Typography>
        <SupplierForm
          setUser={setUser}
          supplierformdata={supplierformdata}
          setSupplierFormData={setSupplierFormData}
          role={role}
        />
      </Grid>
    </div>
  )
}

export default EnterData
