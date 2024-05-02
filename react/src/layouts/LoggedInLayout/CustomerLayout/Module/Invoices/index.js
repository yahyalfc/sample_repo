import { useState, useEffect, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import style from "../../../CustomerLayout/Module/Order/style";
import { firebase_invoice_service } from "../../../../../services/firebase/invoice_service";
import CustomerInvoiceBlock from "../../../layout_components/CustomerInvoiceBlock";
import NoInvoices from "../../../layout_components/NoInvoices";
import InvoiceSkeleton from "../../../SupplierLayout/Module/InvoiceSkeleton";
import { useSelector, useDispatch } from 'react-redux'
import { firebase_order_service } from "../../../../../services/firebase/order_service";
import { setInvoices } from '../../../../../redux/actions'
const _ = require("lodash");

function CustomerInvoices() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);
  const allinvoices = useSelector(state => state.invoices)
  const user = useSelector(state => state.user)
  const { id } = user
  const refs = useRef({})

  /*
   //This is for invoice notifications
   let location = useLocation()
     const [scrollToID, setScrollToID] = useState(null)
 
   useEffect(() => {
     console.log('running this scroll');
 
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
 */

  //componentDidMount
  // getting all the invoices right now later we will get only the users own invoices.
  useEffect(() => {
    (async () => {
      try {
        const maxUpdated = await firebase_order_service.getMaxUpdatedAt(allinvoices);
        const result = await firebase_invoice_service.getAllCustomerInvoices(id, maxUpdated)
        if (!result.length) {
          // dispatch(setOrders([...result]))
        } else {
          const sortedOrders = [...allinvoices, ...result].sort((a, b) => b.updatedAt - a.updatedAt)
          const uniqueOrders = _.uniqBy(sortedOrders, 'orderID')
          dispatch(setInvoices(uniqueOrders))
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])
  return (
    <Grid style={{ marginTop: 20 }}>
      <Grid
        container
        style={{ display: "flex", justifyContent: "center", paddingBottom: 50 }}
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
            <Typography style={style.myOrderText}>My Invoices</Typography>
          </Grid>
        </Grid>
        <Grid container style={style.noOrderGrid}>
          <Grid item md={8} sm={12}>

            {!!loading ? (
              <InvoiceSkeleton />
            ) : !!allinvoices.length ? (
              allinvoices.map((invoice) => <CustomerInvoiceBlock key={invoice.orderID} ref={element => (refs.current[invoice.orderID] = element)} invoice={invoice} />)
            ) : (
              <NoInvoices />
            )}

            {
              /*
            {
              !!allinvoices.length ? (
                allinvoices.map((invoice) => <CustomerInvoiceBlock key={invoice.orderID} ref={element => (refs.current[invoice.orderID] = element)} invoice={invoice} />)
              ) : (
                <NoInvoices />
              )}
              */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CustomerInvoices;
