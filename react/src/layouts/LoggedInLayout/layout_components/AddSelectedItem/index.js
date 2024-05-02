import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Typography from "@material-ui/core/Typography";
import "../../../../components/SwalStyle/SwalStyle.css";
import { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";
import { min } from "date-fns";

const AddSelectedItem = (props) => {
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      outline: "none",
      border: "none",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      minWidth: "38%",
      borderRadius: 3,
    },
  }));
  const classes = useStyles();
  const [quantity, setQuantity] = useState("");

  const {
    showAddSelectedItem,
    handleCloseAddSelected,
    updateItems,
    name,
    price,
  } = props;

  const handleSubmit = () => {
    if (!!quantity && quantity > 0) {
      updateItems({
        productName: name,
        quantity: quantity,
        price: price,
      });
      handleCloseAddSelected();
      swal({
        text: "Item Added Successfully",
        buttons: {
          Confirm: { text: "Ok", className: "okayButton" },
        },
      });
    } else {
      swal({
        text: "Enter a valid quantity",
        icon: "error",
        buttons: {
          Confirm: { text: "Ok", className: "okayButton" },
        },
      });
    }
  };
  const handleCancel = () => {
    if (!!quantity) {
      swal({
        title: "Are you sure you want to cancel",
        text: "Your changes are not saved!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
          Confirm: { text: "Yes", className: "okayButton" },
          Cancel: { text: "No", className: "cancelButton" },
        },
      }).then((value) => {
        if (value == "Confirm") {
          handleCloseAddSelected();
        }
      });
    } else {
      handleCloseAddSelected();
    }
  };

  return (
    <>
      <Modal
        className={classes.modal}
        open={showAddSelectedItem}
        onClose={handleCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showAddSelectedItem}>
          <div className={classes.paper}>
            <div className="profilePageContainer">
              <Grid
                container
                style={{
                  backgroundColor: "white",
                  padding: "3%",
                  color: "#42a5f5",
                  flexDirection: "column",
                }}
              >
                <Grid
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    Add Disposal Fee
                  </Typography>
                  <Typography style={{ color: "gray" }}>price</Typography>
                </Grid>
                <FormControl variant="outlined">
                  <Typography varient="p" style={{ paddingTop: 15 }}>
                    Quantity
                  </Typography>
                  <OutlinedInput
                    type="number"
                    value={quantity}
                    inputProps={{ min: "1" }}
                    onChange={(e) => {
                      // if (e.target.value > 0) {
                      setQuantity(e.target.value);
                      // }
                    }}
                  ></OutlinedInput>

                  <Grid
                    style={{
                      marginTop: 10,
                      float: "right",
                      textAlign: "right",
                    }}
                  >
                    <Button
                      onClick={handleSubmit}
                      style={{ backgroundColor: "#42a5f5", color: "white" }}
                    >
                      Add Item
                    </Button>
                  </Grid>
                </FormControl>
              </Grid>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
};
export default AddSelectedItem;
