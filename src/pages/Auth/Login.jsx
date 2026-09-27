import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getErrorMessage } from "../../utils/api";
import { LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import useManagerContext from "../../context/useManagerContext";

const Login = () => {
    const [form,setForm] = useState({
        email:"",
        password:""
    })
    const [managerForm,setManagerForm] = useState(
        {
            phone:"",
            password:""
        }
    )
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const { login:vendorLogin ,googleLogin } = useAuth();
    const { login:loginManager  } = useManagerContext();
    const [managerLogin,setManagerLogin] = useState(true);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setBusy(true);

        try {
            let result;
            if(managerLogin){
                result = await loginManager(managerForm);
                console.log("manager Login Result:",result);
                navigate(`/outlets/${result.manager.outlet?._id}`)
            }else{
                result = await vendorLogin(form);
                console.log("Login Result",result)
                navigate("/dashboard");
            }

        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setBusy(false);
        }
    };


    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-brand">
                    <div className="brand-mark">VM</div>

                    <h1>Welcome Back</h1>

                    <p>
                        Sign in to manage your food business.
                    </p>
                </div>
                <div className="forgot-pass mb-3">
                <button className={"button secondary"} onClick={()=>{setManagerLogin(true)}}>Manager</button>
                <button className={"button secondary"} onClick={()=>{setManagerLogin(false)}}>Vendor</button>
                </div>
                {
                    !managerLogin && (
                        <GoogleLogin
                        onSuccess={ async (credentialResponse)=>{
                            console.log("GOOGLE SUCCESS");
                            console.log(credentialResponse)
                            try{
                                await googleLogin(credentialResponse.credential)
                                console.log("BACKEND GOOGLE LOGIN SUCCESS");
                                const message = "please update phone and password";
                                navigate(`/profile?message=${message}`)
                            }catch(err){
                                console.error(err);
                                setError("Google Login failed")
                                console.log("BACKEND GOOGLE LOGIN FAILED");
                                console.log(err.response?.data);
                                console.log(err);
                            }
                        }}
                        onError={(error)=>{
                            console.log(error);
                            setError("Google Login failed")
                        }}/>
                    )
                }

                <form
                    className="form"
                    onSubmit={handleSubmit}
                >

                    {
                        managerLogin ? (
                            <>
                                <label>
                                    phone

                                    <input
                                        type="tel"
                                        placeholder="Enter phone"
                                        value={managerForm.phone}
                                        required
                                        onChange={(e) => setManagerForm({...managerForm,phone:e.target.value})}
                                    />
                                </label>

                                <label>
                                    <p>Password</p>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={managerForm.password}
                                        onChange={(e) => setManagerForm({...managerForm,password:e.target.value})}
                                        required
                                    />
                                </label>
                            </>
                        ):(
                            <>
                                <label>
                                    Email

                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={(e) => setForm({...form,email:e.target.value})}
                                        required
                                    />
                                </label>

                                <label>
                                    <div className="forgot-pass">
                                    <p>Password</p>
                                    <p>
                                        <Link to = "/forgot-password">Forgot Password</Link>
                                    </p>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => setForm({...form,password:e.target.value})}
                                        required
                                    />
                                </label>
                            </>
                        )
                    }

                    {error && ( <p className="alert error"> {error} </p> )}

                    <button
                        type="submit"
                        className="button primary full"
                        disabled={busy}
                    >
                        <LogIn size={18}/>
                        {busy ? "Logging in..." : "Login"}
                    </button>

                </form>
                {
                    !managerLogin && (
                        <p className="auth-footer">
                            New Vendor? <Link to="/register" > Create an Account</Link>
                        </p>
                    )
                }
            </div>
        </div>
    );
};

export default Login;