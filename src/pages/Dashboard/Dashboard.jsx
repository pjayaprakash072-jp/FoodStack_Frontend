
import { useEffect, useState } from "react";
import {Store,Tags,Utensils,Activity} from "lucide-react";
import {Link} from 'react-router-dom'

import StatCard from "../../components/Cards/StatCard";
import OutletCard from "../../components/Cards/OutletCard";
import Loader from "../../components/Common/Loader";



import outletService from '../../services/outletService';
import categoryService from '../../services/categoryService';
import menuItemService from '../../services/menuItemService';
import { useAuth } from "../../context/AuthContext";

const arr = (x) =>
  Array.isArray(x)
    ? x
    : x?.items || x?.outlets || x?.categories || x?.menuItems || x?.menuCategories || [];


const Dashboard = () => {

    const {vendor} = useAuth();

    const [data,setData] = useState(
        {
            outlets:[],
            categories:[],
            items:[]
        }
    );

    const [loading , setLoading] = useState(true);

    useEffect(()=>{
            (async()=>{
                        try{
                            const[o, c, m] = await Promise.all(
                                [
                                    vendor ? outletService.byVendor(vendor._id || vendor.id) : outletService.getAll(), categoryService.getAll(), menuItemService.getAll(),
                                ]
                            );
                            // console.log("outletes" , o);
                            // console.log("categorids",c);
                            // console.log("items",m)
                            setData(
                                {
                                    outlets:arr(o),
                                    categories:arr(c),
                                    items:arr(m)
                                }
                            );
                        }finally{
                            setLoading(false)
                        }
            }
        )();
        },[vendor]
    )


    if(loading) return <Loader/>
    return (
        <>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Overview</p>
                    <h1>Good day,{vendor?.name?.split(" ")[0] || "Vendor"}👋 </h1>

                    <p>Here is what is happening with your business.</p>
                </div>
                <Link className="button primary" to = "/outlets/new"> + Add outlet</Link>
            </div>
            <div className="stats-grid">
                <StatCard label="Outlets" value = {data.outlets.length} hint = "your locations" icon={Store}/>
                <StatCard label="Categories" value = {data.categories.length} hint = "Menu groups" icon={Tags}/>
                <StatCard label="Menu Items" value = {data.items.length} hint = "Products listed" icon={Utensils}/>
                <StatCard label="Stats" value = {vendor?.status || "active"} hint = "Vendor Accont" icon={Activity}/>
            </div>
        <section className="section">
            <div className="section-title">
                <div>
                    <h2>Recent outlets</h2>
                    <p>Quick access to your locatins</p>
                </div>
                <Link to = "/outlets" className="text-link" >View all</Link>
            </div>
            {
                data.outlets.length? (
                    <div className="card-grid">
                        {
                            data.outlets.slice(0,4).map((o)=>(
                                <OutletCard 
                                key={o._id}
                                outlet={o}
                                />

                            ))
                        }
                    </div>
                ):(
                    <div className="panel">
                        <p>
                            No Outlets yet.{" "}
                            <Link to = "/outlets/new">
                            Create your first Outlet.</Link>
                        </p>
                    </div>
                )
            }
        </section>
        </>
    );
};

export default Dashboard;