
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import categoryService from "../../services/categoryService";
import outletService from "../../services/outletService";

import Loader from "../../components/Common/Loader";

import { useAuth } from "../../context/useAuth";
import { getErrorMessage } from "../../utils/api";
import { toast } from "sonner";

const initial = {
  name: "",
  description: "",
  displayOrder: 0,
  isActive: true,
  image: null,
  outlet: "",
};

const CategoryForm = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();

  const { vendor, isAuthenticated } = useAuth();

  const [form, setForm] = useState(initial);
  const [outlets, setOutlets] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const o = await outletService.byVendor(
          vendor?.id || vendor?._id
        );

        setOutlets(
          Array.isArray(o) ? o : o?.items || o?.outlets || []
        );

        if (id) {
          const c = await categoryService.getOne(id);
          const category = c.menuCategory;

          setForm({
            name: category.name || "",
            description: category.description || "",
            displayOrder: category.displayOrder ?? 0,
            isActive: category.isActive ?? true,
            image: null,
            outlet: category.outlet?._id || category.outlet || "",
          });
        } else if (params.get("outlet")) {
          setForm((f) => ({
            ...f,
            outlet: params.get("outlet"),
          }));
        }
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [id, isAuthenticated, vendor?.id, vendor?._id]);

  const change = (e) => {
    const { name, value, checked, type, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files[0]
            : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const { outlet, ...payload } = form;

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (id) {
        await categoryService.update(id, formData);

        toast.success("Category Updated successfully!");
        nav(location.state?.from?.pathname || "/categories",{replace :true});
      } else {
        await categoryService.create(outlet, formData);

        toast.success("Category Created successfully!");

        if (params.get("outlet")) {
          nav(`/categories?outlet=${params.get("outlet")}`);
        } else {
          nav("/categories");
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <header className="content-header">
        <div>
          <p className="content-eyebrow">Menu Management</p>

          <h1 className="content-title">
            {id ? "Edit Category" : "Create Category"}
          </h1>

          <p className="content-description">
            Manage your menu categories and their details.
          </p>
        </div>
      </header>

      <div className="content-body">
        {error && (
          <div className="message-error">{error}</div>
        )}

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

          <label className="form-field">
            Outlet

            <select
              className="form-select"
              required
              name="outlet"
              value={form.outlet}
              disabled={Boolean(id) || Boolean(params.get("outlet"))}
              onChange={change}
            >
              <option value="">Select Outlet</option>

              {outlets.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field form-full-width">
            Description

            <input
              className="form-input"
              type="text"
              name="description"
              value={form.description}
              onChange={change}
            />
          </label>

          <label className="form-field">
            Display Order

            <input
              className="form-input"
              type="number"
              name="displayOrder"
              required
              min={0}
              value={form.displayOrder}
              onChange={change}
            />
          </label>

          <label className="form-checkbox">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={change}
            />
            Active
          </label>

          <label className="form-field form-full-width">
            Category Image

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
              onClick={() => nav("/categories")}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              disabled={busy}
            >
              {busy
                ? "Saving..."
                : id
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
