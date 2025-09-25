// src/components/TripSummary.jsx
import React from "react"
import { useTripStore } from "../stores/tripStore"
import "./TripSummary.css"
import { getTripPath, saveTrip } from "../services/api.js"
import { useNavigate } from "react-router-dom"

export default function TripSummary() {
  const tripState = useTripStore()
  const navigate = useNavigate()

  const {
    origin,
    destination,
    startDate,
    endDate,
    totalDays,
    travelMode,
    originInfo,
    destinationInfo,
    itinerary,
    geminiPlan,
    selectPlace,
    setOverviewPolyline,
    overviewPolyline,
  } = tripState

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  function formatTime(timeStr) {
    if (!timeStr) return ""
    const hours = timeStr.slice(0, 2)
    const minutes = timeStr.slice(2)
    return `${hours}:${minutes}`
  }

  const isSelected = (day, category, placeId) => {
    const dayBlock = itinerary.find((d) => d.day === day)
    if (!dayBlock) return false
    const activity = dayBlock.activities.find((a) => a.category === category)
    return activity?.place?.placeId === placeId
  }

  const getPolyline = async () => {
    try {
      const waypoints = itinerary
        .map((day) =>
          day.activities.map((act) => ({
            latitude: act.place.coordinates.latitude,
            longitude: act.place.coordinates.longitude,
          }))
        )
        .flat()

      const tripPathRequest = {
        origin: {
          latitude: originInfo.coordinates.latitude,
          longitude: originInfo.coordinates.longitude,
        },
        destination: {
          latitude: destinationInfo.coordinates.latitude,
          longitude: destinationInfo.coordinates.longitude,
        },
        waypoints,
      }

      const polyline = await getTripPath(tripPathRequest)
      setOverviewPolyline(polyline)

      return polyline
    } catch (err) {
      console.error("Get trip path error:", err)
      alert("Failed to get trip path.")
    }
  }

  const createTripMapForDB = async (polyline) => {
    try {
      const finalTrip = {
        tripInfo: {
          origin: origin,
          destination: destination,
          travelMode: travelMode,
          startDate: startDate,
          endDate: endDate,
        },
        originInfo,
        destinationInfo,
        itinerary,
        tripPath: {
          overviewPolyline: polyline,
        },
      }

      console.log("Final trip to save:", finalTrip)

      await saveTrip(finalTrip)
      // alert("Trip saved successfully!")
      navigate("/results")
    } catch (err) {
      console.error("Save trip error:", err)
      alert("Failed to save trip.")
    }
  }

  const handleSave = async () => {
    const polyline = await getPolyline()
    await createTripMapForDB(polyline)
  }

  return (
    <div className="trip-summary">
      <div className="trip-header">
        <h2>
          {origin} → {destination}
        </h2>
        <p>
          {startDate} → {endDate} ({totalDays} days)
        </p>
        <p>Mode: {travelMode}</p>
      </div>

      <div className="itinerary">
        {geminiPlan?.itinerary?.map((day, dayIdx) => (
          <div key={dayIdx} className="day-block">
            <h3>Day {day.day}</h3>

            {day.categories.map((cat, catIdx) => (
              <div key={catIdx} className="category-block">
                <h4>{cat.category}</h4>

                <div className="options-row">
                  {cat.options.map((place) => (
                    <div
                      key={place.placeId}
                      className={`place-card ${
                        isSelected(day.day, cat.category, place.placeId) ? "selected" : ""
                      }`}
                    >
                      {place.photo && (
                        <img src={place.photo} alt={place.name} className="place-photo" />
                      )}
                      <div className="place-info">
                        <h5>{place.name}</h5>

                        {place.address && <p className="address">{place.address}</p>}

                        {place.summary && <p className="summary">{place.summary}</p>}

                        {place.openingHours && place.openingHours.length > 0 && (
                          <div className="opening-hours">
                            <strong>Hours:</strong>
                            <ul>
                              {place.openingHours?.map((h, idx) => {
                                const dayName = daysOfWeek[h.open?.day ?? h.close?.day ?? idx]
                                const openTime = h.open?.time ? formatTime(h.open.time) : ""
                                const closeTime = h.close?.time ? formatTime(h.close.time) : ""
                                return (
                                  <li key={idx}>
                                    {dayName}: {openTime} {closeTime && `- ${closeTime}`}
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}

                        {place.phone && <p className="phone">📞 {place.phone}</p>}

                        {place.website && (
                          <p>
                            🌐{" "}
                            <a href={place.website} target="_blank" rel="noreferrer">
                              Website
                            </a>
                          </p>
                        )}

                        {place.url && (
                          <p>
                            🗺{" "}
                            <a href={place.url} target="_blank" rel="noreferrer">
                              Google Maps
                            </a>
                          </p>
                        )}

                        <p className="rating">⭐ {place.rating || "N/A"}</p>

                        <button
                          className="select-btn"
                          onClick={() => selectPlace(day.day, cat.category, place)}
                        >
                          {isSelected(day.day, cat.category, place.placeId) ? "Unselect" : "Select"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="save-block">
        <button className="save-btn" onClick={handleSave}>
          💾 Save Trip
        </button>
      </div>
    </div>
  )
}
