import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/api";
import vendorService from "./../../services/vendorService";
import { Pencil, Trash2, X } from "lucide-react";
import ConfirmDialog from "../../components/Common/ConfirmDialog";
import { toast } from "sonner";

export default function Profile() {
  const { vendor, setVendor,logout } = useAuth();
  const nav = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: vendor?.name || "",
    email: vendor?.email || "",
    phone: vendor?.phone || "Please Add phone",
    businessName: vendor?.businessName || "",
    status: vendor?.status || "active",
    profileImg: null,
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState(false);
  const change = (e) => {
    const { type, value, name, files } = e.target;
    setForm({
      ...form,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const remove = async () => {
    try {
      await vendorService.remove();
      logout();
      nav("/login");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setDel(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value != null && value != undefined) {
          formData.append(key, value);
        }
      });
      const response = await vendorService.update(formData);
      setVendor(response.vendor);
      toast.success("profile updateded Successfully!");
      setTimeout(() => {
        setMsg("");
      }, 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };
    const handleUpdatePassword = async(e)=>{
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            const response = await vendorService.sendResetLink(vendor?.email);
            setMsg(response.message +" Change password through email.");
            toast.success(response.message +" Change password through email.");
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
          setBusy(false);
        }
    }
  return (
  <div className="page-container">
    <header className="content-header">
      <div>
        <p className="content-eyebrow">Account</p>
        <h1 className="content-title">Vendor Profile</h1>
        <p className="content-description">
          View and manage your vendor account details.
        </p>
      </div>

      <div className="profile-image">
        <img
          src={vendor?.profileImg?.url || "default-profile.png"}
          alt="Vendor profile"
        />
      </div>
    </header>

    <div className="content-body">
      <div className="profile-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setMsg("");
          }}
        >
          {showForm ? <X size={19} /> : <Pencil size={19} />}
          {showForm ? "Cancel Editing" : "Edit Profile"}
        </button>

        <button
          className="primary-button"
          type="button"
          onClick={handleUpdatePassword}
        >
          Update Password
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={() => setDel(true)}
        >
          <Trash2 size={18} />
          Delete Account
        </button>
      </div>

      {msg && <div className="message-success">{msg}</div>}
      {error && <div className="message-error">{error}</div>}

      {showForm ? (
        <form className="form-container form-grid" onSubmit={submit}>
          <label className="form-field">
            Name
            <input
              className="form-input"
              type="text"
              required
              name="name"
              value={form.name}
              onChange={change}
            />
          </label>

          <label className="form-field">
            Email
            <input
              className="form-input"
              type="email"
              name="email"
              value={form.email}
              disabled
            />
          </label>

          <label className="form-field">
            Phone
            <input
              className="form-input"
              type="tel"
              required
              name="phone"
              value={form.phone}
              onChange={change}
            />
          </label>

          <label className="form-field">
            Business Name
            <input
              className="form-input"
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={change}
            />
          </label>
          
          <label className="form-field">
            Profile Image
            <input
              className="form-input"
              type="file"
              name="profileImg"
              accept="image/*"
              onChange={change}
            />
          </label>

          <label className="form-field">
            Status
            <select
              className="form-select"
              name="status"
              value={form.status}
              onChange={change}
            >
              <option>active</option>
              <option>inactive</option>
              <option>suspended</option>
            </select>
          </label>


          <div className="form-actions form-full-width">
            <button
              type="submit"
              className="primary-button"
              disabled={busy}
            >
              {busy ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="details-container">
          <h2 className="section-title">Account Details</h2>

          <Detail label="Name" value={form.name} />
          <Detail label="Email" value={form.email} />
          <Detail label="Phone" value={form.phone} />
          <Detail label="Business Name" value={form.businessName} />
          <Detail label="Status" value={form.status} />
        </div>
      )}

      <ConfirmDialog
        open={del}
        setOpen={setDel}
        onCancel={() => setDel(false)}
        onConfirm={remove}
        title="Delete Vendor"
        message="Are you sure you want to delete your account?"
      />
    </div>
  </div>
  );
}

const Detail = ({ label, value }) => (
  <div className="detail-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);
