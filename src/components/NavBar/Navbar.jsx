import {NavLink} from 'react-router-dom'
import {Menu , LogOut, UserCircle} from "lucide-react"

import {useAuth} from "../../context/useAuth"
const Navbar = ({onMenu}) => {
    const {vendor,logout} = useAuth();

const links = [
  {to:"/dashboard" , label: "Dashboard"},
  {to:"/outlets" , label: "Outlets"},
  {to:"/categories" , label: "Categories"},
  {to:"/menu-items" , label: "Menu Items"},
  {to:"/profile" , label: "Profile"},
]
  return (
    <div className="navbar">
            {
                vendor?(
                    <button className="icon-button" onClick={onMenu}><Menu size = {21}/></button>
                ):( 
                    <img src='/FS1.svg' width="45" height="45"/>
                )
            }


        <div className="navbar-title">
            <strong>Vendor</strong>
            <span>Manage outlets,categories and menu items</span>
        </div>
        {vendor && <div className="navbar-links">
                {
                    links.map(
                        ({to,label})=>(
                            <NavLink className="navbar-link" key={to} to={to}><small>{label}</small></NavLink>
                        )
                    )
                }
            </div>}

        <div className="navbar-user">
            {
                vendor?(
                    <>
                            <NavLink
                            to="/profile"
                            >
                            <UserCircle size = {22}/>
                            </NavLink>
                            <span>
                                {vendor?.name || vendor?.businessName || 'Vendor'}
                            </span>
                    </>

                ):(
                    <button className="button primary"><NavLink to="/login">Login</NavLink></button>
                )
            }
        </div>

        
        {
            vendor? (
                <button className="ghost-button" onClick={logout}>
                        <LogOut size = {17}/>
                        <span className='md:visible hidden'>Logout</span>
                    </button>
            ):(
                <button className="button primary"><NavLink to="/register">Register</NavLink></button>

            )
        }
    </div>
  )
}

export default Navbar