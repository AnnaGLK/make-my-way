import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { useAuth } from "../auth/AuthProvider";
import "../styles/LoginPage.css";
// import "bootstrap/dist/css/bootstrap.min.css";

export function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState(null);
    const { onLogin } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = "Username is required";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email";
        if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError(null);
        if (!validate()) return;

        setLoading(true);
        try {
            await register(form);
            // Auto login user after successful registration
            await onLogin(form.email, form.password);
            navigate("/");
        } catch (err) {
            console.log(err);
            setRegisterError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container d-flex align-items-center justify-content-center loginform-wrapper"
            // style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "420px" }}>
                <div className="loginform-header d-flex">
                <h2 className="text-center mb-3">Create an Account</h2>
                </div>
                <div className="p-3">
                <p className="text-center text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="text-decoration-none">
                        Login
                    </Link>
                </p>

                <div>
                    {registerError && (
                        <div className="alert alert-danger">{registerError}</div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                name="name"
                                type="text"
                                className={`form-control ${
                                    errors.name ? "is-invalid" : ""
                                }`}
                                value={form.name}
                                onChange={handleChange}
                            />
                            {errors.name && (
                                <div className="invalid-feedback">{errors.name}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                name="email"
                                type="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                value={form.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                name="password"
                                type="password"
                                className={`form-control ${
                                    errors.password ? "is-invalid" : ""
                                }`}
                                value={form.password}
                                onChange={handleChange}
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
                                ></span>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
}
