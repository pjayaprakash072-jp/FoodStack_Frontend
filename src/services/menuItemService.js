import api,{unwrap} from "../utils/api"

const menuItemService = {

    create:async(id,payload)=>unwrap(await api.post(`/menu-item/add/${id}`,payload)),

    getAll:async()=> unwrap(await api.get("/menu-item/getall")),

    getOne:async(id) => unwrap(await api.get(`/menu-item/get/${id}`)),

    byOutlet:async(outletId) =>unwrap(await api.get(`/menu-item/outlet/${outletId}`)),

    byCategory:async(categoryId)=>unwrap(await api.get(`/menu-item/category/${categoryId}`)),

    update:async(id,payload)=>unwrap(await api.put(`/menu-item/update/${id}`,payload)),

    deleet:async(id)=>unwrap(await api.delete(`/menu-item/delete/${id}`))
}
export default menuItemService;