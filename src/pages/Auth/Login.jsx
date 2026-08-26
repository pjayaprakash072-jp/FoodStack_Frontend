
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
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/api";
import { LogIn } from "lucide-react";

const Login = () => {
    const [form,setForm] = useState({
        email:"",
        password:""
    })
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const { login } = useAuth();
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
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-brand">
                    <div className="brand-mark">VM</div>

                    <h1>Welcome Back</h1>

                    <p>
                        Sign in to manage your food business.
                    </p>
                </div>

                <form
                    className="form"
                    onSubmit={handleSubmit}
                >

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
                        Password

                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({...form,password:e.target.value})}
                            required
                        />
                    </label>

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
                <p className="auth-footer">
                    New Vendor? <Link to="/register" > Create an Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;