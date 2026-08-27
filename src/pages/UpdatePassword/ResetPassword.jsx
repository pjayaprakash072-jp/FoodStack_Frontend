import { useState } from "react"
import { useParams , useNavigate} from "react-router-dom"
import vendorService from "../../services/vendorService";
import { getErrorMessage } from "../../utils/api";
const ResetPassword = () => {

    const {token} = useParams();

    const nav = useNavigate();

    const [password,setPassword] = useState("");

    const [confirmPassword,setConfirmPassword] = useState("");

    const [error,setError] = useState("");

    const [msg,setMsg] = useState("");


    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError("");
        setMsg("");
        if(password !== confirmPassword){
            setError("Password do not matched!")
            return;
        }
        setLoading(true);
        try {
            const response = await vendorService.updatePassword(token, password)
            setMsg(response.message);
            setTimeout(()=>{
                nav("/login")
            })
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
                <h1>Reset Password</h1>
            </div>
            {error && <div className="alert error">{error}</div>}
            {msg && <div className="alert success">{msg}</div>}
            <form className="form" onSubmit={handleSubmit}>
                <label>
                    New Password 
                    <input 
                    type="password" 
                    placeholder="New Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                </label>
                <label>
                    Confirm Password 
                    <input 
                    type="password" 
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                </label>
                <button className="button primary full" type="submit" disabled={loading}>
                    {loading? "Updating":"Update Password"}
                </button>
            </form>
        </div>
    </div>
  )
}

export default ResetPassword