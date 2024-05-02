
import { Skeleton } from '@material-ui/lab';
import { useState } from 'react'

function SkeletonOrderPlacementMap() {
  const [loading] = useState(true);

  return (
    <div style={{ marginTop: '-4rem' }} >
      {loading &&
        <Skeleton animation="wave" height='79vh' width='39vw' />
      }
    </div>
  )
}

export default SkeletonOrderPlacementMap