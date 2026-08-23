import {Link, useNavigate, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import categoryService from '../../services/categoryService';
import menuItemService from '../../services/menuItemService';
import Loader from '../../components/Common/Loader';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { Pencil, Trash2 } from 'lucide-react';
import { getErrorMessage } from '../../utils/api';

const CategoryDetails = () => {
    const {id} = useParams();
    const [error,setError] = useState("");
    const [category,setCategory] = useState(null);
    const [busy,setBusy] = useState(true);
    const [items,setItems] = useState([]);
    const [del,setDel] = useState(false);
    const [outletname, setOutletname] = useState("");
    const nav = useNavigate();

    useEffect(
        ()=>{
            (async ()=>{
                try{
                    const [a,b] = await Promise.all([
                        categoryService.getOne(id),
                        menuItemService.byCategory(id)
                    ])
                    setOutletname(a.menuCategory.outlet.name);
                    setCategory(a.menuCategory);
                    setItems(b.menuItems);
                }catch(error){
                    setError(getErrorMessage(error))
                }
                finally{
                    setBusy(false);
                }
            })();
        },[id]
    )

    const remove = async()=>{
        try{
            await categoryService.remove(id);
            nav("/categories")
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
    <>
    <div className="page-heading">
        <div>
            <p className="eyebrow">Category Details</p>
            <h1>{category.name}</h1>
            <p>{category.description}</p>
        </div>
        <div className="button-row">
            <Link className='button primary' to={`/categories/${id}/edit`}><Pencil size={18}/>Edit</Link>
            <button className='button danger' onClick={()=>setDel(true)}><Trash2 size={18}/>Delete</button>
        </div>
    </div>
    {error && <div className='alert error'>{error}</div>}
    <div className="detials-grid">
        <div className="panel">
            <h3>Information</h3>
            <Detail
            label="Description"
            value={category.description || "-"}
            />
            <Detail
            label="Outlet"
            value={category.name}
            />
            <Detail
            label="displayOrder"
            value={category.displayOrder}
            />
            <Detail
            label="isActive"
            value={category.isActive ? "Yes" : "No"}
            />
            <Detail
            label="Outlet"
            value={outletname}
            />
        </div>
        <div className="panel">
            <h2>Category Summary</h2>
            <div className="big-number">
                {items.length}
            </div>
            <p>Menu Items</p>
        </div>
    </div>
            <ConfirmDialog
            open={del}
            setOpen={setDel}
            onConfirm={remove}
            title="Delete Category"
            message="Are you sure you want to delete this category?"
            />
    </>
  )
}

export default CategoryDetails

const Detail = ({label,value})=>{
    return(
        <div className="detail">
            <span>{label}</span>
            <p>{value}</p>
        </div>
    )
}