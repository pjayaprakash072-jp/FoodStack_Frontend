
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  ArrowRight,
  ListOrdered,
} from "lucide-react";

const OutletCard = ({ outlet }) => {
  return (
    <article className="outlet-container">

      {/* OUTLET IMAGE */}
      <div className="outlet-image">
        {outlet.image?.url ? (
          <img
            src={outlet.image.url}
            alt={outlet.name}
          />
        ) : (
          <span>
            {(outlet.name || "O").slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      {/* OUTLET DETAILS */}
      <div className="outlet-content">

        {/* NAME AND STATUS */}
        <div className="outlet-header">
          <h3>{outlet.name}</h3>

          <span
            className={`outlet-status ${
              outlet.status === "inactive"
                ? "outlet-status-inactive"
                : "outlet-status-active"
            }`}
          >
            {outlet.status || "active"}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="outlet-description">
          {outlet.description || "No description provided."}
        </p>

        {/* OUTLET INFORMATION */}
        <div className="outlet-meta">

          <span>
            <ListOrdered size={15} />
            {outlet.menuCategories?.length || 0} Categories
          </span>

          <span>
            <MapPin size={15} />
            {outlet.area || outlet.city || "-"}
          </span>

          <span>
            <Phone size={15} />
            {outlet.phone || "-"}
          </span>

        </div>

        {/* VIEW OUTLET */}
        <Link
          className="outlet-view-link"
          to={`/outlets/${outlet._id}`}
        >
          View Outlet
          <ArrowRight size={16} />
        </Link>

      </div>
    </article>
  );
};

export default OutletCard;
