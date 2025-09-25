// src/components/TripForm.jsx
import React, { useCallback, useState } from "react"
import "../styles/TripForm.css";
import { planTrip } from "../services/api"
import { searchCities } from "../services/geoDB"
import DebouncedInput from "./DebouncedInput"
import { useTripStore } from "../stores/tripStore"
import { useNavigate } from "react-router-dom"
import LoadingPopup from "./LoadingPopup"

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
    const [originSuggestions, setOriginSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const {
        origin,
        destination,
        startDate,
        endDate,
        days,
        travelStyle,
        travelMode,
        travelWith,
        activities,
        food,
        setField,
        toggleArrayValue,
        countDays,
    } = useTripStore()

    const prevStep = () => setStep((s) => Math.max(1, s - 1))
    const nextStep = () => setStep((s) => Math.min(6, s + 1))

    const handleSubmit = async () => {
        const tripData = {
            origin,
            destination,
            startDate,
            endDate,
            days,
            travelStyle,
            travelMode,
            travelWith,
            activities,
            food,
        }

        setLoading(true)

        try {
            const tripInfo = await planTrip(tripData)

            setField("originInfo", tripInfo.originInfo)
            setField("destinationInfo", tripInfo.destinationInfo)
            setField("geminiPlan", tripInfo.geminiPlan)

            navigate("/summary")
        } catch (err) {
            console.error("Plan trip error:", err)
            alert("Failed to plan trip.")
        } finally {
            setLoading(false)
        }
    }

    const handleOriginDebouncedChange = useCallback(
        async (value) => {
            setField("origin", value)
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
        [setField]
    )

    const handleDestinationDebouncedChange = useCallback(
        async (value) => {
            setField("destination", value)
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
        [setField]
    )

    return (
        <div className="tripform-wrapper">
            <div className="tripform-form">
                {/* Step 1: Origin & Destination */}
                {step === 1 && (
                    <div className="tripform-step">
                        <div className="tripform-header first d-flex">
                            <h2 className="tripform-title">Where are you heading?</h2>
                        </div>
                        <div className="tripform-body p-3">
                            <p className="tripform-sub text-center">Please tell us your destinations</p>
                            <label className="form-label">Origin</label>
                            <DebouncedInput
                                className="form-control"
                                delay={500}
                                onChange={handleOriginDebouncedChange}
                                placeholder="Enter origin"
                                value={origin}
                            />
                            {originSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {originSuggestions.map((c) => (
                                        <li
                                            key={c.id}
                                            onClick={() => {
                                                setField("origin", `${c.city}, ${c.country}`)
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
                                value={destination}
                            />
                            {destinationSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {destinationSuggestions.map((c) => (
                                        <li
                                            key={c.id}
                                            onClick={() => {
                                                setField("destination", `${c.city}, ${c.country}`)
                                                setDestinationSuggestions([])
                                            }}
                                        >
                                            {c.city}, {c.country}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Dates */}
                {step === 2 && (
                    <div className="tripform-step">
                        <div className="tripform-header d-flex">
                            <h2 className="tripform-title">When will you travel?</h2>
                        </div>
                        <div className="tripform-body p-3">
                            <p className="tripform-sub text-center">Please select dates</p>
                            <label className="form-label">Start Date</label>
                            <input
                                className="form-control"
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setField("startDate", e.target.value)
                                    countDays()
                                }}
                                required
                            />
                            <label className="form-label">End Date</label>
                            <input
                                className="form-control"
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setField("endDate", e.target.value)
                                    countDays()
                                }}
                                required
                            />
                            <div className="trip-days">
                                Number of days: <strong>{days}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Travel Style */}
                {step === 3 && (
                    <div className="tripform-step">
                        <div className="tripform-header d-flex">
                            <h2 className="tripform-title">What’s your vibe?</h2>
                        </div>
                        <div className="tripform-body p-3">
                            <p className="tripform-sub text-center">Please tell us your Travel Style</p>
                            <div className="options-grid">
                                {TRAVEL_STYLES.map((style) => (
                                    <button
                                        key={style}
                                        type="button"
                                        className={`option-btn ${travelStyle === style ? "active" : ""}`}
                                        onClick={() => setField("travelStyle", style)}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Travel Mode */}
                {step === 4 && (
                    <div className="tripform-step">
                        <div className="tripform-header d-flex">
                            <h2 className="tripform-title">How will you get around?</h2>
                        </div>
                        <div className="tripform-body p-3">
                            <p className="tripform-sub text-center">Please tell us your Travel Mode</p>
                            <div className="options-grid">
                                {TRAVEL_MODES.map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        className={`option-btn ${travelMode === mode ? "active" : ""}`}
                                        onClick={() => setField("travelMode", mode)}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Travel With */}
                {step === 5 && (
                    <div className="tripform-step">
                        <div className="tripform-header d-flex">
                            <h2 className="tripform-title">Who’s coming along?</h2>
                        </div>
                        <div className="tripform-body p-3">
                            <p className="tripform-sub text-center">Who are you travelling with?</p>
                            <div className="options-grid">
                                {TRAVEL_WITH.map((w) => (
                                    <button
                                        key={w}
                                        type="button"
                                        className={`option-btn ${travelWith === w ? "active" : ""}`}
                                        onClick={() => setField("travelWith", w)}
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 6: Activities & Food */}
                {step === 6 && (
                    <div className="tripform-step">
                        <div className="tripform-header d-flex">
                            <h2 className="tripform-title">Choose your favorites</h2>
                        </div>
                        <div className="tripform-body p-3">
                            <p className="tripform-sub text-center">Choose your preferences</p>

                            <label className="form-label">Pick up to 4 activities</label>
                            <div className="options-grid">
                                {ACTIVITIES.map((a) => (
                                    <button
                                        key={a}
                                        type="button"
                                        className={`act-btn ${activities.includes(a) ? "active" : ""}`}
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
                                        className={`act-btn ${food.includes(f) ? "active" : ""}`}
                                        onClick={() => toggleArrayValue("food", f, 2)}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="tripform-actions d-flex p-3">
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
                        <button
                            type="button"
                            className="btn btn-success trip-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            ) : (
                                "Let’s Go!"
                            )}
                        </button>
                    )}
                </div>
            </div>
            {loading && <LoadingPopup />}
        </div>
    )
}
