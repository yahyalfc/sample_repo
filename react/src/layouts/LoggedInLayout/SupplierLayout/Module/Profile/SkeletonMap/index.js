import { Skeleton } from '@material-ui/lab';
import { useState } from 'react'

function SkeletonMap() {
  const [loading] = useState(true);

  return (
    <div>
      {loading &&
        <Skeleton animation="wave" height='50vh' width='50vw' />
      }
    </div>
  )
}

export default SkeletonMap

