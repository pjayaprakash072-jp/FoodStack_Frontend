import { useEffect, useState } from "react";
import orderService from "../../services/orderService"
import { useAuth } from "../../context/useAuth";
import useManagerContext from "../../context/useManagerContext";
import managerService from "../../services/managerService";
import SearchBar from "../../components/Common/SearchBar";
import Loader from "../../components/Common/Loader";
import OrderCard from "../../components/Cards/OrderCard";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";
import { toast } from "sonner";


const Orders = () => {
    const [orders,setOrders] = useState([]);
    const [busy,setBusy] = useState(true);
    const [search,setSearch]  = useState("");
    const navigate = useNavigate();
    const {isManagerAuthenticated,manager,setOrdersNum} = useManagerContext();
    const {isAuthenticated} = useAuth();
    const outletId  = manager?.outlet?._id;
    const loadOrders = async(showLoader = true)=>{
      try {
        if(showLoader){
          setBusy(true);
        }
        let response;
        if(isManagerAuthenticated){
          response = await managerService.getOrders();
        }else if(isAuthenticated){
          response = await orderService.getAllByVendor();
        }
        setOrders(response?.orders || [])
        setOrdersNum(response?.orders?.length);
      } catch (error) {
      console.log("Failed to load orders",error); 
      }finally{
        setBusy(false)
      }
    }
    useEffect(
      ()=>{
        loadOrders(true);
      },[isAuthenticated,isManagerAuthenticated]
    )
    useEffect(
      ()=>{
        if(!isManagerAuthenticated || !outletId) return;
        console.log("Connecting socket...");
        if(!socket.connected){
          socket.connect();
        }
        const handleNewOrder = (data)=>{
          console.log("NEW ORDER RECEIVED",data)
          if(String(data.outletId) !== String(outletId)) return ;
          toast.success("New order received!",{
            description:`Order # ${String(data.orderId).slice(-6)}`
          })
          loadOrders(false);
        }
        socket.on("new-order",handleNewOrder);
        const joinRoom = ()=>{
          console.log("Joining outlet room:",outletId);
          socket.emit("join-outlet",outletId)
        }
        if(socket.connected){
          joinRoom();
        }
        socket.on("connect",joinRoom)
        // return ()=>{
        //   socket.off(
        //     "new-order",handleNewOrder
        //   )
        //   socket.off("connect",joinRoom)
        // }
      },[isManagerAuthenticated,outletId]
    )
    const filtered = orders.filter( (o)=> `${o.deliveryAddress}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Orders</h1>
          <p>Receive and manager every order</p>
        </div>
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
        ):(<h1>No orders Found</h1>)
      }
    </div>
  )
}

export default Orders