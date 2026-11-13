import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getErrorMessage } from "../../utils/api";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import useManagerContext from "../../context/useManagerContext";
const Login = () => {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login: vendorLogin, googleLogin } = useAuth();
  const {
    login: loginManager,
    managerLogin,
    setManagerLogin,
  } = useManagerContext();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [googleCredential, setGoogleCredential] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [managerForm, setManagerForm] = useState({
    phone: "",
    password: "",
  });
  const [phoneAndOUtletName, setPhoneAndOutletName] = useState({
    phone: "",
    businessName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      let result;
      if (managerLogin) {
        result = await loginManager(managerForm);
        console.log("manager Login Result:", result);
        navigate(`/outlets/${result.manager.outlet?._id}`);
      } else {
        result = await vendorLogin(form);
        console.log("Login Result", result);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const googleSuccess = async (credentialResponse) => {
    console.log("GOOGLE SUCCESS", credentialResponse);
    const credential = credentialResponse.credential;
    setGoogleCredential(credential);
    await googleLoginSuccess({ credential });
  };
  const googleLoginError = (error) => {
    console.log("Google Login faield", error);
    setError(getErrorMessage(error));
  };
  const googleLoginSuccess = async (data) => {
    setBusy(true);
    setError("");
    try {
      const respose = await googleLogin(data);
      if (respose?.no) {
        setShowPhoneForm(true);
      } else if (respose?.token) {
        navigate("/dashboard");
      } else {
        setError("Invalid login response from server!");
      }
    } catch (error) {
      console.log("Google logn failed :", error);
      setError(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const completeProfile = async (e) => {
    e.preventDefault();
    const data = {
      credential: googleCredential,
      ...phoneAndOUtletName,
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

              <h1 className="auth-title">Complete Your Profile</h1>

              <p className="auth-description">
                Add your phone number and business name to continue.
              </p>
            </header>

            {error && <div className="message-error">{error}</div>}

            <form className="form-container" onSubmit={completeProfile}>
              <div className="form-fields">
                <label className="form-field">
                  Business Name
                  <input
                    className="form-input"
                    placeholder="Enter Business Name"
                    value={phoneAndOUtletName.businessName}
                    onChange={(e) =>
                      setPhoneAndOutletName({
                        ...phoneAndOUtletName,
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
                    value={phoneAndOUtletName.phone}
                    onChange={(e) =>
                      setPhoneAndOutletName({
                        ...phoneAndOUtletName,
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

                  {busy ? "Completing Account..." : "Complete Account Details"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* LOGIN HEADER */}

            <header className="auth-heading">
              <div className="auth-logo">VM</div>

              <h1 className="auth-title">Welcome Back</h1>

              <p className="auth-description">
                Sign in to manage your food business.
              </p>
            </header>

            {/* ACCOUNT TYPE */}

            <div className="login-account-switch">
              <button
                type="button"
                className={
                  managerLogin
                    ? "account-option account-option-active"
                    : "account-option"
                }
                onClick={() => {
                  setManagerLogin(true);
                  setError("");
                }}
              >
                Manager
              </button>

              <button
                type="button"
                className={
                  !managerLogin
                    ? "account-option account-option-active"
                    : "account-option"
                }
                onClick={() => {
                  setManagerLogin(false);
                  setError("");
                }}
              >
                Vendor
              </button>
            </div>

            {/* GOOGLE LOGIN */}

            {!managerLogin && (
              <div className="google-login-container">
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onError={googleLoginError}
                />
              </div>
            )}

            {managerLogin && busy && (
              <p className="login-processing">Processing...</p>
            )}

            {/* LOGIN FORM */}

            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-fields">
                {managerLogin ? (
                  <>
                    {/* MANAGER PHONE */}

                    <label className="form-field">
                      Phone
                      <input
                        className="form-input"
                        type="tel"
                        placeholder="Enter phone"
                        value={managerForm.phone}
                        required
                        onChange={(e) =>
                          setManagerForm({
                            ...managerForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </label>

                    {/* MANAGER PASSWORD */}

                    <label className="form-field">
                      Password
                      <div className="password-field">
                        <input
                          className="form-input"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={managerForm.password}
                          onChange={(e) =>
                            setManagerForm({
                              ...managerForm,
                              password: e.target.value,
                            })
                          }
                          required
                        />

                        <button
                          className="password-toggle"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
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
                  </>
                ) : (
                  <>
                    {/* VENDOR EMAIL */}

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

                    {/* VENDOR PASSWORD */}

                    <label className="form-field">
                      <div className="password-label">
                        <span>Password</span>

                        <Link to="/forgot-password">Forgot Password?</Link>
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
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
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
                  </>
                )}

                {error && <div className="message-error">{error}</div>}

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

            {!managerLogin && (
              <p className="auth-footer">
                New Vendor? <Link to="/register">Create an Account</Link>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
