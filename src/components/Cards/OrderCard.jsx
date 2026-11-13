const OrderCard = ({ order, onClick,single }) => {
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
    onClick={!single ? onClick : undefined}
    className={`order-container ${
        !single ? "cursor-pointer p-3 md:p-5" : "md:p-0"
    }`}
    >
    {/* Header */}
    <div className="order-header">
        <h3>Order #{orderId}</h3>

        <span className="order-status">
        <span className="order-status-indicator"></span>
        {order.orderStatus}
        </span>
    </div>

    {/* Date */}
    <p className="order-date">{date}</p>

    <div className="order-divider"></div>

    {/* Customer */}
    <div className="order-customer">
        <span>👤</span>

        <div>
        <p className="order-customer-name">
            {order.user?.name || "Customer"}
        </p>

        <p className="order-customer-phone">
            📞 {order?.user?.phone || "+1234567890"}
        </p>
        </div>
    </div>

    {/* Address */}
    <div className="order-address">
        <span>📍</span>
        <p>{(order.deliveryAddress).split(",").slice(3).join(",")}</p>
    </div>

    {!single && (
        <>
        {/* Order Summary */}
        <div className="order-summary">
            <p>{order.items?.length || 0} items</p>

            <p>
            {order.paymentMethod} <span>•</span>{" "}
            <span
                className={
                order.paymentStatus === "paid"
                    ? "text-success"
                    : "text-danger"
                }
            >
                {order.paymentStatus}
            </span>
            </p>
        </div>

        <div className="order-divider"></div>

        {/* Total */}
        <div className="order-total">
            <p>Total</p>
            <p>₹{order.totalAmount}</p>
        </div>

        {/* View Order */}
        <button
            onClick={(e) => {
            e.stopPropagation();
            onClick?.();
            }}
            className="primary-button full-width"
        >
            View Order <span>→</span>
        </button>
        </>
    )}
    </div>
    );
};

export default OrderCard;