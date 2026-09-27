import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Register from './../pages/Auth/Register';

import Profile from "../pages/Profile/Profile";

import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/Layout/DashboardLayout"
import CreateOutlet from "../pages/Outlet/CreateOutlet";
import OutletList from './../pages/Outlet/OutletList';
import OutletDetails from './../pages/Outlet/OutletDetails';
import CategoryList from './../pages/Category/CategoryList';
import CategoryDetails from "../pages/Category/CategoryDetails";
import CategoryForm from "../pages/Category/CategoryForm";
import MenuItemList from "../pages/MenuItem/MenuItemList";
import MenuItemForm from "../pages/MenuItem/MenuItemForm";
import MenuItemDetails from "../pages/MenuItem/MenuItemDetails";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Orders from './../pages/Orders/Orders';
import Track from './../pages/Orders/Track'
import useManagerContext from "../context/useManagerContext";
import { useEffect } from "react";
import { toast } from "sonner";

function VendorPrivate(){
    const {isAuthenticated} = useAuth();
    const {isManagerAuthenticated,manager} = useManagerContext();
    useEffect(
        ()=>{
            if(!isAuthenticated && isManagerAuthenticated){
                toast.error("Only vendors can access this page.")
            }
        }
    )
    if(isAuthenticated){
        return (
        <DashboardLayout>
            <Outlet/>
        </DashboardLayout>
        )
    }
    if(isManagerAuthenticated){
        return <Navigate to={`/outlets/${manager.Outlet?._id}`} replace/>
    }
    return <Navigate to="/login" replace/>
}

function ManagerPrivate(){
    const {isManagerAuthenticated} = useManagerContext();
    return isManagerAuthenticated? (
        <DashboardLayout>
                <Outlet/>
        </DashboardLayout>
    ):(
        <Navigate to="/login" replace/>
    )
}

function VendorOrManager(){
    const {isAuthenticated} = useAuth();
    const {isManagerAuthenticated} = useManagerContext();
    const access = isAuthenticated || isManagerAuthenticated;
    return access?(
        <DashboardLayout>
            <Outlet/>
        </DashboardLayout>
    ):(
        <Navigate to="/login" replace/>
    )
}
function Public(){
    return <DashboardLayout><Outlet/></DashboardLayout>
}

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Public/>}>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/reset-password/:token" element={<ResetPassword/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/" element = {<Navigate to = "/dashboard" replace/>}/>
            </Route>
            <Route element={<VendorPrivate/>}>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/outlets" element={<OutletList/>}/>
                <Route path="/dashboard" element = {<Dashboard/>}/>
                <Route path="/outlets/new" element={<CreateOutlet/>}/>
            </Route>
            <Route element={<ManagerPrivate/>}>
                <Route element={<Track/>}/>
            </Route>
            <Route element={<VendorOrManager/>}>
                <Route path="/categories" element={<CategoryList/>}/>
                <Route path="/category/new" element={<CategoryForm/>}/>
                <Route path= "/outlets/:id" element={<OutletDetails/>}/>
                <Route path= "/outlets/:id/edit" element={<CreateOutlet/>}/>
                <Route path= "/categories/:id/edit" element={<CategoryForm/>}/>
                <Route path= "/categories/:id" element={<CategoryDetails/>}/>
                <Route path= "/menu-items" element={<MenuItemList/>}/>
                <Route path= "/menu-item/new" element={<MenuItemForm/>}/>
                <Route path= "/menu-item/:id" element={<MenuItemDetails/>}/>
                <Route path= "/menu-item/:id/edit" element={<MenuItemForm/>}/>
                <Route path="/orders" element={<Orders/>}/>
            </Route>
            <Route path="*" element ={<Navigate to = "/dashboard" replace/>}/>
        </Routes>
    );
};

export default AppRoutes;