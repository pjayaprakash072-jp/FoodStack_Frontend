import Skeleton from "../Common/Skeleton";


const OutletSkeleton = () => {
    return (
        <div className="outlet-skeleton">
            {/* Image */}
            <Skeleton className="outlet-skeleton-image rounded-none" />

            <div className="outlet-skeleton-content">

                {/* Name and Status */}
                <div className="flex justify-between gap-3">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-3 border-t border-border pt-3">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>

                {/* View Button */}
                <Skeleton className="h-5 w-full" />

            </div>
        </div>
    );
};

export default OutletSkeleton;
