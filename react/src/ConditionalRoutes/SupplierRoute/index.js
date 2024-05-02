import { Navigate } from "react-router"
import { useSelector } from 'react-redux'

const SupplierRoute = ({ component: Component }) => {
  const user = useSelector(state => state.user)
  const { role } = user
  return !!(role == "Supplier") ? <Component /> : <Navigate to="/404" />
}

export default SupplierRoute
