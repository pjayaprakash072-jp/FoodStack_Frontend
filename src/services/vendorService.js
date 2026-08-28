import api, { unwrap } from "../utils/api"

const vendorService = {
    register:async(payload)=> unwrap(await api.post("/vendor/create",payload)),
    login: async (payload)=> unwrap(await api.post("/vendor/login",payload)),
    getAll:async()=> unwrap(await api.get("/vendor/getall")),
    getOne:async(id)=>unwrap(await api.get(`/vendor/get/${id}`)),
    update:async(id,payload)=>unwrap(await api.put(`/vendor/update/${id}`,payload)),
    remove:async(id)=>unwrap(await api.delete(`/vendor/delete/${id}`)),
    sendResetLink:async(email)=> unwrap(await api.post("/vendor/forgot-password",{email})),
    updatePassword:async(token,password) => unwrap(await api.post(`/vendor/reset-password/${token}`,{password})),
    googleLogin:async(credential) => unwrap(await api.post("/vendor/google-login",{credential}))
}

export default vendorService;

// vendorService
// │
// ├── register(payload)
// │      └── POST /vendor/create
// │
// ├── login(payload)
// │      └── POST /vendor/login
// │
// ├── getAll()
// │      └── GET /vendor/getall
// │
// ├── getOne(id)
// │      └── GET /vendor/get/:id
// │
// ├── update(id, payload)
// │      └── PUT /vendor/update/:id
// │
// └── remove(id)
//        └── DELETE /vendor/delete/:id