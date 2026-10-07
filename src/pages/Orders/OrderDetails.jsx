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
        <div className="page">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="mb-5 text-sm text-indigo-600 hover:text-indigo-700"
                >
                    ← Back to Orders
                </button>
            </div>
            {error && <div className="error">{error}</div>}
            <div className="order-details">
                <div className="panel mobile-only">
                    <OrderStatus/>
                </div>
                <div className="panel md:w-[28%]">
                    <OrderCard order={order} single/>
                </div>
                <div className="panel flex-1">
                    <div className="order-items-card">
                        <h2>
                            Items
                        </h2>
                        <div className="order-items">
                            {order.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="order-item"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {item.name}
                                        </p>
                                        <p className="text-sm  mt-1">
                                            ₹{item.price} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold ">
                                        ₹{item.price * item.quantity}
                                    </p>

                                </div>
                            ))}

                        </div>

                    </div>
                </div>

                <div className="panel">
                    <div className="payment-summary">
                        <h2>
                            Payment Summary
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="subtotal">
                                <span>
                                    Subtotal
                                </span>
                                <span>
                                    ₹{order.subTotal}
                                </span>
                            </div>
                            <div className="delivery-fee">
                                <span>
                                    Delivery Fee
                                </span>
                                <span>
                                    ₹{order.deliveryFee}
                                </span>
                            </div>
                            <div className="discount">
                                <span>
                                    Discount
                                </span>
                                <span className="text-green-600">
                                    - ₹{order.discount}
                                </span>
                            </div>
                            <div className="total">
                                <span>
                                    Total
                                </span>
                                <span>
                                    ₹{order.totalAmount}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Payment */}
                    <div className="payment">
                        <h2>
                            Payment
                        </h2>
                        <div className="payment-method">
                            <span>
                                Method
                            </span>
                            <span>
                                {order.paymentMethod}
                            </span>
                        </div>
                        <div className="payment-status">
                            <span>
                                Status
                            </span>
                            <span className="font-medium text-green-600">
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel md-only mt-5">
                <OrderStatus status={order.orderStatus} order={order} updateStatus ={handleStatusUpdate} statusUpdating={statusUpdating}/>
            </div>
        </div>
    );
};

export default OrderDetails;