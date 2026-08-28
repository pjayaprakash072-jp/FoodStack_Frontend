import {getToken,setToken, clearAuth,getVendor,setVendor as saveVendor} from "../utils/auth";

import {useContext, createContext, useMemo, useState}  from 'react'

import vendorService from "../services/vendorService";

const AuthContext = createContext(null);


export function AuthProvider({children}){
    const [token,setAuthToken] = useState(getToken());
    const [vendor,setAuthVendor] = useState(getVendor());

    const updateVendor = (vendorData)=>{
        setAuthVendor(vendorData);
        saveVendor(vendorData)
    }

    const login = async (credentials)=>{
        const result = await vendorService.login(credentials);

        // console.log("Login Response" , result);
        // if(!result?.token){
        // }
        if(result?.token){
            
            setToken(result.token);
            
            setAuthToken(result.token);
        }else{
            throw new Error("No token received form Server")

        }


        if(result.vendor){
            updateVendor(result.vendor)
        }


        return result;
    }

    const logout = ()=>{
        clearAuth();
        setAuthVendor(null);
        setAuthToken(null);

    }

    const value = useMemo(
        ()=>(
            {
                token, isAuthenticated:Boolean(token), login , logout,vendor, setVendor:updateVendor
            }
            ),[token,vendor]);


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = ()=> useContext(AuthContext)