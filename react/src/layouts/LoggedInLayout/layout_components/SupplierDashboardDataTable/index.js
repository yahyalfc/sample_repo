import { useEffect, useState } from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { firebase_order_service } from "../../../../services/firebase/order_service";
import { setOrders } from "../../../../redux/actions";
import { Table, TableCell, TableHead, TableRow } from "@material-ui/core";
import SupplierOrderTable from "../SupplierOrderTable";

const SupplierDashboardDataTable = (props) => {
  const allorders = useSelector((state) => state.orders);
  const user = useSelector(state => state.user)
  const { id } = user
  const dispatch = useDispatch();
  const [displayOrders, setDisplayOrders] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const maxUpdated = await firebase_order_service.getMaxUpdatedAt(allorders)
        const result = await firebase_order_service.getAllSupplierOrders(id, maxUpdated)
        let setorders = [...allorders, ...result]
        setorders.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)).reverse()
        if (!!result.length) {
          dispatch(setOrders(setorders))
        }
        setDisplayOrders(setorders.slice(0, 5))

      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  useEffect(() => {
    setDisplayOrders(allorders.slice(0, 5))
  }, [allorders])

  return (
    <div
      style={{
        height: 400,
        width: "100%",
        border: "none",
      }}
    >
      <Table>
        <TableHead style={{ backgroundColor: "#42a5f5" }}>
          <TableRow>
            <TableCell style={{ color: "white", textAlign: 'center' }}>ID</TableCell>
            <TableCell style={{ color: "white", textAlign: 'center' }}>Product</TableCell>
            <TableCell style={{ color: "white", textAlign: 'center' }}>Status</TableCell>
            <TableCell style={{ color: "white", textAlign: 'center' }}>Order Details</TableCell>
            <TableCell style={{ color: "white", textAlign: 'center' }}>Date And Time</TableCell>
            <TableCell style={{ color: "white", textAlign: 'center' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        {displayOrders.map((item, key) => {
          return (
            <SupplierOrderTable
              supplierorder={item}
              key={item.uid}
              sNo={key + 1}
            />
          );
        })}
      </Table>
    </div>
  );
};

export default SupplierDashboardDataTable;
