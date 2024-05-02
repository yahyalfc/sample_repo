import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux'
import OrderBricks from '../../../layout_components/OrderBricks';
import OrderConcrete from '../../../layout_components/OrderConcrete';
import OrderSand from '../../../layout_components/OrderSand';
import OrderSteel from '../../../layout_components/OrderSteel';
import OrderGravel from '../../../layout_components/OrderGravel';
import style from './style'
function OrderInput({ type, ...props }) {
  const services = useSelector(state => state.services)
  const range = services.find((service) => service.image === type)
  const { uid } = range

  const submitSelection = (data) => {
    // here we are setting values recieved from Child components into the stepper's state. So we can use it throughout
    props.setState('selection', { ...data, serviceID: uid }) //attaching the corresponding service name for ID so we can order that item later
    props.next()
  }

  const selection = props.getState('selection')

  // On basis of option selected by user we render different Components. 
  if (type === 'concrete') {
    return (
      <>
        <Grid container style={style.gridContainer}>
          <Grid md={6} style={style.gridItem}>
            <OrderConcrete selection={selection} product={range} submitVal={(data) => submitSelection(data)} />
          </Grid>
        </Grid>
      </>
    )
  }

  if (type === 'bricks') {
    return (
      <>
        <Grid container style={style.gridContainer}>
          <Grid md={6} style={style.gridItem}>
            <OrderBricks selection={selection} product={range} submitVal={(data) => submitSelection(data)} />
          </Grid>
        </Grid>
      </>
    )
  }

  if (type === 'gravel') {
    return (
      <>
        <Grid container style={style.gridContainer}>
          <Grid md={6} style={style.gridItem}>
            <OrderGravel selection={selection} product={range} submitVal={(data) => submitSelection(data)} />
          </Grid>
        </Grid>
      </>
    )
  }

  if (type === 'sand') {
    return (
      <>
        <Grid container style={style.gridContainer}>
          <Grid md={6} style={style.gridItem}>
            <OrderSand selection={selection} product={range} submitVal={(data) => submitSelection(data)} />
          </Grid>
        </Grid>
      </>
    )
  }
  if (type === 'steel-reinforced') {
    return (
      <>
        <Grid container style={style.gridContainer}>
          <Grid md={6} style={style.gridItem}>
            <OrderSteel selection={selection} product={range} submitVal={(data) => submitSelection(data)} />
          </Grid>
        </Grid>
      </>
    )
  }
}

export default OrderInput