import api,{unwrap} from "../utils/api"

const categoryService = {

    create:async(id,payload)=>unwrap(await api.post(`/menu-category/create/${id}`,payload)),
    byOutlet:async(id)=>unwrap(await api.get(`/menu-category/outlet/${id}`)),
    getOne:async(id)=>unwrap(await api.get(`/menu-category/get/${id}`)),
    getAll:async()=> unwrap(await api.get("/menu-category/getall")),
    update:async(id,payload)=>unwrap(await api.put(`/menu-category/update/${id}`,payload)),
    remove:async(id)=>unwrap(await api.delete(`/menu-category/${id}`))
}
export default categoryService