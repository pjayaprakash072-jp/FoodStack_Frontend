import AppRoutes from "./routes/AppRoutes"
import {BrowserRouter} from "react-router-dom"
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from "./context/LocationContext";
import {ManagerAuthProvider} from "./context/ManagerContext"

const App = () => {
  return (
    <BrowserRouter>
    <AuthProvider>
      <LocationProvider>
        <ManagerAuthProvider>
          <AppRoutes/>
        </ManagerAuthProvider>
      </LocationProvider>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App