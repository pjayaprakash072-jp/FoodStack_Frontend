

import CategoryCard from "../../components/Cards/CategoryCard"

import {Link ,useSearchParams} from "react-router-dom"

import {Plus} from "lucide-react"

import SearchBar from './../../components/Common/SearchBar';

import Loader from "../../components/Common/Loader"

import EmptyState from './../../components/Common/EmptyState';

import categoryService from "../../services/categoryService";
import outletService from "../../services/outletService";

import { useAuth } from "../../context/AuthContext";
import { useState,useEffect  } from "react";

const arr = (x)=> Array.isArray(x)? x: x?.menuCategories || [];

const CategoryLIst = () => {

    const {vendor} = useAuth();
    const [params] = useSearchParams();
    const outletFilter = params.get("outlet");
    const [categories,setCategories]  = useState([]);
    const [outlets,setOutlets] = useState([]);


    const [q,setQ] = useState("");

    const [busy,setBusy]= useState(false);
    
    const filtered = categories.filter((c)=>c.name.toLowerCase().includes(q.toLowerCase()));

    useEffect(
        ()=>{
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
  return (
    <>
    <div className="page-heading">
        <div>
            <p className="eyeborow">Locations</p>
            <h1>Categories</h1>
            <p>Create and manage every category of your meny</p>

        </div>
        <Link className="button primary" to="/category/new"><Plus size={19}/>Add Category</Link>
    </div>
    <div className="toolbar">
        <SearchBar 
        value={q}
        onChange={setQ}
        placeholder="search category..."
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
                title="No categories found"
                text={q ? "Try a different search" : "Create your first category"}
                action={
                    outlets.length == 0?(
                    <Link className="button primary" to = "/outlets/new" >Create Outlet First</Link>):(

                <Link className="button primary" to="/category/new">Add Category</Link>)
            }
                />
            )
    }
     </>
  )
}

export default CategoryLIst