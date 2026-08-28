

import { useEffect, useState } from "react"


import { useNavigate,useParams , useSearchParams } from 'react-router-dom';


import categoryService from './../../services/categoryService';

import Loader from "../../components/Common/Loader"

import {useAuth} from "../../context/AuthContext"
import outletService from './../../services/outletService';
import { getErrorMessage } from "../../utils/api";

const initial = {
    name:"",
    description:"",
    displayOrder:0,
    isActive: true,
    image:null,
    outlet:"",
}

const CategoryForm = () => {

    const {id} = useParams();

    const [params] = useSearchParams();

    const nav = useNavigate();

    const {vendor} = useAuth();

    const [form,setForm] = useState(initial)

    const [outlets,setOutlets] = useState([]);

    const [busy,setBusy] = useState(false)

    const [loading ,setLoading] = useState(Boolean(id));

    const [error, setError] = useState("");

    useEffect(
        ()=>{
            (async ()=>{
                try {
                    
                    const o = await outletService.byVendor(vendor?.id || vendor?._id);// showing outletes global like all.

                    setOutlets( Array.isArray(o)? o : o?.items || o?.outlets || [])

                    if(id){// showing only one outlet of the category. used in editing the caterogy.

                        const c = await categoryService.getOne(id);

                        setForm ({...form , ...c.menuCategory, outlet:c.menuCategory.outlet?._id || c.menuCategory.outlet || "",image:null})
                        
                    }else if(params.get("outlet")) setForm((f)=>({...f,outlet:params.get("outlet")}))// creating category for a particular outlet.
                } catch (error) {
                    setError(getErrorMessage(error))
                }
                finally{
                    setLoading(false)
                }
            })();
        },[id]
    )

    const change =(e)=>{
        const {name, value,checked, type, files} = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : type === "file" ? files[0]:value
        })
    }

    const submit =async(e)=>{
        e.preventDefault();
        setBusy(true);
        try{
            const {outlet,...payload} = form;
            const formData = new FormData();
            Object.entries(payload).forEach(([key,value])=>{
                if(value !== null && value !== undefined){
                formData.append(key,value);
                }
            });
            if(id){
                await categoryService.update(id,formData);
                nav("/categories")
            }else {
                await categoryService.create(outlet,formData);
                if(params.get("outlet")) nav(`/categories?outlet=${params.get("outlet")}`);
                else nav("/categories")

            }
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
                type="text"
                name="name"
                required
                value={form.name}
                onChange={change}
                />
            </label>
            <label>
                Outlet
                <select
                required
                name="outlet"
                value={form.outlet}
                disabled = {Boolean(id) || Boolean(params.get('outlet'))} 
                onChange={change}
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
                <input type="text"
                name="description"
                
                value={form.description}
                onChange={change}
                />
            </label>
            <label>
                Display Order 
                <input 
                type="number"
                name = "displayOrder"
                required
                min={0}
                value={form.displayOrder}
                onChange={change}
                />
            </label>
            <label className="check">
                
                <input 
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={change}
                />{" "} Active
            </label>
            <label className="grid-span-2">
                Category Image
                <input
                type="file"
                name="image"
                accept="image/*"
                onChange={change}
                />
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