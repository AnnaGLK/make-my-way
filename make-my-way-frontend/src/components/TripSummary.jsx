// src/components/TripSummary.jsx
import React from "react"
import { useTripStore } from "../stores/tripStore"

export default function TripSummary() {
  const {
    origin,
    destination,
    startDay,
    endDay,
    totalDays,
    travelStyle,
    travelMode,
    travelWith,
    activities,
    food,
  } = useTripStore()

  return (
    <div className="trip-summary">
      <h2>Trip Summary</h2>
      <ul>
        <li>
          <strong>Origin:</strong> {origin?.name || "Not selected"}
        </li>
        <li>
          <strong>Destination:</strong> {destination?.name || "Not selected"}
        </li>
        <li>
          <strong>Start Date:</strong> {startDay || "Not selected"}
        </li>
        <li>
          <strong>End Date:</strong> {endDay || "Not selected"}
        </li>
        <li>
          <strong>Total Days:</strong> {totalDays}
        </li>
        <li>
          <strong>Travel Style:</strong> {travelStyle || "Not selected"}
        </li>
        <li>
          <strong>Travel Mode:</strong> {travelMode || "Not selected"}
        </li>
        <li>
          <strong>Travel With:</strong> {travelWith || "Not selected"}
        </li>
        <li>
          <strong>Activities:</strong> {activities.length ? activities.join(", ") : "None"}
        </li>
        <li>
          <strong>Food:</strong> {food.length ? food.join(", ") : "None"}
        </li>
      </ul>
    </div>
  )
}
