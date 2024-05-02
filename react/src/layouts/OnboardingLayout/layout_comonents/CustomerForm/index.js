import { useState } from "react"
import { FormControl, MenuItem, Select } from "@material-ui/core"
import Fields from './Fields'
import './style.css'

function CustomerForm({ customerformdata, role }) {
  const types = ['Individual', 'Business']
  const [selection, setSelection] = useState('Individual')

  const myHandleChange = (event) => {
    setSelection(event.target.value)
  }

  return (
    <>
      <FormControl fullWidth>
        <Select

          style={{
            marginTop: 5,
            width: "60%",
            alignSelf: 'center',
            padding: 8,
            marginBottom: 15,
            borderRadius: 5,
            cursor: "pointer",
            boxShadow: " 0 0 17px -5px #9E9E9E",
          }}
          name="customerType"
          disableUnderLine
          value={selection}
          required
          onChange={myHandleChange}
        >
          {
            types.map((value) => (
              <MenuItem className='MuiSelect-select' value={value}>{value}</MenuItem>)
            )}
        </Select>
      </FormControl>
      <Fields role={role} selection={selection}></Fields>
    </>
  )
}

export default CustomerForm
