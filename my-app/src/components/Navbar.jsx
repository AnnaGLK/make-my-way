// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src=".././media/favicon.png" alt="MakeMyWay" width="36" height="36" className="me-2 rounded" />
          <span className="fw-bold">MakeMyWay</span>
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
              <NavLink to="/" end className={({ isActive }) => 'nav-link px-3' + (isActive ? ' active' : '')}>
                Plan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/results" className={({ isActive }) => 'nav-link px-3' + (isActive ? ' active' : '')}>
                Results
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/dashboard" className={({ isActive }) => 'nav-link px-3' + (isActive ? ' active' : '')}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login" className={({ isActive }) => 'nav-link px-3' + (isActive ? ' active' : '')}>
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
