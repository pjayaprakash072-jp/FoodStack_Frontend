import { useEffect, useState } from "react"
import { useNavigate,useParams, useSearchParams } from "react-router-dom"
import menuItemService from "../../services/menuItemService"
import { getErrorMessage } from "../../utils/api"
import { useAuth } from "../../context/useAuth"
import Loader from "../../components/Common/Loader"
import categoryService from "../../services/categoryService"
import {toast} from 'sonner'
import managerService from "../../services/managerService"
import useManagerContext from "../../context/useManagerContext"
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
  const {vendor,isAuthenticated} = useAuth();
  const {manager} = useManagerContext();
  const [busy,setBusy] = useState(false);
  const [params] = useSearchParams();
  const [loading,setLoading] = useState(Boolean(id));
  const categoryFilter = params.get("category")
  const [form,setForm] = useState(intial);
  const [categories,setCategories] = useState([]);
  const [error,setError] = useState("");
  const nav = useNavigate();



  useEffect(()=>{
    (async ()=>{
      try{ // createing item from global.
        const c = isAuthenticated ? await  categoryService.byVendor(vendor?.id || vendor?._id): await managerService.getAllCategories();
      
        setCategories(Array.isArray(c)? c :c?.menuCategories || [])
        if(id){
          const menuitem = await menuItemService.getOne(id);// editing the item.
        
          setForm({
            ...form, 
            ...menuitem.menuItem,
            outlet:menuitem.menuItem.outlet?._id  || menuitem.menuItem.outlet || "",
            category:menuitem.menuItem.category?._id || menuitem.menuItem.category || "",
            image:null })
        }else if(categoryFilter) {

          setForm((prev)=>({
            ...prev,

            category:categoryFilter
          })
          )// creating item for a particular category.
        }
      }catch(error){
        setError(getErrorMessage(error))
      }finally{
        setLoading(false)
      }
      })();
    },[id,vendor,isAuthenticated,params]);

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
      // console.log(form);
      const {category,...payload} = form;
      const formData = new FormData();
      Object.entries(payload).forEach(([key,value])=>{
        if(value !== null && value !== undefined){
          formData.append(key,value);
        }
      });
      const toastMsg = id? "MenuItem Updated successfully!" : "MenuItem Created successfully!"

      if(isAuthenticated){
        if(id){
          await menuItemService.update(id,formData);
          toast.success(toastMsg)
          nav("/menu-items");
        }else{
          await menuItemService.create(category,formData);
          toast.success(toastMsg)
          nav( categoryFilter ?`/menu-items?category=${categoryFilter}`: "/menu-items")
        }
      }else {
        if(id){
          await managerService.updateItem(id,formData);
        }else{
          await managerService.createItem(category,formData);
        }
        toast.success(toastMsg)
        nav(categoryFilter ?`/menu-items?category=${categoryFilter}`:`/menu-items?outlet=${manager?.outlet?._id}` )
      }
    }catch(error){
      setError(getErrorMessage(error));
    }finally{
      setBusy(false);
    }
  }
  if(loading) return <Loader/>
  return (
  <div className="page-container">
    <header className="content-header">
      <div>
        <p className="content-eyebrow">Menu Management</p>
        <h1 className="content-title">
          {id ? "Edit Menu Item" : "Create Menu Item"}
        </h1>
        <p className="content-description">
          Add and manage your outlet's food items.
        </p>
      </div>
    </header>

    <div className="content-body">
      {error && <div className="message-error">{error}</div>}

      <form className="form-container form-grid" onSubmit={submit}>
        <label className="form-field">
          Name
          <input
            className="form-input"
            type="text"
            name="name"
            required
            value={form.name}
            onChange={change}
          />
        </label>

        <label className="form-field form-full-width">
          Description
          <input
            className="form-input"
            type="text"
            name="description"
            required
            value={form.description}
            onChange={change}
          />
        </label>

        <label className="form-field">
          Category
          <select
            className="form-select"
            required
            name="category"
            value={form.category}
            disabled={Boolean(id) || Boolean(categoryFilter)}
            onChange={change}
          >
            <option value="">Select Category</option>
            {categories.map((x) => (
              <option key={x._id} value={x._id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          Price
          <input
            className="form-input"
            type="number"
            name="price"
            min={0}
            required
            value={form.price}
            onChange={change}
          />
        </label>

        <label className="form-field">
          Stock
          <input
            className="form-input"
            type="number"
            name="stock"
            min={0}
            required
            value={form.stock}
            onChange={change}
          />
        </label>

        <label className="form-field">
          Discount (%)
          <input
            className="form-input"
            type="number"
            name="discount"
            min={0}
            max={100}
            required
            value={form.discount}
            onChange={change}
          />
        </label>

        <label className="form-field">
          Food Type
          <select
            className="form-select"
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

        <label className="form-field">
          Preparation Time
          <input
            className="form-input"
            type="number"
            required
            min={0}
            name="preparationTime"
            value={form.preparationTime}
            onChange={change}
          />
        </label>

        <label className="form-checkbox">
          Is Available
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={change}
          />
        </label>

        <label className="form-field">
          Status
          <select
            className="form-select"
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

        <label className="form-field form-full-width">
          Image
          <input
            className="form-input"
            type="file"
            name="image"
            accept="image/*"
            onChange={change}
          />
        </label>

        <div className="form-actions form-full-width">
          <button
            className="secondary-button"
            type="button"
            onClick={() => nav("/menu-items")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={busy}
          >
            {busy
              ? "Please Wait..."
              : id
                ? "Update Item"
                : "Create Item"}
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default MenuItemForm