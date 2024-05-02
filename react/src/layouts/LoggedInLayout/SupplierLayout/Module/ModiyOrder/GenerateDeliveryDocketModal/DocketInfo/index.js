import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux'
import { time_service } from '../../../../../../../utils/time/timeAndDate';
import { firebase_order_service } from '../../../../../../../services/firebase/order_service';
import { setOrders } from '../../../../../../../redux/actions';
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "75vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "50px ",
    // padding: theme.spacing(5, 4, 5),
  },
}));

function DocketInfo(props) {
  const classes = useStyles();
  const data = props.getState('data')
  const user = useSelector(state => state.user)
  const reduxOrders = useSelector(state => state.orders)
  const { orderX } = props;
  const dispatch = useDispatch()
  const order = reduxOrders.find((item) => item.orderID = orderX.orderID)

  const goBack = () => {
    props.prev()
  }

  const releaseOrder = async () => {
    const obj = {
      dockdispatchDate: time_service.convertDateFormat(Date.now()).date,
      dockdispatchtime: time_service.convertDateFormat(Date.now()).time,
      truckNo: data.truckNo,
      plant: data.location,
      additive: data.additive,
      load: data.loadVolume,
      batchedWater: data.batchedWater,
      slumpStandWater: data.slumpStandWater,
    }

    if (!!order.docket) {
      const docket = [...order.docket, obj]
      const result = await firebase_order_service.addDocket(orderX.orderID, docket)

      if (result) {
        const updatedOrders = reduxOrders.map((item) =>
          item.orderID == orderX.orderID
            ? {
              ...item,
              docket
            }
            : item
        );
        // ? updatedOrders is the allOrders for redux and firebase update
        dispatch(setOrders(updatedOrders));
        swal({
          title: "Docket Added",
          icon: "success",
          buttons: {
            Confirm: { text: "Okay", className: "okayButton" },
          },
        })
          .then((value) => {
            props.handleClose()
          })

      }
    } else {
      const docket = [obj]
      const result = await firebase_order_service.addDocket(orderX.orderID, docket)

      if (result) {
        const updatedOrders = reduxOrders.map((item) =>
          item.orderID == orderX.orderID
            ? {
              ...item,
              docket
            }
            : item
        );
        // ? updatedOrders is the allOrders for redux and firebase update
        dispatch(setOrders(updatedOrders));
        //add swal here
        swal({
          title: "Docket Added",
          icon: "success",
          buttons: {
            Confirm: { text: "Okay", className: "okayButton" },
          },
        })
          .then((value) => {
            props.handleClose()
          })
      }
    }
  }

  let str = orderX.productType.split(" ")
  let strength = str[0]
  strength = strength.substring(1)
  let split = str.filter((s) => s.includes('mm'))

  return (
    <Grid
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 20,
        backgroundColor: 'red'
        // width: "60%",
      }}
    >
      <Grid className={classes.paper} style={{ width: "70%" }}>
        <Grid
          container
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Grid>
            <p style={{ fontSize: 25, fontWeight: 'bold', color: '#42a5f5' }}>{user?.businessName}</p>
            <p>ABN: {user?.ABN}</p>
            <p>{user?.googleaddress}</p>
            <p>Telephone: {user?.phone}</p>
            <br />
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Customer: </span>{orderX?.customerName}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Deliver To: </span> {orderX?.locationName}</p>
            <br />
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Date: </span>{time_service.convertDateFormat(Date.now()).date}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Time Dispatched: </span>{time_service.convertDateFormat(Date.now()).time}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Truck No: </span> {data.truckNo}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Product: </span>{orderX.productType}</p>
            <div style={{ display: orderX.productType == 'Blockfill' ? "none" : "" }}>
              <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Strength: </span> {strength}</p>
              <div style={{ display: 'flex' }}>
                <span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Agg Size: {" "} </span>
                {
                  split.map((item) => (<p> {" "} {item} </p>))
                }
              </div>
            </div>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Ordered Quantity: </span> {orderX.quantity} m³</p>
            <br />
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Plant: </span> {data.location}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Additives: </span>{data.additive}</p>
            <br />
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>This Load: </span>{data.loadVolume}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Water Design: </span>{orderX.waterMix} </p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Batched Water: </span>{data.batchedWater}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Slump Stand: </span>{data.slumpStandWater}</p>
          </Grid>
          <div style={{ display: 'flex', justifyContent: "space-around" }}>
            <Button style={{ backgroundColor: '#42a4f5', marginTop: 20, color: "white" }} onClick={() => goBack()}>Back</Button>
            <Button style={{ marginLeft: 50, backgroundColor: '#42a4f5', marginTop: 20, color: "white" }} onClick={() => releaseOrder()}>Release</Button>
          </div>
        </Grid>

      </Grid>
    </Grid>
  )
}

export default DocketInfo
