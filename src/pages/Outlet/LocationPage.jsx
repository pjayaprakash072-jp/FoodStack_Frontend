
import LocationPicker from './../../components/LocationPicker/LocationPicker';

const LocationPage = ({id,locationForm,locationChange,showMap,setShowMap,handleMapLocation,handleUseCurrentLocation,locationLoading,locationNext,locationBack})=>{
    return (
        <>
            <h1>Location</h1>
            <form className="panel form grid-2" onSubmit={locationNext}>
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
                        <button className="button primary" type="button"  onClick={locationBack}>Back</button>
                        <button className="button secondary" type="button" disabled={locationLoading} onClick={handleUseCurrentLocation}>Use Current Location</button>
                        <button className="button secondary" type="button" disabled={locationLoading} onClick={()=>setShowMap(!showMap)}>Select on map</button>
                        <button className="button primary" type="submit" disabled={locationLoading} >{id?"Update Location":"Next"}</button>
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
export default LocationPage