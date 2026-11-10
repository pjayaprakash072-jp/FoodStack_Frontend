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
    <div className="auth-container">
        <div className="auth-panel">
        <header className="auth-heading">
            <div className="auth-logo">VM</div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-description">
            Create a new password for your account.
            </p>
        </header>

        {error && <div className="message-error">{error}</div>}
        {msg && <div className="message-success">{msg}</div>}

        <form className="form-container" onSubmit={handleSubmit}>
            <label className="form-field">
            New Password
            <input
                className="form-input"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </label>

            <label className="form-field">
            Confirm Password
            <input
                className="form-input"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </label>

            <button
            className="primary-button full-width"
            type="submit"
            disabled={loading}
            >
            {loading ? "Updating..." : "Update Password"}
            </button>
        </form>
        </div>
    </div>
  )
}

export default ResetPassword