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
            className="
                w-full
                max-w-md
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition-all duration-200
                cursor-pointer
            "
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Order #{orderId}
                </h3>

                <span
                    className="
                        inline-flex items-center gap-1.5
                        px-3 py-1
                        rounded-full
                        text-xs font-medium
                        bg-yellow-100 text-yellow-700
                        dark:bg-yellow-900/30 dark:text-yellow-400
                    "
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                    {order.orderStatus}
                </span>
            </div>

            {/* Date */}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {date}
            </p>

            <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>

            {/* Customer */}
            <div className="flex items-start gap-3">
                <span className="text-lg">👤</span>

                <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {order.user?.name || "Customer"}
                    </p>

                    {order.user?.phone && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {order.user.phone}
                        </p>
                    )}
                </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 mt-4">
                <span className="text-lg">📍</span>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    {order.deliveryAddress}
                </p>
            </div>

            {/* Order Summary */}
            <div className="flex items-center justify-between mt-5">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {order.items?.length || 0} items
                </p>

                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {order.paymentMethod}{" "}
                    <span className="text-gray-400">•</span>{" "}
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

            <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>

            {/* Total */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                </span>

                <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ₹{order.totalAmount}
                </span>
            </div>

            {/* View Order */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                className="
                    w-full
                    mt-5
                    py-2.5
                    rounded-xl
                    bg-indigo-600
                    hover:bg-indigo-700
                    text-white
                    text-sm
                    font-medium
                    transition-colors
                    duration-200
                "
            >
                View Order →
            </button>
        </div>
    );
};

export default OrderCard;