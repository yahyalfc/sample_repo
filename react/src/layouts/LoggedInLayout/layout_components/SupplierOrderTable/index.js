import { Box, Button, Modal, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { useState } from 'react'
import { useSelector } from 'react-redux'
import SupplierOrderBlock from '../SupplierOrderBlock';
import status_array from '../../../../static/supplier-status'
import { unit_service } from '../../../../utils/convert/quantityUnit';
import { time_service } from '../../../../utils/time/timeAndDate';
import { compute_service_data } from '../../../../utils/convert/serviceName';

function SupplierOrderTable({ supplierorder, sNo }) {
  const { updatedAt, status, serviceID, quantity } = supplierorder;
  const time = time_service.convertDateFormat(updatedAt)
  const [modal, setModal] = useState(false);
  const services = useSelector(state => state.services)
  const serviceName = compute_service_data.computeServiceName(serviceID, services)
  const munit = unit_service.convertStatus(serviceName)

  const openModal = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false)
  }

  const convertStatus = (status) => {
    if (status_array) {
      // Here we are matching our status with the config/customerStatus which we'll later move to db and only admin can change that.
      const convertstatus = status_array.find((item) => item.status == status);
      return convertstatus.text;
    } else return status;
  };

  return (
    <>
      <TableBody>
        <TableRow>
          <TableCell style={{ textAlign: "center" }}>{sNo}</TableCell>
          <TableCell style={{ textAlign: "center" }}>
            {serviceName}
          </TableCell>
          <TableCell style={{ textAlign: "center" }}>
            {convertStatus(status)}
          </TableCell>
          <TableCell style={{ textAlign: "center" }}>
            {quantity} {" "} {munit}
          </TableCell>
          <TableCell style={{ textAlign: "center" }}>
            {time.date} {time.time}
          </TableCell>
          <TableCell
            style={{ textAlign: "center" }}
            onClick={() => {
              openModal();
            }}
          >
            <Button style={{
              textDecoration: "underline",
              color: "#42a5f5",
              textTransform: "capitalize",
              marginRight: 5,
            }} onClick={() => setModal(true)}>
              <Typography>View</Typography>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <Modal
        open={modal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ width: "60%", zIndex: 'X', marginLeft: '-10%' }}
      >
        <Box style={{ marginLeft: "50%", marginTop: "25vh", width: "100%" }}>
          <SupplierOrderBlock data={supplierorder} modal={modal} handleClose={handleClose} openModal={openModal} />
        </Box>
      </Modal>
    </>
  )
}

export default SupplierOrderTable
