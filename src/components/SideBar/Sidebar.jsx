
import {NavLink} from 'react-router-dom'
import { LayoutDashboard,Store,Tags,Utensils,User,X } from "lucide-react"
const links = [
  {to:"/dashboard" , label: "Dashboard" , icon:LayoutDashboard},
  {to:"/outlets" , label: "Outlets" , icon:Store},
  {to:"/categories" , label: "Categories" , icon:Tags},
  {to:"/menu-items" , label: "Menu Items" , icon:Utensils},
  {to:"/profile" , label: "Profile" , icon:User},
]
const Sidebar = ({open , onClose}) => {
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">VM</div>
        <div>
          <b>Vendor</b>
          <small>Management</small>
        </div>
        <button className="icon-button mobile-only" onClick={onClose}>
          <X/>
        </button>
      </div>
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
    </aside>
  )
}

export default Sidebar