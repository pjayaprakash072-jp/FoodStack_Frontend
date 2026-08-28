import { useState,useEffect } from "react"
import { Link ,useSearchParams } from "react-router-dom"
import Loader from "../../components/Common/Loader"
import SearchBar from "../../components/Common/SearchBar"
import ConfirmDialog from "../../components/Common/ConfirmDialog"
import menuItemService from "../../services/menuItemService"
import { getErrorMessage } from "../../utils/api"
import { Plus,Pencil ,Trash2 ,ArrowRight} from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const MenuItemList = () => {
    const {vendor} = useAuth();
    const [items,setItems] = useState([]);
    const [params] = useSearchParams();
    const categoryFilter = params.get("category")
    const [busy,setBusy] = useState(true);
    const [error,setError] = useState("")
    const [del,setDel] = useState(null);
    const [search,setSearch] = useState("");

    useEffect(()=>{
        (async ()=>{
            try {
                const menuitems = categoryFilter ? await menuItemService.byCategory(categoryFilter): await menuItemService.byVendor(vendor?._id)
                setItems(menuitems.menuItems)
            } catch (error) {
                setError(getErrorMessage(error))
            }finally{
                setBusy(false);
            }
        })();
    //     (async()=>{
    //                 menuItemService.byVendor(vendor?._id)
    //     .then((r)=>setItems(r.menuItems))
    //     .catch((err)=>setError(getErrorMessage(err)))
    //     .finally(()=>setBusy(false))
    // })();
    }
    ,[vendor,categoryFilter])

    const remove = ()=>{
        setBusy(true)
        menuItemService.remove(del).then(()=>{
            setItems(items.filter((item)=>item._id !== del))
        }).catch((err)=>{
            setError(getErrorMessage(err))
        }).finally(()=>{
            setBusy(false)
            setDel(null)
        })
    }

    const filtered = items.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
        <div className="page-heading">
            <div>
                <p className="eyebrow">Products</p>
                <h1>Menu Items</h1>
                <p>Manage Pricing, Stock, availability and preparation time</p>
            </div>
                <Link to="/menu-item/new" className="button primary">
                    <Plus size={18}/> Add Menu Item
                </Link>
            </div>
            {error && <div className="error">{error}</div>}
            <div className="toolbar">
                <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search Menu Items by name ...."
                />
                
            </div>
            {
                busy? (
                    <Loader/>
                ):(
                    <div className="panel table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <td>Item</td>
                                    <td>Image</td>
                                    <td>Price</td>
                                    <td>Stock</td>
                                    <td>Food</td>
                                    <td>Status</td>
                                    <td>Details</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filtered.map((item)=>(
                                        <tr key={item._id}>
                                            <td>
                                                <b>{item.name}</b>
                                            </td>
                                            <td>
                                                {
                                                    item.image?.url ? (
                                                        <img src={item.image.url} alt={item.name} style={{width :"50px", height:"50px",objectFit:"cover",border:"8px",borderRadius:"50%"}} />
                                                    ):(
                                                        <span>No Image</span>
                                                    )
                                                }
                                            </td>
                                            <td>
                                                ₹{Number(item.price || 0 ).toFixed(2)}
                                            </td>
                                            <td>
                                                {item.stock}
                                            </td>
                                            <td>
                                                {item.foodType}
                                            </td>
                                            <td>
                                                <span className={`badge ${item.status === "Inactive" ? "gray" : ""}`}>{item.status}</span>
                                            </td>
                                            <td>
                                                <Link className="text-link" to={`/menu-item/${item._id}`}><ArrowRight size={16}/></Link>
                                            </td>
                                            <td>
                                                <div className="button-row">
                                                    <Link className="icon-button" to= {`/menu-item/${item._id}/edit`}><Pencil size={18}/></Link>
                                                    <button className="icon-button danger-icon" onClick={()=>setDel(item._id)}> <Trash2 size={18}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            !filtered.length && (
                                <div className="table-empty">
                                    No Menu Items Found
                                </div>
                            )
                        }
                    </div>
                )
            }
        <ConfirmDialog
        open = {del}
        onCancel={()=>setDel(false)}
        onConfirm={remove}
        />
    </>
  )
}

export default MenuItemList