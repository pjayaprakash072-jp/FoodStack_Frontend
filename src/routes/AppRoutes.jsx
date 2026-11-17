
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";

import DashboardLayout from "../components/Layout/DashboardLayout";

import CreateOutlet from "../pages/Outlet/CreateOutlet";
import OutletList from "../pages/Outlet/OutletList";
import OutletDetails from "../pages/Outlet/OutletDetails";

import CategoryList from "../pages/Category/CategoryList";
import CategoryDetails from "../pages/Category/CategoryDetails";
import CategoryForm from "../pages/Category/CategoryForm";

import MenuItemList from "../pages/MenuItem/MenuItemList";
import MenuItemForm from "../pages/MenuItem/MenuItemForm";
import MenuItemDetails from "../pages/MenuItem/MenuItemDetails";

import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/Orders/OrderDetails";

function VendorPrivate() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}

function Public() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Public />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>

      {/* Vendor Protected Routes */}
      <Route element={<VendorPrivate />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        {/* Outlets */}
        <Route path="/outlets" element={<OutletList />} />
        <Route path="/outlets/new" element={<CreateOutlet />} />
        <Route path="/outlets/:id" element={<OutletDetails />} />
        <Route path="/outlets/:id/edit" element={<CreateOutlet />} />

        {/* Categories */}
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/category/new" element={<CategoryForm />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />
        <Route path="/categories/:id/edit" element={<CategoryForm />} />

        {/* Menu Items */}
        <Route path="/menu-items" element={<MenuItemList />} />
        <Route path="/menu-item/new" element={<MenuItemForm />} />
        <Route path="/menu-item/:id" element={<MenuItemDetails />} />
        <Route path="/menu-item/:id/edit" element={<MenuItemForm />} />

        {/* Orders */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/manager/orders/:orderId" element={<OrderDetails />} />
      </Route>

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
