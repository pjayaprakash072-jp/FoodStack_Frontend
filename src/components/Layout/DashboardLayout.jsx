import { useState } from "react"

import Sidebar from "../SideBar/Sidebar"
import Navbar from "../NavBar/Navbar"
const DashboardLayout = ({children}) => {
    const [open,setOpen] = useState(false);
  return (
    <div className="app-shell">
        <Sidebar open = {open} onClose={()=> setOpen(false)} />
            {
                open &&  (<div className="sidebar-overlay" onClick={()=>setOpen(false)}/>)
            }
            <div className="main-shell">
                <Navbar onMenu={()=>setOpen(true)}/>
                <main className="content">{children}</main>
            </div>
    </div>
  )
}

export default DashboardLayout