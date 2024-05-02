import { useState } from 'react'
import AddConcrete from '../../../../layout_components/AddConcrete'
import AddSteel from '../../../../layout_components/AddSteel'
import AddBricks from '../../../../layout_components/AddBricks'
import AddSand from '../../../../layout_components/AddSand'
import AddRock from '../../../../layout_components/AddRock'
import { useSelector } from "react-redux"
import { firebase_supplier_product_service } from '../../../../../../services/firebase/supplier_product_services'
import swal from 'sweetalert'

function ProductSelection({ selection, supplierProducts, setSupplierProducts, closeModal, setSelection }) {
  const services = useSelector((state) => state.services)
  const user = useSelector(state => state.user)
  const [disableButton, setDisableButton] = useState(false)

  const submitSelection = async (value) => {
    const { id, email, businessName, phone, mobile, address, name } = user;
    //disabling the button so user cant make multiple products by clicking again and again
    setDisableButton(true)

    try {
      let product = {
        ...value, //formik values vary so dynamically we put values of product supplier entered
        serviceID: services.find((service) => service.serviceName == selection).uid,
        supplierID: id,
        supplierName: name,
        supplierEmail: email,
        businessName: businessName,
        supplierPhone: phone,
        supplierMobile: mobile,
        supplierAddress: address,
        quantities: [],
        shortfall: {},
        waterMix: ''
      };

      const result = await firebase_supplier_product_service.addProduct(
        product
      );
      // If product added successfully we'll add to our state array of objects
      if (result) {
        let sp = [...supplierProducts, result]
        setSupplierProducts(sp);
        swal({
          title: "Product Added Successfully",
          icon: "success",
          buttons: {
            Confirm: { text: "Okay", className: "okayButton" },
          },
        })
          .then((value) => {
            closeModal(true);
            if (value == "Confirm") {
              setSelection('')
            }
          })

      }
    } catch (err) {
      console.log(err);
    }
  }

  if (selection === 'Premix Concrete') {
    return (
      <>
        <AddConcrete disableButton={disableButton} closeModal={closeModal} selection={selection} submitVal={(data) => submitSelection(data)} supplierProducts={supplierProducts} />
      </>
    )
  } else if (selection == 'Reinforced Steel') {
    return (
      <>
        <AddSteel disableButton={disableButton} closeModal={closeModal} supplierProducts={supplierProducts} selection={selection} submitVal={(data) => submitSelection(data)} />
      </>
    )
  } else if (selection == 'Bricks') {
    return (
      <>
        <AddBricks disableButton={disableButton} closeModal={closeModal} supplierProducts={supplierProducts} selection={selection} submitVal={(data) => submitSelection(data)} />
      </>
    )
  } else if (selection == 'Sand') {
    return (
      <>
        <AddSand disableButton={disableButton} closeModal={closeModal} supplierProducts={supplierProducts} selection={selection} submitVal={(data) => submitSelection(data)} />
      </>
    )
  } else if (selection == 'Rock/Gravel') {
    return (
      <>
        <AddRock disableButton={disableButton} closeModal={closeModal} supplierProducts={supplierProducts} selection={selection} submitVal={(data) => submitSelection(data)} />
      </>
    )
  }
  else {
    return null
  }
}


export default ProductSelection