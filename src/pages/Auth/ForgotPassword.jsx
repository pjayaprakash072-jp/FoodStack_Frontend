import { useState } from "react";
import vendorService from "../../services/vendorService";
import { getErrorMessage } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [msg, setMsg] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await vendorService.sendResetLink(email);
      setMsg(response.message + " Change password and login");
      setEmail("");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <header className="auth-heading">
          <div className="auth-logo">VM</div>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-description">
            Enter your registered email to get a password reset link.
          </p>
        </header>

        {error && <div className="message-error">{error}</div>}

        {msg ? (
          <>
            <div className="message-success">{msg}</div>

            <button
              className="primary-button full-width"
              type="button"
              onClick={() => nav("/login")}
            >
              Login
            </button>
          </>
        ) : (
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-fields">
              <label className="form-field">
                Email
                <input
                  className="form-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <button
                type="submit"
                className="primary-button full-width"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
