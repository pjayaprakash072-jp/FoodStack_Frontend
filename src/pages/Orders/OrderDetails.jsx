import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useManagerContext from "../../context/useManagerContext";
import managerService from "../../services/managerService";
import { useAuth } from "../../context/useAuth";
import orderService from "../../services/orderService";
import { getErrorMessage } from "../../utils/api";
import Loader from "../../components/Common/Loader";
import OrderCard from './../../components/Cards/OrderCard';
import OrderStatus from "../../components/OrderStatus/OrderStatus";
import { ArrowLeft } from "lucide-react";

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const {isManagerAuthenticated} = useManagerContext();
    const {isAuthenticated}  = useAuth();


    const [order, setOrder] = useState(null);
    const [Busy, setBusy] = useState(true);
    const [error, setError] = useState("");
    const [statusUpdating,setStatusUpdating] = useState(false);


    useEffect(() => {
        const getOrder = async () => {
            try {
                setBusy(true);

                // If you don't have a single-order API yet,
                // you can temporarily get all orders.
                const response = isManagerAuthenticated? await managerService.getOrders() : isAuthenticated && await orderService.getAllByVendor();

                const orders = response.orders;

                const foundOrder = orders.find(
                    (order) => order._id === orderId
                );

                if (!foundOrder) {
                    setError("Order not found.");
                    return;
                }

                setOrder(foundOrder);
            } catch (error) {
                setError(getErrorMessage(error));
            } finally {
                setBusy(false);
            }
        };

        getOrder();
    }, [orderId,isAuthenticated,isManagerAuthenticated]);
    const handleStatusUpdate = async(orderStatus)=>{
        try {
            setStatusUpdating(true);
            const response = await managerService.updateOrder(order._id,{orderStatus})
            setOrder(response.order)
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setStatusUpdating(false);
        }
    }


    if (Busy) return <Loader/>


    return (
    <div className="page-container">
        <div>
        <button
            onClick={() => navigate(-1)}
            className="secondary-button"
        >
            <ArrowLeft size={16} />
            Back to Orders
        </button>
        </div>

        {error && <div className="message-error">{error}</div>}

        <div className="order-details-grid">
        {/* Mobile Order Status */}
        <div className="details-container order-status-mobile">
            <OrderStatus
            status={order.orderStatus}
            updateStatus={handleStatusUpdate}
            statusUpdating={statusUpdating}
            />
        </div>

        {/* Order Information */}
        <div className="details-container order-information">
            <OrderCard order={order} single />
        </div>

        {/* Order Items */}
        <div className="details-container order-items-container">
            <h2 className="section-title">Items</h2>

            <div className="order-items-list">
            {order.items.map((item) => (
                <div key={item._id} className="order-item-row">
                <div className="order-item-info">
                    <p>{item.name}</p>
                    <span>
                    ₹{item.price} × {item.quantity}
                    </span>
                </div>

                <p className="order-item-price">
                    ₹{item.price * item.quantity}
                </p>
                </div>
            ))}
            </div>
        </div>

        {/* Payment Summary */}
        <div className="details-container">
            <div className="payment-summary">
            <h2 className="section-title">Payment Summary</h2>

            <div className="payment-summary-list">
                <div className="payment-row">
                <span>Subtotal</span>
                <span>₹{order.subTotal}</span>
                </div>

                <div className="payment-row">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
                </div>

                <div className="payment-row">
                <span>Discount</span>
                <span className="text-success">
                    - ₹{order.discount}
                </span>
                </div>

                <div className="payment-total">
                <span>Total</span>
                <strong>₹{order.totalAmount}</strong>
                </div>
            </div>
            </div>

            <div className="payment-information">
            <h2 className="section-title">Payment</h2>

            <div className="payment-row">
                <span>Method</span>
                <strong>{order.paymentMethod}</strong>
            </div>

            <div className="payment-row">
                <span>Status</span>
                <strong
                className={
                    order.paymentStatus === "paid"
                    ? "text-success"
                    : "text-danger"
                }
                >
                {order.paymentStatus}
                </strong>
            </div>
            </div>
        </div>
        </div>

        {/* Desktop Order Status */}
        <div className="details-container order-status-desktop">
        <h2 className="section-title">Update Order Status</h2>

        <OrderStatus
            status={order.orderStatus}
            updateStatus={handleStatusUpdate}
            statusUpdating={statusUpdating}
        />
        </div>
    </div>
    );
};

export default OrderDetails;