

import CategoryCard from "../../components/Cards/CategoryCard"

import {Link ,useSearchParams} from "react-router-dom"

import {Plus,ArrowLeft} from "lucide-react"

import SearchBar from './../../components/Common/SearchBar';

import Loader from "../../components/Common/Loader"

import EmptyState from './../../components/Common/EmptyState';

import categoryService from "../../services/categoryService";
import outletService from "../../services/outletService";

import { useAuth } from "../../context/useAuth";
import { useState,useEffect  } from "react";

const arr = (x)=> Array.isArray(x)? x: x?.menuCategories || [];

const CategoryLIst = () => {

    const {vendor} = useAuth();
    const [params] = useSearchParams();
    const outletFilter = params.get("outlet");
    const [categories,setCategories]  = useState([]);
    const [outlets,setOutlets] = useState([]);


    const [q,setQ] = useState("");

    const [busy,setBusy]= useState(true);

    const selectedOutlet = outlets.find((o)=> o._id === outletFilter)
    
    const filtered = categories.filter((c)=>`${c.name} ${c.description}`.toLowerCase().includes(q.toLowerCase()));

    useEffect(
        ()=>{
            if(!vendor?._id) return;
            (async ()=>{
                try{

                    const [c,o] = await Promise.all([
                        outletFilter ? await categoryService.byOutlet(outletFilter) : await categoryService.byVendor(vendor?._id), outletService.byVendor(vendor?._id)

                    ]) 

                    setCategories(arr(c.menuCategories));
                    setOutlets(arr(o.outlets));
                }catch(error){
                    console.log(error);
                }finally{
                    setBusy(false);
                }
            })();
        },[vendor,outletFilter]
    )

    const addCategoryUrl = outletFilter ? `/category/new?outlet=${outletFilter}`:"/category/new"
  return (
    <>
    <div className="page-heading">
        <div>
            <p className="eyebrow">{ outletFilter ? "Outlet":"Categories"}</p>
            <h1>{ outletFilter? `${selectedOutlet?.name || "Outlet" } Categories`:"Categories"}</h1>
            <p>{outletFilter ? `Manage categories for ${selectedOutlet?.name}`:"Create and manage every category of your menu"}</p>

        </div>
        <div className="button-row">
            {
                outletFilter && (
                    <Link className="button secondary" to="/categories"> <ArrowLeft size = {18}/> All Categories</Link>
                )
            }
            <Link className="button primary" to={addCategoryUrl}><Plus size={19}/>Add Category</Link>
        </div>
    </div>
    <div className="toolbar">
        <SearchBar 
        value={q}
        onChange={setQ}
        placeholder="Search Categories by name or description..."
        />
    </div>
    {
        busy?(
            <Loader/>

        ):filtered.length?(
            <div className="card-grid">
                {
                    filtered.map((c)=>(
                        <CategoryCard key={c._id} menuCategory={c}/>
                    ))
                }
            </div>
            ):(
                <EmptyState
                title={outletFilter? `No categories for ${selectedOutlet?.name}` :"No categories found"}
                text={q ? "Try a different search" : "Create your first category"}
                action={
                    outlets.length == 0?(
                    <Link className="button primary" to = "/outlets/new" >Create Outlet First</Link>):(

                <Link className="button primary" to={addCategoryUrl}>Add Category</Link>)
            }
                />
            )
    }
     </>
  )
}

export default CategoryLIst