import { useState } from 'react';
import {Link , useNavigate} from 'react-router-dom'
import vendorService from './../../services/vendorService';
import { getErrorMessage } from '../../utils/api';
import {UserPlus} from 'lucide-react'

export default function Register(){
  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    phone:"",
    businessName:"",
    status:"active"
  })
  const [error,setError] = useState("")

  const [busy,setBusy] = useState(false)

  const navigate = useNavigate();

  const update = (e)=> setForm({...form,[e.target.name]:e.target.value})

  const submit = async (e)=>{
    e.preventDefault();

    setError("");
    setBusy(true);
    try{
      await vendorService.register(form);
    
      navigate("/login",{state:{registered:true}})

    }catch(err){
      setError(getErrorMessage(err))
    }finally{
      setBusy(false)
    }
    
  }

  return(
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-brand">
          <div className="brand-mark">VM</div>
          <h1>Create Vendor accoutn</h1>
          <p>start by registering your vendor profile.</p>
        </div>
        {error && <div className='alert error'>{error}</div>}
        <form className='form grid-2' onSubmit={submit}>
            <label>
              Full name
              <input type="text"
                name='name'
                required
                value={form.name}
                onChange={update}
              />
            </label>
            <label >
              BusinessName 
              <input type="text"
              name='businessName'
              value={form.businessName}
              onChange={update}

              />
            </label>
            <label >
              Email
              <input type="email"
              name='email'
              value={form.email}
              onChange={update}
              />
            </label>
            <label >
              Phone
              <input type="phone"
              name='phone'
              value={form.phone}
              onChange={update}
              />
            </label>
            <label >
              Password
              <input type="password"
              name='password'
              required
              minLength="6"
              value={form.password}
              onChange={update}
              />
            </label>
            <label>
              Status 
              <select name="status"
              value={form.status}
              onChange={update}
              >
                <option>active</option>
                <option>inactive</option>
                <option>suspended</option>
              </select>
            </label>
            <button className="button primary full grid-span-2"><UserPlus size ={18}/>{ busy ? "Creaging... " : "Create Account"}</button>
        </form>
        <p className="auth-footer">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )

}
