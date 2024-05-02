import { useState } from 'react'
import { Skeleton } from "@material-ui/lab";
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"

function SkeletonTable() {
  const [loading] = useState(true);

  return (
    <div>
      <Table>
        <TableHead >
          <TableRow>
            {loading ?
              <Skeleton width={1000} height={50} />
              :
              <TableCell></TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>

          <TableRow style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            {loading ?
              <Skeleton width={70} height={50} />
              :
              <TableCell></TableCell>
            }
            {loading ?
              <Skeleton width={270} height={50} />
              :
              <TableCell></TableCell>
            }
            {loading ?
              <Skeleton width={120} height={50} />
              :
              <TableCell></TableCell>
            }
            {loading ?
              <Skeleton width={200} height={50} />
              :
              <TableCell></TableCell>
            }
            {loading ?
              <Skeleton width={70} height={50} />
              :
              <TableCell></TableCell>
            }
          </TableRow>
        </TableBody>
      </Table>

    </div>
  )
}

export default SkeletonTable
