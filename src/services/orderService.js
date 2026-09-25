import api,{unwrap} from "../utils/api"
const orderService = {
    getAllByVendor:async ()=> unwrap(await api.get("/order/vendor")),
    // getOne:async(orderId)=>unwrap(await api.get(`vendor/order/${orderId}`))
}
export default orderService;