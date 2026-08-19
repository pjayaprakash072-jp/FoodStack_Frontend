import {getToken,setToken, clearAuth} from "../utils/auth";

import {useContext, createContext, useMemo, useState}  from 'react'

import vendorService from "../services/vendorService";

const AuthContext = createContext(null);


export function AuthProvider({children}){
    const [token,setAuthtoken] = useState(getToken());

    const login = async (credentials)=>{
        const result = await vendorService.login(credentials);

        console.log("Login Response" , result);
        if(!result?.token){
            throw new Error("No token received form Server")
        }
        setToken(result.token);

        setAuthtoken(result.token);
        return result;
    }

    const logout = ()=>{
        clearAuth();

        setAuthtoken(null);

    }

    const value = useMemo(
        ()=>(
            {
                token, isAuthenticated:Boolean(token), login , logout
            }
            ),[token]);


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = ()=> useContext(AuthContext)