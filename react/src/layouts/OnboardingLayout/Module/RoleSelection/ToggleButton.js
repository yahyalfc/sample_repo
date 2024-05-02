import { Button, Grid } from "@material-ui/core";

export default function ToggleServices(props) {
  const { userRole, handleSetRole } = props;
  return (
    <Grid
      container
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        xs={10}
        sm={8}
        md={4}
        lg={4}
        xl={4}
        style={{
          marginTop: 20,
          boxShadow: "4px 4px 15px #9E9E9E",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "center",
          borderRadius: 25,
          padding: 5,
        }}
      >
        <Grid item xs={6}>
          <Button
            onClick={() => handleSetRole("Customer")}
            variant="contained"
            disableElevation
            disableTouchRipple={true}
            style={{
              backgroundColor: `${userRole === "Customer" ? "#42a5f5" : "white"
                }`,
              color: `${userRole === "Customer" ? "white" : "#42a5f5"}`,
              borderRadius: 25,
              padding: 10,
              textTransform: "none",
              width: "100%",
            }}
          >
            Customer
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            onClick={() => handleSetRole("Supplier")}
            variant="contained"
            disableElevation
            disableTouchRipple={true}
            style={{
              backgroundColor: `${userRole === "Supplier" ? "#42a5f5" : "white"
                }`,
              color: `${userRole === "Supplier" ? "white" : "#42a5f5"}`,
              borderRadius: 25,
              padding: 10,
              textTransform: "none",
              width: "100%",
            }}
          >
            Supplier
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
