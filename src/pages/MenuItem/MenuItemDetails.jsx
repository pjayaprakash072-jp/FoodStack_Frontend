
import {Pencil, Trash2} from 'lucide-react'
import Loader from "../../components/Common/Loader"
import { useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import ConfirmDialog from './../../components/Common/ConfirmDialog';
import menuItemService from './../../services/menuItemService';
import { getErrorMessage } from '../../utils/api';

const MenuItemDetails = () => {
  const {id} = useParams();
  const nav = useNavigate();
  const [busy,setBusy] = useState(true)
  const [item , setItem] = useState(null);
  const[del , setDel] = useState(false);
  const [error,setError] = useState("");

  useEffect(
    () => {
      (async()=>{
        try{
          const res = await menuItemService.getOne(id);
          setItem(res.menuItem);
        }catch(err){
          setError(getErrorMessage(err))
        }
        finally{
          setBusy(false);
        }
      })();
    },[id]);

  if(busy) return<Loader/>
  return (
  <div className="page-container">
    {/* Header */}
    <div className="content-header">
      <div>
        <p className="content-eyebrow">Menu Item</p>

        <h1 className="content-title">{item.name}</h1>

        <p className="content-description">
          {item.description || "No Description"}
        </p>
      </div>

      <div className="menu-item-actions">
        <Link
          className="secondary-button"
          to={`/menu-item/${id}/edit`}
        >
          <Pencil size={18} />
          Edit
        </Link>

        <button
          className="danger-button"
          onClick={() => setDel(true)}
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>

    {error && (
      <div className="message-error">
        {error || "Menu Item not found"}
      </div>
    )}

    {/* Details */}
    <div className="content-body">
      <div className="menu-item-details-grid">

        {/* Information */}
        <div className="details-container">
          <h3 className="section-title">Information</h3>

          <Detail
            label="Outlet"
            value={item.outlet?.name || "-"}
          />

          <Detail
            label="Category"
            value={item.category?.name || "-"}
          />

          <Detail
            label="Price"
            value={`₹${item.price}`}
          />

          <Detail
            label="Stock"
            value={item.stock}
          />

          <Detail
            label="Discount"
            value={`${item.discount || 0}%`}
          />

          <Detail
            label="Food Type"
            value={item.foodType}
          />

          <Detail
            label="Preparation Time"
            value={`${item.preparationTime} mins`}
          />

          <Detail
            label="Availability"
            value={item.isAvailable ? "Available" : "Not Available"}
          />

          <Detail
            label="Status"
            value={item.status}
          />
        </div>

        {/* Image */}
        <div className="details-container menu-item-image-container">
          <h3 className="section-title">Menu Item Image</h3>

          {item.image?.url ? (
            <div className="menu-item-image">
              <img
                src={item.image.url}
                alt={item.name}
              />
            </div>
          ) : (
            <div className="menu-item-no-image">
              No Image Available
            </div>
          )}
        </div>

      </div>
    </div>

    {/* Delete Confirmation */}
    <ConfirmDialog
      open={del}
      onCancel={() => setDel(false)}
      onConfirm={async () => {
        await menuItemService.remove(id);
        nav("/menu-items");
      }}
    />
  </div>
  )
}

export default MenuItemDetails

const Detail = ({ label, value }) => {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value ?? "-"}</strong>
    </div>
  );
};