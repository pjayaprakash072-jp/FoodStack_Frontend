

import "leaflet/dist/leaflet.css"
import { useState } from "react"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"

const MapClick = ({onLocationSelect})=>{
    useMapEvents(
        {
            click(e){
                onLocationSelect(
                    {
                        latitude: e.latlng.lat,
                        longitude:e.latlng.lng
                    }
                )
            }
        }
    )
    return null;
}
const LocationPicker = ({onSelect,onClose,initialLocation}) => {
    const [selectedLocation,setSelectedLocation] = useState(initialLocation);
    const handleLocationSelected = (location)=>{
        setSelectedLocation(location);
    }
    const handleMarkerDrag = (e)=>{
        const position = e.target.getLatLng();
        setSelectedLocation(
            {
                latitude:position.lat,
                longitude:position.lng
            }
        )
    }
    const confirmLocation =()=>{
        if(!selectedLocation)return ;
        onSelect(selectedLocation);
        onClose();
    }
    const mapCenter = selectedLocation ? [selectedLocation.latitude,selectedLocation.longitude] : [20.5937,78.9629]
  return (
        <div className="location-picker">
        <MapContainer
            center={mapCenter}
            zoom={5}
            className="location-map-container"
        >
            <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClick onLocationSelect={handleLocationSelected} />

            {selectedLocation && (
            <Marker
                position={[
                selectedLocation.latitude,
                selectedLocation.longitude,
                ]}
                draggable={true}
                eventHandlers={{
                dragend: handleMarkerDrag,
                }}
            />
            )}
        </MapContainer>

        <div className="form-actions location-picker-actions">
            <button
            type="button"
            className="primary-button"
            disabled={!selectedLocation}
            onClick={confirmLocation}
            >
            Confirm Location
            </button>

            <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            >
            Cancel
            </button>
        </div>
        </div>
  )
}

export default LocationPicker