
// const Login = () => {
//   return (
//     <div className="auth-page">
//         <div className="auth-card">
//             <div className="auth-brand">
//                 <div className="brand-mark">VM</div>
//                 <h1 >Welcome Back</h1>
//                 <p>sign in to manage your food Business.</p>
//             </div>
//             <form className="form">
//                 <label>
//                     Email
//                     <input 
//                     type="email" 
//                     placeholder="Email"
//                     />
//                 </label>
//                 <label>
//                     Password
//                     <input 
//                     type="password"
//                     placeholder="••••••••"
//                     />
//                 </label>
//                 <button className="button primary full">Submit</button>
//             </form>
//         </div>
//     </div>
//   )
// }

// export default Login

import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getErrorMessage } from "../../utils/api";
import { LogIn } from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [form,setForm] = useState({
        email:"",
        password:""
    })
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const { login ,googleLogin } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setBusy(true);

        try {
            // Login through AuthContext
            const result = await login(form);
            console.log("Login Result",result)
            // Login successful → go to dashboard
            navigate("/dashboard");

        } catch (error) {
            // console.log("Error",error)
            // Login failed
            setError(getErrorMessage(error));

        } finally {
            setBusy(false);
        }
    };

    return (
    //     <div className="auth-page">
    //         <div className="auth-card">

    //             <div className="auth-brand">
    //                 <div className="brand-mark">VM</div>

    //                 <h1>Welcome Back</h1>

    //                 <p>
    //                     Sign in to manage your food business.
    //                 </p>
    //             </div>
    //             <GoogleLogin
    //             onSuccess={ async (credentialResponse)=>{
    //                 console.log("GOOGLE SUCCESS");
    //                 console.log(credentialResponse)
    //                 try{
    //                     await googleLogin(credentialResponse.credential)
    //                     console.log("BACKEND GOOGLE LOGIN SUCCESS");
    //                     const message = "please update phone and password";
    //                     navigate(`/profile?message=${message}`)
    //                 }catch(err){
    //                     console.error(err);
    //                     setError("Google Login failed")
    //                     console.log("BACKEND GOOGLE LOGIN FAILED");
    //                     console.log(err.response?.data);
    //                     console.log(err);
    //                 }
    //             }}
    //             onError={(error)=>{
    //                 console.log(error);
    //                 setError("Google Login failed")
    //             }}/>

    //             <form
    //                 className="form"
    //                 onSubmit={handleSubmit}
    //             >

    //                 <label>
    //                     Email

    //                     <input
    //                         type="email"
    //                         placeholder="Email"
    //                         value={form.email}
    //                         onChange={(e) => setForm({...form,email:e.target.value})}
    //                         required
    //                     />
    //                 </label>

    //                 <label>
    //                     Password

    //                     <input
    //                         type="password"
    //                         placeholder="••••••••"
    //                         value={form.password}
    //                         onChange={(e) => setForm({...form,password:e.target.value})}
    //                         required
    //                     />
    //                 </label>

    //                 {error && ( <p className="alert error"> {error} </p> )}

    //                 <button
    //                     type="submit"
    //                     className="button primary full"
    //                     disabled={busy}
    //                 >
    //                     <LogIn size={18}/>
    //                     {busy ? "Logging in..." : "Login"}
    //                 </button>

    //             </form>
    //             <p className="auth-footer">
    //                 <Link to = "/forgot-password">Forgot Password</Link>
    //             </p>
    //             <p className="auth-footer">
    //                 New Vendor? <Link to="/register" > Create an Account</Link>
    //             </p>
    //         </div>
    //     </div>
    <div>
        <h1>Currently un available</h1>
    </div>
    );
};

export default Login;