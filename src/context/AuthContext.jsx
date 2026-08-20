import {getToken,setToken, clearAuth,getVendor,setVendor} from "../utils/auth";

import {useContext, createContext, useMemo, useState}  from 'react'

import vendorService from "../services/vendorService";

const AuthContext = createContext(null);


export function AuthProvider({children}){
    const [token,setAuthtoken] = useState(getToken());
    const [vendor,setAuthVendor] = useState(getVendor());

    const login = async (credentials)=>{
        const result = await vendorService.login(credentials);

        console.log("Login Response" , result);
        if(!result?.token){
            throw new Error("No token received form Server")
        }
        setToken(result.token);

        setAuthtoken(result.token);


        if(result.vendor){
            setVendor(result.vendor);
            setAuthVendor(result.vendor);
        }


        return result;
    }

    const logout = ()=>{
        clearAuth();
        setAuthVendor(null);
        setAuthtoken(null);

    }

    const value = useMemo(
        ()=>(
            {
                token, isAuthenticated:Boolean(token), login , logout,vendor, setVendor:vendor
            }
            ),[token,vendor]);


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = ()=> useContext(AuthContext)