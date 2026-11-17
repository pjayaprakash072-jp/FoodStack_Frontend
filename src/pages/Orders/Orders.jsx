
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import orderService from "../../services/orderService";

import SearchBar from "../../components/Common/SearchBar";
import OrderCard from "../../components/Cards/OrderCard";
import EmptyState from "../../components/Common/EmptyState";
import OrderCardSkeleton from "../../components/Skeletons/OrderCardSkeleton";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { isAuthenticated, vendor } = useAuth();

  const loadOrders = async (showLoader = true) => {
    try {
      if (showLoader) {
        setBusy(true);
      }

      if (!isAuthenticated || !vendor?._id) {
        setOrders([]);
        return;
      }

      const response = await orderService.getAllByVendor(vendor._id);

      setOrders(response?.orders || []);

    } catch (error) {
      console.log("Failed to load orders", error);
    } finally {
      setBusy(false);
    }
  };


  useEffect(() => {
    loadOrders(true);
  }, [isAuthenticated, vendor?._id]);


  const filtered = orders.filter((o) =>
    `${o.deliveryAddress}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


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
                onClick={() => navigate(`/orders/${o._id}`)}
              />
            ))}
          </div>

        ) : (
          <EmptyState
            title="No orders found"
            text={
              search
                ? "Try a different search"
                : "There are no orders yet."
            }
          />
        )}

      </div>
    </div>
  );
};

export default Orders;
