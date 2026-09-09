import { useEffect, useState } from "react";

import { useAuth } from "../../context/useAuth";

import { useNavigate, useSearchParams } from "react-router-dom";
import { getErrorMessage } from "../../utils/api";
import vendorService from "./../../services/vendorService";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "../../components/Common/ConfirmDialog";
import { toast } from "sonner";

export default function Profile() {
  const { vendor, setVendor } = useAuth();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [takePassword, setTakePassword] = useState(false);
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
  useEffect(() => {
    (() => {
      const msg = params.get("message");
      if (msg) {
        setMsg(msg);
      }
    })();
  }, [params]);

  const change = (e) => {
    const { type, value, name, files } = e.target;
    setForm({
      ...form,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const remove = async () => {
    try {
      await vendorService.remove(vendor._id);
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

    try {
      const formData = new FormData();
      if (takePassword) {
        formData.append("password", password);
      }
      Object.entries(form).forEach(([key, value]) => {
        if (value != null && value != undefined) {
          formData.append(key, value);
        }
      });

      const response = await vendorService.update(formData);
      setVendor(response.vendor);
      setTakePassword(false);
      setPassword("");
      toast.success("profile updateded Successfully!");

      // setMsg("profile updateded Successfully!");
      setTimeout(() => {
        setMsg("");
      }, 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="page">
      <div className="page-heading profile">
        <div>
          <p className="eyebrow"> Account</p>
          <h1>Profile</h1>
          <p>Update your vendor details</p>
        </div>
        <div className="profile-image">
          <img
            src={vendor?.profileImg?.url || "default-profile.png"}
            alt="vendor img"
          />
        </div>
        <div className="profile btns">
          <button
            className="button primary"
            onClick={() => {setShowForm(!showForm); setTakePassword(false)}}
          >
            Update Profile
          </button>
          <button
            className="button primary"
            type="button"
            onClick={() => {setTakePassword(!takePassword); setShowForm(false)}}
          >
            Add Password?
          </button>
              <button
                type="button"
                className="button danger"
                onClick={() => setDel(true)}
              >
                <Trash2 size={18} />
                Delete Account
              </button>
        </div>
      </div>
      {showForm ? (
        <>
          {msg && <div className="alert success">{msg}</div>}
          {error && <div className="alert error">{error}</div>}
          <form className="panel form grid-2" onSubmit={submit}>
            <label>
              {" "}
              Name
              <input
                type="text"
                required
                name="name"
                value={form.name}
                onChange={change}
              />
            </label>
            <label>
              {" "}
              Email
              <input type="email" name="email" value={form.email} disabled />
            </label>
            <label>
              {" "}
              Phone
              <input
                type="tel"
                required
                name="phone"
                value={form.phone}
                onChange={change}
              />
            </label>
            <label>
              {" "}
              businessName
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={change}
              />
            </label>
            <label>
              {" "}
              status
              <select name="status" value={form.status} onChange={change}>
                <option>active</option>
                <option>inactive</option>
                <option>suspended</option>
              </select>
            </label>
            <label className="grid-span-2">
              Profile Image
              <input
                type="file"
                name="profileImg"
                accept="image/*"
                onChange={change}
              />
            </label>
            <div className="grid-span-2 form-actions">
              <button type="submit" className="button primary" disabled={busy}>
                {busy ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
          <ConfirmDialog
            open={del}
            setOpen={setDel}
            onCancel={() => setDel(false)}
            onConfirm={remove}
            title="Delete Vendor"
            message="Are you sure you want to delte Account"
          />
        </>
      ) :takePassword?(
        <div className="panel auth-card grid place-content-center">
        <form className="form" onSubmit={submit}>
            <label>
              {" "}
              Password
              <input
                name="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <div className="grid-span-2 form-actions">
              <button type="submit" className="button primary" disabled={busy}>
                {busy ? "Updating..." : "Save Changes"}
              </button>
            </div>
        </form>
        </div>
      ):
       (
        <>
          <div className="panel">
            <h1>Details</h1>
            <Detail label="Name" value={form.name} />
            <Detail label="Email" value={form.email} />
            <Detail label="phone" value={form.phone} />
            <Detail label="businessName" value={form.businessName} />
            <Detail label="Status" value={form.status} />
          </div>
        </>
      )}
    </div>
  );
}

const Detail = ({ label, value }) => {
  return (
    <div className="detail">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
};
