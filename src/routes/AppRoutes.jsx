import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Register from './../pages/Auth/Register';

import Profile from "../pages/Profile/Profile";

import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/Layout/DashboardLayout"
import CreateOutlet from "../pages/Outlet/CreateOutlet";
import OutletList from './../pages/Outlet/OutletList';
function Private({children}){
    const {isAuthenticated} = useAuth();
    return isAuthenticated? (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    ):(
        <Navigate to ="/login"/>
    )
}
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>}/>
            <Route path="/" element = {<Navigate to = "/dashboard" replace/>}/>
            <Route path="/dashboard" element = {<Private><Dashboard/></Private>}/>
            <Route path="/profile" element={<Private><Profile/></Private>}/>
            <Route path="/outlets" element={<Private><OutletList/></Private>}/>
            <Route path="/outlets/new" element={<Private><CreateOutlet></CreateOutlet></Private>}/>
            <Route path="*" element ={<Navigate to = "/dashboard" replace/>}/>
        </Routes>
    );
};

export default AppRoutes;