import { Suspense } from 'react';
import { useRoutes } from "react-router-dom"
import { AuthProvider } from "./providers"
import GlobalStyles from "./components/GlobalStyles"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
// import theme from "./theme";
import routes from "./routes"
import "./App.css"
import CustomLoader from './components/CustomLoader'

// import "./index.css";
const theme = createMuiTheme({
  typography: {
    fontFamily: "Nunito Sans, Roboto, sans-serif",
  },
})

const App = () => {
  const routing = useRoutes(routes)

  return (
    <AuthProvider>
      <MuiThemeProvider theme={theme}>
        <GlobalStyles />
        <Suspense fallback={<CustomLoader />}>
          {routing}
        </Suspense>
      </MuiThemeProvider>
    </AuthProvider >
  )
}

export default App
