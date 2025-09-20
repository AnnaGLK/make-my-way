// src/components/TripForm.jsx
import React, { useState } from "react";
import "./TripForm.css";
import { planTrip } from "../services/api"; // keep if you have this service
import { searchCities } from "../api/geoDB"; // keep if you have this service

const TRAVEL_STYLES = ["Urban Explorer", "Culture & History", "Chill & Relax", "Adventure Mode"];
const TRAVEL_MODES = ["driving", "bike", "walk"];
const TRAVEL_WITH = ["Adults only", "Family"];
const ACTIVITIES = ["museum", "sightseeing", "shopping", "beach", "hiking", "nightlife", "art", "nature", "spa", "theater"];
const FOOD_PREFS = ["restaurant", "dining", "fast_food", "street_food", "cafe", "local"];

export default function TripForm() {
  const [step, setStep] = useState(1);
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
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (updated.startDate && updated.endDate) {
      const start = new Date(updated.startDate);
      const end = new Date(updated.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      updated.days = diff > 0 ? diff : 0;
    }
    setFormData(updated);
  };

  const toggleArrayValue = (field, value, limit) => {
    setFormData((prev) => {
      let arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
      if (arr.includes(value)) arr = arr.filter((v) => v !== value);
      else if (arr.length < limit) arr.push(value);
      return { ...prev, [field]: arr };
    });
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));
  const nextStep = () => setStep((s) => Math.min(6, s + 1));

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    try {
      if (typeof planTrip === "function") {
        await planTrip(formData);
      }
      alert("Trip planned successfully!");

    } catch (err) {
      console.error("Plan trip error:", err);
      alert("Failed to plan trip.");
    }
  };

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);


  return (
    <div className="tripform-wrapper">


      <form onSubmit={handleSubmit} className="tripform-form">
        {/* Step 1: Origin & Destination */}
        {step === 1 && (
          <div className="tripform-step">
            <div className="tripform-header">
              <h2 className="tripform-title">Start your journey</h2>
            </div>
            <div>
              <p className="tripform-sub text-center">Please tell us your destinations</p>
              <label className="form-label">Origin</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter origin (city or country)"
                value={formData.origin}
                onChange={async (e) => {
                  const value = e.target.value;
                  handleChange("origin", value);
                  if (value.length > 2) {
                    const results = await searchCities(value);
                    setOriginSuggestions(results);
                  } else {
                    setOriginSuggestions([]);
                  }
                }}
              />
              {originSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {originSuggestions.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => {
                        handleChange("origin", `${c.city}, ${c.country}`);
                        setOriginSuggestions([]);
                      }}
                    >
                      {c.city}, {c.country}
                    </li>
                  ))}
                </ul>
              )}

              <label className="form-label">Destination</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter destination (city or country)"
                value={formData.destination}
                onChange={async (e) => {
                  const value = e.target.value;
                  handleChange("destination", value);
                  if (value.length > 2) {
                    const results = await searchCities(value);
                    setDestinationSuggestions(results);
                  } else {
                    setDestinationSuggestions([]);
                  }
                }}
              />
              {destinationSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {destinationSuggestions.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => {
                        handleChange("destination", `${c.city}, ${c.country}`);
                        setDestinationSuggestions([]);
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
            <div className="tripform-header">
              <h2 className="tripform-title">Start your journey</h2>
            </div>
            <div>
              <p className="tripform-sub text-center">Please tell us your dates</p>
              <label className="form-label">Start Date</label>
              <input
                className="form-control"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                required
              />

              <label className="form-label">End Date</label>
              <input
                className="form-control"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
                required
              />

              <div className="trip-days">Number of days: <strong>{formData.days}</strong></div>
            </div>
          </div>
        )}

        {/* Step 3: Travel Style */}
        {step === 3 && (
          <div className="tripform-step">
            <div className="tripform-header">
              <h2 className="tripform-title">Start your journey</h2>
            </div>
            <div>
              <p className="tripform-sub text-center">Please tell us your Travel Style</p>
              <div className="options-grid">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`option-btn ${formData.travelStyle === style ? "active" : ""}`}
                    onClick={() => handleChange("travelStyle", style)}
                    style={{ backgroundImage: `url(/images/${style.toLowerCase()}.jpg)` }}
                  >
                    <span className="option-label">{style}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Travel Mode */}
        {step === 4 && (
          <div className="tripform-step">
            <div className="tripform-header">
              <h2 className="tripform-title">Start your journey</h2>
            </div>
            <div>
              <p className="tripform-sub text-center">Please tell us your Travel Mode</p>
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
          </div>
        )}

        {/* Step 5: Travel With */}
        {step === 5 && (
          <div className="tripform-step">
            <div className="tripform-header">
              <h2 className="tripform-title">Start your journey</h2>
            </div>
            <div>
              <p className="tripform-sub text-center">Who are you travelling with?</p>
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
          </div>
        )}

        {/* Step 6: Activities & Food */}
        {step === 6 && (
          <div className="tripform-step">
            <div className="tripform-header">
              <h2 className="tripform-title">Start your journey</h2>
            </div>
            <div>
              <p className="tripform-sub text-center">Choose your preferences</p>
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
            <button type="submit" className="btn btn-success trip-btn">
              Let’s Go!
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
