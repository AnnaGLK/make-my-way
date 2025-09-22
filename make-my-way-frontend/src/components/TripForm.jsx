// src/components/TripForm.jsx
import React, { useCallback, useState } from "react"
import "./TripForm.css"
import { planTrip } from "../services/api"
import { searchCities } from "../services/geoDB"
import DebouncedInput from "./DebouncedInput"

const TRAVEL_STYLES = ["Urban Explorer", "Culture & History", "Chill & Relax", "Adventure Mode"]
const TRAVEL_MODES = ["driving", "bike", "walk"]
const TRAVEL_WITH = ["Adults only", "Family"]
const ACTIVITIES = [
  "museum",
  "sightseeing",
  "shopping",
  "beach",
  "hiking",
  "nightlife",
  "art",
  "nature",
  "spa",
  "theater",
]
const FOOD_PREFS = ["restaurant", "dining", "fast_food", "street_food", "cafe", "local"]

export default function TripForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    days: 0,
    travelStyle: "",
    travelMode: "",
    travelWith: "",
    activities: [],
    food: [],
  })

  const [originSuggestions, setOriginSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleDateChange = (field, value) => {
    const updated = { ...formData, [field]: value }
    if (updated.startDate && updated.endDate) {
      const start = new Date(updated.startDate)
      const end = new Date(updated.endDate)
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      updated.days = diff > 0 ? diff : 0
    }
    setFormData(updated)
  }

  const toggleArrayValue = (field, value, limit) => {
    setFormData((prev) => {
      let arr = Array.isArray(prev[field]) ? [...prev[field]] : []
      if (arr.includes(value)) arr = arr.filter((v) => v !== value)
      else if (arr.length < limit) arr.push(value)
      return { ...prev, [field]: arr }
    })
  }

  const prevStep = () => setStep((s) => Math.max(1, s - 1))
  const nextStep = () => setStep((s) => Math.min(6, s + 1))

  const handleSubmit = async () => {
    console.log(">>> handleSubmit CALLED")
    try {
      if (typeof planTrip === "function") {
        await planTrip(formData)
      }
      alert("Trip planned successfully!")
    } catch (err) {
      console.error("Plan trip error:", err)
      alert("Failed to plan trip.")
    }
  }

  const handleOriginDebouncedChange = useCallback(
    async (value) => {
      handleChange("origin", value)
      if (value.length > 2) {
        try {
          const results = await searchCities(value)
          setOriginSuggestions(Array.isArray(results) ? results : [])
        } catch {
          setOriginSuggestions([])
        }
      } else {
        setOriginSuggestions([])
      }
    },
    [handleChange]
  )

  const handleDestinationDebouncedChange = useCallback(
    async (value) => {
      handleChange("destination", value)
      if (value.length > 2) {
        try {
          const results = await searchCities(value)
          setDestinationSuggestions(Array.isArray(results) ? results : [])
        } catch {
          setDestinationSuggestions([])
        }
      } else {
        setDestinationSuggestions([])
      }
    },
    [handleChange]
  )

  return (
    <div className="tripform-wrapper">
      <div className="tripform-form">
        {/* Step 1: Origin & Destination */}
        {step === 1 && (
          <div className="tripform-step">
            <h2 className="tripform-title">Start your journey</h2>
            <label className="form-label">Origin</label>
            <DebouncedInput
              className="form-control"
              delay={500}
              onChange={handleOriginDebouncedChange}
              placeholder="Enter origin"
              value={formData.origin}
            />
            {originSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {originSuggestions.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => {
                      handleChange("origin", `${c.city}, ${c.country}`)
                      setOriginSuggestions([])
                    }}
                  >
                    {c.city}, {c.country}
                  </li>
                ))}
              </ul>
            )}

            <label className="form-label">Destination</label>
            <DebouncedInput
              className="form-control"
              delay={500}
              onChange={handleDestinationDebouncedChange}
              placeholder="Enter destination"
              value={formData.destination}
            />
            {destinationSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {destinationSuggestions.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => {
                      handleChange("destination", `${c.city}, ${c.country}`)
                      setDestinationSuggestions([])
                    }}
                  >
                    {c.city}, {c.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Step 2: Dates */}
        {step === 2 && (
          <div className="tripform-step">
            <h2 className="tripform-title">Select Dates</h2>
            <label className="form-label">Start Date</label>
            <input
              className="form-control"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              required
            />
            <label className="form-label">End Date</label>
            <input
              className="form-control"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              required
            />
            <div className="trip-days">
              Number of days: <strong>{formData.days}</strong>
            </div>
          </div>
        )}

        {/* Step 3: Travel Style */}
        {step === 3 && (
          <div className="tripform-step">
            <h2 className="tripform-title">Travel Style</h2>
            <div className="options-grid">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`option-btn ${formData.travelStyle === style ? "active" : ""}`}
                  onClick={() => handleChange("travelStyle", style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Travel Mode */}
        {step === 4 && (
          <div className="tripform-step">
            <h2 className="tripform-title">Travel Mode</h2>
            <div className="options-grid">
              {TRAVEL_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`option-btn ${formData.travelMode === mode ? "active" : ""}`}
                  onClick={() => handleChange("travelMode", mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Travel With */}
        {step === 5 && (
          <div className="tripform-step">
            <h2 className="tripform-title">Who are you travelling with?</h2>
            <div className="options-grid">
              {TRAVEL_WITH.map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`option-btn ${formData.travelWith === w ? "active" : ""}`}
                  onClick={() => handleChange("travelWith", w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Activities & Food */}
        {step === 6 && (
          <div className="tripform-step">
            <h2 className="tripform-title">Preferences</h2>
            <label className="form-label">Pick up to 4 activities</label>
            <div className="options-grid">
              {ACTIVITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`act-btn ${formData.activities.includes(a) ? "active" : ""}`}
                  onClick={() => toggleArrayValue("activities", a, 4)}
                >
                  {a}
                </button>
              ))}
            </div>
            <label className="form-label mt-3">Pick up to 2 food preferences</label>
            <div className="options-grid">
              {FOOD_PREFS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`act-btn ${formData.food.includes(f) ? "active" : ""}`}
                  onClick={() => toggleArrayValue("food", f, 2)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="tripform-actions d-flex">
          {step > 1 ? (
            <button type="button" className="btn btn-secondary trip-btn" onClick={prevStep}>
              Prev
            </button>
          ) : (
            <div />
          )}
          {step < 6 ? (
            <button type="button" className="btn btn-primary trip-btn" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="button" className="btn btn-success trip-btn" onClick={handleSubmit}>
              Let’s Go!
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
