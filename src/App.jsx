
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <AppRoutes />
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
