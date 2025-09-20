// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { getUserTrips } from "../services/api";
import TripForm from "../components/TripForm";

export default function HomePage() {
    const [user, setUser] = useState(null); // replace with real auth context later
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ name: "Traveler" }); // stub user, replace with backend call
            getUserTrips()
                .then((res) => setTrips(res.slice(0, 5)))
                .catch(() => { });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* --- Navbar --- */}
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
            </nav>

            {/* --- Hero / Start Trip --- */}
            <section className="text-center py-16 px-4">
                <h1 className="text-3xl font-bold mb-4">Let’s Start Your Trip</h1>
                <p className="text-gray-600 mb-8">
                    Plan your next adventure in just a few steps.
                </p>
                <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
                    <TripForm />
                </div>
            </section>

            {/* --- Latest Trips (only for logged-in user) --- */}
            {user && trips.length > 0 && (
                <section className="px-4 pb-12">
                    <h2 className="text-2xl font-semibold mb-4">Your Latest Trips</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {trips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
