import api,{unwrap} from "../utils/managerApi"

const managerService = {
    login:async(payload)=>unwrap(await api.post("/manager/login",payload)),
    updateOutlet:async(payload)=>unwrap(await api.put("/manager/outlet/update",payload)),
    getAllCategories:async()=>unwrap(await api.get('/manager/categories/outlet')),
    createCategory:async(payload)=>unwrap(await api.post('/manager/category/create',payload)),
    getCategoryById:async(id)=>unwrap(await api.get(`/manager/category/get/${id}`)),
    updateCategory:async(id,payload)=>unwrap(await api.put(`/manager/category/update/${id}`,payload)),
    deleteCategory:async(id)=>unwrap(await api.delete(`/manager/category/delete/${id}`) ),
    getAllItems:async()=>unwrap(await api.get("/manager/items/outlet")),
    getItemsByCategory:async(categoryId)=>unwrap( await api.get(`/manager/items/category/${categoryId}`)),
    getItemById:async(menuItemId)=>unwrap(await api.get(`/manager/items/get/${menuItemId}`)),
    createItem:async(categoryId,payload)=>unwrap(await api.post(`/manager/items/add/${categoryId}`,payload)),
    updateItem:async(menuItemId,payload)=>unwrap(await api.put(`/manager/items/update/${menuItemId}`,payload)),
    deleteItem:async(menuItemId)=>unwrap(await api.delete(`/manager/items/delete/${menuItemId}`)),
    getOrders:async()=>unwrap(await api.get("/manager/orders")),
    updateOrder:async(orderId,payload)=>unwrap(await api.put(`/order/update/${orderId}`,payload))
}
export default managerService