import { useState } from "react"

import {useAuth} from "../../context/AuthContext"


import { getErrorMessage } from "../../utils/api";
import vendorService from './../../services/vendorService';


export default function Profile(){
    const {vendor ,setVendor} = useAuth();

    const [form,setForm] = useState(
        {
            name: vendor?.name || "",
            email: vendor?.email || "",
            phone: vendor?.phone || "",
            businessName: vendor?.businessName || "",
            status:vendor?.status || "active",
        }
    )

    const [error,setError]= useState("");

    const [msg,setMsg] = useState("");

    const [busy,setBusy] = useState(false);

    const submit = async(e)=>{
        e.preventDefault();

        setBusy(true);

        try{

            const response = await vendorService.update(vendor._id || vendor.id , form);
            setVendor(response.vendor);

            setMsg("profile updateded Successfully!");

            
        }catch(err){
            setError(getErrorMessage(err))
        }finally{
            setBusy(false);
        }

    }
    return(
        <>
            <div className="page-heading">
                <div>
                    <p className="eyebrow"> Account</p>
                    <h1>Profile</h1>
                    <p>Update your vendor details</p>
                </div>
            </div>

            {
                msg && <div className="alert success">{msg}</div>
            }
            {
                error && <div className="alert error">{error}</div>
            }
            <form className="panel form grid-2" onSubmit={submit}>
                <label> Name
                    <input type="text" required value={form.name} onChange={(e)=> setForm({...form,name:e.target.value})}/>
                </label>
                <label> Email
                    <input type="email" value={form.email} disabled />
                </label>
                <label> Phone
                    <input type="tel" required  value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})}/>
                </label>
                <label> businessName
                    <input type="text"  value={form.businessName} onChange={(e)=>setForm({...form,businessName:e.target.value})} />
                </label>
                <label> status
                    <select value={form.status} onChange={(e)=>setForm({...form ,status:e.target.value})}>
                        <option>active</option>
                        <option>inactive</option>
                        <option>suspended</option>
                    </select>
                </label>
                <div className="grid-span-2 form-actions">
                    <button className="button primary" disabled = {busy}>{busy? "Updating...":"Save Changes"}</button>
                </div>
            </form>
        </>
    )
}