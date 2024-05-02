import { useState, useEffect } from 'react'
import { firebase_product_service } from '../../../../services/firebase/product_service'
import { useSelector } from "react-redux"
import Enteries from './enteries'
import { Button, Grid, Table, TableCell, TableHead, TableRow } from '@material-ui/core'
import swal from 'sweetalert'

function ExtraFeeAddition({ closeExtraFeeModal }) {
  const user = useSelector(state => state.user)
  const { id } = user

  const [originalEnteries, setoriginalEnteries] = useState([]) // to store copy to match at time of update
  const [enteries, setEnteries] = useState([])

  const submitEnteries = async (e) => {
    e.preventDefault()
    // firestore update
    const result = await firebase_product_service.updateExtraItems(originalEnteries, enteries);
    if (result) {
      swal({
        title: "Items Updated Successfully",
        icon: "success",
        buttons: {
          Confirm: { text: "Okay", className: "okayButton" },
        },
      })
        .then((value) => {
          closeExtraFeeModal();
        })
    }
  }

  useEffect(() => {
    (async () => {
      // if suppliers products exists we fetch their extra items
      const result = await firebase_product_service.getExtraItems(id)
      setEnteries(result)
      setoriginalEnteries(result)
    })()
  }, [])

  return (
    <>
      <form onSubmit={submitEnteries}>
        <div
          style={{
            display: enteries.length === 0 ? 'none' : '', marginTop: 20, marginBottom: 30, display: "flex", justifyContent: "center"
          }}
        >

          <Table>
            <TableHead style={{ backgroundColor: "#42a5f5" }}>
              <TableRow>
                <TableCell style={{ color: "white", textAlign: 'center' }}>SR</TableCell>
                <TableCell style={{ color: "white", textAlign: 'center' }}>Item Name</TableCell>
                <TableCell style={{ color: "white", textAlign: 'center' }}>Price</TableCell>
                <TableCell style={{ color: "white", textAlign: 'center' }}>UOM</TableCell>
              </TableRow>
            </TableHead>
            {enteries.map((item, key) => <Enteries
              enteries={enteries}
              setEnteries={setEnteries}
              entry={item}
              key={item.uid}
              sNo={key + 1}
            />
            )}
          </Table>

        </div>
        <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item sm={4} >
            <Button fullWidth style={{ backgroundColor: '#42a5f5', color: 'white' }} type="submit">Submit</Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default ExtraFeeAddition
