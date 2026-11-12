import api,{unwrap} from "../utils/api"
const orderService = {
    getAllByVendor:async (id)=> unwrap(await api.get(`/order/vendor?vendor=${id}`)),
    // getOne:async(orderId)=>unwrap(await api.get(`vendor/order/${orderId}`))
}
export default orderService;