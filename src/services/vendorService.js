import api, { unwrap } from "../utils/api"

const vendorService = {
    login: async (payload)=> unwrap(await api.post("/vendor/login",payload))
}

export default vendorService;