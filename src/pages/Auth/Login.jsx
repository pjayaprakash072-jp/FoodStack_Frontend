
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/api";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            // Login through AuthContext
            await login({
                email,
                password
            });

            // Login successful → go to dashboard
            navigate("/dashboard");

        } catch (error) {

            // Login failed
            setError(getErrorMessage(error));

        } finally {
            setLoading(false);
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Password

                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="button primary full"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Login;