import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import {Link} from 'react-router-dom'
import {Plus} from 'lucide-react'
import SearchBar from "../../components/Common/SearchBar"
import Loader from "../../components/Common/Loader";
import OutletCard from "../../components/Cards/OutletCard";
import EmptyState from './../../components/Common/EmptyState';
import outletService from "../../services/outletService";


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
                    const response = vendor?._id || vendor?.id ? await outletService.byVendor(vendor?._id || vendor?.id) : await outletService.getAll();
                    setOutlets(arr(response))
                }finally{
                    setBusy(false);
                }
            })();
        },[vendor]
    )
  return (
    <>
        <div className="page-heading">
            <div>
                <p className="eyebrow">Locations</p>
                <h1>Outlets</h1>
                <p>Create and manage every business location.</p>
            </div>
            <Link className="button primary" to="/outlets/new"><Plus size={18}/>Add Outlet</Link>
        </div>    
        <div className="toolbar">
            <SearchBar 
            value = {q}
            onChange={setQ}
            placeholder="search outlets..."
            />
        </div>
        {
            busy?(
                <Loader/>
            ):filtered.length?(
                <div className="card-grid">
                    {
                    filtered.map((o)=>(
                        <OutletCard key={o._id} outlet={o}/>
                    ))
                    }
                </div>
            ):(
                <EmptyState
                title = "No outlets found"
                text = {q ?"Try a different search" : "Create your first outlet"} action = {<Link className="button primary" to = "/outlets/new" > Add Outlet</Link>}/>
            )
        }
    </>
  )
}

export default OutletList