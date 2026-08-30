const TOKEN_KEY = "vendor_token"

const VENDOR_KEY = "vendor_user"


export const getToken = ()=> sessionStorage.getItem(TOKEN_KEY) // getting token .

export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY,token) // Storing token in sessionstorage.


export const removeToken = ()=> sessionStorage.removeItem(TOKEN_KEY);// Removing Token form local storage. 

export const getVendor = ()=>{ // get vendor

    try {
        
        // console.log(JSON.parse(sessionStorage.getItem(VENDOR_KEY) || "null"))
        return JSON.parse(sessionStorage.getItem(VENDOR_KEY) || "null")
    } catch {
        console.log("No data is getting from the local storage.");
        return null;
    }
}

export const setVendor = (vendor)=>{
    sessionStorage.setItem(VENDOR_KEY,JSON.stringify(vendor)) // Add vendor
}

export const removeVendor = ()=> sessionStorage.removeItem(VENDOR_KEY) // remove vendor

export const  clearAuth = ()=>{
    removeToken();
    removeVendor();
}