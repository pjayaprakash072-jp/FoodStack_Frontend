import Skeleton from "../Common/Skeleton";

const CategoryCardSkeleton = () => {
  return (
    <div className="category-container">
      {/* Category image */}
      <Skeleton className="h-40 w-full rounded-none" />

      <div className="category-content">
        {/* Name and status */}
        <div className="category-header">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        {/* Menu items count */}
        <div className="category-meta">
          <Skeleton className="h-4 w-28" />
        </div>

        {/* View category link */}
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;