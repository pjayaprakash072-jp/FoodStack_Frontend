import { useState,useEffect } from "react"
import {Link , useNavigate, useParams} from 'react-router-dom'
import outletService from "../../services/outletService"
import menuItemService from "../../services/menuItemService"
import categoryService from "../../services/categoryService"

import Loader from "../../components/Common/Loader"
import ConfirmDialog from './../../components/Common/ConfirmDialog';
import { Pencil,Trash2 } from "lucide-react"

import { getErrorMessage } from "../../utils/api"



const OutletDetails = () => {
    
    const {id} = useParams();
    console.log(id);
    
    const [error,setError] = useState("");
    
    const [outlet,setOutlet] = useState(null);

    const [busy , setBusy] = useState(true);

    const [items,setItems] = useState([]);

    const [cats ,setCats] = useState([]);

    const [del,setDel] = useState(false);

    const nav  = useNavigate();
    
    useEffect(
        ()=>{
            (async ()=>{
                try{
                    const [a,b,c]  = await Promise.all([
                        outletService.getOne(id),
                        categoryService.byOutlet(id),
                        menuItemService.byOutlet(id),
                    ])

                    setOutlet(a.outlet);

                    setCats(Array.isArray(b)? b : b?.menuCategories || []);

                    setItems(Array.isArray(c)? c: c?.menuItems || [] )
                }catch(error){
                    setError(getErrorMessage(error))
                }
                finally{
                    setBusy(false)
                }
            }
        )();
        },[id]
    )

    const remove = async()=>{
        try{
            await outletService.remove(id);
            nav("/outlets")
        }catch(err){
            setError(getErrorMessage(err))
        }finally{
            setDel(false)
        }
    }

    if(busy) return <Loader/>


    if(!outlet){
        return (
            <div className="alert error">
                {error || "Outler not found"}
            </div>
        )
    }
  return (
    <>
    <div className="page-heading">
        <div>
            <p className="eyebrow">Outler details</p>
            <h1>{outlet.name}</h1>
            <p>{outlet.area} , {outlet.city}</p>
        </div>
        <div className="button-row">
            <Link className="button secondary" to = {`/outlets/${id}/edit`}><Pencil size = {17}/>Edit</Link>
            <button className="button danger" onClick={()=>setDel(true)}><Trash2 size = {17}/> Delete</button>
        </div>
    </div>
    {error && <div className="alert error">{error}</div>}

    <div className="details-grid">
        <div className="panel">
            <h3>Information</h3>
            <Detail 
            label = "Description"
            value = {outlet.description || "-"} 
            />
            <Detail 
            label = "Phone"
            value = {outlet.phone} 
            />
            <Detail 
            label = "Address"
            value = {outlet.address} 
            />
            <Detail 
            label = "Cuisine"
            value = {(outlet.cuisine || []).join(", ") || "-"} 
            />
            <Detail 
            label = "Food Type"
            value = {outlet.foodType} 
            />
            <Detail 
            label = "Hours"
            value = {`${outlet.openingTime} - ${outlet.closingTime}`} 
            />
            <Detail 
            label = "Status"
            value = {outlet.status} 
            />
        </div>

        <div className="panel">
            <h2>Menu Summary</h2>
            <div className="big-number">
                {cats.length}
            </div>
            <p>Categoirs</p>
            <div className="big-number">
                {items.length}
            </div>
            <p>Menu Items</p>

            <Link className="button primary" to={`/categories?outlet=${id}`}>Manage categories</Link>
        </div>
    </div>

    <ConfirmDialog 
    open = {del}
    onCancel={()=>setDel(false)}
    onConfirm={remove}
/>
    </>
  )
}

export default OutletDetails
const Detail = ({label , value})=>{
    return (
        <div className="detail">
            <span>{label}</span>
            <b>{value}</b>
        </div>
    )
}
