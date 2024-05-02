import { createStyles } from '@material-ui/core'
import Grid from "@material-ui/core/Grid"
import CustomerDisplayForm from '../CustomerDisplayForm'
function CustomerProfile() {
  const styles = createStyles({
    div: { display: 'flex', justifyContent: 'center', padding: 50, },
    grid: { backgroundColor: 'white', padding: "40px 0px", borderRadius: 10, boxShadow: '0 0 17px -5px #9E9E9E', }
  })
  return (
    <div style={styles.div}>
      <Grid container md={8} xs={12}>
        <Grid item md={12} xs={12} style={styles.grid}>
          <CustomerDisplayForm />
        </Grid>
      </Grid>
    </div>
  )
}

export default CustomerProfile


