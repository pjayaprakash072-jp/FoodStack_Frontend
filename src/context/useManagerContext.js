import { useContext } from "react"
import { ManagerContext } from "./ManagerContext"

const useManagerContext = ()=>{
    return useContext(ManagerContext);
}
export default useManagerContext