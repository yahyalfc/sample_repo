import { Navigate } from "react-router-dom"
import { useUser } from "../../hooks"

const LoggedInRoute = ({ component: Component }) => {
  const currentUser = useUser()
  // const id = currentUser && currentUser.uid
  // firebase_user_services.getUser(id);

  return !!currentUser ? <Component /> : <Navigate to={"/auth/login"} />
}

export default LoggedInRoute
