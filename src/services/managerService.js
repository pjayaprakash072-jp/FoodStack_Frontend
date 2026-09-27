import api,{unwrap} from "../utils/managerApi"

const managerService = {
    login:async(payload)=>unwrap(await api.post("/manager/login",payload))
}
export default managerService