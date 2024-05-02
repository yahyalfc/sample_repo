import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useEffect, useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import AddSelectedItem from "../AddSelectedItem";
import _ from "lodash";
import { TextField } from "@material-ui/core";

const AddItemModal = (props) => {
  const useStyles = makeStyles(() => ({
    modal: {
      display: "flex",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: "transparent",

      outline: "none",
      border: "none",
      // boxShadow: theme.shadows[5],
      // padding: theme.spacing(2, 4, 3),
      minWidth: "35%",
      // maxWidth: "55%",
      // padding: 0,
      // marginTop: 100,
      // height: '70vh'
      margin: "auto",
    },
  }));

  const classes = useStyles();

  const [arrayItem, setArrayItem] = useState([]);

  const { showAddItemModal, handleCloseAddItemModal, updateItems, allItems, setAllItems } = props;

  const [showAddSelectedItem, setShowAddSelectedItem] = useState(false);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setArrayItem(_.differenceBy(allItems, props.supplierItems, "itemName"));
  }, [props.supplierItems, props.allItems]);

  const handleAddSelected = (itemName, price) => {
    setItemName(itemName);
    setPrice(price);
    setShowAddSelectedItem(true);
  };

  const handleCloseAddSelected = () => {
    // handleCloseAddItemModal();
    setShowAddSelectedItem(false);
  };

  const myChangeHandler = (e) => {
    const updatedorders = allItems.map((x) =>
      x.id == e.target.name ? { ...x, price: e.target.value } : x
    );
    setAllItems(updatedorders)
  }

  return (
    <>
      <Modal
        style={{ overflow: "scroll" }}
        className={classes.modal}
        open={showAddItemModal}
        onClose={handleCloseAddItemModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showAddItemModal}>
          <div className={classes.paper}>
            <div className="profilePageContainer">
              <Grid
                container
                style={{
                  // flexShrink=""
                  display: "flex",
                  flexWrap: "wrap",
                  backgroundColor: "white",
                  padding: "3%",
                  // height: '80vh',
                  flexDirection: "column",
                  // overflow: 'scroll',
                  // marginBottom: 100,
                  borderRadius: 5,
                  // marginBottom: 50
                }}
              >
                <Typography
                  style={{
                    fontSize: 15,
                    paddingBottom: 15,
                    color: "#42a5f5",
                    fontWeight: "bold",
                  }}
                >
                  Add Item
                </Typography>
                {/* <FormControl variant="outlined" */}
                {/* > */}
                {arrayItem.length === 0 ? <>No More Items To Display</> : arrayItem.map((item) => {
                  return (
                    <>
                      <Grid
                        container
                        md={12}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Grid item md={5} xs={12}>
                          <Typography style={{ fontSize: 13 }} variant="p">
                            {item.itemName}
                          </Typography>
                        </Grid>

                        <Grid md={4} xs={12} style={{}}>
                          <TextField
                            value={item.price}
                            name={item.id}
                            onChange={(e) => { myChangeHandler(e) }}
                          />

                        </Grid>
                        <Grid
                          md={3}
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleAddSelected(item.itemName, item.price)
                            }
                            style={{
                              backgroundColor: "#42a5f5",
                              color: "white",
                              marginTop: "-0.2rem",
                              fontSize: 13,
                              // marginBottom: 5,
                              height: "80%",
                              textTransform: "capitalize",
                            }}
                          >
                            Add item
                          </Button>
                        </Grid>
                      </Grid>
                      <Divider
                        style={{
                          marginBottom: 15,
                          height: 2,
                          color: "#42a5f5",
                        }}
                      />
                    </>
                  );
                })}
                <AddSelectedItem
                  showAddSelectedItem={showAddSelectedItem}
                  handleCloseAddSelected={handleCloseAddSelected}
                  updateItems={updateItems}
                  name={itemName}
                  price={price}
                />
              </Grid>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
};
export default AddItemModal;
