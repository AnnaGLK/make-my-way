// src/components/Navbar.jsx
import React from "react"
import { NavLink } from "react-router-dom"
import Logo from "../assets/logo.png"
import "../styles/Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          {/* <img src={process.env.PUBLIC_URL + '/media/logo.png'} alt="MakeMyWay" width="auto" height="36" className="me-2"/> */}
          <img src={Logo} alt="MakeMyWay" width="auto" height="36" className="me-2" />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => "nav-link px-3" + (isActive ? " active" : "")}
              >
                Plan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/results"
                className={({ isActive }) => "nav-link px-3" + (isActive ? " active" : "")}
              >
                Results
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/login"
                className={({ isActive }) => "nav-link px-3" + (isActive ? " active" : "")}
              >
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
