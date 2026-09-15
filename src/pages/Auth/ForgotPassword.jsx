import { useState } from "react"
import vendorService from "../../services/vendorService";
import { getErrorMessage } from "../../utils/api";
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {

    const [email,setEmail] = useState("");

    const [loading,setLoading]  = useState(false);

    const [error,setError] = useState("");

    const [msg,setMsg]  = useState("");

    const nav = useNavigate();


    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await vendorService.sendResetLink(email)
            setMsg(response.message +" Change password and login");
            setEmail("");
        } catch (error) {
            setError(getErrorMessage(error))
        }finally{
            setLoading(false)
        }
    }


  return (
    <div className="auth-page">
        <div className="auth-card">
            <div className="auth-brand">
                <div className="brand-mark">VM</div>
                <h1>Forgot password</h1>
                <p>Enter Registered email to get password update link</p>
            </div>
            {error && <div className="alert error">{error}</div>}
            {msg ? (
                <>
                <div className="alert success">{msg}</div>
                <button className="button primary full" type="button" onClick={()=> nav("/login")}>login</button>
                </>
            ):(

            <form className="form" onSubmit={handleSubmit}>
                <label>
                    Email 
                    <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                </label>
                <button 
                type="submit"
                className="button primary full"
                disabled = {loading}
                >{loading ? "Sending...":"Send reset link"}</button>
            </form>
            )
            }
        </div>
    </div>
  )
}

export default ForgotPassword