

import {Link} from 'react-router-dom'
import {MapPin , Phone , ArrowRight} from "lucide-react"
const OutlerCard = ({outlet}) => {
  return (
    <div className="outlet-card">
        <div className="outlet-image">
            {outlet.image?.url?
            (
                <img src = {outlet.image.url} alt = {outlet.name}/>
            )
            :
            (
                <span>
                    {
                        (outlet.name || "O").slice(0,1)
                    }
                </span>
            )
        }
        </div>
        <div className="outlet-card-body">
            <div className="row-between">
                <h3>
                    {
                        outlet.name
                    }
                </h3>
                <span className={`badge${outlet.status === "inactive"?"gray":""}`}>
                    {
                        outlet.status || "active"
                    }
                </span>
            </div>
            <p>
                {
                    outlet.description || "No description provided."
                }
            </p>
            <div className="mini-meta">
                <span>
                    <MapPin size = {14}/>
                    {
                        outlet.area || outlet.city || "-"
                    }
                </span>
                <span>
                    <Phone size = {14}/>
                    {
                        outlet.phone || "_"
                    }
                </span>
            </div>
            <Link className="text-link" to = {`/outlet/${outlet._id}`}>
            View Outlet <ArrowRight size = {16}/>
            </Link>
        </div>
    </div>
  )
}

export default OutlerCard