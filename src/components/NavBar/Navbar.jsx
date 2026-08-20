
import {Menu , LogOut, UserCircle} from "lucide-react"

import {useAuth} from "../../context/AuthContext"
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
            <UserCircle size = {22}/>
            <span>
                {vendor?.name || vendor?.businessName || 'Vendor'}
            </span>
            <button className="ghost-button" onClick={logout}>
                <LogOut size = {17}/>
                Logout
            </button>
        </div>
    </header>
  )
}

export default Navbar