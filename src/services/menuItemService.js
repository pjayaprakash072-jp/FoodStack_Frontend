import api,{unwrap} from "../utils/api"

const menuItemService = {

    create:async(categoryId,payload)=>unwrap(await api.post(`/menu-item/add/${categoryId}`,payload)),

    getAll:async()=> unwrap(await api.get("/menu-item/getall")),

    getOne:async(id) => unwrap(await api.get(`/menu-item/get/${id}`)),

    byOutlet:async(outletId) =>unwrap(await api.get(`/menu-item/outlet/${outletId}`)),

    byCategory:async(categoryId)=>unwrap(await api.get(`/menu-item/category/${categoryId}`)),

    update:async(id,payload)=>unwrap(await api.put(`/menu-item/update/${id}`,payload)),

    remove:async(id)=>unwrap(await api.delete(`/menu-item/delete/${id}`)),

    byVendor:async(vendorId)=>unwrap(await api.get(`/menu-item/vendor/${vendorId}`)),
}
export default menuItemService;