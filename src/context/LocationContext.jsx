import { createContext, useEffect, useState } from "react";


export const LocationContext = createContext(null) // this is an object (inbuil hood by react);

export const LocationProvider = ({children})=>{
    const [location,setLocation] = useState(
        ()=>{
            const selectedLocation = localStorage.getItem("outlet_location");
            return selectedLocation ? JSON.parse(selectedLocation) : {
                latitude:null,
                longitude:null
            }
        }
    )

    useEffect(
        ()=>{
            localStorage.setItem("outlet_location",JSON.stringify(location))
        },[location]
    )

    const useCurrentLocation = ()=>{
        return new Promise(
            (resolve,reject)=>{
                if(!navigator.geolocation){
                    return reject(
                        new Error("GeoLocaiton is not supported")
                    )
                }
                navigator.geolocation.getCurrentPosition(
                    ({coords})=>{
                        const value ={
                            latitude:coords.latitude,
                            longitude:coords.longitude
                        }
                        setLocation(value);
                        resolve(value);
                    },
                    reject
                )
            }
        )
    }
    return (
        <LocationContext.Provider
        value={
            {
                location,setLocation,useCurrentLocation
            }
        }
        >
            {children}
        </LocationContext.Provider>
    )
}