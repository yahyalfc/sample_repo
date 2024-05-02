import { useEffect, useState } from "react";
import { firebase_supplier_product_service } from "../../../../../services/firebase/supplier_product_services";
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Table from "@material-ui/core/Table"
import Container from "@material-ui/core/Container"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Typography from "@material-ui/core/Typography"
import Modal from "@material-ui/core/Modal";
import style from "./style";
import Select from "../../../layout_components/SupplierAddItemSelect";
import SkeletonTable from "./SkeletonTable";
import AddIcon from '@material-ui/icons/Add';
import { useSelector } from "react-redux"
import ProductSelection from './ProductSelection'
import SuppplierProductListBlock from '../../../layout_components/SupplierProductListBlock'
import './style.css'
import ExtraFeeAddition from '../../../layout_components/ExtraFeeAddition'

function Products() {
  const services = useSelector((state) => state.services)
  const [productTypes, setProductTypes] = useState(services.map((service) => service.serviceName))
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [extraFeeModal, setExtraFeeModal] = useState(false)
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [selection, setSelection] = useState('')
  const user = useSelector(state => state.user)
  const { id } = user

  useEffect(() => {
    (async () => {
      try {
        const res = await firebase_supplier_product_service.getAllSupplierProducts(
          id
        );
        res.sort((a, b) => new Date(a.time) - new Date(b.time))
        setSupplierProducts(res);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    })()
  }, [])

  const myChangeHandler = (event) => {
    event.preventDefault();
    setSelection(event.target.value)
  };

  const closeModal = () => {
    setSelection('')
    setModal(false);
  };

  const closeExtraFeeModal = () => {
    setExtraFeeModal(false)
  }

  const deleteProduct = async (uid) => {
    try {
      const result = await firebase_supplier_product_service.deleteProduct(uid);
      if (result) {
        const sp = supplierProducts.filter((item) => item.uid !== uid)
        setSupplierProducts(sp)
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", justifyContent: "center" }}
    >
      <Grid md={8} style={{ paddingTop: 40 }}>
        <Typography variant="h5" style={{ paddingBottom: 20, color: "gray" }}>
          Product List
        </Typography>

        {!!loading ? (
          <SkeletonTable />
        ) : (
          <div className="verticalLine">
            <Table>
              <TableHead style={{ backgroundColor: "#42a5f5" }}>
                <TableRow>
                  <TableCell style={{ color: "white", textAlign: 'center' }}>SR</TableCell>
                  <TableCell style={{ color: "white", textAlign: 'center' }}>Product</TableCell>
                  <TableCell style={{ color: "white", textAlign: 'center' }}>Type</TableCell>
                  <TableCell style={{ color: "white", textAlign: 'center' }}>Size</TableCell>
                  <TableCell style={{ color: "white", textAlign: 'center' }}>Class</TableCell>
                  <TableCell style={{ color: "white", textAlign: 'center' }}>UOM</TableCell>
                  <TableCell style={{ color: "white", textAlign: 'center' }}>Cost</TableCell>
                  <TableCell style={{ color: "white", textAlign: 'center' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              {
                supplierProducts.map((item, key) => {
                  return (
                    <SuppplierProductListBlock
                      deleteProduct={deleteProduct}
                      supplierProducts={supplierProducts}
                      setSupplierProducts={setSupplierProducts}
                      sproduct={item}
                      key={item.uid}
                      sNo={key + 1}
                    />
                  );
                })}
            </Table>
          </div>
        )}
        <Grid style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}>
          <Grid xs={6} md={5}></Grid>
          <Grid xs={6} md={2} style={{ textAlign: "center" }}>
            <Button
              endIcon={<AddIcon />}
              fullWidth
              onClick={() => setModal(true)}
              style={style.addItemButton}
            >
              Add Item
            </Button>
          </Grid>
          <Grid xs={6} md={2} style={{ textAlign: "center" }}>
            <Button
              endIcon={<AddIcon />}
              fullWidth
              onClick={() => setExtraFeeModal(true)}
              style={style.addOtherItemButton}
            >
              Extra Fees
            </Button>
          </Grid>

          <Grid xs={6} md={5}></Grid>
        </Grid>

        <Modal
          style={{ overflow: "scroll" }}
          size="sm"
          open={modal}
          onClose={() => closeModal()}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Container maxWidth="md" style={style.bodyDiv}>
            <Typography variant="h5" style={style.textaddproduct}>
              Add Product
            </Typography>
            <div style={{ display: productTypes ? "" : "none" }}>
              <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                <Select
                  style={{ boxShadow: '  0 0 17px -5px #9E9E9E', paddng: 10, cursor: 'pointer', marginBottom: 10, width: '20vw' }}
                  key={selection}
                  className="select"
                  multiple={true}
                  type="text"
                  placeholder="Product"
                  name="productName"
                  onChange={myChangeHandler}
                  required={true}
                  value={selection}
                  options={productTypes} //all product types that can be entered
                />
              </Grid>
              <ProductSelection closeModal={closeModal} supplierProducts={supplierProducts} setSupplierProducts={setSupplierProducts} selection={selection} setSelection={setSelection} />
            </div>
          </Container>
        </Modal>
        {/**** EXTRA ITEMS MODAL*/}
        <Modal
          style={{ overflow: "scroll" }}
          size="sm"
          open={extraFeeModal}
          onClose={() => closeExtraFeeModal()}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Container maxWidth="md" style={style.bodyDiv}>
            <Typography variant="h5" style={style.textaddproduct}>
              Add Extra Fee
            </Typography>
            <div style={{ display: productTypes ? "" : "none" }}>

              <ExtraFeeAddition closeExtraFeeModal={closeExtraFeeModal} />
            </div>
          </Container>
        </Modal>
      </Grid>
    </div>
  );
}

export default Products;