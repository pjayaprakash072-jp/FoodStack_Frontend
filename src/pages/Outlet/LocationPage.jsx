
import { useState } from 'react';
import LocationPicker from '../../components/LocationPicker/LocationPicker';

const LocationPage = ({id,locationForm,locationChange,handleMapLocation,handleUseCurrentLocation,locationLoading,locationNext,locationBack})=>{
    const [showMap,setShowMap] = useState(false);
    return (
        <div className="wizard-section">
        <div className="wizard-heading">
            <h2 className="section-title">Outlet Location</h2>
            <p className="content-description">
            Enter your outlet address or select its location on the map.
            </p>
        </div>
        {
            !showMap ? (
                <form
                    className="form-container"
                    onSubmit={locationNext}
                >
                    <div className="form-grid">
                    <label className="form-field">
                        Address Line 1

                        <input
                        className="form-input"
                        type="text"
                        name="addressLine1"
                        required
                        value={locationForm.addressLine1}
                        onChange={locationChange}
                        placeholder="House no, street, area"
                        />
                    </label>

                    <label className="form-field">
                        Address Line 2

                        <input
                        className="form-input"
                        type="text"
                        name="addressLine2"
                        required
                        value={locationForm.addressLine2}
                        onChange={locationChange}
                        placeholder="Apartment, landmark, etc."
                        />
                    </label>

                    <label className="form-field">
                        City

                        <input
                        className="form-input"
                        type="text"
                        name="city"
                        required
                        value={locationForm.city}
                        onChange={locationChange}
                        placeholder="Enter City"
                        />
                    </label>

                    <label className="form-field">
                        State

                        <input
                        className="form-input"
                        type="text"
                        name="state"
                        required
                        value={locationForm.state}
                        onChange={locationChange}
                        placeholder="Enter State"
                        />
                    </label>

                    <label className="form-field">
                        Pincode

                        <input
                        className="form-input"
                        type="text"
                        name="pincode"
                        required
                        value={locationForm.pincode}
                        onChange={locationChange}
                        placeholder="Enter Pincode"
                        />
                    </label>
                    </div>

                    <div className="form-actions location-actions">
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={locationBack}
                    >
                        Back
                    </button>

                    <button
                        className="secondary-button"
                        type="button"
                        disabled={locationLoading}
                        onClick={handleUseCurrentLocation}
                    >
                        {locationLoading ? "Getting Location..." : "Use Current Location"}
                    </button>

                    <button
                        className="secondary-button"
                        type="button"
                        disabled={locationLoading}
                        onClick={() => setShowMap(!showMap)}
                    >
                        {showMap ? "Hide Map" : "Select on Map"}
                    </button>

                    <button
                        className="primary-button"
                        type="submit"
                        disabled={locationLoading}
                    >
                        {id ? "Update Location" : "Next"}
                    </button>
                    </div>
                </form>

            )
            :
            (
                <LocationPicker
                    initialLocation={
                    locationForm.latitude !== null &&
                    locationForm.longitude !== null
                        ? {
                            latitude: locationForm.latitude,
                            longitude: locationForm.longitude
                        }
                        : null
                    }
                    onSelect={handleMapLocation}
                    onClose={() => setShowMap(false)}
                />
            )

        }


        </div>
    )
}
export default LocationPage