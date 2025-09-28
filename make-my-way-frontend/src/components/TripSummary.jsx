// src/components/TripSummary.jsx
import React, { useState } from "react"
import { useTripStore } from "../stores/tripStore"
import "./TripSummary.css"
import { getTripPath, saveTrip } from "../services/api.js"
import { useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import LoadingPopup from "./LoadingPopup"

export default function TripSummary() {
  const tripState = useTripStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    origin,
    destination,
    startDate,
    endDate,
    days,
    // totalDays,
    travelMode,
    originInfo,
    destinationInfo,
    itinerary,
    geminiPlan,
    selectPlace,
    setOverviewPolyline,
    overviewPolyline,
  } = tripState

  const [activeTab, setActiveTab] = useState(0)
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



      await saveTrip(finalTrip)
      // alert("Trip saved successfully!")
      navigate("/results")
    } catch (err) {
      console.error("Save trip error:", err)
      alert("Failed to save trip.")
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const polyline = await getPolyline()
      await createTripMapForDB(polyline)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="trip-summary">
      <div className="trip-header  d-flex">
        <h2 className="trip-Htitle">Plan Your Adventure</h2>
      </div>
      <div className="trip-body p-3">
        <p className="tripform-sub text-center">
          Please select <strong>one card from each category every day</strong> to complete your trip
          map.
        </p>
        <h2 className="trip-title my-3">
          {origin} → {destination}
        </h2>
        <p>
          {startDate} → {endDate} ({days} days)
        </p>
        <p>Mode: {travelMode}</p>


        <div className="itinerary">
          {geminiPlan?.itinerary?.map((day, dayIdx) => (
            <div key={dayIdx} className="day-block my-4">
              <h3>Day {day.day}</h3>

              {/* NEW: Tabs for categories */}
              <div className="d-flex justify-content-evenly flex-wrap my-3">
                {day.categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className={` act-btn ${activeTab === idx ? "active" : ""}`}
                    onClick={() => setActiveTab(idx)}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* NEW: Swiper for options */}
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={20}
                // CHANGED: show 1 on mobile, 3 on desktop
                breakpoints={{
                  0: { slidesPerView: 1 },      // mobile
                  768: { slidesPerView: 2 },    // tablet
                  1024: { slidesPerView: 3 },   // desktop
                }}
                className="options-swiper"
              >
                {day.categories[activeTab].options?.map((place) => (
                  <SwiperSlide key={place.placeId}>
                    <div
                      className={`place-card ${isSelected(day.day, day.categories[activeTab].category, place.placeId)
                        ? "selected"
                        : ""
                        }`}
                    >
                      {/* Top image */}
                      {place.photo && (
                        <img src={place.photo} alt={place.name} className="place-photo-top" />
                      )}

                      <div className="place-info">
                        <h5 className="place-name">{place.name}</h5>
                        {place.address && <p className="place-address">{place.address}</p>}
                        {place.summary && <p className="place-summary">{place.summary}</p>}
                        <p className="place-rating">⭐ {place.rating || "N/A"}</p>

                        {/* Collapsible opening hours */}
                        {place.openingHours && place.openingHours.length > 0 && (
                          <details className="opening-hours">
                            <summary>
                              <span>Opening Hours</span> <span className="arrow">▼</span>
                            </summary>
                            <ul>
                              {place.openingHours.map((h, idx) => {
                                const dayName =
                                  daysOfWeek[h.open?.day ?? h.close?.day ?? idx]
                                const openTime = h.open?.time ? formatTime(h.open.time) : ""
                                const closeTime = h.close?.time ? formatTime(h.close.time) : ""
                                return (
                                  <li key={idx}>
                                    {dayName}: {openTime} {closeTime && `- ${closeTime}`}
                                  </li>
                                )
                              })}
                            </ul>
                          </details>
                        )}

                        {/* Action buttons */}
                        <div className="action-buttons">
                          {place.phone && (
                            <button
                              className="action-btn"
                              onClick={() => (window.location.href = `tel:${place.phone}`)}
                            >
                              📞 Call
                            </button>
                          )}
                          {place.website && (
                            <button
                              className="action-btn"
                              onClick={() => window.open(place.website, "_blank")}
                            >
                              🌐 Website
                            </button>
                          )}
                          {place.url && (
                            <button
                              className="action-btn"
                              onClick={() => window.open(place.url, "_blank")}
                            >
                              🗺 Map
                            </button>
                          )}
                        </div>

                        {/* Select button */}
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            selectPlace(day.day, day.categories[activeTab].category, place)
                          }
                        >
                          {isSelected(
                            day.day,
                            day.categories[activeTab].category,
                            place.placeId
                          )
                            ? "Selected"
                            : "Select"}
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </div>

        <div className="save-block ">
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Trip"}
          </button>
        </div>
      </div>
      {loading && <LoadingPopup />}
    </div>
  )
}
