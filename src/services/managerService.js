import api,{unwrap} from "../utils/managerApi"

const managerService = {
    login:async(payload)=>unwrap(await api.post("/manager/login",payload)),
    updateOutlet:async(payload)=>unwrap(await api.put("/manager/outlet/update",payload)),
    getAllCategories:async()=>unwrap(await api.get('/manager/categories/outlet')),
    createCategory:async(payload)=>unwrap(await api.post('/manager/category/create',payload)),
    getCategoryById:async(id)=>unwrap(await api.get(`/manager/category/get/${id}`)),
    updateCategory:async(id)=>unwrap(await api.put(`/manager/category/update/${id}`)),
    deleteCategory:async(id)=>unwrap(await api.delete(`/manager/category/delte/${id}`) ),
    getAllItems:async()=>unwrap(await api.get("/manager/items/outlet")),
    getItemsByCategory:async(categoryId)=>unwrap(api.get(`/manager/items/category/${categoryId}`)),
    getItemById:async(menuItemId)=>unwrap(await api.get(`/manager/items/get/${menuItemId}`)),
    createItem:async(payload,categoryId)=>unwrap(await api.post(`/manager/items/add/${categoryId}`,payload)),
    updateItem:async(payload,menuItemId)=>unwrap(await api.put(`/manager/items/update/${menuItemId}`,payload)),
    deleteItem:async(menuItemId)=>unwrap(await api.delete(`/manager/items/delete/${menuItemId}`))
}
export default managerService