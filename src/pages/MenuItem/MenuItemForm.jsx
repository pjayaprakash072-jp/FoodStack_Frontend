



import { useEffect, useState } from "react"
import { useNavigate,useParams, useSearchParams } from "react-router-dom"
import menuItemService from "../../services/menuItemService"
import { getErrorMessage } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"
import Loader from "../../components/Common/Loader"
import categoryService from "../../services/categoryService"
const intial = {
    name:"",
    description:"",
    price:0,
    stock:0,
    discount:0,
    foodType:"",
    preparationTime:0,
    isAvailable:true,
    status:"Active",
    image:{url:"",public_id:""},
    outlet:"",
    category:""
}
const MenuItemForm = () => {

  const {id} = useParams();
  const {vendor} = useAuth();
  const [busy,setBusy] = useState(false);
  const [params] = useSearchParams();
  const [loading,setLoading] = useState(false);
  const [formData,setFormData] = useState(intial);
  const [categories,setCategories] = useState([]);
  const [error,setError] = useState("");
  const nav = useNavigate();



  useEffect(()=>{
    (async ()=>{
      try{ // createing item from global.
        const c = await  categoryService.byVendor(vendor?.id || vendor?._id);
      
        setCategories(Array.isArray(c)? c :c?.menuCategories || [])
        if(id){
          const menuitem = await menuItemService.getOne(id);// editing the item.
        

          setFormData({...formData, ...menuitem.menuItem , category:menuitem.menuItem.category?._id})
        }else if(params.get("category")) setFormData({...formData,category:params.get("category")})// creating item for a particular category.
      }catch(error){
        setError(getErrorMessage(error))
      }finally{
        setLoading(false)
      }
      })();
    },[id,vendor?.id])

  const submit = async(e)=>{
    e.preventDefault();
    setBusy(true);
    try{
      const {category,...payload} = formData;

      if(id){
        await menuItemService.update(id,payload);
      }else{
        await menuItemService.create(category,payload);
      }
      nav("/menu-items");
    }catch(error){
      setError(getErrorMessage(error));
    }finally{
      setBusy(false);
    }
  }
  if(loading) return <Loader/>
  return (
    <div className="form-page">
      <div className="page-heading">
        <div>
            <p className="eyebrow">Menu</p>
            <h1>{id?"Edit Menu Item" : "Create Menu Item"}</h1>
        </div>
      </div>
      {error && <div className="alert error" >{error}</div>}
      <form className="panel form grid-2" onSubmit={submit}>
        <label>
          Name
          <input
          required
          value={formData.name}
          onChange={(e)=>{ setFormData({...formData,name:e.target.value})}}
          />
        </label>
        <label className="grid-span-2">
          Description
          <input
          required
          value={formData.description}
          onChange={(e)=>{ setFormData({...formData,description:e.target.value})}}
          />
        </label>
        <label>
          Category
          <select
          required
          value={formData.category}
          disabled = {Boolean(id)}
          onChange={(e)=>{ setFormData({...formData,category:e.target.value})}}
          >
            <option value="">Select Category</option>
            {
              categories.map((x)=>(
                <option key={x._id} value={x._id}>{x.name}</option>
              ))
            }
          </select>
        </label>
        <label>
          Price
          <input
          type="number"
          min={0}
          required
          value={formData.price}
          onChange={(e)=>{ setFormData({...formData,price:Number(e.target.value || 0 )})}}
          />
        </label>
        <label>
          Stock
          <input
          type="number"
          min={0}
          required
          value={formData.stock}
          onChange={(e)=>{ setFormData({...formData,stock:Number(e.target.value || 0 )})}}
          />
        </label>
        <label>
          Discount
          <input
          type="number"
          required
          min={0}
          max={100}
          value={formData.discount}
          onChange={(e)=>{ setFormData({...formData,discount:Number(e.target.value || 0 )})}}
          />
        </label>
        <label>
          Food Type
          <select
          required
          value={formData.foodType}
          onChange={(e)=>{ setFormData({...formData,foodType:e.target.value})}}
          >
            <option value="">Select Food Type</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </label>
        <label>
          Preparation Time
          <input
          type="number"
          required
          min={0}

          value={formData.preparationTime}
          onChange={(e)=>{ setFormData({...formData,preparationTime:Number(e.target.value || 0 )})}}
          />
        </label>
        <label className="check">
          Is Available
          <input
          type="checkbox"
          checked={formData.isAvailable}
          onChange={(e)=>{ setFormData({...formData,isAvailable:e.target.checked})}}
          />
        </label>
        <label>
          Status
          <select
          required
          value={formData.status}
          onChange={(e)=>{ setFormData({...formData,status:e.target.value})}}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <label>
          Image
          <input
          type="file"
          accept="image/*"
          onChange={(e)=>{ setFormData({...formData,image:e.target.files[0]})}}
          />
        </label>
        <div className="grid-span-2 form-actions">
          <button className="button secondary" type="button" onClick={()=> nav("/menu-itmes")}> cancel</button>
          <button type="submit" className="button primary" disabled={busy}>
            {busy ? "Please Wait..." : id?"Update Item" :"Create Item"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MenuItemForm