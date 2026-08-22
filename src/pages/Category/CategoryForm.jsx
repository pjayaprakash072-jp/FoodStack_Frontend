

import { useEffect, useState } from "react"


import { useNavigate,useParams , useSearchParams } from 'react-router-dom';


import categoryService from './../../services/categoryService';

import Loader from "../../components/Common/Loader"

import {useAuth} from "../../context/AuthContext"
import outletService from './../../services/outletService';
import { getErrorMessage } from "../../utils/api";

const CategoryForm = () => {

    const {id} = useParams();

    const [params] = useSearchParams();

    const nav = useNavigate();

    const {vendor} = useAuth();

    const [form,setForm] = useState({
        name:"",
        description:"",
        displayOrder:0,
        isActive: true,
        image:{url:"",public_id:""},
        outlet:"",
    })

    const [outlets,setOutlets] = useState([]);

    const [busy,setBusy] = useState(false)

    const [loading ,setLoading] = useState(Boolean(id));

    const [error, setError] = useState("");

    useEffect(
        ()=>{
            (async ()=>{
                try {
                    
                    const o = await outletService.byVendor(vendor?.id || vendor?._id);
                    setOutlets( Array.isArray(o)? o : o?.items || o?.outlets || [])
                    if(id){
                        const c = await categoryService.getOne(id);
                        setForm ({...form , ...c.menuCategory, outlet:c.menuCategory.outlet?._id || c.menuCategory.outlet || ""})
                    }else if(params.get("outlet")) setForm((f)=>({...f,outlet:params.get("outlet")}))
                } catch (error) {
                    setError(getErrorMessage(error))
                }
                finally{
                    setLoading(false)
                }
            })();
        },[id]
    )

    const submit =async(e)=>{
        e.preventDefault();
        setBusy(true);
        try{
            const {outlet,...payload} = form;
            if(id){
                await categoryService.update(id,payload);
            }else await categoryService.create(outlet,payload);
            nav("/categories")
        }catch(err){
            setError(getErrorMessage(err))
        }finally{
            setBusy(false);
        }
    }
    if(loading) return <Loader/>; 
  return (
    <div className="form-page">
        <div className="page-heading">
            <div>
                <p className="eyebrow">Category</p>
                <h1>{id?"Edit category" : "Create Category"}</h1>
            </div>
        </div>
        {error && <div className="alert error" >{error}</div>}
        <form className="panel form grid-2" onSubmit={submit}>
            <label>
                Name
                <input 
                required
                value={form.name}
                onChange={(e)=>{ setForm({...form,name:e.target.value})}}
                />
            </label>
            <label>
                Outlet
                <select
                required
                value={form.outlet}
                disabled = {Boolean(id)}
                onChange={(e)=>{ setForm({...form,outlet:e.target.value})}}
                >
            <option value="">Select outet</option>
            {
                outlets.map((o)=>(
                    <option key={o._id} value={o._id}>{o.name}</option>
                ))
            }
            </select>
            </label>
            <label className="grid-span-2">
                Description
                <textarea
                
                value={form.description}
                onChange={(e)=>{ setForm({...form,description:e.target.value})}}
                />
            </label>
            <label>
                Display Order 
                <input 
                type="number"
                required
                value={form.displayOrder}
                onChange={(e)=>{ setForm({...form,displayOrder:Number(e.target.value)})}}
                />
            </label>
            <label className="check">
                
                <input 
                type="checkbox"

                checked={form.isActive}
                onChange={(e)=>{ setForm({...form,isActive:e.target.checked})}}
                />{" "} Active
            </label>
            <div className="grid-span-2 form-actions">
                <button className="button secondary" type="button" onClick={()=>nav("/categories")}> Cancel</button>
                <button className="button primary" disabled={busy}>{ busy? "Saving..." : id? "Update category":"create Category"}</button>
            </div>
        </form>
    </div>
  )
}

export default CategoryForm