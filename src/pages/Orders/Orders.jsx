import { useEffect, useState } from "react";
import orderService from "../../services/orderService"
import { useAuth } from "../../context/useAuth";
import useManagerContext from "../../context/useManagerContext";
import managerService from "../../services/managerService";
import SearchBar from "../../components/Common/SearchBar";
import OrderCard from "../../components/Cards/OrderCard";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";
import { toast } from "sonner";
import EmptyState from "../../components/Common/EmptyState";
import OrderCardSkeleton from "../../components/Skeletons/OrderCardSkeleton";


const Orders = () => {
    const [orders,setOrders] = useState([]);
    const [busy,setBusy] = useState(true);
    const [search,setSearch]  = useState("");
    const navigate = useNavigate();
    const {isManagerAuthenticated,manager,setOrdersNum} = useManagerContext();
    const {isAuthenticated,vendor} = useAuth();
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
          response = await orderService.getAllByVendor(vendor._id);
          console.log(response)
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
        return ()=>{
          socket.off(
            "new-order",handleNewOrder
          )
          socket.off("connect",joinRoom)
        }
      },[isManagerAuthenticated,outletId]
    )
    const filtered = orders.filter( (o)=> `${o.deliveryAddress}`.toLowerCase().includes(search.toLowerCase()))
  return (
  <div className="page-container">
    <div className="content-header">
      <div>
        <p className="content-eyebrow">Management</p>
        <h1 className="content-title">Orders</h1>
        <p className="content-description">
          Receive and manage every order
        </p>
      </div>

      <div className="orders-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search Orders"
        />

        <span className="outlet-count">
          {orders.length} Orders
        </span>
      </div>
    </div>

    <div className="content-body">
      {busy ? (
        <div className="order-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <OrderCardSkeleton key={index} />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="order-grid">
          {filtered.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              onClick={() => navigate(`/manager/orders/${o._id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No orders found"
          text={search ? "Try a different search" : "There are no orders yet."}
        />
      )}
    </div>
  </div>
  )
}

export default Orders