import {Link, useNavigate, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import categoryService from '../../services/categoryService';
import menuItemService from '../../services/menuItemService';
import Loader from '../../components/Common/Loader';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { Pencil, Trash2 } from 'lucide-react';
import { getErrorMessage } from '../../utils/api';
import useManagerContext from '../../context/useManagerContext';
import managerService from '../../services/managerService';
import { useAuth } from '../../context/useAuth';

const CategoryDetails = () => {
    const {id} = useParams();
    const {isManagerAuthenticated} = useManagerContext();
    const {isAuthenticated} = useAuth();
    const [error,setError] = useState("");
    const [category,setCategory] = useState(null);
    const [busy,setBusy] = useState(true);
    const [items,setItems] = useState([]);
    const [del,setDel] = useState(false);
    const nav = useNavigate();

    useEffect(
        ()=>{
            (async ()=>{
                try{
                    if(isManagerAuthenticated){
                        const [a,b] = await Promise.all([
                            managerService.getCategoryById(id),
                            managerService.getItemsByCategory(id)
                        ])
                        setCategory(a.menuCategory);
                        setItems(b.menuItems);
                    }
                    if(isAuthenticated){
                        const [a,b] = await Promise.all([
                            categoryService.getOne(id),
                            menuItemService.byCategory(id)
                        ])
                        setCategory(a.menuCategory);
                        setItems(b.menuItems);
                    }
                }catch(error){
                    setError(getErrorMessage(error))
                }
                finally{
                    setBusy(false);
                }
            })();
        },[id,isManagerAuthenticated,isAuthenticated]
    )

    const remove = async()=>{
        try{
            if(isAuthenticated){
                await categoryService.remove(id);
                nav("/categories")   
            }
            if(isManagerAuthenticated){
                await managerService.deleteCategory(id);
                nav(`/categories?outlet=${category?.outlet?._id}`)
            }
        }catch(error){
            setError(getErrorMessage(error))
        }finally{
            setDel(false)
    }
}

if(busy) return <Loader/>
if(!category){
    return <div className='alert error'>{error || "Category not found"}</div>
}
  return (
    <div className="page-container">
        {/* Header */}
        <div className="content-header">
        <div>
            <p className="content-eyebrow">Category Details</p>
            <h1 className="content-title">{category.name}</h1>
            <p className="content-description">{category.description}</p>
        </div>

        <div className="category-actions">
            <Link
            className="secondary-button"
            to={`/categories/${id}/edit`}
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

        {error && <div className="message-error">{error}</div>}

        {/* Content */}
        <div className="content-body">
        <div className="category-details-grid">
            <div className="details-container">
            <h3 className="section-title">Information</h3>

            <Detail
                label="Outlet"
                value={category.outlet?.name || "-"}
            />

            <Detail
                label="Category"
                value={category.name}
            />

            <Detail
                label="Description"
                value={category.description || "-"}
            />

            <Detail
                label="Display Order"
                value={category.displayOrder}
            />

            <Detail
                label="Active"
                value={category.isActive ? "Yes" : "No"}
            />
            </div>

            <div className="details-container category-summary-card">
            <h2 className="section-title">Category Summary</h2>

            <div className="category-item-count">
                <p>Menu Items</p>
                <h1>{items.length}</h1>
            </div>

            <Link
                className="primary-button"
                to={`/menu-items?category=${id}`}
            >
                Manage Menu Items
            </Link>
            </div>
        </div>
        </div>

        <ConfirmDialog
        open={del}
        setOpen={setDel}
        onCancel={() => setDel(false)}
        onConfirm={remove}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        />
    </div>
  )
}

export default CategoryDetails

const Detail = ({ label, value }) => (
  <div className="detail-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);