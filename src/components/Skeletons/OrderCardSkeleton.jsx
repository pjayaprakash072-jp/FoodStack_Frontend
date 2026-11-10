import Skeleton from "../Common/Skeleton";

const OrderCardSkeleton = () => {
  return (
    <div className="order-container flex flex-col gap-4">
      {/* Header: Order ID and Status */}
      <div className="order-header">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Date */}
      <Skeleton className="h-3 w-36" />

      <div className="order-divider" />

      {/* Customer */}
      <div className="order-customer">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Delivery Address */}
      <div className="order-address">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="order-divider" />

      {/* Total */}
      <div className="order-total">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* View Order Button */}
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
};

export default OrderCardSkeleton;