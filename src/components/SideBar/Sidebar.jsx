import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Store,
  Tags,
  Utensils,
  User,
  X,
  ListOrdered,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import useManagerContext from "../../context/useManagerContext";

const vendorLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/outlets", label: "Outlets", icon: Store },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/menu-items", label: "Menu Items", icon: Utensils },
  { to: "/orders", label: "Orders", icon: ListOrdered },
  { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = ({ open, onClose }) => {
  const { isAuthenticated, logout } = useAuth();

  const { manager, Managerlogout } = useManagerContext();

  const managerLinks = [
    {
      to: `/outlets/${manager?.outlet?._id}`,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: `/categories?outlet=${manager?.outlet?._id}`,
      label: "Categories",
      icon: Tags,
    },
    {
      to: `/menu-items?outlet=${manager?.outlet?._id}`,
      label: "Menu Items",
      icon: Utensils,
    },
    {
      to: "/orders",
      label: "Orders",
      icon: ListOrdered,
    },
  ];

  const links = isAuthenticated ? vendorLinks : managerLinks;

  const handleLogout = () => {
    isAuthenticated ? logout() : Managerlogout();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${open ? "sidebar-overlay-visible" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-header">
          <NavLink
            to={
              isAuthenticated
                ? "/dashboard"
                : `/outlets/${manager?.outlet?._id}`
            }
            className="sidebar-brand"
            onClick={onClose}
          >
            <img src="/FS1.png" alt="FoodStack" className="sidebar-logo" />

            <div className="sidebar-brand-text">
              <strong>Vendor</strong>
              <span>Management</span>
            </div>
          </NavLink>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-links">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <Icon size={19} />

              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
