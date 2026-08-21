import api,{ unwrap } from './../utils/api';


const outletService = {
    create:async(payload)=> unwrap(await api.post("/outlet/create",payload)),
    getAll:async()=>unwrap(await api.get("/outlet/getall")),
    getOnt:async(id)=>unwrap(await api.get(`/outlet/get${id}`)),
    update:async(id,payload)=>unwrap(await api.put(`/outlet/update/${id}`,payload)),
    remove:async(id)=>unwrap(await api.delete(`/outlet/delete/${id}`))
}
export default outletService