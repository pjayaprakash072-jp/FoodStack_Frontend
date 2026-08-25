
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
    <>
    <div className="page-heading">
      <div>
        <p className="eyebrow">Menu Item</p>
        <h1>{item.name}</h1>
        <p>{item.description || "No Description"}</p>
      </div>
      <div className="button-row">
        <Link className="button secondary" to={`/menu-item/${id}/edit`}><Pencil size={18}/>Edit</Link>
        <button className="button danger" onClick={()=>setDel(true)}><Trash2 size={18}/>Delete</button>
      </div>
    </div>
    {error && <div className='alert eror'>{error || "Menu Item not  found"}</div>}
    <div className="details-grid">
      <div className="panel">
          <h3>Information</h3>
          <Detail
          l = "Outlet"
          v = {item.outlet.name}
          />
          <Detail
          l = "Category"
          v = {item.category.name}
          />
          <Detail
          l = "Price"
          v = {`₹${item.price}`}
          />
          <Detail
          l = "Stock"
          v = {item.stock}
          />
          <Detail
          l = "Discount"
          v = {`${item.discount || 0}%`}
          />  
          <Detail
          l = "Food Type"
          v = {item.foodType}
          />
          <Detail
          l = "Preperation time"
          v = {`${item.preparationTime} mins`}
          />
          <Detail
          l = "Availability"
          v = {item.isAvailable ? "Available" : "Not Available"}
          />

          <Detail
          l = "Status"
          v = {item.status}
          />
      </div>
      <div className="panel">
        {
          item.image?.url ? (
            <img src={item.image.url} alt={item.name} style={{borderRadius:"50%", border:"5px solid black" ,marginTop:"50px"}}/>
          ):(
            <span>No Image</span>
          )
        }
      </div>
    </div>
    <ConfirmDialog
    open = {del}
    onCancel={()=>setDel(false)}
    onConfirm={
      async ()=>{
        await menuItemService.remove(id);
        nav("/menu-items");
      }
    }
/>
    </>
  )
}

export default MenuItemDetails

const Detail =({l,v})=>{
  return(
    <div className="detail">
      <span>{l}</span>
      <b>{v}</b>
    </div>
  )
}