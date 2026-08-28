
import {Link} from 'react-router-dom'
import {FileText , ListOrdered , ArrowRight} from "lucide-react"
const CategoryCard = ({menuCategory}) => {
  return (
    <div className="outlet-card">
        <div className="outlet-image">
            {menuCategory.image?.url?
            (
                <img src = {menuCategory.image.url} alt = {menuCategory.name}/>
            )
            :
            (
                <span>
                    {
                        (menuCategory.name || "C").slice(0,1)
                    }
                </span>
            )
        }
        </div>
        <div className="outlet-card-body">
            <div className="row-between">
                <h3>
                    {
                        menuCategory.name
                    }
                </h3>
                <span className={`badge ${menuCategory.isActive ? "" : "gray"}`}>
                    {
                        menuCategory.isActive ? "Active" : "Inactive"
                    }
                </span>
            </div>
            <p>
                    <FileText size = {14}/>
                                    {
                                            menuCategory.description || "No description provided."
                                        }

            </p>
            <div className="mini-meta">
                <span>
                    <ListOrdered size = {14}/>
                    {
                        menuCategory.menuItems.length || 0
                    }
                </span>
            </div>
            <Link className="text-link" to = {`/categories/${menuCategory._id}`}>
            View Category <ArrowRight size = {16}/>
            </Link>
        </div>
    </div>
  )
}

export default CategoryCard