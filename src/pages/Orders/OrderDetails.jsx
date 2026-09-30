import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useManagerContext from "../../context/useManagerContext";
import managerService from "../../services/managerService";
import { useAuth } from "../../context/useAuth";
import orderService from "../../services/orderService";
import { getErrorMessage } from "../../utils/api";
import Loader from "../../components/Common/Loader";

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const {isManagerAuthenticated} = useManagerContext();
    const {isAuthenticated}  = useAuth();


    const [order, setOrder] = useState(null);
    const [Busy, setBusy] = useState(true);
    const [error, setError] = useState("");

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
    }, [orderId]);

    if (Busy) return <Loader/>

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">{error}</p>

                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-5 md:p-8">

            {/* Header */}
            <div className="max-w-4xl mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-5 text-sm text-indigo-600 hover:text-indigo-700"
                >
                    ← Back to Orders
                </button>

                {/* Order Header */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 md:p-6">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <p className="text-sm text-gray-500">
                                Order
                            </p>

                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                #{order._id.slice(-8)}
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </div>

                        <span className="w-fit px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                            {order.orderStatus}
                        </span>

                    </div>
                </div>

                {/* Customer */}
                <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Customer
                    </h2>

                    <div className="mt-4">
                        <p className="text-gray-800 dark:text-gray-200">
                            P Jayaprakash
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            9652649724
                        </p>
                    </div>

                </div>

                {/* Delivery Address */}
                <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Delivery Address
                    </h2>

                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-6">
                        {order.deliveryAddress}
                    </p>

                </div>

                {/* Items */}
                <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Items
                    </h2>

                    <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">

                        {order.items.map((item) => (
                            <div
                                key={item._id}
                                className="py-4 flex items-center justify-between gap-4"
                            >

                                <div className="flex-1">

                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {item.name}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        ₹{item.price} × {item.quantity}
                                    </p>

                                </div>

                                <p className="font-semibold text-gray-900 dark:text-white">
                                    ₹{item.price * item.quantity}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

                {/* Price Summary */}
                <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Payment Summary
                    </h2>

                    <div className="space-y-3 text-sm">

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Subtotal
                            </span>

                            <span className="text-gray-900 dark:text-white">
                                ₹{order.subTotal}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Delivery Fee
                            </span>

                            <span className="text-gray-900 dark:text-white">
                                ₹{order.deliveryFee}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Discount
                            </span>

                            <span className="text-green-600">
                                - ₹{order.discount}
                            </span>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">

                            <span className="font-semibold text-gray-900 dark:text-white">
                                Total
                            </span>

                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                ₹{order.totalAmount}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Payment */}
                <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Payment
                    </h2>

                    <div className="mt-4 flex justify-between">

                        <span className="text-gray-500">
                            Method
                        </span>

                        <span className="font-medium text-gray-900 dark:text-white">
                            {order.paymentMethod}
                        </span>

                    </div>

                    <div className="mt-3 flex justify-between">

                        <span className="text-gray-500">
                            Status
                        </span>

                        <span className="font-medium text-green-600">
                            {order.paymentStatus}
                        </span>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default OrderDetails;