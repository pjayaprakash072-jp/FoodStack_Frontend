import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Register from './../pages/Auth/Register';

import Profile from "../pages/Profile/Profile";

import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/Layout/DashboardLayout"
import CreateOutlet from "../pages/Outlet/CreateOutlet";
import OutletList from './../pages/Outlet/OutletList';
import OutletDetails from './../pages/Outlet/OutletDetails';
import CategoryList from './../pages/Category/CategoryList';
import CategoryDetails from "../pages/Category/CategoryDetails";
import CategoryForm from "../pages/Category/CategoryForm";
import MenuItemList from "../pages/MenuItem/MenuItemList";
import MenuItemForm from "../pages/MenuItem/MenuItemForm";
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
            <Route path="/categories" element={<Private><CategoryList/></Private>}/>
            <Route path="/category/new" element={<Private><CategoryForm/></Private>}/>
            <Route path="/outlets/new" element={<Private><CreateOutlet/></Private>}/>
            <Route path= "/outlets/:id" element={<Private><OutletDetails/></Private>}/>
            <Route path= "/categories/:id/edit" element={<Private><CategoryForm/></Private>}/>
            <Route path= "/categories/:id" element={<Private><CategoryDetails/></Private>}/>
            <Route path= "/menu-items" element={<Private><MenuItemList/></Private>}/>
            <Route path= "/menu-item/new" element={<Private><MenuItemForm/></Private>}/>
            <Route path= "/menu-item/:id/edit" element={<Private><MenuItemForm/></Private>}/>
            <Route path="*" element ={<Navigate to = "/dashboard" replace/>}/>
        </Routes>
    );
};

export default AppRoutes;