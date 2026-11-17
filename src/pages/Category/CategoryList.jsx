
import { useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import { Plus, ArrowLeft } from "lucide-react";

import CategoryCard from "../../components/Cards/CategoryCard";
import SearchBar from "../../components/Common/SearchBar";
import EmptyState from "../../components/Common/EmptyState";
import CategoryCardSkeleton from "../../components/Skeletons/CategoryCardSkeleton";

import categoryService from "../../services/categoryService";
import outletService from "../../services/outletService";

import { useAuth } from "../../context/useAuth";

const arr = (x) =>
  Array.isArray(x) ? x : x?.menuCategories || x?.outlets || [];

const CategoryList = () => {
  const { vendor, isAuthenticated } = useAuth();

  const [params] = useSearchParams();
  const outletFilter = params.get("outlet");

  const [categories, setCategories] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(true);

  const selectedOutlet = outlets.find(
    (o) => o._id === outletFilter
  );

  const filtered = categories.filter((c) =>
    `${c.name} ${c.description || ""}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!vendor?._id) return;

        const [c, o] = await Promise.all([
          outletFilter
            ? categoryService.byOutlet(outletFilter)
            : categoryService.byVendor(vendor._id),

          outletService.byVendor(vendor._id),
        ]);

        setCategories(arr(c.menuCategories));
        setOutlets(arr(o));
      } catch (error) {
        console.log(error);
      } finally {
        setBusy(false);
      }
    };

    if (isAuthenticated) {
      fetchCategories();
    }
  }, [vendor?._id, outletFilter, isAuthenticated]);

  const addCategoryUrl = outletFilter
    ? `/category/new?outlet=${outletFilter}`
    : "/category/new";

  return (
    <div className="page-container">

      {/* Header */}
      <div className="content-header">
        <div>
          <p className="content-eyebrow">
            {outletFilter ? "Outlet" : "Categories"}
          </p>

          <h1 className="content-title">
            {outletFilter
              ? `${selectedOutlet?.name || "Outlet"} Categories`
              : "Categories"}
          </h1>

          <p className="content-description">
            {outletFilter
              ? `Manage categories for ${selectedOutlet?.name || "this outlet"}`
              : "Create and manage every category of your menu"}
          </p>
        </div>

        <div className="category-actions">
          {outletFilter && (
            <Link className="secondary-button" to="/categories">
              <ArrowLeft size={18} />
              All Categories
            </Link>
          )}

          <Link className="primary-button" to={addCategoryUrl}>
            <Plus size={19} />
            Add Category
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="content-body">
        <div className="category-toolbar">
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder="Search Categories by name or description..."
          />
        </div>

        {busy ? (
          <div className="category-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="category-grid">
            {filtered.map((c) => (
              <CategoryCard
                key={c._id}
                menuCategory={c}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              outletFilter
                ? `No categories for ${selectedOutlet?.name || "this outlet"}`
                : "No categories found"
            }
            text={
              q
                ? "Try a different search"
                : "Create your first category"
            }
            action={
              outlets.length === 0 ? (
                <Link className="primary-button" to="/outlets/new">
                  Create Outlet First
                </Link>
              ) : (
                <Link className="primary-button" to={addCategoryUrl}>
                  Add Category
                </Link>
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default CategoryList;
