
import {Link} from 'react-router-dom'
import {ListOrdered , ArrowRight} from "lucide-react"
const CategoryCard = ({menuCategory}) => {
  return (
        <div className="category-container">
        <div className="category-image">
            {menuCategory.image?.url ? (
            <img
                src={menuCategory.image.url}
                alt={menuCategory.name}
            />
            ) : (
            <span>
                {(menuCategory.name || "C").slice(0, 1)}
            </span>
            )}
        </div>

        <div className="category-content">
            <div className="category-header">
            <h3>{menuCategory.name}</h3>

            <span
                className={`category-status ${
                menuCategory.isActive
                    ? "category-status-active"
                    : "category-status-inactive"
                }`}
            >
                {menuCategory.isActive ? "Active" : "Inactive"}
            </span>
            </div>

            <p className="category-description">
            {menuCategory.description || "No description provided."}
            </p>

            <div className="category-meta">
            <span>
                <ListOrdered size={14} />
                {menuCategory.menuItems?.length || 0} Menu Items
            </span>
            </div>

            <Link
            className="category-view-link"
            to={`/categories/${menuCategory._id}`}
            >
            View Category <ArrowRight size={16} />
            </Link>
        </div>
        </div>
  )
}

export default CategoryCard