import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getErrorMessage } from "../../utils/api";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import useManagerContext from "../../context/useManagerContext";
import vendorService from "../../services/vendorService";
import { toast } from "sonner";

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
    const { login:loginManager ,managerLogin,setManagerLogin } = useManagerContext();
    const [showPassword,setShowPassword] = useState(false)
    const navigate = useNavigate();
    const [showPhoneForm,setShowPhoneForm] =useState(false);
    const [phoneAndOUtletName,setPhoneAndOutletName] = useState(
        {
            name:"",
            email:"",
            phone:"",
            businessName:""
        }
    )
    const{setVendor} = useAuth();


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
    const googleLoginSuccess = async(credentialResponse) =>{
        console.log("GOOGLE SUCCESS");
        console.log(credentialResponse);
        try {
            const respose = await googleLogin(credentialResponse.credential);
            const vendor = respose.vendorAuth;
            if(vendor?.phone?.trim()){
                const getVendor = await vendorService.getOne();
                setVendor(getVendor.vendor);
                navigate("/dashboard")
            }else{
                setPhoneAndOutletName(
                    (prev)=>(
                        {
                            ...prev,name:vendor.name,email:vendor.email
                        }
                    )
                )
                setShowPhoneForm(true);
            }
        } catch (error) {
            console.log("Google logn failed :", error);
            setError(getErrorMessage(error));
        }
    }
    const googleLoginError = async(error)=>{
        console.log("Google Login faield",error);
        setError(getErrorMessage(error))
    }
    const completeProfile = async(e)=>{
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const formData = new FormData();
            Object.entries(phoneAndOUtletName).forEach(([key,value])=>{
                if( value != null && value != undefined){
                    formData.append(key,value);
                }
            })
            formData.delete("password");
            const response = await vendorService.updateAuth(
                {
                    name:phoneAndOUtletName.name,
                    email:phoneAndOUtletName.email,
                    businessName:phoneAndOUtletName.businessName,
                    phone:phoneAndOUtletName.phone
                }
            );
            const resposnevendor = await vendorService.create(response.vendorAuth?._id,formData)
            setVendor(resposnevendor.vendor);
            toast.success("Account Created Successfully!");
            navigate("/dashboard")
        } catch (error) {
            setError(getErrorMessage(error));
        }finally{
            setBusy(false);
        }
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
                                    <button className="button primary full" type="submit"><LogIn size={18}/>{busy ? "Complete Account Details...":"Complete Account Details"}</button>
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
                                <button className={"button secondary"} onClick={()=>{setManagerLogin(true)}}>Manager</button>
                                <button className={"button secondary"} onClick={()=>{setManagerLogin(false)}}>Vendor</button>
                                </div>
                                {
                                    !managerLogin && (
                                        <GoogleLogin
                                        onSuccess={googleLoginSuccess}
                                        onError={googleLoginError}
                                        />
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