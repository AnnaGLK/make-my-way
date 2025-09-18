import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy load pages so the initial bundle stays small.
// Create these files next: src/routes/HomePage.jsx, TripResults.jsx, Dashboard.jsx, Login.jsx
const HomePage = lazy(() => import('./routes/HomePage'));
const TripResults = lazy(() => import('./routes/TripResults'));
const Dashboard = lazy(() => import('./routes/Dashboard'));
const Login = lazy(() => import('./routes/Login'));

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      {/* container-fluid keeps layout edge-to-edge on small screens */}
      <main className="container-fluid px-2 px-md-4">
        <Suspense
          fallback={
            <div className="d-flex justify-content-center align-items-center" style={{ height: '40vh' }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<TripResults />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}