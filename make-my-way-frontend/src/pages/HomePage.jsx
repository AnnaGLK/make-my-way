// import { useEffect, useState } from "react";
// import { getUserTrips } from "../services/api";
// import TripCard from "../components/TripCard"; 
import { Link } from "react-router-dom";
import './HomePage.css';

export default function HomePage() {
//   const [user, setUser] = useState(null);
//   const [trips, setTrips] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setUser({ name: "Traveler" }); // stub user, replace with backend call
//       getUserTrips()
//         .then((res) => setTrips(res.slice(0, 5)))
//         .catch(() => {});
//     }
//   }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* --- Navbar ---
      <nav className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <div className="flex items-center">
          <button className="mr-4 md:hidden">
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </button>
          <span className="font-bold text-xl text-blue-600">TripPlanner</span>
        </div>
        <div>
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">{user.name}</span>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                👤
              </div>
            </div>
          )}
        </div>
      </nav> */}

      {/* --- Hero Section --- */}
      <section
        className="relative bg-cover bg-center h-[80vh]"
        style={{ backgroundImage: "url('./public/media/hero1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-black px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Plan Your Next Adventure
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl">
            Discover amazing destinations, activities, and experiences — tailored just for you.
          </p>
          <Link
            to="/tripform"
            className="bg-blue-500 hover:bg-blue-600 text-black px-6 py-3 rounded-lg text-lg font-semibold transition"
          >
            Start Your Trip
          </Link>
        </div>
      </section>

      {/* --- Latest Trips (only for logged-in user) --- 
      {user && trips.length > 0 && (
        <section className="px-4 py-12">
          <h2 className="text-2xl font-semibold mb-4">Your Latest Trips</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      )}*/}
    </div>
  );
}
