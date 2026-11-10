import { useState } from "react"

import Sidebar from "../SideBar/Sidebar"
import Navbar from "../NavBar/Navbar"
const DashboardLayout = ({children}) => {
    const [open,setOpen] = useState(false);
  return (
    <div className="app-layout">
        <Navbar onMenu={()=>setOpen(true)}/>
        <Sidebar open = {open} onClose={()=> setOpen(false)}/>
        <main className="app-main">{children}</main>
    </div>
  )
}

export default DashboardLayout