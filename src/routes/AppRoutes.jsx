import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Register from './../pages/Auth/Register';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/register" element={<Register/>}/>
        </Routes>
    );
};

export default AppRoutes;