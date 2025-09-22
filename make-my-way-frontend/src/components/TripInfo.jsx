import React from "react"
import "./TripInfo.css"

const formatDate = (dateString) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString()
}

const TripInfo = ({ trip }) => {
  if (!trip) return null

  const { tripInfo, originInfo, destinationInfo, itinerary } = trip

  return (
    <div className="trip-card">
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
  )
}

export default TripInfo
