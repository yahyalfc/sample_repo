import { Navigate } from "react-router"
import { useSelector } from 'react-redux'

const CustomerRoute = ({ component: Component }) => {
  const user = useSelector(state => state.user)
  const { role } = user
  return !!(role == "Customer") ? <Component /> : <Navigate to="/404" />
}

export default CustomerRoute
