import { useEffect, useState } from "react"
import { useNavigate,useParams } from "react-router-dom";
import {useAuth} from "../../context/AuthContext"
import outletService from "../../services/outletService";
import { getErrorMessage } from "../../utils/api";
import Loader from "../../components/Common/Loader"

const intial = {
    name:"",
    description:"",
    phone:"",
    address:"",
    city:"",
    area:"",
    cuisine:"",
    foodType:"both",
    openingTime:"09:00",
    closingTime:"06:00",
    isOpen:true,
    status:"active",
    // image:{
    //     url:"",
    //     public_id:""
    // }
    image:null
    // uplading the image.

}
const CreateOutlet = () => {
    const {id} = useParams();

    const [form,setForm] = useState(intial);

    const [error,setError] = useState("");

    const [busy,setBusy] = useState(false);

    const [loading,setLoading] = useState(Boolean(id));

    const nav = useNavigate();

    const {vendor} = useAuth();

    const change =(e)=>{
        const{name,value,type,checked, files} = e.target;
        setForm({
            ...form,
            [name]:type === "checkbox"? checked: type === "file" ? files[0]:value 
        }
        )
    }

    useEffect(
        ()=>{
            (async ()=>{
                try{
                    if(id){
                        const o = await outletService.getOne(id);
                        setForm({...form,...o.outlet,cuisine:o.outlet.cuisine.join(","),image: null})
                    }
                }catch(error){
                    setError(getErrorMessage(error))
                }finally{
                    setLoading(false)
                }
            })();
        },[id]
    )

    const submit = async (e)=>{
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            // const payload ={
            //         ...form,
            //         cuisine:form.cuisine.split(",").map((x)=>x.trim()).filter(Boolean)
            //     } // this is way of sending json data.
            // for images we have to send in formData.
            const payload = new FormData();
            payload.append("name", form.name);
            payload.append("description",form.description)
            payload.append("phone",form.phone)
            payload.append("address",form.address)
            payload.append("city", form.city)
            payload.append("area", form.area)
            payload.append("foodType" , form.foodType)
            payload.append("openingTime",form.openingTime)
            payload.append("closingTime",form.closingTime)
            payload.append("isOpen",form.isOpen)
            payload.append("status", form.status)
            const cuisines = form.cuisine.split(",").map((x)=>x.trim()).filter(Boolean)
            cuisines.forEach((x)=>{
                payload.append("cuisine",x);
            })
            if(form.image){
                payload.append("image",form.image);
            }
            if(id){
                await outletService.update(id,payload)
            }else {

                await outletService.create(payload)
            }
            nav("/outlets")
        } catch (error) {
            setError(getErrorMessage(error));
        }finally{
            setBusy(false)
        }
    }
    
    if(loading) return <Loader/>
  return (
    <FormPage
    title = "Create Outlet"
    id = {id}
    form = {form}
    setForm={setForm}
    busy = {busy}
    error = {error}
    vendor = {vendor}
    submit={submit}
    change={change}
    />
  )
}

export default CreateOutlet

export function FormPage({title,form,change,submit,busy,error,id}){
    return(
        <div className="form-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Outlet</p>
                    <h1>{title}</h1>
                    <p>Enter the details used by your outlet and menu.</p>
                </div>
            </div>
        { error && <div className="alert error">{error}</div>}
            <form className="panel form grid-2" onSubmit={submit}>
                <label>
                    Outlet Name 
                    <input type="text" 
                    name="name"
                    required
                    value={form.name}
                    onChange={change}
                    />
                </label>
                <label>
                    Phone
                    <input type="tel" 
                    required
                    name="phone"
                    value={form.phone}
                    onChange={change}
                    />
                </label>
                <label className="grid-span-2">
                    Description
                    <input type="text" 
                    name="description"
                    value={form.description}
                    onChange={change}
                    />
                </label>
                <label className="grid-span-2">
                    Address
                    <input
                    name="address"
                    required
                    value={form.address}
                    onChange={change}
                    />
                </label>
                <label>
                    City
                    <input
                    name="city"
                    required
                    value={form.city}
                    onChange={change}
                    />
                </label>
                <label>
                    Area
                    <input
                    name="area"
                    required
                    value={form.area}
                    onChange={change}
                    />
                </label>
                <label>
                    Cuisine <span className="hint">(comma seperated)</span>
                    <input
                    name="cuisine"
                    value={form.cuisine}
                    onChange={change}
                    />
                </label>
                <label>
                    Food Type
                    <select 
                    name="foodType"
                    value={form.foodType}
                    onChange={change}
                    
                    >
                        <option value="veg">veg</option>
                        <option value="non-veg">non-veg</option>
                        <option value="both">both</option>

                    </select>
                </label>
                <label>
                    Opening Time 
                    <input 
                    type="time"
                    required
                    name="openingTime"
                    value={form.openingTime}
                    onChange={change}
                    />
                </label>
                <label>
                    Closing Time
                    <input
                    type="time"
                    required
                    name="closingTime"
                    value={form.closingTime}
                    onChange={change}
                    />
                </label>
                <label>
                    Status
                    <select 
                    name="status"
                    value={form.status}
                    onChange={change}
                    
                    >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                    </select>
                </label>
                <label className="check">
                    <input type="checkbox"
                    name="isOpen"
                    checked={form.isOpen}
                    onChange={change}
                    />{" "} Currently open
                </label>
                <label className="grid-span-2">
                    Outlet image
                    <input 
                    type="file"
                    name = "image"
                    accept="image/*"
                    onChange={change}
                    />
                </label>
                <div 
                
                className="grid-span-2 
                form-actions">
                    <button type="button" className="button secondary" onClick={()=>history.back()}>
                        Cancel
                    </button>
                    <button className="button secondary" disabled={busy}>{busy?"Saving...": id ? "Update Outlet":"Create Outlet"}</button>
                </div>
            </form>
        </div>
    )
}