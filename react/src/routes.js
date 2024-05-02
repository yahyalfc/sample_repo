import { lazy } from 'react';
import { Navigate } from "react-router-dom";

//routes
import LoggedInRoute from "./ConditionalRoutes/LoggedInRoute";
import SupplierRoute from "./ConditionalRoutes/SupplierRoute";
import CustomerRoute from "./ConditionalRoutes/CustomerRoute";
//Layouts
const LoggedInLayout = lazy(() => import('./layouts/LoggedInLayout'))
const LoggedOutLayout = lazy(() => import('./layouts/LoggedOutLayout'))
const OnboardingLayout = lazy(() => import('./layouts/OnboardingLayout'))
//Sub Layouts
const AuthLayout = lazy(() => import('./layouts/LoggedOutLayout/AuthLayout'))
const SupplierLayout = lazy(() => import('./layouts/LoggedInLayout/SupplierLayout'))
const CustomerLayout = lazy(() => import('./layouts/LoggedInLayout/CustomerLayout'))
const DashboardLayout = lazy(() => import('./layouts/LoggedInLayout/DashboardLayout'))
const CreateOrderLayout = lazy(() => import('./layouts/LoggedInLayout/CreateOrderLayout'))
// LoggedOutLayout
const Register = lazy(() => import('./layouts/LoggedOutLayout/AuthLayout/Module/Register'))
const Login = lazy(() => import('./layouts/LoggedOutLayout/AuthLayout/Module/Login'))
//LoggedInLayout
const CustomerInvoices = lazy(() => import('./layouts/LoggedInLayout/CustomerLayout/Module/Invoices'))
const CustomerOrder = lazy(() => import('./layouts/LoggedInLayout/CustomerLayout/Module/Order'))
const CustomerProfile = lazy(() => import('./layouts/LoggedInLayout/CustomerLayout/Module/Profile'))
const SupplierInvoices = lazy(() => import('./layouts/LoggedInLayout/SupplierLayout/Module/Invoices'))
const SupplierOrder = lazy(() => import('./layouts/LoggedInLayout/SupplierLayout/Module/Orders'))
const SupplierProfile = lazy(() => import('./layouts/LoggedInLayout/SupplierLayout/Module/Profile'))
const Products = lazy(() => import('./layouts/LoggedInLayout/SupplierLayout/Module/Products'))
const ModifyOrder = lazy(() => import('./layouts/LoggedInLayout/SupplierLayout/Module/ModiyOrder'))
const AllNotifications = lazy(() => import('./components/AllNotifications'))
//404
const NotFound = lazy(() => import('./components/NotFound'))

const routes = [
  {
    path: "/",
    element: <LoggedOutLayout />,
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "/register",
            element: <Register />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          { path: "", element: <Navigate to="/auth/login" /> },
          { path: "/", element: <Navigate to="/auth/login" /> },
        ],
      },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <Navigate to="/404" /> },
      { path: "", element: <Navigate to="/app/dashboard" /> },
      { path: "/", element: <Navigate to="/app/dashboard" /> },
    ],
  },
  {
    path: "/app",
    element: <LoggedInRoute component={LoggedInLayout} />,
    children: [
      {
        path: "/supplier",
        element: <SupplierRoute component={SupplierLayout} />,
        children: [
          {
            path: "/order",
            element: <SupplierOrder />,
          },
          {
            path: "/profile",
            element: <SupplierProfile />,
          },
          {
            path: "/invoice",
            element: <SupplierInvoices />,
          },
        ],
      }, {
        path: '/products',
        element: <Products />,
      },
      {
        path: "/modifyorder",
        element: <SupplierRoute component={ModifyOrder} />,
        // element: <ModifyOrder />,
      },
      {
        path: "/customer",
        element: <CustomerRoute component={CustomerLayout} />,
        children: [
          {
            path: "/order",
            element: <CustomerOrder />,
          },
          {
            path: "/profile",
            element: <CustomerProfile />,
          },
          {
            path: "/invoice",
            element: <CustomerInvoices />,
          },
        ],
      },
      {
        path: "/showallnotifications",
        element: <AllNotifications />
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
      },
      {
        path: "/createorder",
        // element: <CreateOrderLayout />,
        element: <CustomerRoute component={CreateOrderLayout} />,
      },
      { path: "*", element: <Navigate to="/404" /> },
      { path: "", element: <Navigate to="/app/dashboard" /> },
      { path: "/", element: <Navigate to="/app/dashboard" /> },
    ],
  },
  {
    path: "/onboarding",
    element: <OnboardingLayout />,
    children: [
      { path: "*", element: <Navigate to="/404" /> },
      { path: "", element: <Navigate to="/404" /> },
      { path: "/", element: <Navigate to="/404" /> },
    ],
  },
];
export default routes;
