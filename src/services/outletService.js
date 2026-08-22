import api,{ unwrap } from './../utils/api';


const outletService = {
    create:async(payload)=> unwrap(await api.post("/outlet/create",payload)),
    getAll:async()=>unwrap(await api.get("/outlet/getall")),
    getOne:async(id)=>unwrap(await api.get(`/outlet/get/${id}`)),
    byVendor:async(vendorId)=> unwrap(await api.get(`/outlet/vendor/${vendorId}`)),
    update:async(id,payload)=>unwrap(await api.put(`/outlet/update/${id}`,payload)),
    remove:async(id)=>unwrap(await api.delete(`/outlet/delete/${id}`))
}
export default outletService