
import { useEffect, useState } from "react";
import {Store,Tags,Utensils,Activity} from "lucide-react";
import {Link} from 'react-router-dom'

import StatCard from "../../components/Cards/StatCard";
import OutletCard from "../../components/Cards/OutletCard";



import outletService from '../../services/outletService';
import categoryService from '../../services/categoryService';
import menuItemService from '../../services/menuItemService';
import { useAuth } from "../../context/useAuth";
import EmptyState from "../../components/Common/EmptyState";
import DashboardSkeleton from "../../components/Skeletons/DashboardSkeleton";

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
                                    vendor ? outletService.byVendor(vendor._id || vendor.id) : outletService.byVendor(vendor?._id), categoryService.byVendor(vendor?._id), menuItemService.byVendor(vendor?._id),
                                ]
                            );
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


    if(loading) return <DashboardSkeleton/>
    return (
        <div className="page-container">
            <header className="content-header">
                <div>
                    <p className="content-eyebrow">Overview</p>
                    <h1 className="content-title">Good day,{vendor?.name?.split(" ")[0] || "Vendor"}👋 </h1>

                    <p className="content-description">Manage outlets,categories and menu items</p>
                </div>
                <Link className="page-action" to = "/outlets/new"> + Add outlet</Link>
            </header>
            <div className="content-body">
            <section className="statistics-grid">
                <StatCard label="Outlets" value = {data.outlets.length} hint = "your locations" icon={Store}/>
                <StatCard label="Categories" value = {data.categories.length} hint = "Menu groups" icon={Tags}/>
                <StatCard label="Menu Items" value = {data.items.length} hint = "Products listed" icon={Utensils}/>
                <StatCard label="Stats" value = {vendor?.status || "active"} hint = "Vendor Accont" icon={Activity}/>
            </section>

            </div>
            <section className="content-section">
                <div className="section-header">
                    <div>
                        <h2>Recent outlets</h2>
                        <p>Quick access to your locatins</p>
                    </div>
                    <Link to = "/outlets" className="section-link" >View all</Link>
                </div>
                {
                    data.outlets.length? (
                        <div className="outlet-grid">
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
                        <EmptyState
                        title="No Outelts yer."
                        text="Create your First Outlet"
                        action={<Link className="page-action" to="/outlets/new">Add Outlet</Link>}
                        />
                    )
                }
            </section>
        </div>
    );
};

export default Dashboard;