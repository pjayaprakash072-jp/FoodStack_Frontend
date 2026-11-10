import { useState,useEffect } from "react"
import { Link ,useSearchParams } from "react-router-dom"
import SearchBar from "../../components/Common/SearchBar"
import ConfirmDialog from "../../components/Common/ConfirmDialog"
import menuItemService from "../../services/menuItemService"
import { getErrorMessage } from "../../utils/api"
import { Plus,Pencil ,Trash2 ,ArrowRight,ArrowLeft} from "lucide-react"
import { useAuth } from "../../context/useAuth"
import categoryService from "../../services/categoryService"
import EmptyState from "../../components/Common/EmptyState"
import useManagerContext from "../../context/useManagerContext"
import managerService from "../../services/managerService"
import MenuItemTableSkeleton from "../../components/Skeletons/MenuItemTableSkeleton"


const MenuItemList = () => {
    const {vendor,isAuthenticated} = useAuth();
    const {isManagerAuthenticated,manager} = useManagerContext();
    const [items,setItems] = useState([]);
    const [categories,setCategories] = useState([]);
    const [params] = useSearchParams();
    const categoryFilter = params.get("category")
    const outletFilter = params.get("outlet")
    const [busy,setBusy] = useState(true);
    const [error,setError] = useState("")
    const [del,setDel] = useState(null);
    const [search,setSearch] = useState("");
    const isManager = isManagerAuthenticated && ! isAuthenticated;
    const isVendor =isAuthenticated && !isManagerAuthenticated;
    const selectedCategory = (isManagerAuthenticated && categoryFilter) ? categories : categories.find((c)=>c._id === categoryFilter)

    useEffect(()=>{
        // if(!vendor?._id) return;
        (async ()=>{
            try {
                if(isVendor){
                    const [i,c] = await Promise.all(
                        [
                        outletFilter ? menuItemService.byOutlet(outletFilter) : categoryFilter? menuItemService.byCategory(categoryFilter):menuItemService.byVendor(vendor?._id)
                            ,
                        outletFilter? categoryService.byOutlet(outletFilter) : categoryService.byVendor(vendor?._id)
                        ]
                    )
                    setItems(i?.menuItems)
                    setCategories(Array.isArray(c?.menuCategories)?c?.menuCategories:[])
                }
                if(isManager ){
                    const [i,c] = await Promise.all(
                        [
                            categoryFilter ? managerService.getItemsByCategory(categoryFilter) : managerService.getAllItems(),
                            categoryFilter ? managerService.getCategoryById(categoryFilter) : managerService.getAllCategories()
                        ]
                    )
                    setItems(i?.menuItems || []);
                    setCategories(Array.isArray(c?.menuCategories)? c?.menuCategories :c?.menuCategory ? [c?.menuCategory]: [])
                }
            } catch (error) {
                setError(getErrorMessage(error))
            }finally{
                setBusy(false);
            }
        })();
    }
    ,[vendor,categoryFilter,outletFilter,isAuthenticated,isManagerAuthenticated])

    const remove = async()=>{
        setBusy(true);
        try{
            if(isVendor){
                await menuItemService.remove(del);
            }
            if(isManager){
                await managerService.deleteItem(del);
            }
            setItems(items.filter((item)=> item._id !== del));   
        }catch(error){
            setError(getErrorMessage(error));
        }finally{
            setBusy(false);
            setDel(null);
        }
    }

    const filtered = items.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase()))

    const addMenuItemUrl = categoryFilter? `/menu-item/new?category=${categoryFilter}` : "/menu-item/new"
  return (
    <div className="page-container">
        <div className="content-header">
        <div>
            <p className="content-eyebrow">Products</p>

            <h1 className="content-title">
            {categoryFilter
                ? `${selectedCategory?.name || "Category"} Menu Items`
                : "Menu Items"}
            </h1>

            <p className="content-description">
            {categoryFilter
                ? `Manage menu items for ${selectedCategory?.name || "This Category"}`
                : "Manage pricing, stock, availability and preparation time"}
            </p>
        </div>

        <div className="menu-item-actions">
            {categoryFilter && (
            <Link
                className="secondary-button"
                to={
                isManagerAuthenticated
                    ? `/menu-items?outlet=${manager?.outlet?._id}`
                    : "/menu-items"
                }
            >
                <ArrowLeft size={19} />
                All Menu Items
            </Link>
            )}

            <Link className="primary-button" to={addMenuItemUrl}>
            <Plus size={18} />
            Add Menu Item
            </Link>
        </div>
        </div>

        {error && <div className="message-error">{error}</div>}

        <div className="menu-items-toolbar">
        <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Menu Items by name..."
        />

        <span className="outlet-count">
            {filtered.length} Menu Items
        </span>
        </div>

        {busy ? (
        <MenuItemTableSkeleton />
        ) : filtered.length ? (
        <div className="menu-items-table-container">
            <div className="menu-items-table-scroll">
            <table className="menu-items-table">
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Food</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {filtered.map((item) => (
                    <tr key={item._id}>
                    <td>
                        <strong>{item.name}</strong>
                    </td>

                    <td>
                        {item.image?.url ? (
                        <img
                            className="menu-items-table-image"
                            src={item.image.url}
                            alt={item.name}
                        />
                        ) : (
                        <span className="table-image-empty">No Image</span>
                        )}
                    </td>

                    <td>
                        ₹{Number(item.price || 0).toFixed(2)}
                    </td>

                    <td>{item.stock}</td>

                    <td className="capitalize">{item.foodType}</td>

                    <td>
                        <span
                        className={`menu-item-status ${
                            item.status === "Inactive"
                            ? "menu-item-status-inactive"
                            : "menu-item-status-active"
                        }`}
                        >
                        {item.status}
                        </span>
                    </td>

                    <td>
                        <Link
                        className="menu-item-view-link"
                        to={`/menu-item/${item._id}`}
                        >
                        <ArrowRight size={16} />
                        </Link>
                    </td>

                    <td>
                        <div className="menu-item-table-actions">
                        <Link
                            className="menu-item-icon-button"
                            to={`/menu-item/${item._id}/edit`}
                            aria-label={`Edit ${item.name}`}
                        >
                            <Pencil size={18} />
                        </Link>

                        <button
                            className="menu-item-icon-button menu-item-delete-button"
                            onClick={() => setDel(item._id)}
                            aria-label={`Delete ${item.name}`}
                        >
                            <Trash2 size={18} />
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        ) : (
        <EmptyState
            title={
            categoryFilter
                ? `No menu items for ${selectedCategory?.name || "this category"}`
                : "No menu items found"
            }
            text={
            search
                ? "Try a different search"
                : "Create your first menu item"
            }
            action={
            <Link className="primary-button" to={addMenuItemUrl}>
                <Plus size={19} />
                Add Menu Item
            </Link>
            }
        />
        )}

        <ConfirmDialog
        open={del}
        onCancel={() => setDel(null)}
        onConfirm={remove}
        />
    </div>
  )
}

export default MenuItemList