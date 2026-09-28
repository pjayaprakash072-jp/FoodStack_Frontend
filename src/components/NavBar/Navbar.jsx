import {NavLink} from 'react-router-dom'
import {Menu , LogOut, UserCircle} from "lucide-react"

const Vendorlinks = [
{to:"/dashboard" , label: "Dashboard"},
{to:"/outlets" , label: "Outlets"},
{to:"/categories" , label: "Categories"},
{to:"/menu-items" , label: "Menu Items"},
{to:"/profile" , label: "Profile"},
{to:"/orders",label:"Orders"}
]
import {useAuth} from "../../context/useAuth"
import useManagerContext from '../../context/useManagerContext'
const Navbar = ({onMenu}) => {
    const {vendor,logout,isAuthenticated} = useAuth();
  const {isManagerAuthenticated,manager,Managerlogout,managerLogin} = useManagerContext();

  const ManagerLinks = [
    {to:`/outlets/${manager?.outlet?._id}` , label: "Dashboard"},
    {to:`/categories?outlet=${manager?.outlet?._id}`, label: "Categories"},
    {to:`/menu-items?outlet=${manager?.outlet?._id}` , label: "Menu Items"},
    {to:"/orders",label:"Orders"}
  ]
  const links = isAuthenticated? Vendorlinks:ManagerLinks;
  const accessBoth = isAuthenticated || isManagerAuthenticated;
return (
    <div className="navbar">
            {
                accessBoth?(
                    <button className="icon-button" onClick={onMenu}><Menu size = {21}/></button>
                ):( 
                    <img src='/FS1.png' width="45" height="45"/>
                )
            }


        <div className="navbar-title">
            <strong>{ isManagerAuthenticated ? manager?.outlet?.name :"Vendor"}</strong>
        </div>
        {accessBoth&& <div className="navbar-links">
                {
                    links.map(
                        ({to,label})=>(
                            <NavLink 
                            className={({isActive})=> isActive? "navbar-link active"  : "navbar-link"}
                            key={to} 
                            to={to}
                            >
                                <small>{label}</small>
                            </NavLink>
                        )
                    )
                }
            </div>}

        <div className="navbar-user">
            {
                accessBoth?(
                    <>
                            <NavLink
                            to="/profile"
                            >
                            <UserCircle size = {22}/>
                            </NavLink>
                            <span>
                                {vendor?.name || vendor?.businessName || manager.name ||'Vendor'}
                            </span>
                    </>

                ):(
                    <button className="button primary"><NavLink to="/login">Login</NavLink></button>
                )
            }
        </div>

        
        {
            accessBoth? (
                <button className="ghost-button" onClick={isAuthenticated ? logout :Managerlogout}>
                        <LogOut size = {17}/>
                        <span className='md:visible hidden'>Logout</span>
                    </button>
            ):(
                !managerLogin &&  <button className="button primary"><NavLink to="/register">Register</NavLink></button>

            )
        }
    </div>
  )
}

export default Navbar