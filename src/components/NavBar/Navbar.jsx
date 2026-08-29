import {NavLink} from 'react-router-dom'
import {Menu , LogOut, UserCircle} from "lucide-react"

import {useAuth} from "../../context/useAuth"
const Navbar = ({onMenu}) => {
    const {vendor,logout} = useAuth();
  return (
    <header className="navbar">
        <button className="icon-button mobile-only" onClick={onMenu}>
            <Menu size = {21}/>
        </button>
        <div className="navbar-title">
            <strong>Vendor Menu Manager</strong>
            <span>Manage outlets,categories and menu items</span>
        </div>
        <div className="navbar-user">
            <NavLink
            to="/profile"
            >
            <UserCircle size = {22}/>
            </NavLink>
            <span>
                {vendor?.name || vendor?.businessName || 'Vendor'}
            </span>
        </div>
            <button className="ghost-button" onClick={logout}>
                <LogOut size = {17}/>
                Logout
            </button>
    </header>
  )
}

export default Navbar