import { createContext, useMemo,useState } from "react";
import {getManagerToken, setManagerToken, getManager, setManager as saveManager,clearManagerAuth} from "../utils/auth"
import managerService from './../services/managerService';

export const ManagerContext = createContext(null);

export const ManagerAuthProvider =({children})=>{

    const [token, setAuthToken] = useState(getManagerToken());
    const [manager,setAuthManager] = useState(getManager());
    const [managerLogin,setManagerLogin] = useState(true);
    const [ordersNum,setOrdersNum] = useState(0);


    const updateManager = (managerData)=>{
        setAuthManager(managerData);
        saveManager(managerData)
    }
    const login = async (credentials)=>{
        const response = await managerService.login(credentials);
        if(response?.token){
            setManagerToken(response.token);
            setAuthToken(response.token);
        }else{
            throw new Error("No token received form server!")
        }
        if(response.manager){
            updateManager(response.manager);
        }
        return response
    }
    const Managerlogout = ()=>{
        clearManagerAuth();
        setAuthManager(null);
        setAuthToken(null);
    }
    const value = useMemo(
        ()=>(
            {
                token,
                isManagerAuthenticated:Boolean(token),
                login,
                Managerlogout,
                manager,
                updateManager,
                managerLogin,
                setManagerLogin,
                ordersNum,
                setOrdersNum
            }
        ),[token,manager,managerLogin,ordersNum]
    )
    return (
        <ManagerContext.Provider
        value={value}
        >
            {children}
        </ManagerContext.Provider>
    )
}