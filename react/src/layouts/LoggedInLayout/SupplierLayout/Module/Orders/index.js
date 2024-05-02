import { useState, useEffect, useRef } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import style from "./style"
// import Select from "react-dropdown-select"
import NoOrders from "../../../layout_components/NoOrders"
import { firebase_order_service } from "../../../../../services/firebase/order_service"
import SupplierOrderBlock from "../../../layout_components/SupplierOrderBlock"
import OrderCardSkeletonBox from "../OrderCardSkeletonBox"
import { useSelector, useDispatch } from 'react-redux'
import { setOrders } from '../../../../../redux/actions'
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core"
import "./style.css"
import { useLocation } from "react-router"

const _ = require("lodash");

function SupplierOrder() {
  const [loading, setLoading] = useState(true)
  const allorders = useSelector((state) => state.orders)
  const [orders, setOrderS] = useState([])
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const { id } = user;
  const [scrollToID, setScrollToID] = useState(null)
  const refs = useRef({})
  let location = useLocation()

  // componentDidUpdate
  useEffect(() => {
    if (scrollToID && refs.current[scrollToID]) {
      setTimeout(
        () => refs.current[scrollToID].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        }),
        1000
      )
    }
  }, [scrollToID])

  useEffect(() => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    setScrollToID(url.searchParams.get("id"));
  }, [location.search])

  useEffect(() => {
    setOrderS(allorders)
  }, [allorders])

  const [options] = useState([
    { value: "all", label: "All Orders" },
    { value: "unapproved", label: "New Orders" },
    { value: "confirmed", label: "Confirmed Orders" },
    { value: "reconfirmed", label: "Reconfirmed Orders" },
    { value: "fulfilled", label: "Fulfilled Orders" },
    { value: "cancelled", label: "Cancelled Orders" },
  ])
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    if (selectedOption) {
      let result = []
      switch (selectedOption) {
        case options[0].value:
          setOrderS(allorders)
          break
        case options[1].value:
          result = allorders.filter((order) => order.status == options[1].value)
          setOrderS(result)
          //unapproved
          break
        case options[2].value:
          result = allorders.filter((order) => order.status == options[2].value)
          setOrderS(result)
          break
        case options[3].value:
          result = allorders.filter((order) => order.status == options[3].value)
          setOrderS(result)
          break
        case options[4].value:
          result = allorders.filter((order) => order.status == options[4].value)
          setOrderS(result)
          break
        case options[5].value:
          result = allorders.filter((order) => order.status == options[5].value)
          setOrderS(result)
          break
        default:
          break
      }
    }
  }, [selectedOption])

  const handleChange = (e) => {
    setSelectedOption(e.target.value)
  }

  return (
    <Grid style={{ marginTop: 20, minHeight: "100vh" }}>
      <Grid
        container
        style={{ display: "flex", justifyContent: "center", padding: "0px 20px 50px 20px" }}
      >
        <Grid
          container
          md={8}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <Grid item md={2}>
            <Typography style={style.myOrderText}>My Orders</Typography>
          </Grid>
          <Grid item md={3} style={style.selectGrid}>

            <FormControl fullWidth  >
              <InputLabel id="demo-simple-select-outlined-label" style={{ postion: 'relative', paddingLeft: 10, zIndex: 1 }}>Sort by</InputLabel>
              <Select
                fullWidth
                className="MuiSelect-select"
                disableUnderline
                style={{
                  backgroundColor: "whitesmoke",
                  borderRadius: 20,
                  paddingLeft: 10,
                  zIndex: 0
                }}
                value={selectedOption}
                onChange={handleChange}
              >
                {options.map((item) => (
                  <MenuItem value={item.value} >{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

          </Grid>
        </Grid>
        {/* ////////////////////////////////////////// */}
        <Grid container style={style.noOrderGrid}>
          <Grid item md={8} sm={12}>
            {/*
            {!!loading ? (
              <OrderCardSkeletonBox />
            ) : orders.length !== 0 ? (
              orders.map((order) => <SupplierOrderBlock key={order.orderID} ref={element => (refs.current[order.orderID] = element)} data={order} />)
            ) : (
              <NoOrders />
            )}
            */}

            {
              orders.length !== 0 ? (
                orders.map((order) => <SupplierOrderBlock key={order.orderID} ref={element => (refs.current[order.orderID] = element)} data={order} />)
              ) : (
                <NoOrders />
              )
            }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SupplierOrder
