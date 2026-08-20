import api, { unwrap } from "../utils/api"

const vendorService = {
    register:async(payload)=> unwrap(await api.post("/vendor/create",payload)),
    login: async (payload)=> unwrap(await api.post("/vendor/login",payload))
}

export default vendorService;