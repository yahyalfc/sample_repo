import Grid from '@material-ui/core/Grid'
import { makeStyles } from "@material-ui/styles"
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux'
import { time_service } from '../../../../../../../utils/time/timeAndDate';
import { compute_service_data } from '../../../../../../../utils/convert/serviceName'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    //width: "75vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #fff",
    boxShadow: theme.shadows[5],
    padding: "20px 20px 80px 20px",
    overflowY: "scroll",
    // paddingBotton: 50
    //height: "100%",
  },
}));

function ViewDocker(props) {
  const classes = useStyles();
  const { orderX, docket, step } = props;
  const user = useSelector(state => state.user)
  const services = useSelector(state => state.services)
  const serviceName = compute_service_data.computeServiceName(orderX.serviceID, services)

  const nextPage = () => {
    props.next()
  }

  const previousPage = () => {
    props.prev()
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
            <p> {user?.phone}</p>
            <br />
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Customer: </span> {orderX?.customerName}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Deliver To: </span> {orderX?.locationName}</p>
            <br />
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Date: </span> {time_service.convertDateFormat(Date.now()).date}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Time Dispatched: </span> {time_service.convertDateFormat(Date.now()).time}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Truck No: </span> {docket.truckNo}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Product: </span> {orderX.productType}</p>
            <div style={{ display: orderX.productType == 'Blockfill' ? "none" : "" }}>
              <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Strength: </span> {strength}</p>
              <div style={{ display: 'flex' }}>
                <span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Agg Size: {" "} </span>
                {
                  split.map((item) => (<p> {" "} {item} </p>))
                }
              </div>
            </div>
            <p> <span style={{ color: '#42a5f5', fontWeight: 'bolder' }}>Ordered Quantity: </span> {orderX.quantity} m³</p>
            <br />
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Plant: </span> {docket.plant}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Additives: </span>{docket.additive}</p>
            <br />
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>This Load: </span>{docket.load}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Water Design: </span> {orderX.waterMix} </p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Batched Water: </span>{docket.batchedWater}</p>
            <p><span style={{ color: '#42a5f5', fontWeight: 'bold' }}>Slump Stand: </span> {docket.slumpStandWater}</p>
          </Grid>
          <div style={{ display: 'flex', justifyContent: "space-around", marginTop: 20 }}>
            <Button disabled={step == 0} style={{ backgroundColor: '#42a4f5', color: "white" }} onClick={previousPage}>Previous</Button>
            <p>Docket {step + 1} of {orderX.docket.length}</p>
            <Button disabled={step == orderX.docket.length - 1} style={{ backgroundColor: '#42a4f5', color: "white" }} onClick={nextPage}>Next</Button>
          </div>
        </Grid>
      </Grid>
    </Grid >
  )
}

export default ViewDocker