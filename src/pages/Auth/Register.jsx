import { useState } from 'react';
import {Link , useNavigate} from 'react-router-dom'
import vendorService from './../../services/vendorService';
import { getErrorMessage } from '../../utils/api';
import {UserPlus} from 'lucide-react'
const intial = {
  name:"",
  email:"",
  password:"",
  phone:"",
  businessName:"",
  status:"active"
}
export default function Register(){

  const [form,setForm] = useState(intial);
  const [error,setError] = useState("")

  const [busy,setBusy] = useState(false)

  const navigate = useNavigate();

  // const change = (e)=> setForm({...form,[e.target.name]:e.target.value})
  const change = (e)=>{
    const {name,value} = e.target;
    setForm(
      (prev)=>(
        {
          ...prev,[name]:value
        }
      )
    )
  }

  const submit = async (e)=>{
    e.preventDefault();

    setError("");
    setBusy(true);
    try{
      const response = await vendorService.register(form);
      console.log("vendor created!",response);
      navigate("/login",{state:{registered:true}})

    }catch(err){
      setError(getErrorMessage(err))
    }finally{
      setBusy(false)
    }
    
  }

  return(
 <div className="auth-container">
    <div className="auth-panel">
      <header className="auth-heading">
        <div className="auth-logo">VM</div>
        <h1 className="auth-title">Create Vendor Account</h1>
        <p className="auth-description">
          Start by registering your vendor profile.
        </p>
      </header>

      {error && (
        <div className="message-error">{error}</div>
      )}

      <form className="form-grid" onSubmit={submit}>
        <label className="form-field">
          Full Name
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
          Email
          <input
            className="form-input"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={change}
          />
        </label>

        <label className="form-field">
          Phone
          <input
            className="form-input"
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={change}
          />
        </label>

        <label className="form-field">
          Password
          <input
            className="form-input"
            type="password"
            name="password"
            required
            minLength="6"
            value={form.password}
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

        <button
          className="primary-button form-full-width"
          disabled={busy}
        >
          <UserPlus size={18} />
          {busy ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="auth-footer">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  </div>
  )

}
