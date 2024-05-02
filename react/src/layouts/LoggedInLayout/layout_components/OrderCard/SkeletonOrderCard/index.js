
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import { Skeleton } from '@material-ui/lab'
import { useState } from 'react'

function SkeletonOrderCard() {
  const [loading, setLoading] = useState(true)
  return (
    <div>
      <Grid>
        <Grid
          container
          style={{
            borderRadius: 10,
            borderLeftColor: "lightgray",
            borderLeftStyle: "solid",
            borderLeftWidth: 10,
            paddingBottom: 10,
            marginLeft: -10,
            paddingRight: 20,
            boxShadow: " 0 0 17px -5px #9E9E9E",
            marginBottom: 30,

          }}
        >
          <Grid item xs={12} md={8}>
            <Box style={{ paddingTop: 20, paddingLeft: 20, display: !!loading ? '' : 'null' }} >
              <Skeleton width={30} />
              <Box style={{ display: !!loading ? '' : 'null' }} >
                <Skeleton width={330} height={50} />
              </Box>
            </Box>
            <Box style={{ paddingLeft: 20, display: !!loading ? '' : 'null' }} >
              <Skeleton width={30} />
              <Box style={{ display: !!loading ? '' : 'null' }} >
                <Skeleton width={330} height={50} />
              </Box>
            </Box>
            <Box style={{ paddingLeft: 20, display: !!loading ? '' : 'null' }} >
              <Skeleton width={30} />
              <Box style={{ display: !!loading ? '' : 'null' }} >
                <Skeleton width={330} height={50} />
              </Box>
            </Box>
            <Box style={{ paddingLeft: 20, display: !!loading ? '' : 'null' }} >
              <Skeleton width={30} />
              <Box style={{ display: !!loading ? '' : 'null' }} >
                <Skeleton width={330} height={50} />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} >
            <Grid container>

              <Grid item md={7} ></Grid>
              <Grid style={{ display: !!loading ? '' : 'null' }} >
                <Skeleton width={70} height={50} />
                <Grid ></Grid>
              </Grid>

              <Grid style={{ display: !!loading ? '' : 'null' }} >
                <Skeleton width={185} height={320} />

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default SkeletonOrderCard
