import Skeleton from "../Common/Skeleton";
import OutletSkeleton from "./OutletSkeleton";


const DashboardSkeleton = () => {
    return (
        <div className="page-container">

            {/* HEADER SKELETON */}
            <header className="content-header">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-56 sm:w-72" />
                    <Skeleton className="h-4 w-64 sm:w-80" />
                </div>

                <Skeleton className="h-11 w-32 rounded-lg" />
            </header>

            <div className="content-body">

                {/* STATISTICS SKELETON */}
                <section className="statistics-grid">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="statistics-card"
                        >
                            <div className="statistics-content w-full">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="mt-2 h-7 w-16" />
                                <Skeleton className="mt-1 h-3 w-28" />
                            </div>

                            <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
                        </div>
                    ))}
                </section>

            </div>

            {/* RECENT OUTLETS SKELETON */}
            <section className="content-section">

                <div className="section-header">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-36" />
                        <Skeleton className="h-4 w-48" />
                    </div>

                    <Skeleton className="h-4 w-16" />
                </div>

                <div className="outlet-grid">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <OutletSkeleton key={index} />
                    ))}
                </div>

            </section>

        </div>
    );
};

export default DashboardSkeleton;
