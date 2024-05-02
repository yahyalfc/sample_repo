import React from "react";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function Reviews() {
  const [value, setValue] = React.useState(2);
  const reviews =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,";

  return (
    <div>
      <Box
        py={3}
        mt={8}
        borderColor="transparent"
        textAlign="center"
        style={{
          boxShadow: "4px 4px 15px 0px rgba(128, 128, 128,1)",
          borderRadius: 10,
        }}
      >
        <Typography component="legend" variant="h5">
          Reviews
        </Typography>
        <Typography component="legend" style={{ margin: 10 }}>
          {reviews}
        </Typography>

        <Rating
          size="large"
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
      </Box>
    </div>
  );
}
export default Reviews;
