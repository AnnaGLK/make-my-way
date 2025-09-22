import React, { useState } from "react"
import "./TripInfo.css"
import { deleteTrip, inviteToTrip } from "../services/api.js"

const formatDate = (dateString) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString()
}

const TripInfo = ({ trip }) => {
  const [inviteEmail, setInviteEmail] = useState("")

  if (!trip) return null

  const { id: tripId, tripInfo, originInfo, destinationInfo, itinerary } = trip

  const handleDelete = async () => {
    try {
      await deleteTrip(tripId)
      alert("Trip deleted successfully!")
    } catch (error) {
      console.error("Error deleting trip:", error)
    }
  }

  const handleInvite = async (e) => {
    try {
      e.preventDefault()
      if (!inviteEmail) {
        alert("Please enter an email address.")
        return
      }
      await inviteToTrip(tripId, inviteEmail)
      alert("Invitation sent successfully!")
      setInviteEmail("")
    } catch (error) {
      console.error("Error sending invite:", error)
      const message = error.response?.data?.error || "Failed to send invite."
      alert(message)
    }
  }

  return (
    <div className="trip-card">
      {/* Left column */}
      <div className="trip-info">
        <h2 className="trip-title">
          {originInfo?.address} → {destinationInfo?.address}
        </h2>

        <p>
          <span className="label">Travel mode:</span> {tripInfo?.travelMode}
        </p>
        {tripInfo?.startDate && tripInfo?.endDate && (
          <p>
            <span className="label">Dates:</span> {formatDate(tripInfo.startDate)} —{" "}
            {formatDate(tripInfo.endDate)}
          </p>
        )}

        <h3 className="itinerary-heading">Itinerary</h3>
        {itinerary && itinerary.length > 0 ? (
          itinerary.map((day) => (
            <div key={day._id} className="itinerary-day">
              <p className="day-title">Day {day.day}</p>
              <ul className="activity-list">
                {day.activities.map((activity) => (
                  <li key={activity._id} className="activity-item">
                    <div className="activity-header">
                      <strong>{activity.place?.name}</strong>{" "}
                      <span className="category">({activity.category})</span>
                    </div>
                    <p className="activity-address">{activity.place?.address}</p>
                    {activity.place?.url && (
                      <a
                        href={activity.place.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        View on Google Maps
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="empty-itinerary">No itinerary available.</p>
        )}
      </div>

      {/* Right column */}
      <div className="trip-actions">
        <button className="delete-btn" onClick={handleDelete}>
          Delete Trip
        </button>

        <form onSubmit={handleInvite} className="invite-form">
          <input
            type="email"
            placeholder="Invite user by email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button type="submit" className="invite-btn">
            Invite
          </button>
        </form>
      </div>
    </div>
  )
}

export default TripInfo
