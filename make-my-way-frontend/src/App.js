import React, { Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import TripFormPage from "./pages/TripFormPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import TripSummary from "./components/TripSummary"
import TripResults from "./pages/TripResults"

// Create these files next: src/routes/HomePage.jsx, TripResults.jsx, Dashboard.jsx, Login.jsx
// const HomePage = lazy(() => import('./routes/trip.routes'));
// const TripResults = lazy(() => import('./routes/TripResults'));
// const Dashboard = lazy(() => import('./routes/Dashboard'));
// const Login = lazy(() => import('./routes/Login'));

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="container-fluid px-0 px-md-0">
        <Suspense
          fallback={
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "40vh" }}
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tripform" element={<TripFormPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/summary" element={<TripSummary />} />
            <Route path="/results" element={<TripResults />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
