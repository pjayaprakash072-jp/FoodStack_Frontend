import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext"
import outletService from "../../services/outletService";
import { getErrorMessage } from "../../utils/api";

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
    image:{
        url:"",
        public_id:""
    }

}
const CreateOutlet = () => {

    const [form,setForm] = useState(intial);

    const [error,setError] = useState("");

    const [busy,setBusy] = useState(false);

    const nav = useNavigate();

    const {vendor} = useAuth();

    const change =(e)=>{
        const{name,value,type,checked } = e.target;
        setForm({
            ...form,
            [name]:type === "checkbox"? checked:value
        }
        )
    }

    const submit = async (e)=>{
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            await outletService.create(
                {
                    ...form,
                    cuisine:form.cuisine.split(",").map((x)=>x.trim()).filter(Boolean)
                }
            )
            nav("/outlets")
        } catch (error) {
            setError(getErrorMessage(error));
        }finally{
            setBusy(false)
        }
    }
  return (
    <FormPage
    title = "Create Outlet"
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

export function FormPage({title,form,change,submit,busy,error}){
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
                <div 
                
                className="grid-span-2 
                form-actions">
                    <button type="button" className="button secondary" onClick={()=>history.back()}>
                        Cancel
                    </button>
                    <button className="button secondary" disabled={busy}>{busy?"Saving...":"Create Outlet"}</button>
                </div>
            </form>
        </div>
    )
}