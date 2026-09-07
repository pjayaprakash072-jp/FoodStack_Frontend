import { useState } from "react"

import Sidebar from "../SideBar/Sidebar"
import Navbar from "../NavBar/Navbar"
const DashboardLayout = ({children}) => {
    const [open,setOpen] = useState(false);
  return (
    <div>
        <Navbar onMenu={()=>setOpen(true)}/>
        <Sidebar open = {open} onClose={()=> setOpen(false)}/>
        <main className="content">{children}</main>
    </div>
  )
}

export default DashboardLayout