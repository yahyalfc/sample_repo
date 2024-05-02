import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import * as serviceWorker from "./serverWorker"
import App from "./App"
import { createStore } from "redux"
import { Provider } from "react-redux"
// Importing all reducers
import rootReducer from "./redux/reducers"

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem("state", serializedState)
  } catch (e) {
    console.log("Error saving to local storage.", e)
  }
}

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("state")
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (e) {
    console.log("Error fetching from local storage.")
    return undefined
  }
}

const persistedState = loadFromLocalStorage()
//Store
let store = createStore(
  rootReducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
store.subscribe(() => saveToLocalStorage(store.getState()))

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
)

serviceWorker.unregister()
