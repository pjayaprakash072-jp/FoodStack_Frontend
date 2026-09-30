import { useEffect, useState } from "react";
import orderService from "../../services/orderService"
import { useAuth } from "../../context/useAuth";
import useManagerContext from "../../context/useManagerContext";
import managerService from "../../services/managerService";
import SearchBar from "../../components/Common/SearchBar";
import Loader from "../../components/Common/Loader";
import OrderCard from "../../components/Cards/OrderCard";
import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";


const Orders = () => {
    const [orders,setOrders] = useState([]);
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [busy,setBusy] = useState(true);
    const {isManagerAuthenticated} = useManagerContext();
    const [search,setSearch]  = useState("");
    const filtered = orders.filter( (o)=> `${o.deliveryAddress}`.toLowerCase().includes(search.toLowerCase()))
    useEffect(
      ()=>{
        const load = async()=>{
          try { 
            const response = isManagerAuthenticated? await managerService.getOrders() : isAuthenticated && await orderService.getAllByVendor();
            setOrders(response.orders)
            console.log(response)
          } catch (error) {
            console.log(error)
          }finally{
            setBusy(false)
          }
        }
        load();
      },[]
    )
  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">Orders</p>
        <div className="toolbar">
          <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search Orders"
          />
        </div>
        <h2>{orders.length}</h2>
      </div>
      {
        busy?(
          <Loader/>
        ): filtered.length?(
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {
              filtered.map(
                (o)=>(
                  <OrderCard key={o._id} 
                  order = {o}
                  onClick={()=>navigate(`/manager/orders/${o._id}`)}
                  />
                )
              )
            }
          </div>
        ):(<h1></h1>)
      }
    </div>
  )
}

export default Orders