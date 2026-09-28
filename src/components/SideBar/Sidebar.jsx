
import {NavLink} from 'react-router-dom'
import { LayoutDashboard,Store,Tags,Utensils,User,X ,ListOrdered} from "lucide-react"
import {useAuth} from '../../context/useAuth'
import {LogOut} from 'lucide-react'
import useManagerContext from './../../context/useManagerContext';
const vendorLinks = [
  {to:"/dashboard" , label: "Dashboard" , icon:LayoutDashboard},
  {to:"/outlets" , label: "Outlets" , icon:Store},
  {to:"/categories" , label: "Categories" , icon:Tags},
  {to:"/menu-items" , label: "Menu Items" , icon:Utensils},
  {to:"/orders",label:"Orders",icon:ListOrdered},
  {to:"/profile" , label: "Profile" , icon:User},
]
const Sidebar = ({open , onClose}) => {
  const {manager} = useManagerContext();
  const {isAuthenticated} = useAuth();
  const ManagerLinks = [
    {to:`/outlets/${manager?.outlet?._id}` , label: "Dashboard" , icon:LayoutDashboard},
    {to:`/categories?outlet=${manager?.outlet?._id}`, label: "Categories" , icon:Tags},
    {to:`/menu-items?outlet=${manager?.outlet?._id}` , label: "Menu Items" , icon:Utensils},
    {to:"/orders",label:"Orders",icon:ListOrdered},
  ]
  const links = isAuthenticated ? vendorLinks : ManagerLinks;
  const {logout} = useAuth();
  return (
    <>
          <div className={`sidebar-overlay ${open? "visible":"invisible"}`} onClick={onClose}/>
          <div className={`sidebar ${open ? "translate-x-0":"-translate-x-full"}`}>
            <NavLink
            to ="/dashboard"
            >
            <div className="brand" style={{cursor:"pointer"}}>
              <img src='/FS1.png' width="30" height="30"/>
              <div>
                <b>Vendor</b>
                <small>Management</small>
              </div>
              <button onClick={onClose}>
                <X/>
              </button>
            </div>
            </NavLink>
            <nav>
              {
                links.map(
                  ({to,label,icon:Icon})=>(
                    <NavLink 
                      key= {to}
                      to = {to}
                      className = {({isActive})=> isActive ? "nav-link active":"nav-link"}
                      onClick = {onClose}
                      >
                        <Icon size={19}/>
                        <span>{label}</span>
                      </NavLink>
                )
              )
              }
            </nav>
                <button className='button logout'  onClick={logout}><LogOut size = {17}/>Logout</button>
          </div>
        </>
  )
}

export default Sidebar