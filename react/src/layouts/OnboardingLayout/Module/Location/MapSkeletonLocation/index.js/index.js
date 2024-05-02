
import { Skeleton } from '@material-ui/lab';
import { useState } from 'react'

function MapSkeletonLocation() {
  const [loading] = useState(true);

  return (
    <div style={{ marginTop: '-4rem' }} >
      {loading &&
        <Skeleton animation="wave" height="100vh" width='100vw' />
      }
    </div>
  )
}

export default MapSkeletonLocation