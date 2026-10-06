const OrderCard = ({ order, onClick }) => {
    const orderId = order._id?.slice(-8);

    const date = new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <div
            onClick={onClick}
            className="order-card"
        >
            {/* Header */}
            <div className="order-card-head">
                <h3 >
                    Order #{orderId}
                </h3>

                <span>
                    <span className="circle"></span>
                    {order.orderStatus}
                </span>
            </div>

            {/* Date */}
            <p >
                {date}
            </p>

            <div className="line"></div>

            {/* Customer */}
            <div className="order-card-customer">
                <span>👤</span>
                <div>
                    <p >
                        {order.user?.name || "Customer"}
                    </p>
                    <p>
                       📞 {order?.user?.phone || "+1234567890"}
                    </p>
                </div>
            </div>

            {/* Address */}
            <div className="order-card-address">
                <span>📍</span>
                <p>
                    {order.deliveryAddress}
                </p>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
                <p>
                    {order.items?.length || 0} items
                </p>

                <p>
                    {order.paymentMethod}{" "}
                    <span>•</span>{" "}
                    <span
                        className={
                            order.paymentStatus === "paid"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                        }
                    >
                        {order.paymentStatus}
                    </span>
                </p>
            </div>

            <div className="line"></div>

            {/* Total */}
            <div className="order-total">
                <p>
                    Total
                </p>
                <p>
                    ₹{order.totalAmount}
                </p>
            </div>

            {/* View Order */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                className="button primary full"
            >
                View Order →
            </button>
        </div>
    );
};

export default OrderCard;