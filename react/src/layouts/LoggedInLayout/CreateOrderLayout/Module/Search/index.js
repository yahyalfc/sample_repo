import { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import style from "./style";
import OrderCard from "../../../layout_components/OrderCard";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useSelector } from 'react-redux'
import NoVendorFound from "../../../layout_components/NoVenorFound";
import SkeletonOrderCard from "../../../layout_components/OrderCard/SkeletonOrderCard";
import { firebase_location_service } from "../../../../../services/geofirestore/location_service";
import { firebase_product_service } from '../../../../../services/firebase/product_service'
import { unit_service } from '../../../../../utils/convert/quantityUnit'
import { compute_service_data } from "../../../../../utils/convert/serviceName";

function OrderSearch(props) {
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.user)
  const services = useSelector(state => state.services)
  const selection = props.getState('selection')
  const secondarySelection = props.getState('secondary')
  const { productType, quantity, serviceID } = selection
  let { deliveryDate, deliveryTime, locationName, coordinates } = secondarySelection
  const serviceName = compute_service_data.computeServiceName(serviceID, services)
  // If concrete only then we need to add delivery time
  if (serviceName !== 'Premix Concrete') {
    deliveryTime = null
  }

  const munit = unit_service.convertStatus(serviceName)
  const orderInfo = { deliveryDate, deliveryTime, locationName, coordinates, serviceName, quantity, productType, munit }
  const [suppliersInProximity, setSuppliersInProximity] = useState([])
  //componentDidMount
  useEffect(() => {
    // Lets find suppliers who are offering the product
    const {
      getSuppliersInProximity,
      getMoreThanTenSuppliersInProximity,
    } = firebase_location_service;
    //setting unit of measure
    try {
      // Queries is a dynamic object which will fill all the data user entered while ordering except quantity and placement Method 
      //cuz we dont need these two parameters to find the suppliers offering that product
      const queries = []
      Object.entries(selection).map((value) => {
        if (value[1] && value[0] !== 'quantity' && value[0] !== 'placementMethod' && value[0] !== 'description') {
          queries.push({
            attribute: value[0],
            operator: '==',
            value: value[1]
          })
        }
      });
      //We then in fetch filterCollection on basis of our dynamic query and quantity to get suppliers who are selling our desired
      //product and the quantity we entered.
      (async () => {
        //supp contains products which are offering the product and quantiy that we entered  
        const sup = await firebase_product_service.fetchCollection('SupplierProducts', { queries }, quantity)
        // suppliers are filtered on basis of description added in case of bricks, rock, sand and shiz.
        //In case of concrete we simply enter concrete we dont need to filter
        let suppliers
        if (serviceName == 'Premix Concrete' || serviceName == 'Reinforced Steel'
        ) {
          suppliers = sup
        } else {
          suppliers = sup.filter((product) => product.title.toLowerCase().includes(selection.description.toLowerCase()) || product.description.toLowerCase().includes(selection.description.toLowerCase()))
          // suppliers = sup.filter((product) => (algo_service.kmpSearch(selection.description.toLowerCase(), product.title.toLowerCase()) != -1) || (algo_service.kmpSearch(selection.description.toLowerCase(), product.title.toLowerCase()) != -1))
        }
        let filteredSuppliers = []
        let res = []
        if (suppliers.length > 10) {
          // if suppliers more than 10 then we have to filter out suppliers ourselves.
          filteredSuppliers = await getMoreThanTenSuppliersInProximity(
            suppliers,
            coordinates
          );
        } else {
          //for geofirestore query we make it an array of id's
          const supplieridArray = suppliers.map(({ supplierID }) => supplierID);

          if (!!supplieridArray.length) {
            filteredSuppliers = await getSuppliersInProximity(
              supplieridArray,
              coordinates
            );
          }
        }
        // Now we have filtered suppliers. If suppliers then we map such that supplierCoordinates are attached to our supplier product 
        if (!!filteredSuppliers.length) {
          res = filteredSuppliers.map(
            ({ coordinates: { latitude: lat, longitude: lng }, userID }) => ({
              suppliercoordinates: { lat, lng },
              ...suppliers.find(({ supplierID }) => supplierID == userID),
            })
          );
        }
        // These are the suppliers in our proximity
        setSuppliersInProximity(res);
      })();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [])

  const onSubmit = ({
    price,
    supplierID,
    supplierEmail,
    supplierMobile,
    supplierName,
    supplierPhone,
    businessName,
    waterMix,
  }) => {

    const selection = props.getState('selection')
    // we create an object with different fields we will require to make an order and pass it to next step.
    let status = ''
    if (serviceName == 'Premix Concrete') {
      status = 'unapproved'
    } else {
      status = 'unapproved'
    };

    const object = {
      ...selection,
      deliveryDate,
      deliveryTime,
      locationName,
      supplierID,
      supplierMobile,
      supplierName,
      supplierEmail,
      supplierPhone,
      businessName,
      waterMix,
      serviceID,
      price,
      status,
      customerID: user.id,
      customerEmail: user.email,
      customerMobile: user.mobile,
      customerPhone: user.phone,
      customerName: user.name,
      customerAddress: user.address ? user.address : null,
      customerBusinessName: user.businessName ? user.businessName : null,
      customerBusinessAddress: user.businessAddress ? user.businessAddress : null,
      customerABN: user.ABN ? user.ABN : null,
      customerType: user.type ? user.type : null
    };

    props.setState("order", object);
    props.next();
  };

  return (
    <Grid style={{ marginTop: 40, marginBottom: 90 }}>
      <Grid container style={{ margin: 40 }}>
        <Grid item xs={12} md={1} style={{ textAlign: "right" }}>
          <ArrowBackIosIcon onClick={() => props.prev()} style={style.icon} />
        </Grid>

        <Grid item xs={12} md={9} style={style.mainContainer}>
          <Grid
            container
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={10} md={4} style={{ marginBottom: 20 }}>
              {renderOrderInfo(orderInfo)}
            </Grid>
            <Grid item xs={10} md={7} style={{ marginLeft: 8 }}>
              <Grid>
                <div style={{ display: !!loading ? "" : "none" }}>
                  <SkeletonOrderCard />
                </div>
                <div style={{ display: !!loading ? "none" : "" }}>
                  <div
                    style={{
                      display: !!suppliersInProximity.length ? "" : "none",
                    }}
                  >
                    {suppliersInProximity.map((product) => (
                      <OrderCard
                        key={product.id}
                        orderdata={orderInfo}
                        productdata={product}
                        onSelect={(data) => onSubmit(data)}
                      />
                    ))}
                  </div>
                  <Grid
                    style={{
                      display: !!suppliersInProximity.length ? "none" : "",
                    }}
                  >
                    <NoVendorFound />
                  </Grid>
                </div>
              </Grid >
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={1}></Grid>
      </Grid>
    </Grid>
  );
}

export default OrderSearch;

const renderOrderInfo = ({
  productType,
  locationName,
  serviceName,
  quantity,
  deliveryDate,
  deliveryTime,
  munit
}) => (
  <Grid item xs={12} md={12} style={style.cardGrid}>
    <Box my={2} style={style.box}>
      <p style={style.textsitelocation}>Site Location</p>

      <p style={style.textadress}>{locationName}</p>
    </Box>

    <Box my={2} style={style.box}>
      <p style={style.textsitelocation}>Product</p>

      <p style={style.textadress}>{serviceName}</p>
    </Box>
    {
      productType ? <Box my={2} style={style.box}>
        <p style={style.textsitelocation}>Type</p>
        <p style={style.textadress}>{productType}</p>
      </Box>
        : ''
    }
    <Box my={2} style={style.box}>
      <p style={style.textsitelocation}>Quantity</p>

      <p style={style.textadress}>
        {quantity}{" "}{munit}
      </p>
    </Box>
    {
      deliveryTime !== null ? (
        <Box Box my={2} style={style.box}>
          <p style={style.textsitelocation}>Delivery Time</p>

          <p style={style.textadress}>{deliveryTime}</p>
        </Box>
      ) : null}

    <Box my={2} style={style.lastbox}>
      <p style={style.textsitelocation}>Delivery Date</p>
      <p style={style.textadress}>{deliveryDate}</p>
    </Box>
  </Grid >
);