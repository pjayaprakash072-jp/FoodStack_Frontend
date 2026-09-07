
import {NavLink} from 'react-router-dom'
import { LayoutDashboard,Store,Tags,Utensils,User,X } from "lucide-react"
import {useAuth} from '../../context/useAuth'
import {LogOut} from 'lucide-react'
const links = [
  {to:"/dashboard" , label: "Dashboard" , icon:LayoutDashboard},
  {to:"/outlets" , label: "Outlets" , icon:Store},
  {to:"/categories" , label: "Categories" , icon:Tags},
  {to:"/menu-items" , label: "Menu Items" , icon:Utensils},
  {to:"/profile" , label: "Profile" , icon:User},
]
const Sidebar = ({open , onClose}) => {
  const {logout} = useAuth();
  return (
    <>
          <div className={`sidebar-overlay ${open? "visible":"invisible"}`} onClick={onClose}/>
          <div className={`sidebar ${open ? "translate-x-0":"-translate-x-full"}`}>
            <NavLink
            to ="/dashboard"
            >
            <div className="brand" style={{cursor:"pointer"}}>
              <img src='/FS1.svg' width="30" height="30"/>
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
                <button  onClick={logout}><LogOut size = {17}/>Logout</button>
          </div>
        </>
  )
}

export default Sidebar