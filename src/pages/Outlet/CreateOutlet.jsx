import { useEffect, useState } from "react"
import { useNavigate,useParams } from "react-router-dom";
import outletService from "../../services/outletService";
import { getErrorMessage } from "../../utils/api";
import Loader from "../../components/Common/Loader"
import{toast} from 'sonner'
import useLocation from "../../context/useLocation";
import FormPage from './OutletForm'
import LocationPage from "./LocationPage";
import useManagerContext from './../../context/useManagerContext';
import managerService from "../../services/managerService";
import { useAuth } from './../../context/useAuth';

const intial = {
    outletName:"",
    description:"",
    cuisine:"",
    foodType:"both",
    openingTime:"09:00",
    closingTime:"06:00",
    isOpen:true,
    status:"active",
    image:null
}
const initialLocation = {
    latitude:null,
    longitude:null,
    addressLine1:"",
    addressLine2:"",
    city:"",
    state:"",
    pincode:""
}
const intialManager = {
    name:"",
    email:"",
    password:"",
    phone:""
}

const CreateOutlet = () => {
    const {id} = useParams();
    const {isManagerAuthenticated} = useManagerContext();
    const {isAuthenticated} = useAuth();
    const {useCurrentLocation} = useLocation();
    const nav = useNavigate();
    
    const [form,setForm] = useState(intial);

    const [locationForm,setLocationForm] = useState(initialLocation)

    const [managerForm,setManagerForm] = useState(intialManager);

    const [showManagerForm,setShowManagerForm] = useState(false);

    const [showMap,setShowMap] = useState(false);

    const [showForm,setShowForm] = useState(true);

    const [showLocationForm, setShowLocationForm] = useState(false);

    const [error,setError] = useState("");

    const [busy,setBusy] = useState(false);

    const [loading,setLoading] = useState(Boolean(id));

    const [locationLoading,setLocationLoading] = useState(false);


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
    const managerchange = (e)=>{
        const {name,value} = e.target;
        setManagerForm(
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
                        setForm({...form,...o.outlet,cuisine:o.outlet.cuisine.join(","),image: null,outletName:o.outlet.name})
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
            throw new Error("Unable to find address for this location")
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

    const outletNext = (e)=>{
        e.preventDefault();
        setShowForm(false);
        setShowLocationForm(true);
        setShowManagerForm(false);
    }
    const locationNext = (e)=>{
        e.preventDefault();
        setShowForm(false);
        setShowLocationForm(false);
        setShowManagerForm(true);
    }
    const locationBack = (e)=>{
        e.preventDefault();
        setShowForm(true);
        setShowLocationForm(false);
        setShowManagerForm(false);
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
            const city = [locationForm.city, locationForm.state].filter(Boolean).join("");
            const payload = new FormData();
            if(!id){
                payload.append("latitude",locationForm.latitude)
                payload.append("longitude",locationForm.longitude)
                payload.append("pincode",locationForm.pincode);
                payload.append("address",locationForm.addressLine1)
                payload.append("area", locationForm.addressLine2)
                payload.append("city", city)
                payload.append("name",managerForm.name)
                payload.append("email",managerForm.email)
                payload.append("phone",managerForm.phone)
                payload.append("password",managerForm.password)
            }
            payload.append("outletName", form.outletName);
            payload.append("description",form.description)
            payload.append("foodType" , form.foodType)
            payload.append("openingTime",form.openingTime)
            payload.append("closingTime",form.closingTime)
            payload.append("isOpen",form.isOpen)
            payload.append("status", form.status)
            const cuisines = form.cuisine.split(",").map((x)=>x.trim()).filter(Boolean)
            cuisines.forEach((x)=>{
                payload.append("cuisine",x);
            })
            console.log(payload)
            if(form.image){
                payload.append("image",form.image);
            }
            if(id && isAuthenticated){
                await outletService.update(id,payload)
            }else if(isManagerAuthenticated){
                await managerService.updateOutlet(form)
            }
            else {

                await outletService.create(payload)
            }
            const toastMsg = id? "Outlet Updated successfully!" : "Outlet Created successfully!"
            toast.success(toastMsg)
            if(isAuthenticated){
                nav("/outlets")
            }
            if(isManagerAuthenticated){
                nav(`/outlets/${id}`)
            }

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
            </div>
        { error && <div className="alert error">{error}</div>}
        { showForm &&
            (
                <FormPage
                id = {id}
                form = {form}
                busy = {busy}
                error = {error}
                outletNext={outletNext}
                change={change}
                sendData={sendData}
                isManagerAuthenticated={isManagerAuthenticated}
                />
            )
        }
        {
            showLocationForm && (
                <LocationPage 
                id = {id}
                locationForm = {locationForm}
                locationChange={locationChange}
                showMap={showMap}
                setShowMap={setShowMap}
                handleMapLocation={handleMapLocation}
                handleUseCurrentLocation={handleUseCurrentLocation}
                locationLoading={locationLoading}
                locationNext={locationNext}
                locationBack={locationBack}
                />
            )
        }
        {
            showManagerForm && (
                <ManagerPage
                managerForm = {managerForm}
                sendData = {sendData}
                managerchange={managerchange}
                outletNext={outletNext}
                />
            )
        }
    </div>
    </>
  )
}

export default CreateOutlet



export function ManagerPage({managerForm,managerchange,sendData,outletNext}){
    return (
        <>
            <h1>Manager</h1>
            <form className="panel form grid-2" onSubmit={sendData}>
                    <label>
                        name
                        <input type="text" 
                        name="name"
                        required
                        value={managerForm.name}
                        onChange={managerchange}
                        placeholder="Manager Name"
                        />
                    </label>
                    <label>
                        Email
                        <input type="email" 
                        name="email"
                        required
                        value={managerForm.email}
                        onChange={managerchange}
                        placeholder="Manager Email"
                        />
                    </label>
                    <label>
                        Phone
                        <input type="tel" 
                        name="phone"
                        required
                        value={managerForm.phone}
                        onChange={managerchange}
                        placeholder="contact Numver"
                        />
                    </label>
                    <label>
                        Password
                        <input type="password" 
                        name="password"
                        required
                        value={managerForm.password}
                        onChange={managerchange}
                        placeholder="password"
                        />
                    </label>
                    <div className="grid-span-2 form-actions">
                        <button className="button secondary" type="button" onClick={outletNext} >Back</button>
                        <button className="button secondary" type="submit">Create Outlet</button>
                    </div>
            </form>
        </>
    )
}