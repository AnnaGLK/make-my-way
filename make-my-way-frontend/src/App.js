import React, { Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import TripFormPage from "./pages/TripFormPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import TripSummary from "./components/TripSummary"
import TripResults from "./pages/TripResults"

import TripDetails from "./pages/TripDetails"
import ProtectedRoute from "./auth/ProtectedRoute.js"

// Create these files next: src/routes/HomePage.jsx, TripResults.jsx, Dashboard.jsx, LoginPage.js
// const HomePage = lazy(() => import('./routes/trip.routes'));
// const TripResults = lazy(() => import('./routes/TripResults'));
// const Dashboard = lazy(() => import('./routes/Dashboard'));
// const Login = lazy(() => import('./routes/LoginPage.js'));

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tripform"
              element={
                <ProtectedRoute>
                  <TripFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/summary"
              element={
                <ProtectedRoute>
                  <TripSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <TripResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trip/:tripId"
              element={
                <ProtectedRoute>
                  <TripDetails />
                </ProtectedRoute>
              }
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
