
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../../context/useAuth";
import { getErrorMessage } from "../../utils/api";

const Login = () => {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const [googleCredential, setGoogleCredential] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [phoneAndOutletName, setPhoneAndOutletName] = useState({
    phone: "",
    businessName: "",
  });

  const { login, googleLogin } = useAuth();

  const navigate = useNavigate();

  // Vendor Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      const result = await login(form);

      console.log("Login Result:", result);

      navigate("/dashboard");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  // Google Login Success
  const googleSuccess = async (credentialResponse) => {
    const credential = credentialResponse.credential;

    setGoogleCredential(credential);

    await googleLoginSuccess({ credential });
  };

  // Google Login Error
  const googleLoginError = (error) => {
    console.log("Google Login failed:", error);
    setError(getErrorMessage(error));
  };

  // Google Authentication
  const googleLoginSuccess = async (data) => {
    setBusy(true);
    setError("");

    try {
      const response = await googleLogin(data);

      if (response?.no) {
        setShowPhoneForm(true);
      } else if (response?.token) {
        navigate("/dashboard");
      } else {
        setError("Invalid login response from server!");
      }
    } catch (error) {
      console.log("Google login failed:", error);
      setError(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  // Complete Google Profile
  const completeProfile = async (e) => {
    e.preventDefault();

    const data = {
      credential: googleCredential,
      ...phoneAndOutletName,
    };

    await googleLoginSuccess(data);
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">

        {showPhoneForm ? (
          <>
            {/* GOOGLE PROFILE COMPLETION */}

            <header className="auth-heading">
              <div className="auth-logo">VM</div>

              <h1 className="auth-title">
                Complete Your Profile
              </h1>

              <p className="auth-description">
                Add your phone number and business name to continue.
              </p>
            </header>

            {error && (
              <div className="message-error">{error}</div>
            )}

            <form
              className="form-container"
              onSubmit={completeProfile}
            >
              <div className="form-fields">

                <label className="form-field">
                  Business Name

                  <input
                    className="form-input"
                    placeholder="Enter Business Name"
                    value={phoneAndOutletName.businessName}
                    onChange={(e) =>
                      setPhoneAndOutletName({
                        ...phoneAndOutletName,
                        businessName: e.target.value,
                      })
                    }
                    type="text"
                    required
                  />
                </label>

                <label className="form-field">
                  Phone

                  <input
                    className="form-input"
                    placeholder="Enter Phone"
                    value={phoneAndOutletName.phone}
                    onChange={(e) =>
                      setPhoneAndOutletName({
                        ...phoneAndOutletName,
                        phone: e.target.value,
                      })
                    }
                    type="tel"
                    required
                  />
                </label>

                <button
                  className="primary-button full-width"
                  type="submit"
                  disabled={busy}
                >
                  <LogIn size={18} />

                  {busy
                    ? "Completing Account..."
                    : "Complete Account Details"}
                </button>

              </div>
            </form>
          </>
        ) : (
          <>
            {/* LOGIN HEADER */}

            <header className="auth-heading">
              <div className="auth-logo">VM</div>

              <h1 className="auth-title">
                Welcome Back
              </h1>

              <p className="auth-description">
                Sign in to manage your food business.
              </p>
            </header>

            {/* GOOGLE LOGIN */}

            <div className="google-login-container">
              <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleLoginError}
              />
            </div>

            {/* LOGIN FORM */}

            <form
              className="form-container"
              onSubmit={handleSubmit}
            >
              <div className="form-fields">

                {/* EMAIL */}

                <label className="form-field">
                  Email

                  <input
                    className="form-input"
                    type="email"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                {/* PASSWORD */}

                <label className="form-field">
                  <div className="password-label">
                    <span>Password</span>

                    <Link to="/forgot-password">
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="password-field">
                    <input
                      className="form-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          password: e.target.value,
                        })
                      }
                      required
                    />

                    <button
                      className="password-toggle"
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </label>

                {error && (
                  <div className="message-error">{error}</div>
                )}

                <button
                  type="submit"
                  className="primary-button full-width"
                  disabled={busy}
                >
                  <LogIn size={18} />

                  {busy ? "Logging in..." : "Login"}
                </button>

              </div>
            </form>

            {/* REGISTER LINK */}

            <p className="auth-footer">
              New Vendor?{" "}
              <Link to="/register">
                Create an Account
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;
