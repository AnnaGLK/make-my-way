import React, { useState, useEffect } from "react"
import "./TripInfo.css"
import {
  deleteTrip,
  inviteToTrip,
  getTripMembers,
  removeFromTrip,
  leaveSharedTrip,
} from "../services/api.js"
import TripMap from "./TripMap.jsx"

const formatDate = (dateString) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString()
}

const TripInfo = ({ trip, isOwner }) => {
  const [inviteEmail, setInviteEmail] = useState("")
  const [members, setMembers] = useState([])
  const tripId = trip?.id || trip?._id

  useEffect(() => {
    if (!tripId || !isOwner) return
    const fetchMembers = async () => {
      try {
        const data = await getTripMembers(tripId)
        setMembers(data)
      } catch (error) {
        console.error("Error fetching members:", error)
      }
    }
    fetchMembers()
  }, [tripId, isOwner])

  const { tripInfo, originInfo, destinationInfo, itinerary } = trip

  const handleDelete = async () => {
    try {
      await deleteTrip(tripId)
      alert("Trip deleted successfully!")
    } catch (error) {
      console.error("Error deleting trip:", error)
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail) {
      alert("Please enter an email address.")
      return
    }
    try {
      await inviteToTrip(tripId, inviteEmail)
      alert("Invitation sent successfully!")
      setInviteEmail("")
      const data = await getTripMembers(tripId)
      setMembers(data)
    } catch (error) {
      console.error("Error sending invite:", error)
      const message = error.response?.data?.error || "Failed to send invite."
      alert(message)
    }
  }

  const handleRemoveMember = async (email) => {
    if (!window.confirm(`Remove ${email} from trip?`)) return
    try {
      await removeFromTrip(tripId, email)
      alert("User removed from trip")
      setMembers((prev) => prev.filter((m) => m.email !== email))
    } catch (error) {
      console.error("Error removing member:", error)
      const message = error.response?.data?.error || "Failed to remove user."
      alert(message)
    }
  }

  const handleLeaveTrip = async () => {
    if (!window.confirm("Are you sure you want to leave this trip?")) return
    try {
      await leaveSharedTrip(tripId)
      alert("You left the trip.")
    } catch (error) {
      console.error("Error leaving trip:", error)
      const message = error.response?.data?.error || "Failed to leave trip."
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

        {trip.tripPath && originInfo?.coordinates && (
          <TripMap
            path={trip.tripPath}
            origin={originInfo.coordinates}
            destination={destinationInfo?.coordinates}
          />
        )}

        {trip.pdfUrl && (
          <a
            href={trip.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary pdf-btn"
          >
            Download PDF
          </a>
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
        {isOwner ? (
          <>
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
              <button type="submit" className="btn btn-primary">
                Invite
              </button>
            </form>

            <div className="members-list">
              <h4>Members</h4>
              {members.length > 0 ? (
                <ul>
                  {members.map((m) => (
                    <li key={m.id} className="member-item">
                      <div className="member-info">
                        <div>{m.name}</div>
                        {/* <div>{m.email}</div> */}
                        <div>{m.role}</div>
                      </div>
                      {m.role !== "owner" && (
                        <button className="remove-btn" onClick={() => handleRemoveMember(m.email)}>
                          X
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members found.</p>
              )}
            </div>
          </>
        ) : (
          <button className="leave-btn" onClick={handleLeaveTrip}>
            Leave Trip
          </button>
        )}
      </div>
    </div>
  )
}

export default TripInfo
