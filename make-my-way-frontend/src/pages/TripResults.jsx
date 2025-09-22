import React, { useEffect, useState } from "react"
import TripInfo from "../components/TripInfo"
// import { useTripStore } from "../stores/tripStore" // если используешь Zustand
import { getUserTrips } from "../services/api.js"

const TripResultPage = () => {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getUserTrips()
        setTrips(data)
        console.log("Fetched trips:", data)
      } catch (error) {
        console.error("Error fetching trips:", error)
      }
    }

    fetchTrips()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Мои поездки</h1>
      {trips.length === 0 ? (
        <p>У вас пока нет сохранённых поездок.</p>
      ) : (
        trips.map((trip) => <TripInfo key={trip.id} trip={trip} />)
      )}
    </div>
  )
}

export default TripResultPage
