import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  Menu,
  LogOut,
  UserCircle,
  ShoppingBag,
  Sun,
  Moon,
  Monitor,
  Check,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import useManagerContext from "../../context/useManagerContext";

const vendorLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/outlets", label: "Outlets" },
  { to: "/categories", label: "Categories" },
  { to: "/menu-items", label: "Menu Items" },
  { to: "/profile", label: "Profile" },
  { to: "/orders", label: "Orders" },
];

const themes = [
  { name: "light", label: "Light", icon: Sun },
  { name: "dark", label: "Dark", icon: Moon },
  { name: "system", label: "System", icon: Monitor },
];

const Navbar = ({ onMenu }) => {
  const { vendor, logout, isAuthenticated } = useAuth();

  const {
    isManagerAuthenticated,
    manager,
    Managerlogout,
    managerLogin,
    ordersNum,
  } = useManagerContext();

  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    return ["light", "dark", "system"].includes(savedTheme)
      ? savedTheme
      : "system";
  });

  const [themeOpen, setThemeOpen] = useState(false);

  const themeRef = useRef(null);

  // Apply theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark =
        theme === "dark" || (theme === "system" && mediaQuery.matches);

      document.documentElement.classList.toggle("dark", isDark);

      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    };

    applyTheme();

    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
    }

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  // Save theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close theme dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Navigation
  const managerLinks = [
    {
      to: `/outlets/${manager?.outlet?._id}`,
      label: "Dashboard",
    },
    {
      to: `/categories?outlet=${manager?.outlet?._id}`,
      label: "Categories",
    },
    {
      to: `/menu-items?outlet=${manager?.outlet?._id}`,
      label: "Menu Items",
    },
    {
      to: "/orders",
      label: "Orders",
    },
  ];

  const links = isAuthenticated ? vendorLinks : managerLinks;

  const accessBoth = isAuthenticated || isManagerAuthenticated;

  const userName =
    vendor?.name || vendor?.businessName || manager?.name || "Vendor";

  const selectedTheme = themes.find((item) => item.name === theme);

  const SelectedIcon = selectedTheme.icon;

  const handleLogout = () => {
    isAuthenticated ? logout() : Managerlogout();
  };

  return (
    <header className="navbar">
      <div className="navbar-body">
        {/* Logo and Menu */}
        <div className="navbar-start">
          {accessBoth ? (
            <button
              type="button"
              className="navbar-menu"
              onClick={onMenu}
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>
          ) : (
            <img src="/FS1.png" alt="FoodStack" className="navbar-logo" />
          )}

          <strong className="navbar-title">
            {isManagerAuthenticated ? manager?.outlet?.name : "Vendor"}
          </strong>
        </div>

        {/* Navigation Links */}
        {accessBoth && (
          <nav className="navbar-links">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link-active" : ""}`
                }
              >
                {label}

                {label === "Orders" &&
                  isManagerAuthenticated &&
                  ordersNum > 0 && (
                    <span className="navbar-count">{ordersNum}</span>
                  )}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Theme Switcher */}
          <div className="theme-switcher" ref={themeRef}>
            <button
              type="button"
              className="theme-trigger"
              onClick={() => setThemeOpen(!themeOpen)}
              aria-label="Change theme"
              aria-expanded={themeOpen}
            >
              <SelectedIcon size={18} />

              <span>{selectedTheme.label}</span>

              <ChevronDown size={15} />
            </button>

            {themeOpen && (
              <div className="theme-dropdown">
                {themes.map(({ name, label, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    className={`theme-option ${
                      theme === name ? "theme-option-active" : ""
                    }`}
                    onClick={() => {
                      setTheme(name);
                      setThemeOpen(false);
                    }}
                  >
                    <Icon size={17} />

                    <span>{label}</span>

                    {theme === name && (
                      <Check size={16} className="theme-check" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="navbar-user">
            {accessBoth ? (
              <>
                <NavLink
                  to={isAuthenticated ? "/profile" : "/orders"}
                  className="navbar-user-link"
                >
                  {isAuthenticated ? (
                    <UserCircle size={22} />
                  ) : (
                    <span className="navbar-orders">
                      <ShoppingBag size={19} />
                      {ordersNum}
                    </span>
                  )}
                </NavLink>

                <span className="navbar-username">{userName}</span>
              </>
            ) : (
              <NavLink to="/login" className="navbar-login">
                Login
              </NavLink>
            )}
          </div>

          {/* Logout / Register */}
          {accessBoth ? (
            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          ) : (
            !managerLogin && (
              <NavLink to="/register" className="navbar-register">
                Register
              </NavLink>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
