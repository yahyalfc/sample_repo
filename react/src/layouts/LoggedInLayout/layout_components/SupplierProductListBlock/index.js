import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Delete from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import { firebase_supplier_product_service } from "../../../../services/firebase/supplier_product_services";
import Modal from "@material-ui/core/Modal";
import "./shtyle.css";
import swal from "sweetalert";
import "../../../../components/SwalStyle/SwalStyle.css";
import style from "./style";
import { useSelector } from "react-redux";
import { IconButton } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import BusinessIcon from "@material-ui/icons/Business";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import { unit_service } from "../../../../utils/convert/quantityUnit";
import { compute_service_data } from "../../../../utils/convert/serviceName";

const _ = require("lodash");

function SupplierProductListBlock({
  sproduct,
  deleteProduct,
  sNo,
  supplierProducts,
  setSupplierProducts,
}) {
  const services = useSelector((state) => state.services);
  const [list, setList] = useState([
    { minQuantity: "1", maxQuantity: "", price: "" },
  ]);
  const [waterMix, setwaterMix] = useState(sproduct.waterMix)
  const [xshortfall, setXShortfall] = useState({});
  const [modal, setModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [concrete, setconcrete] = useState(false)
  const serviceName = compute_service_data.computeServiceName(sproduct.serviceID, services)
  const munit = unit_service.convertStatus(serviceName)

  useEffect(() => {
    if (serviceName == 'Premix Concrete') {
      setconcrete(true)
    }
  }, [serviceName])

  useEffect(() => {
    setProduct(sproduct);
    //making copies of shortfall and quantites in order to traverse them
    if (Object.keys(sproduct.shortfall).length !== 0) {
      setXShortfall(sproduct.shortfall);
    }

    if (sproduct.quantities.length !== 0) {
      setList(_.cloneDeep(sproduct.quantities));
    }
  }, []);

  const shortfallInputHandler = (e, fieldName) => {
    setXShortfall({ ...xshortfall, [fieldName]: e.target.value });
  };

  const productInputHandler = (e, prodNo) => {
    const newlist = [...list];

    newlist[prodNo][e.target.name] = e.target.value;
    setList(newlist);
  };

  const evaluateInputs = (e, prodNo) => {
    const newlist = [...list];
    //maxQuantity should be greater than minQuantity
    let condition1 =
      parseFloat(e.target.value) > parseFloat(newlist[prodNo]["minQuantity"]);

    if (condition1) {
      newlist[prodNo][e.target.name] = e.target.value;
      if (newlist[prodNo + 1]) {
        //if next element exists
        newlist[prodNo + 1]["minQuantity"] = e.target.value; //dynamically replace with new maxQuantity

        if (
          parseFloat(newlist[prodNo + 1]["minQuantity"]) >
          parseFloat(newlist[prodNo + 1]["maxQuantity"])
        ) {
          newlist[prodNo + 1]["maxQuantity"] = "";
        }
      }
    } else {
      newlist[prodNo][e.target.name] = "";
    }
    setList(_.cloneDeep(newlist));
  };

  const addField = () => {
    const last = [...list].pop();

    if (list.length !== 0) {
      if (
        last.minQuantity !== "" &&
        last.maxQuantity !== "" &&
        last.price !== ""
      ) {
        const emptyobject = {
          minQuantity: last.maxQuantity,
          maxQuantity: "",
          price: "",
        };
        setList([...list, emptyobject]);
      }
    } else {
      //means array is empty so we add this row
      setList([{ minQuantity: "1", maxQuantity: "", price: "" }]);
    }
  };

  const handleDelete = (prodNo) => {
    const newList = [...list];
    newList.splice(prodNo, 1);
    setList(newList);
  };

  const onCancel = () => {
    setList(_.cloneDeep(sproduct.quantities));
    setModal(false);
    setXShortfall(sproduct.shortfall);
  };


  const openModal = () => {
    setModal(true);
  };
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      // we make a product instance to upload to firebase.
      let productInstance = {
        ...product,
        waterMix,
        quantities: _.cloneDeep(list),
        shortfall: xshortfall,
      };

      const result = await firebase_supplier_product_service.updateProductCost(
        sproduct.uid,
        productInstance
      );

      if (result.quantities.length !== 0) {
        setList(_.cloneDeep(result.quantities));
      }

      // updating the product instance
      setProduct((prevState) => {
        return {
          ...prevState,
          waterMix: result.waterMix,
          quantities: result.quantities,
          shortfall: result.shortfall,
        };
      });

      // here we will set the returned object in supplierProducts in parent.
      const updatedorders = supplierProducts.map((x) =>
        x.uid == result.uid ? { ...result } : x
      );

      setSupplierProducts(updatedorders);

      setXShortfall(result.shortfall);
      setList(_.cloneDeep(result.quantities));
      setModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseDescriptionModal = () => {
    setDescriptionModal(false);
  };

  const waterMixHandler = (e) => {
    setwaterMix(e.target.value)
  }

  return (
    <TableBody>
      <TableRow>
        <TableCell style={{ textAlign: "center" }}>{sNo}</TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {compute_service_data.computeServiceName(sproduct.serviceID, services)}
          <IconButton
            style={{ marginLeft: 5, padding: 5 }}
            onClick={() => { setDescriptionModal(true); }}
          >
            <HelpIcon style={{ color: "#41a5f5" }} />
          </IconButton>
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {sproduct.productType ? sproduct.productType : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {sproduct.productSize ? sproduct.productSize : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {sproduct.productClass ? sproduct.productClass : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {sproduct.unit ? sproduct.unit : munit}
        </TableCell>
        <TableCell
          style={{ textAlign: "center" }}
          onClick={() => {
            openModal();
          }}
        >
          <Button style={style.scheduleButton} onClick={() => setModal(true)}>
            <Typography>Schedule</Typography>
          </Button>
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          <Delete
            style={style.delIcon}
            onClick={() =>
              swal({
                // className: "swal-button",
                title: "Delete Range",
                text: "Are you sure?",
                icon: "error",
                buttons: {
                  Confirm: { text: "Yes", className: "okayButton" },
                  Cancel: { text: "No", className: "cancelButton" },
                },
              }).then((value) => {
                if (value == "Confirm") {
                  deleteProduct(sproduct.uid);
                }
              })
            }
          />
        </TableCell>
      </TableRow>
      <Modal
        open={descriptionModal}
        onClose={handleCloseDescriptionModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid item md={5} style={style.cancelReasonModel}>
          <Box mb={15} pt={1} pt={4}>
            <Box
              display="flex"
              justifyContent="center"
              ml={-2}

            >
              {" "}
              <Typography
                style={{
                  marginBottom: 5,
                  marginLeft: 30,
                  fontWeight: "600",
                  fontSize: 25,
                  color: "gray",
                }}
              >
                Product Info
              </Typography>
            </Box>
            <Box mt={1}>
              <ul
                style={{
                  color: "#42a5f5",
                  padding: "5px 0px 0px 30px",
                }}
              >
                {
                  sproduct.title || sproduct.description ? '' : <p> No Info to display</p>
                }
                {
                  sproduct.title ?
                    <Box mb={2}>
                      <li style={style.pLocation}>
                        <BusinessIcon style={style.cardIcon} />
                        <Typography style={style.listItemHeading}>
                          Title{" "}
                        </Typography>
                      </li>
                      <li style={style.orderList}>{sproduct.title}</li>
                    </Box>
                    : ''}
                {
                  sproduct.description ?
                    <>
                      <li style={style.pLocation}>
                        <AlternateEmailIcon style={style.cardIcon} />
                        <Typography style={style.listItemHeading}>
                          {" "}
                      Description
                    </Typography>
                      </li>
                      <li style={style.orderList}>{sproduct.description}</li>
                    </> : ''}
              </ul>
            </Box>
          </Box>
        </Grid>
      </Modal>
      <Modal
        style={{ overflow: "scroll" }}
        size="sm"
        open={modal}
        onClose={() => {
          setModal(false);
          if (!!sproduct.quantities.length) {
            setList(_.cloneDeep(sproduct.quantities));
          } else {
            setList([{ minQuantity: "1", maxQuantity: "", price: "" }]);
          }
          setXShortfall(sproduct.shortfall);
        }}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        {/* <Modal.Body style={style.modalbody}> */}
        <Container maxWidth="sm" style={style.bodyDiv}>
          <form onSubmit={onSubmit}>
            {
              <h5 style={style.headertext}>
                {" "}
                {compute_service_data.computeServiceName(sproduct.serviceID, services)}{" "}
              </h5>
            }
            <Grid style={style.modalDiv}>
              <Button
                style={style.plusButton}
                onClick={(e) => {
                  addField(e);
                }}
              >
                <Add style={{ backgroundColor: "lightgrey", borderRadius: 50 }} />
              </Button>
            </Grid>
            <div style={{ display: compute_service_data.computeServiceName(sproduct.serviceID, services) == 'Premix Concrete' ? "" : "none" }}>
              <Grid style={{ display: 'flex' }}>
                <Typography style={{ paddingTop: 25 }}>Design Water of this mix design</Typography>
                <OutlinedInput
                  style={style.field}
                  type="number"
                  required={concrete}
                  value={waterMix}
                  // placeholder="Water Mix"
                  //readOnly={true}
                  //disabled
                  name="waterMix"
                  onChange={(e) => waterMixHandler(e)}
                  endAdornment={
                    <InputAdornment position="start">L/m³</InputAdornment>
                  }
                />
              </Grid>
            </div>
            <Typography>Unit Price for quantities between</Typography>

            {list.map((item, prodNo) => {
              return (
                <Grid key={prodNo} style={style.inputdiv}>
                  <Grid style={style.input}>
                    <OutlinedInput
                      style={style.field}
                      type="number"
                      required={true}
                      value={item.minQuantity}
                      placeholder="Min Quantity"
                      readOnly={true}
                      disabled
                      name="minQuantity"
                      onChange={(e) => productInputHandler(e, prodNo)}
                      endAdornment={
                        <InputAdornment position="start">{munit}</InputAdornment>
                      }
                    />
                    <OutlinedInput
                      style={style.field}
                      type="number"
                      required={true}
                      value={item.maxQuantity}
                      placeholder="Max Quantity"
                      name="maxQuantity"
                      onChange={(e) => productInputHandler(e, prodNo)}
                      onBlur={(e) => evaluateInputs(e, prodNo)}
                      endAdornment={
                        <InputAdornment position="start">{munit}</InputAdornment>
                      }
                    />
                  =
                  <OutlinedInput
                      style={style.field}
                      type="number"
                      required={true}
                      value={item.price}
                      placeholder="Product Price"
                      inputProps={{ min: "0" }}
                      name="price"
                      onChange={(e) => productInputHandler(e, prodNo)}
                      endAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </Grid>
                  <Button
                    disabled={prodNo === list.length - 1 ? false : true}
                    style={{
                      display: list.length - 1 == 0 ? "none" : "",
                    }}
                  >
                    <Delete
                      style={
                        prodNo === list.length - 1
                          ? style.delIconStyle
                          : style.noIconStyle
                      }
                      onClick={() =>
                        swal({
                          title: "Delete Order",
                          text: "Are you sure?",
                          icon: "error",
                          buttons: {
                            Confirm: { text: "Yes", className: "okayButton" },
                            Cancel: { text: "No", className: "cancelButton" },
                          },
                        }).then((value) => {
                          if (value == "Confirm") {
                            handleDelete(prodNo);
                          }
                        })
                      }
                    />
                  </Button>
                  {/* ) : null} */}
                </Grid>
              );
            })}
            <Typography>
              Is there a shortfall below for small quantities?
          </Typography>
            <Box mx={1.5} mt={1.5}>
              <FormControl variant="outlined" fullWidth>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={xshortfall ? Object.keys(xshortfall).length !== 0 : {}}
                >
                  <MenuItem
                    onClick={() => setXShortfall({ threshold: "", price: "" })}
                    value={true}
                  >
                    Yes
                </MenuItem>
                  <MenuItem onClick={() => setXShortfall({})} value={false}>
                    No
                </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Grid>
              {Object.keys(xshortfall).length !== 0 ? (
                <Grid
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // marginRight: 72,
                  }}
                >
                  <OutlinedInput
                    fullWidth
                    style={style.field}
                    type="number"
                    placeholder="Product ShortFall"
                    name="threshold"
                    required={true}
                    inputProps={{ min: "0" }}
                    value={xshortfall.threshold}
                    onChange={(e) => shortfallInputHandler(e, "threshold")}
                    endAdornment={
                      <InputAdornment position="start">
                        m<Typography style={{ fontSize: 13 }}>3</Typography>
                      </InputAdornment>
                    }
                  />
                  <OutlinedInput
                    fullWidth
                    style={style.field}
                    type="text"
                    placeholder="Shortfall Rate"
                    name="price"
                    required={true}
                    value={xshortfall.price}
                    onChange={(e) => shortfallInputHandler(e, "price")}
                    endAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                </Grid>
              ) : (
                ""
              )}
            </Grid>
            <Grid style={style.modalButtonDiv}>
              <Button style={style.cancelButton} onClick={onCancel}>
                <Typography style={{ color: "white" }}>Cancel</Typography>
              </Button>
              <Button style={style.saveButton} type="submit">
                <Typography style={{ color: "white" }}>Save</Typography>
              </Button>
            </Grid>
          </form>
        </Container>
      </Modal>
    </TableBody >
  );
}

export default SupplierProductListBlock;
