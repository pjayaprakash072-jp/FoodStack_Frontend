import { useEffect, useState } from "react"
import { useNavigate,useParams } from "react-router-dom";
// import {useAuth} from "../../context/useAuth"
import outletService from "../../services/outletService";
import { getErrorMessage } from "../../utils/api";
import Loader from "../../components/Common/Loader"
import{toast} from 'sonner'
import useLocation from "../../context/useLocation";
import LocationPicker from './../../components/LocationPicker/LocationPicker';

const initialLocation = {
    latitude:null,
    longitude:null,
    addressLine1:"",
    addressLine2:"",
    city:"",
    state:"",
    pincode:""
}

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
    image:null

}
const CreateOutlet = () => {
    const {id} = useParams();
    const {useCurrentLocation} = useLocation();
    
    const [showMap,setShowMap] = useState(false);

    const [showForm,setShowForm] = useState(true);

    const [showLocationForm, setShowLocationForm] = useState(false);

    const [form,setForm] = useState(intial);

    const [locationForm,setLocationForm] = useState(initialLocation)


    const [error,setError] = useState("");

    const [busy,setBusy] = useState(false);

    const [loading,setLoading] = useState(Boolean(id));

    const [locationLoading,setLocationLoading] = useState(false);

    const nav = useNavigate();

    // const {vendor} = useAuth();

    const change =(e)=>{
        const{name,value,type,checked, files} = e.target;
        setForm({
            ...form,
            [name]:type === "checkbox"? checked: type === "file" ? files[0]:value 
        }
        )
    }
    const locationChange = (e)=>{
        const {name,value}= e.target;
        setLocationForm(
            (prev)=>(
                {
                    ...prev,[name]:value
                }
            )
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

    const getAddressFromCorodinates = async(latitude,longitude)=>{
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        if(!response.ok){
            throw new Error("Unable to find addres for this location")
        }
        const data = await response.json();
        return data;
    }
    const applyLocation = async({latitude,longitude})=>{
        try {
            setError("");
            setLocationLoading(true);
            setLocationForm(
                (prev)=>(
                    {
                        ...prev,latitude,longitude
                    }
                )
            )
            const data = await getAddressFromCorodinates(latitude,longitude);
            const address = data.address || {};
            setLocationForm(
                (prev)=>(
                    {
                        ...prev,latitude,longitude,
                        addressLine1:[address.house_number,address.road].filter(Boolean).join(","),
                        addressLine2:[address.suburb, address.neighbourhood, address.residential].filter(Boolean).join(", "),
                        city:address.city || address.town|| address.municipality || "",
                        state:address.state ||"",
                        pincode:address.postcode || "",
                    }
                )
            )
        } catch (error) {
            console.log(error);
            setError("Location selected, but address details could not be loaded. you can enter the address manually.")
        }finally{
            setLocationLoading(false);
        }
    }

    const handleUseCurrentLocation = async()=>{
        try {
            setError("");
            const currentLocation = await useCurrentLocation();
            await applyLocation(currentLocation);
        } catch (error) {
            console.log(error);
            setError("Unble to get current location, Please allow location access.")
        }
    }
    const handleMapLocation = async(location)=>{
        await applyLocation(location);
    }

    const submit = (e)=>{
        e.preventDefault();
        setShowForm(false);
        setShowLocationForm(true);
    }
    const sendData = async (e)=>{
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            // const payload ={
            //         ...form,
            //         cuisine:form.cuisine.split(",").map((x)=>x.trim()).filter(Boolean)
            //     } // this is way of sending json data.
            // for images we have to send in formData.
            const address = [locationForm.latitude, locationForm.longitude,locationForm.addressLine1,locationForm.addressLine2].filter(Boolean).join(", ")
            const area = [locationForm.pincode].filter(Boolean).join("");
            const city = [locationForm.city, locationForm.state].filter(Boolean).join("");
            const payload = new FormData();
            payload.append("name", form.name);
            payload.append("description",form.description)
            payload.append("phone",form.phone)
            payload.append("address",address)
            payload.append("city", city)
            payload.append("area", area)
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
            const toastMsg = id? "Outlet Updated successfully!" : "Outlet Created successfully!"
            toast.success(toastMsg)
            nav("/outlets")

        } catch (err) {
            const message= getErrorMessage(err);
            setError(message);
            toast.error(message)
        }finally{
            setBusy(false)
        }
    }
    
    if(loading) return <Loader/>
  return (
    <>
        <div className="page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Outlet</p>
                    <h1>Create Outlet</h1>
                    <p>Enter the details used by your outlet and menu.</p>
                </div>
                {/* <button className="button primary" onClick={()=>setShowForm(!showForm)}>showform</button> */}
                {/* <button className="button primary" onClick={()=>setShowLocationForm(!showLocationForm)}>Select on map</button> */}
            </div>
        { error && <div className="alert error">{error}</div>}
        { showForm &&
            (
                <FormPage
                id = {id}
                form = {form}
                busy = {busy}
                error = {error}
                submit={submit}
                change={change}
                />
            )
        }
        <LocationPage 
        locationForm = {locationForm}
        locationChange={locationChange}
        showMap={showMap}
        setShowMap={setShowMap}
        handleMapLocation={handleMapLocation}
        handleUseCurrentLocation={handleUseCurrentLocation}
        locationLoading={locationLoading}
        showLocationForm={showLocationForm}
        sendData={sendData}
        />
    </div>
    </>
  )
}

export default CreateOutlet

export function FormPage({form,change,submit,busy,id}){
    return(       
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
                    capture="environment"
                    onChange={change}
                    />
                </label>
                <div className="grid-span-2 form-actions">
                    <button type="button" className="button secondary" onClick={()=>history.back()}>Cancel</button>
                    <button className="button secondary" type="submit"  disabled={busy}>{busy?"Saving...": id ? "Update Outlet":"Create Outlet"}</button>
                </div>
            </form>
    )
}

export function LocationPage({locationForm,locationChange,showMap,setShowMap,handleMapLocation,handleUseCurrentLocation,locationLoading,showLocationForm,sendData}){
    return (
        <>
            <h1>Location</h1>
            {showLocationForm &&
                (
                    <>
                    <form className="panel form grid-2" onSubmit={sendData}>
                            <label>
                                AddressLine1
                                <input type="text" 
                                name="addressLine1"
                                required
                                value={locationForm.addressLine1}
                                onChange={locationChange}
                                placeholder="House no, street, area"
                                />
                            </label>
                            <label>
                                AddressLine 2
                                <input type="text" 
                                name="addressLine2"
                                required
                                value={locationForm.addressLine2}
                                onChange={locationChange}
                                placeholder="Apartment, landmark, etc."
                                />
                            </label>
                            <label>
                                City
                                <input type="text" 
                                name="city"
                                required
                                value={locationForm.city}
                                onChange={locationChange}
                                placeholder="Enter City"
                                />
                            </label>
                            <label>
                                State
                                <input type="text" 
                                name="state"
                                required
                                value={locationForm.state}
                                onChange={locationChange}
                                placeholder="Enter State"
                                />
                            </label>
                            <label>
                                Pincode 
                                <input type="text" 
                                name="pincode"
                                required
                                value={locationForm.pincode}
                                onChange={locationChange}
                                placeholder="Enter Pincode."
                                />
                            </label>
                            <div className="grid-span-2 form-actions">
                                <button className="button primary" type="button" disabled={locationLoading} onClick={handleUseCurrentLocation}>Use Current Location</button>
                                <button className="button primary" type="button" disabled={locationLoading} onClick={()=>setShowMap(!showMap)}>Select on map</button>
                                <button className="button secondary" type="submit">Create Outlet</button>
                                <button className="button secondary" type="button"  onClick={()=>history.back()}>Cancel</button>
                            </div>
                    </form>
                    {
                        showMap && (
                            <LocationPicker
                            initialLocation={
                                locationForm.latitude !== null && locationForm.longitude !== null ?  {latitude:locationForm.latitude,longitude:locationForm.longitude}:null
                            }
                            onSelect={handleMapLocation}
                            onClose ={()=>setShowMap(false)}
                            />
                        )
                    }
                </>
                )
            }
        </>
    )
}