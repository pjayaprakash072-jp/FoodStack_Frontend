
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
                <span className={`badge ${menuCategory.status === "inactive" ? "gray" : ""}`}>
                    {
                        menuCategory.status || "active"
                    }
                </span>
            </div>
            <p>
                {
                    menuCategory.description || "No description provided."
                }
            </p>
            <div className="mini-meta">
                <span>
                    <FileText size = {14}/>
                    {
                        menuCategory.description || "-"
                    }
                </span>
                <span>
                    <ListOrdered size = {14}/>
                    {
                        menuCategory.menuItems.length || "-"
                    }
                </span>
            </div>
            <Link className="text-link" to = {`/categoires/${menuCategory._id}`}>
            View Category <ArrowRight size = {16}/>
            </Link>
        </div>
    </div>
  )
}

export default CategoryCard