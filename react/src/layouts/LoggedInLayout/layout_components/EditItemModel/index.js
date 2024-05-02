import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Typography from "@material-ui/core/Typography";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import swal from "sweetalert";
import "../../../../components/SwalStyle/SwalStyle.css";

const EditItemModal = (props) => {
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
    showEditModal,
    handleCloseEditModal,
    supplierItems,
    editItem,
    currentItem,
  } = props;

  const handleSave = () => {
    if (!!quantity) {
      let thePrice = null;
      supplierItems.forEach((item) => {
        if (item.itemName === currentItem.itemName) {
          thePrice = parseFloat(item.unitCost.replace(/^\D+/g, ""));
          item.quantity = quantity;
          item.total = thePrice * quantity;
        }
      });

      editItem(supplierItems);
      handleCloseEditModal();
    } else {
      swal({
        text: "Please enter quantity!",
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
        if (value == 'Confirm') {
          handleCloseEditModal();
        }
      });
    } else {
      handleCloseEditModal();
    }
  };

  return (
    <>
      <Modal
        className={classes.modal}
        open={showEditModal}
        onClose={handleCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showEditModal}>
          <div className={classes.paper}>
            <div className="profilePageContainer">
              <Grid
                container
                md={12}
                xs={12}
                style={{
                  backgroundColor: "white",
                  padding: "3%",
                  color: "#42a5f5",
                  flexDirection: "column",
                }}
              >
                <Typography>Edit Item</Typography>
                <FormControl variant="outlined">
                  <Typography style={{ paddingTop: 15 }}>Quantity</Typography>
                  <OutlinedInput
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                    type="number"
                    inputProps={{ min: "0" }}
                  ></OutlinedInput>

                  <Grid
                    style={{
                      marginTop: 10,
                      float: "right",
                      textAlign: "right",
                    }}
                  >
                    <Button
                      onClick={handleSave}
                      style={{
                        backgroundColor: "#42a5f5",
                        marginRight: 10,
                        color: "white",
                      }}
                    >
                      ADD
                    </Button>
                    <Button
                      onClick={handleCancel}
                      style={{ backgroundColor: "#42a5f5", color: "white" }}
                    >
                      Cancel
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

export default EditItemModal;
