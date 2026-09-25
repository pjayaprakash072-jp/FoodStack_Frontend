import { useEffect, useState } from "react";
import orderService from "../../services/orderService"

const Orders = () => {
    const [orders,setOrders] = useState([]);
    useEffect(
      ()=>{
        const load = async()=>{
          try {
            const response = await orderService.getAllByVendor();
            setOrders(response.orders)
          } catch (error) {
            console.log(error)
          }
        }
        load();
      },[]
    )
  return (
    <div>
        {/* <button className="button primary" onClick={get}>get orders</button> */}
        <h2>{orders.length}</h2>
    </div>
  )
}

export default Orders