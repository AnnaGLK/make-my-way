import { useEffect, useState } from "react"
import { getUserTrips } from "../services/api"
import TripCard from "../components/TripCard"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import "../styles/HomePage.css"

export default function HomePage() {
  const { token, activeUser, loading } = useAuth()
  const [trips, setTrips] = useState([])

  useEffect(() => {
    if (token) {
      getUserTrips()
        .then((res) => setTrips(res))
        .catch(() => {})
    }
  }, [token])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Hero Section --- */}
      <section className="relative flex min-vh-100 items-center justify-center text-center">
        <div className="hero main-hero">
          <img src={process.env.PUBLIC_URL + "/media/hero1.jpg"} alt="hero" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-black px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Plan Your Next Adventure</h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl">
            Discover amazing destinations, activities, and experiences — tailored just for you.
          </p>
          <Link to="/tripform" className="btn btn-primary transition">
            Start Your Trip
          </Link>
        </div>
      </section>

      {/* --- Latest Trips (only for logged-in user) ---  */}
      {activeUser && trips.length > 0 && (
        <section className="px-4 py-12">
          <h2 className="text-2xl font-semibold mb-4">Your Latest Trips</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
