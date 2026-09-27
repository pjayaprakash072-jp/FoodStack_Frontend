const TOKEN_KEY = "vendor_token"

const VENDOR_KEY = "vendor_user"



export const getToken = ()=> sessionStorage.getItem(TOKEN_KEY) 

export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY,token) 

export const removeToken = ()=> sessionStorage.removeItem(TOKEN_KEY);



export const getVendor = ()=>{ 

    try {
        
        return JSON.parse(sessionStorage.getItem(VENDOR_KEY) || "null")
    } catch {
        console.log("No data is getting from the local storage.");
        return null;
    }
}

export const setVendor = (vendor)=>{
    sessionStorage.setItem(VENDOR_KEY,JSON.stringify(vendor)) 
}

export const removeVendor = ()=> sessionStorage.removeItem(VENDOR_KEY) 

export const  clearAuth = ()=>{
    removeToken();
    removeVendor();
}
// MANAGER
// =================================================================================

const MANAGER_TOKEN ="manager_token"

const MANAGER_KEY="manager_user"

export const getManagerToken = ()=> sessionStorage.getItem(MANAGER_TOKEN) 

export const setManagerToken = (token) => sessionStorage.setItem(MANAGER_TOKEN,token) 

export const removeManagerToken = ()=> sessionStorage.removeItem(MANAGER_TOKEN);


export const getManager = ()=>{ 

    try {
        
        return JSON.parse(sessionStorage.getItem(MANAGER_KEY) || "null")
    } catch {
        console.log("No data is getting from the local storage.");
        return null;
    }
}

export const setManager = (manager)=>{
    sessionStorage.setItem(MANAGER_KEY,JSON.stringify(manager)) 
}

export const removeManager = ()=> sessionStorage.removeItem(MANAGER_KEY) 

export const  clearManagerAuth = ()=>{
    removeManagerToken();
    removeManager();
}