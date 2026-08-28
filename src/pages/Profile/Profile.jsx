import { useState } from "react"

import {useAuth} from "../../context/useAuth"

import {useNavigate} from 'react-router-dom'
import { getErrorMessage } from "../../utils/api";
import vendorService from './../../services/vendorService';
import { Trash2 } from "lucide-react";
import ConfirmDialog from "../../components/Common/ConfirmDialog";


export default function Profile(){
    const {vendor ,setVendor} = useAuth();
    const nav = useNavigate();

    const [form,setForm] = useState(
        {
            name: vendor?.name || "",
            email: vendor?.email || "",
            phone: vendor?.phone || "",
            businessName: vendor?.businessName || "",
            status:vendor?.status || "active",
            profileImg: null
        }
    )

    const [error,setError]= useState("");

    const [msg,setMsg] = useState("");

    const [busy,setBusy] = useState(false);
    const [del, setDel] = useState(false);

    const change = (e)=>{
        const{type,value,name,files} = e.target;
        setForm(
            {
                ...form,
                [name]: type === 'file' ? files[0] : value
            }
        )
    }

    const remove = async()=>{
        try {
            await vendorService.remove(vendor._id);
            nav("/login");
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setDel(false)
        }
    }

    const submit = async(e)=>{
        e.preventDefault();

        setBusy(true);

        try{
            const formData = new FormData();

            Object.entries(form).forEach(([key,value])=>{
                if(value != null && value != undefined){
                    formData.append(key,value)
                }
            })

            const response = await vendorService.update(vendor._id || vendor.id , formData);
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
                    <div className="outlet-image">
                        <img src = {vendor?.profileImg?.url} alt ="vendor img"/>
                    </div>
                    <p>Update your vendor details</p>
                </div>
                <div className="button-row">
                    <button className="button danger" onClick={()=>setDel(true)}><Trash2 size={18}/>Delete</button>
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
                    <input 
                    type="text" 
                    required 
                    name="name"
                    value={form.name} 
                    onChange={change}/>
                </label>
                <label> Email
                    <input 
                    type="email" 
                    name="email"
                    value={form.email} 
                    disabled />
                </label>
                <label> Phone
                    <input 
                    type="tel" 
                    required  
                    name="phone"
                    value={form.phone} 
                    onChange={change}/>
                </label>
                <label> businessName
                    <input 
                    type="text"  
                    name="businessName"
                    value={form.businessName} 
                    onChange={change} />
                </label>
                <label> status
                    <select 
                    name="status" 
                    value={form.status} 
                    onChange={change}
                    >
                        <option>active</option>
                        <option>inactive</option>
                        <option>suspended</option>
                    </select>
                </label>
                <label className="grid-span-2">
                    Profile Image 
                    <input 
                    type="file" 
                    name="profileImg" 
                    accept="image/*"
                    onChange={change}
                    />
                </label>
                <div className="grid-span-2 form-actions">
                    <button className="button primary" disabled = {busy}>{busy? "Updating...":"Save Changes"}</button>
                </div>
            </form>
            <ConfirmDialog
            open={del}
            setOpen = {setDel}
            onCancel={()=>setDel(false)}
            onConfirm={remove}
            title="Delete Vendor"
            message="Are you sure you want to delte Account"
            />
        </>
    )
}