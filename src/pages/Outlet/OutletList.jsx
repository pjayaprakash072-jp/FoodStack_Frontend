import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth"
import {Link} from 'react-router-dom'
import {Plus} from 'lucide-react'
import SearchBar from "../../components/Common/SearchBar"
import OutletCard from "../../components/Cards/OutletCard";
import EmptyState from './../../components/Common/EmptyState';
import outletService from "../../services/outletService";
import OutletSkeleton from "../../components/Skeletons/OutletSkeleton";


const arr = (x)=> Array.isArray(x)? x:x?.outlets || [];

const OutletList = () => {

    const {vendor} = useAuth();

    const [outlets,setOutlets] = useState([]);

    const [busy,setBusy] = useState(true);

    const [q,setQ] = useState("");

    const filtered = outlets.filter ((x)=> `${x.name} ${x.city} ${x.area}`.toLowerCase().includes(q.toLowerCase()),)


    useEffect(
        ()=>{
            (async ()=>{
                try{
                    const response = await outletService.byVendor(vendor?._id);
                    setOutlets(arr(response))
                }finally{
                    setBusy(false);
                }
            })();
        },[vendor]
    )
    
  return (
    <div className="page-container">
        <header className="content-header">
            <div>
                <p className="content-eyebrow">Locations</p>
                <h1 className="content-title">Outlets</h1>
                <p className="content-description">Create and manage every business location.</p>
            </div>
            <Link className="page-action" to="/outlets/new"><Plus size={18}/>Add Outlet</Link>
        </header>   
        <div className="content-body">
            <div className="outlet-toolbar">
                <SearchBar 
                value = {q}
                onChange={setQ}
                placeholder="Search Outlets by name,city or area..."
                />
                <p className="outlet-count">
                    {filtered.length} {filtered.length === 1? "Outlet":"Outlets"}
                </p>
            </div>
            {
                busy?(
                    <div className="outlet-grid">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <OutletSkeleton key={index} />
                        ))}
                    </div>
                ):filtered.length?(
                    <div className="outlet-grid">
                        {
                        filtered.map((o)=>(
                            <OutletCard key={o._id} outlet={o}/>
                        ))
                        }
                    </div>
                ):(
                    <EmptyState
                    title = "No outlets found"
                    text = {q ?"Try a different search" : "Create your first outlet"} 
                    action = {<Link className="page-action" to = "/outlets/new" > Add Outlet</Link>}/>
                )
            }
        </div> 
    </div>
  )
}

export default OutletList