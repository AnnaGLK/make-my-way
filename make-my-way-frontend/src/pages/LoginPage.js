import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "../styles/LoginPage.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import LoadingPopup from "../components/LoadingPopup";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { onLogin } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email";
    }
    if (password.length < 6) {
      newErrors.password = "Password should include at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await onLogin(email, password);
      navigate("/");
    } catch (err) {
      const message =
        (err.response &&
          (err.response.data.error ||
            err.response.data.message ||
            JSON.stringify(err.response.data))) ||
        err.message ||
        "Login failed";
      setLoginError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container d-flex align-items-center justify-content-center loginform-wrapper"
      //   style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <div className="loginform-header d-flex">
          <h2 className="loginform-title">Welcome back!</h2>
        </div>
        {/* <h2 className="text-center mb-3">Welcome back!</h2> */}
        <div className="p-3">
          <p className="text-center text-muted">
            Do not have an account yet?{" "}
            <Link to="/register" className="text-decoration-none">
              Create account
            </Link>
          </p>

          <div>
            {loginError && (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                <div>{loginError || "Login failed"}</div>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@example.com"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      {loading && <LoadingPopup message="Logging you in..." />}
    </div>
  );
}
