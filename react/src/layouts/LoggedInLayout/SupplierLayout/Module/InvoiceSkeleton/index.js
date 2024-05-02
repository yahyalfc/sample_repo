import { Grid, Box } from "@material-ui/core";
import { useState } from "react";
import { Skeleton } from "@material-ui/lab";

function InvoiceSkeleton() {
  const [loading] = useState(true);

  return (
    (
      <Grid style={{ textAlign: "left" }}>
        <Grid
          container
          style={{
            paddingTop: "10px",
            paddingBottom: "30px",
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 0 17px -5px #9e9e9e",
            marginBottom: "10%", "borderLeft": "15px solid #C0C0C0",
          }}
        >
          <Grid
            item
            sm={12}
            md={5}
            style={{
              padding: 20,
              paddingTop: 30
            }}
          >
            <ul>
              <>
                <Box style={{ display: !!loading ? '' : 'null' }} >
                  <Skeleton animation="wave" width={100} height={20} />
                  <Skeleton animation="wave" width={200} height={20} />
                  <Skeleton animation="wave" width={100} height={20} />
                  <Skeleton animation="wave" width={200} height={20} />
                  <Skeleton animation="wave" width={100} height={20} />
                  <Skeleton animation="wave" width={200} height={20} />
                </Box>
              </>
            </ul>
          </Grid>

          <Grid item sm={12} md={2}></Grid>
          <Grid item sm={12} md={5} >
            <ul style={{ padding: "35px 0px 0px 20px" }}>
              <Box style={{ display: !!loading ? '' : 'null' }} >
                <Skeleton animation="wave" width={300} height={20} />
                <Skeleton animation="wave" width={150} height={20} />
                <Skeleton animation="wave" width={150} height={20} />
                <Skeleton animation="wave" width={200} height={20} />
                <Skeleton animation="wave" width={200} height={20} />
              </Box>

            </ul>
            <Grid
              container
              md={12}
              sm={12}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
                paddingLeft: 20
              }}
            >
              <Grid item sm={12} md={5}>
                <Box style={{ display: !!loading ? '' : 'null' }} >

                  <Skeleton width={150} height={50} />
                </Box>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  );
}
export default InvoiceSkeleton;
