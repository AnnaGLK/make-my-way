import React, { useCallback, useEffect, useState } from "react";
import "../styles/TripForm.css";
import { planTrip } from "../services/api";
import { searchCities } from "../services/geoDB";
import DebouncedInput from "./DebouncedInput";

const TRAVEL_STYLES = ["Urban Explorer", "Culture & History", "Chill & Relax", "Adventure Mode"];
const TRAVEL_MODES = ["driving", "bike", "walk"];
const TRAVEL_WITH = ["Adults only", "Family"];
const ACTIVITIES = ["museum", "sightseeing", "shopping", "beach", "hiking", "nightlife", "art", "nature", "spa", "theater"];
const FOOD_PREFS = ["restaurant", "dining", "fast_food", "street_food", "cafe", "local"];
const STORAGE_KEY = "tripFormData";

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

    const handleChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

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
            if (arr.includes(value)) {
                arr = arr.filter((v) => v !== value);
            } else {
                if (limit && arr.length >= limit) {
                    return prev;
                }
                arr.push(value);
            }
            return { ...prev, [field]: arr };
        });
    };

    const prevStep = () => setStep((s) => Math.max(1, s - 1));
    const nextStep = () => setStep((s) => Math.min(6, s + 1));

    const [plannedTrip, setPlannedTrip] = useState(null);

    const handleSubmit = async (e) => {
        e && e.preventDefault();
        // try {
        //     if (!formData.origin || !formData.destination || !formData.startDate || !formData.endDate) {
        //         alert("Please fill in all required fields (origin, destination, start & end dates).");
        //         return;
        //     }
        if (!formData.origin || !formData.destination || !formData.startDate || !formData.endDate) {
            alert("Please fill in all required fields (origin, destination, start & end dates).");
            return;
        }

        const modeRadiusMap = { driving: 3000, bike: 2000, walk: 1000 };

        const payload = {
            origin: formData.origin,
            destination: formData.destination,
            mode: formData.travelMode,
            days: formData.days,
            Radius: modeRadiusMap[formData.travelMode],
            preferences: {
                activities: formData.activities,
                food: formData.food
            }
        };

        console.log("Submitting trip payload:", payload);

        try {
            const response = await planTrip(payload);
            console.log("Trip plan response:", response.data);
            alert("Trip planned successfully!");
        } catch (err) {
            console.error("Plan trip error:", err.response?.data || err.message || err);
            alert("Failed to plan trip. Check console for details.");
        }
    };

    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);

    const handleOriginDebouncedChange = useCallback(
        async (value) => {
            handleChange('origin', value);
            if (value.length > 2) {
                console.log('Searching for:', value);
                const results = await searchCities(value);
                setOriginSuggestions(results);
            } else {
                setOriginSuggestions([]);
            }
        },
        [handleChange]
    );

    const handleDestinationDebouncedChange = useCallback(
        async (value) => {
            handleChange('destination', value);
            if (value.length > 2) {
                const results = await searchCities(value);
                setDestinationSuggestions(results);
            } else {
                setDestinationSuggestions([]);
            }
        },
        [handleChange]
    );

    // const modeRadiusMap = {
    //     driving: 3000,
    //     bike: 2000,
    //     walk: 1000
    // };

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const { data, step: savedStep, timestamp } = JSON.parse(saved);
                const now = Date.now();
                if (now - timestamp < 24 * 60 * 60 * 1000) {
                    setFormData(data);
                    setStep(savedStep || 1);
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (err) {
                console.error("Error parsing saved trip form data", err);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ data: formData, step, timestamp: Date.now() })
        );
    }, [formData, step]);

    return (
        <div className="tripform-wrapper">
            {!plannedTrip ? (
                <form onSubmit={handleSubmit} className="tripform-form">
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
                                    placeholder="Enter origin (city or country)"
                                    type="text"
                                    value={formData.origin}
                                />
                                {originSuggestions && originSuggestions.length > 0 && (
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
                                <DebouncedInput
                                    className="form-control"
                                    delay={500}
                                    onChange={handleDestinationDebouncedChange}
                                    placeholder="Enter destination (city or country)"
                                    type="text"
                                    value={formData.destination}
                                />
                                {destinationSuggestions && destinationSuggestions.length > 0 && (
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
                            <div className="tripform-header d-flex">
                                <h2 className="tripform-title">When will you travel?</h2>
                            </div>
                            <div className="tripform-body p-3">
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
                                            className={`option-btn ${formData.travelStyle === style ? "active" : ""}`}
                                            onClick={() => handleChange("travelStyle", style)}
                                            // style={{backgroundImage: `url(../images/${style.toLowerCase()}.jpg)`}}
                                            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/${style.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}.jpg)` }}
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
                            <div className="tripform-header d-flex">
                                <h2 className="tripform-title">How will you get around?</h2>
                            </div>
                            <div className="tripform-body p-3">
                                <p className="tripform-sub text-center">Please tell us your Travel Mode</p>
                                <div className="options-grid">
                                    {TRAVEL_MODES.map((mode) => {
                                        const icons = {
                                            driving: "bi bi-car-front",
                                            bike: "bi bi-bicycle",
                                            walk: "bi bi-person-walking"
                                        };
                                        return (<button
                                            key={mode}
                                            type="button"
                                            className={`travelMode-btn option-btn ${formData.travelMode === mode ? "active" : ""}`}
                                            onClick={() => handleChange("travelMode", mode)}
                                        >
                                            <i className={`${icons[mode]} me-2`}></i>
                                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                        </button>
                                        );
                                    })}
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
                                    {TRAVEL_WITH.map((w) => {
                                        const icons = {
                                            "Adults only": <i className="bi bi-people me-2"></i>,
                                            Family: <span className="family-icon me-2"></span>,
                                        };
                                        return (
                                            <button
                                                key={w}
                                                type="button"
                                                className={`travelMode-btn option-btn ${formData.travelWith === w ? "active" : ""}`}
                                                onClick={() => handleChange("travelWith", w)}
                                            >
                                                {icons[w]}
                                                {w}
                                            </button>
                                        );
                                    })}
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

                                {/* Activities */}
                                <label className="form-label">Pick up to 4 activities</label>
                                <div className="options-grid">
                                    {ACTIVITIES.map((a) => {
                                        const isActive = formData.activities.includes(a);
                                        const isDisabled =
                                            !isActive && formData.activities.length >= 4;
                                        return (
                                            <button
                                                key={a}
                                                type="button"
                                                className={`act-btn ${isActive ? "active" : ""}`}
                                                disabled={isDisabled}
                                                onClick={() => toggleArrayValue("activities", a, 4)}
                                            >
                                                {a}
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* {formData.activities.length >= 4 && (
                                <p className="text-danger small mt-1">
                                    You can only pick up to 4 activities.
                                </p>
                            )} */}

                                {/* Food */}
                                <label className="form-label mt-3">Pick up to 2 food preferences</label>
                                <div className="options-grid">
                                    {FOOD_PREFS.map((f) => {
                                        const isActive = formData.food.includes(f);
                                        const isDisabled =
                                            !isActive && formData.food.length >= 2;
                                        return (
                                            <button
                                                key={f}
                                                type="button"
                                                className={`act-btn ${isActive ? "active" : ""}`}
                                                disabled={isDisabled}
                                                onClick={() => toggleArrayValue("food", f, 2)}
                                            >
                                                {f}
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* {formData.food.length >= 2 && (
                                <p className="text-danger small mt-1">
                                    You can only pick up to 2 food preferences.
                                </p>
                            )} */}

                            </div>
                        </div>

                    )}

                    {/* Navigation Buttons */}
                    <div className={`tripform-actions d-flex px-3 ${step === 1 ? "gap-0" : ""}`}>
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
            ) : (
                <div>
                    <h2 className="text-center mb-4">Your Planned Trip</h2>
                    <pre>{JSON.stringify(plannedTrip, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
