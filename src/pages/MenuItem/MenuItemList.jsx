import { useState,useEffect } from "react"
import { Link ,useSearchParams } from "react-router-dom"
import Loader from "../../components/Common/Loader"
import SearchBar from "../../components/Common/SearchBar"
import ConfirmDialog from "../../components/Common/ConfirmDialog"
import menuItemService from "../../services/menuItemService"
import { getErrorMessage } from "../../utils/api"
import { Plus,Pencil ,Trash2 ,ArrowRight,ArrowLeft} from "lucide-react"
import { useAuth } from "../../context/useAuth"
import categoryService from "../../services/categoryService"
import EmptyState from "../../components/Common/EmptyState"

const MenuItemList = () => {
    const {vendor} = useAuth();
    const [items,setItems] = useState([]);
    const [categories,setCategories] = useState([]);
    const [params] = useSearchParams();
    const categoryFilter = params.get("category")
    const [busy,setBusy] = useState(true);
    const [error,setError] = useState("")
    const [del,setDel] = useState(null);
    const [search,setSearch] = useState("");

    const selectedCategory = categories.find((c)=>c._id === categoryFilter)

    useEffect(()=>{
        if(!vendor?._id) return;
        (async ()=>{
            try {
                const [i,c] = await Promise.all(
                    [
                        categoryFilter? menuItemService.byCategory(categoryFilter):menuItemService.byVendor(vendor?._id)
                        ,
                        categoryService.byVendor(vendor?._id)
                    ]
                )
                // const menuitems = categoryFilter ? await menuItemService.byCategory(categoryFilter): await menuItemService.byVendor(vendor?._id)
                setItems(i?.menuItems)
                setCategories(c?.menuCategories)
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

    const addMenuItemUrl = categoryFilter? `/menu-item/new?category=${categoryFilter}` : "/menu-item/new"
  return (
    <>
        <div className="page-heading">
            <div>
                <p className="eyebrow">Products</p>
                <h1>{categoryFilter? `${selectedCategory?.name || "Category"} Menu Items`:"Menu Items"}</h1>
                <p>{
                    categoryFilter? `Manage menu items  for ${selectedCategory?.name || "This Category"} `: "Manage Pricing, Stock, availability and preparation time"}
                </p>
            </div>
            <div className="button-row">
                {
                    categoryFilter && (
                        <Link className="button secondary"  to="/menu-items"><ArrowLeft size={19}/> All menu items</Link>
                    )
                }
                <Link className="button primary"  to ={addMenuItemUrl}><Plus size={18}/> Add Menu Item </Link>
            </div>
                {/* <Link 
                    className="button primary"
                    to={
                        categoryFilter? `/menu-item/new?category=${categoryFilter}` : "/menu-item/new"
                    } 
                    >
                    <Plus size={18}/> Add Menu Item
                </Link> */}
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
                ):filtered.length ?(
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
                ):(
                    <EmptyState
                    title={
                        categoryFilter?
                        `No menu items for ${selectedCategory.name ||"this category"}` :"No menu tems found"
                    }
                    text={
                        search ? "try differnct search" : "Create your first menu item"
                    }
                    action={
                        <Link className="button primary" to={addMenuItemUrl}><Plus size={19}/> Add menu Item</Link>
                    }
                    />
                )
            }
        <ConfirmDialog
        open = {del}
        onCancel={()=>setDel(null)}
        onConfirm={remove}
        />
    </>
  )
}

export default MenuItemList