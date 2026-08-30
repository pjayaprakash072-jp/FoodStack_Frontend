import { useEffect, useState } from "react"
import { useNavigate,useParams, useSearchParams } from "react-router-dom"
import menuItemService from "../../services/menuItemService"
import { getErrorMessage } from "../../utils/api"
import { useAuth } from "../../context/useAuth"
import Loader from "../../components/Common/Loader"
import categoryService from "../../services/categoryService"
import {toast} from 'sonner'
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
    image:null,
    outlet:"",
    category:""
}
const MenuItemForm = () => {

  const {id} = useParams();
  const {vendor} = useAuth();
  const [busy,setBusy] = useState(false);
  const [params] = useSearchParams();
  const [loading,setLoading] = useState(Boolean(id));
  const [form,setForm] = useState(intial);
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
        

          setForm({
            ...form, 
            ...menuitem.menuItem,
            outlet:menuitem.menuItem.outlet?._id  || menuitem.menuItem.outlet || "",
            category:menuitem.menuItem.category?._id || menuitem.menuItem.category || "",
            image:null })
        }else if(params.get("category")) {

          setForm((prev)=>({
            ...prev,

            category:params.get("category")
          })
          )// creating item for a particular category.
        }
      }catch(error){
        setError(getErrorMessage(error))
      }finally{
        setLoading(false)
      }
      })();
    },[id,vendor]);

    const change = (e)=>{
        const {name,type, value, checked,files} = e.target;

        setForm(
                (prev)=>({
                          ...prev,
                          [name]: type === "checkbox" ? checked : type === "file" ?files[0]: value
                        }
                )
        )
    }

  const submit = async(e)=>{
    e.preventDefault();
    setBusy(true);
    try{
      const {category,...payload} = form;
      const formData = new FormData();
      Object.entries(payload).forEach(([key,value])=>{
        if(value !== null && value !== undefined){
          formData.append(key,value);
        }
      });
            const toastMsg = id? "MenuItem Updated successfully!" : "MenuItem Created successfully!"
      if(id){
        await menuItemService.update(id,formData);
        toast.success(toastMsg)
        nav("/menu-items");
      }else{
        await menuItemService.create(category,formData);
        toast.success(toastMsg)
        nav(`/menu-items?category=${category}`)
      }
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
          type="text"
          name="name"
          required
          value={form.name}
          onChange={change}
          />
        </label>
        <label className="grid-span-2">
          Description
          <input
          type="text"
          name="description"
          required
          value={form.description}
          onChange={change}
          />
        </label>
        <label>
          Category
          <select
          required
          name="category"
          value={form.category}
          disabled = {Boolean(id) || Boolean(params.get("category"))}
          onChange={change}
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
          name="price"
          min={0}
          required
          value={form.price}
          onChange={change}
          />
        </label>
        <label>
          Stock
          <input
          type="number"
          name="stock"
          min={0}
          required
          value={form.stock}
          onChange={change}
          />
        </label>
        <label>
          Discount
          <input
          type="number"
          required
          name="discount"
          min={0}
          max={100}
          value={form.discount}
          onChange={change}
          />
        </label>
        <label>
          Food Type
          <select
          required
          name="foodType"
          value={form.foodType}
          onChange={change}
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
          name="preparationTime"
          value={form.preparationTime}
          onChange={change}
          />
        </label>
        <label className="check">
          Is Available
          <input
          type="checkbox"
          name="isAvailable"
          checked={form.isAvailable}
          onChange={change}
          />
        </label>
        <label>
          Status
          <select
          required
          name="status"
          value={form.status}
          onChange={change}
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
          name="image"
          accept="image/*"
          onChange={change}
          />
        </label>
        <div className="grid-span-2 form-actions">
          <button className="button secondary" type="button" onClick={()=> nav("/menu-items")}> cancel</button>
          <button type="submit" className="button primary" disabled={busy}>
            {busy ? "Please Wait..." : id?"Update Item" :"Create Item"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MenuItemForm