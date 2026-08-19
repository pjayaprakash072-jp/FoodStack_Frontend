
const Login = () => {
  return (
    <div className="auth-page">
        <div className="auth-card">
            <div className="auth-brand">
                <div className="brand-mark">VM</div>
                <h1 >Welcome Back</h1>
                <p>sign in to manage your food Business.</p>
            </div>
            <form className="form">
                <label>
                    Email
                    <input 
                    type="email" 
                    placeholder="Email"
                    />
                </label>
                <label>
                    Password
                    <input 
                    type="password"
                    placeholder="••••••••"
                    />
                </label>
                <button className="button primary full">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default Login