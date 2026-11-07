import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getErrorMessage } from "../../utils/api";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import useManagerContext from "../../context/useManagerContext";
const Login = () => {

    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const { login:vendorLogin ,googleLogin } = useAuth();
    const { login:loginManager ,managerLogin,setManagerLogin } = useManagerContext();
    const [showPassword,setShowPassword] = useState(false)
    const navigate = useNavigate();
    const [showPhoneForm,setShowPhoneForm] =useState(false);
    const [googleCredential,setGoogleCredential] = useState("");
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
    const [phoneAndOUtletName,setPhoneAndOutletName] = useState({
        phone:"",
        businessName:"",
    });

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
    const googleSuccess = async(credentialResponse)=>{
        console.log("GOOGLE SUCCESS" ,credentialResponse);
        const credential = credentialResponse.credential;
        setGoogleCredential(credential);
        await googleLoginSuccess({credential})
    }
    const googleLoginError = (error)=>{
        console.log("Google Login faield",error);
        setError(getErrorMessage(error))
    }
    const googleLoginSuccess = async(data) =>{
        setBusy(true);
        setError("");
        try {
            const respose = await googleLogin(data);
            if(respose?.no){
                setShowPhoneForm(true);
            }else if(respose?.token){
                navigate("/dashboard")
            }
            else{
                setError("Invalid login response from server!")
            }
        } catch (error) {
            console.log("Google logn failed :", error);
            setError(getErrorMessage(error));
        }finally{
            setBusy(false);
        }
    }
    const completeProfile = async(e)=>{
        e.preventDefault();
        const data = {
            credential:googleCredential,
            ...phoneAndOUtletName
        }
        await googleLoginSuccess(data);
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                {
                    showPhoneForm ? 
                            <>
                                <div className="auth-brand">
                                    <div className="brand-mark">VM</div>
                                    <h1>Add phone and Business Name</h1>
                                </div>
                                <form className="form" onSubmit={completeProfile}>
                                    <label>
                                        Business Name
                                        <input 
                                        placeholder="Enter Business Name"
                                        value={phoneAndOUtletName.businessName}
                                        onChange={(e)=>setPhoneAndOutletName({...phoneAndOUtletName,businessName:e.target.value})}
                                        type="text" 
                                        required
                                        />
                                    </label>
                                    <label>
                                        Phone
                                        <input 
                                        placeholder="Enter Phone"
                                        value={phoneAndOUtletName.phone}
                                        onChange={(e)=>setPhoneAndOutletName({...phoneAndOUtletName,phone:e.target.value})}
                                        type="tel" 
                                        required
                                        />
                                    </label>
                                    <button 
                                    className="button primary full" 
                                    type="submit"
                                    disabled={busy}
                                    >
                                        <LogIn size={18}/>
                                        {busy ? "Complete Account Details...":"Complete Account Details"}
                                    </button>
                                </form>
                            </>

                            :
                    
                            <>
                                <div className="auth-brand">
                                    <div className="brand-mark">VM</div>
                                    <h1>Welcome Back</h1>
                                    <p>
                                        Sign in to manage your food business.
                                    </p>
                                </div>
                                <div className="forgot-pass mb-3">
                                <button className={"button secondary"} onClick={()=>{setManagerLogin(true);setError("")}}>Manager</button>
                                <button className={"button secondary"} onClick={()=>{setManagerLogin(false);setError("")}}>Vendor</button>
                                </div>
                                {
                                    (!managerLogin && !busy) ? (
                                        <GoogleLogin
                                        onSuccess={googleSuccess}
                                        onError={googleLoginError}
                                        />
                                    ):(
                                        <p>Processing...</p>
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
                                                    Password
                                                    <div className="password-container">
                                                        <input
                                                            type={showPassword ? "text":"password"}
                                                            placeholder="••••••••"
                                                            value={managerForm.password}
                                                            onChange={(e) => setManagerForm({...managerForm,password:e.target.value})}
                                                            required
                                                        />
                                                        <button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                                                    </div>
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
                                                    <div className="password-container">
                                                    <input
                                                        type={showPassword?"text":"password"}
                                                        placeholder="••••••••"
                                                        value={form.password}
                                                        onChange={(e) => setForm({...form,password:e.target.value})}
                                                        required
                                                    />
                                                    <button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={18}/> : <Eye size={18}/>}</button>
                                                    </div>
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
                            </>
                }
            </div>
        </div>
    );
};

export default Login;