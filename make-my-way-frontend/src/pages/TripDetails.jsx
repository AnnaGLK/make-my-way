import React, { useEffect } from "react"
import { useParams, Navigate } from "react-router-dom"
import TripInfo from "../components/TripInfo"
import { useTripStore } from "../stores/tripStore.js"
import { getTripById } from "../services/api.js"

const TripDetails = () => {
  const { tripId } = useParams()

  const { currentTrip, setCurrentTrip } = useTripStore()

  useEffect(() => {
    const fetchTrip = async () => {
      if (!currentTrip || (currentTrip.id || currentTrip._id) !== tripId) {
        try {
          const data = await getTripById(tripId)

          if (data) {
            setCurrentTrip(data)
          }
        } catch (error) {
          console.error("Error fetching trip:", error)
        }
      }
    }
    fetchTrip()
  }, [tripId, currentTrip, setCurrentTrip])

  if (!currentTrip) {
    return <Navigate to="/results" replace />
  }

  return <TripInfo trip={currentTrip} isOwner={currentTrip.isOwner} />
}

export default TripDetails
