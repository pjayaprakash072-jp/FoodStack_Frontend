import { useState,useEffect } from "react"
import {Link , useNavigate, useParams} from 'react-router-dom'
import outletService from "../../services/outletService"
import menuItemService from "../../services/menuItemService"
import categoryService from "../../services/categoryService"

import Loader from "../../components/Common/Loader"
import ConfirmDialog from './../../components/Common/ConfirmDialog';
import { Activity, Pencil,Tags,Trash2 } from "lucide-react"

import { getErrorMessage } from "../../utils/api"
import StatCard from "../../components/Cards/StatCard"
import { useAuth } from "../../context/useAuth"
// import useManagerContext from "../../context/useManagerContext"



const OutletDetails = () => {
    
    const {id} = useParams();
    const {isAuthenticated} = useAuth();    
    // const {manager} = useManagerContext();
    const [error,setError] = useState("");
    
    const [outlet,setOutlet] = useState(null);

    const [busy , setBusy] = useState(true);

    const [items,setItems] = useState([]);

    const [cats ,setCats] = useState([]);

    const [del,setDel] = useState(false);

    const nav  = useNavigate();

    const [showDetails,setShowDetails] = useState(false);
    
    useEffect(
        ()=>{
            (async ()=>{
                try{
                    const [a,b,c]  = await Promise.all([
                        outletService.getOne(id),
                        categoryService.byOutlet(id),
                        menuItemService.byOutlet(id),
                    ])

                    setOutlet(a.outlet);

                    setCats(Array.isArray(b)? b : b?.menuCategories || []);

                    setItems(Array.isArray(c)? c: c?.menuItems || [] )
                }catch(error){
                    setError(getErrorMessage(error))
                }
                finally{
                    setBusy(false)
                }
            }
        )();
        },[id]
    )

    const remove = async()=>{
        try{
            await outletService.remove(id);
            nav("/outlets")
        }catch(err){
            setError(getErrorMessage(err))
        }finally{
            setDel(false)
        }
    }

    if(busy) return <Loader/>


    if(!outlet){
        return (
            <div className="alert error">
                {error || "Outler not found"}
            </div>
        )
    }
  return (
    <div className="page-container">
        <div className="content-header">
        <div>
            <p className="content-eyebrow">Outlet Details</p>

            <h1 className="content-title">{outlet.name}</h1>

            <p className="content-description">
            {outlet.area}, {outlet.city}
            </p>
        </div>

        <div className="outlet-details-actions">
            <button
            className="secondary-button"
            onClick={() => setShowDetails(!showDetails)}
            >
            {showDetails ? "Close" : "Details"}
            </button>

            <Link
            className="secondary-button"
            to={`/outlets/${id}/edit`}
            >
            <Pencil size={17} />
            Edit
            </Link>

            {isAuthenticated && (
            <button
                className="danger-button"
                onClick={() => setDel(true)}
            >
                <Trash2 size={17} />
                Delete
            </button>
            )}
        </div>
        </div>

        {error && <div className="message-error">{error}</div>}

        {!showDetails && (
        <div className="statistics-grid">
            <StatCard
            label="Categories"
            value={cats.length || 0}
            hint="Menu groups"
            icon={Tags}
            />

            <StatCard
            label="Menu Items"
            value={items.length || 0}
            hint="Products Listed"
            icon={Tags}
            />

            <StatCard
            label="Status"
            value={outlet?.status || "-"}
            hint="Restaurant Status"
            icon={Activity}
            />
        </div>
        )}

        {showDetails && (
        <div className="outlet-details-grid">
            <div className="details-container">
            <h3 className="section-title">Information</h3>

            <Detail
                label="Description"
                value={outlet.description || "-"}
            />

            <Detail
                label="Phone"
                value={outlet.phone}
            />

            <Detail
                label="Address"
                value={outlet.address}
            />

            <Detail
                label="Cuisine"
                value={(outlet.cuisine || []).join(", ") || "-"}
            />

            <Detail
                label="Food Type"
                value={outlet.foodType}
            />

            <Detail
                label="Hours"
                value={`${outlet.openingTime} - ${outlet.closingTime}`}
            />

            <Detail
                label="Status"
                value={outlet.status}
            />
            </div>

            <div className="details-container outlet-summary-card">
            <h3 className="section-title">Menu Summary</h3>

            <div className="outlet-summary-count">
                <p>Categories</p>
                <h2>{cats.length}</h2>
            </div>

            <div className="outlet-summary-count">
                <p>Menu Items</p>
                <h2>{items.length}</h2>
            </div>

            <Link
                className="primary-button full-width"
                to={`/categories?outlet=${id}`}
            >
                Manage Categories
            </Link>
            </div>
        </div>
        )}

        <ConfirmDialog
        open={del}
        onCancel={() => setDel(false)}
        onConfirm={remove}
        />
    </div>
  )
}

export default OutletDetails
const Detail = ({ label, value }) => {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value ?? "-"}</strong>
    </div>
  );
};
