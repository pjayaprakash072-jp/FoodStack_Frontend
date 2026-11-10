import Skeleton from "../Common/Skeleton";

const MenuItemTableSkeleton = ({ rows = 4 }) => {
  return (
    <div className="menu-items-table-container">
      <div className="menu-items-table-scroll">
        <table className="menu-items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Image</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Food</th>
              <th>Status</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index}>
                {/* Item name */}
                <td>
                  <Skeleton className="h-4 w-28" />
                </td>

                {/* Image */}
                <td>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </td>

                {/* Price */}
                <td>
                  <Skeleton className="h-4 w-16" />
                </td>

                {/* Stock */}
                <td>
                  <Skeleton className="h-4 w-10" />
                </td>

                {/* Food type */}
                <td>
                  <Skeleton className="h-4 w-16" />
                </td>

                {/* Status */}
                <td>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>

                {/* Details */}
                <td>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </td>

                {/* Actions */}
                <td>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuItemTableSkeleton;