// src/components/TripForm.jsx
import React, { useState, useEffect } from "react";
import { planTrip, getLocations } from "../services/api";

const TripForm = () => {
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

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Fetch cities/countries list from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data); // expects array of { name, placeId, lat, lng }
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

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
      let arr = [...prev[field]];
      if (arr.includes(value)) {
        arr = arr.filter((v) => v !== value);
      } else if (arr.length < limit) {
        arr.push(value);
      }
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await planTrip(formData);
      console.log("Trip planned:", response);
      alert("Trip planned successfully!");
    } catch (error) {
      console.error("Error planning trip:", error);
      alert("Failed to plan trip.");
    }
  };

  // --- Render steps ---
  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Step 1: Origin, Destination, Dates */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Trip Details</h2>

          {loadingLocations ? (
            <p>Loading locations...</p>
          ) : (
            <>
              <label className="block mb-2">Origin</label>
              <select
                value={formData.origin}
                onChange={(e) => handleChange("origin", e.target.value)}
                className="border w-full mb-4 p-2"
              >
                <option value="">Select Origin</option>
                {locations.map((loc) => (
                  <option key={loc.placeId} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Destination</label>
              <select
                value={formData.destination}
                onChange={(e) => handleChange("destination", e.target.value)}
                className="border w-full mb-4 p-2"
              >
                <option value="">Select Destination</option>
                {locations.map((loc) => (
                  <option key={loc.placeId} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <label className="block mb-2">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            className="border w-full mb-4 p-2"
          />

          <label className="block mb-2">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            className="border w-full mb-4 p-2"
          />

          <p className="mb-4">Number of days: {formData.days}</p>

          <button
            onClick={() => setStep(2)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Travel Style */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Travel Style</h2>
          {["Urban Explorer", "Culture & History", "Chill & Relax", "Adventure Mode"].map(
            (style) => (
              <button
                key={style}
                onClick={() => handleChange("travelStyle", style)}
                className={`block w-full mb-2 p-2 rounded border ${
                  formData.travelStyle === style ? "bg-blue-500 text-white" : ""
                }`}
              >
                {style}
              </button>
            )
          )}
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(1)} className="bg-gray-300 px-4 py-2 rounded">
              Prev
            </button>
            <button onClick={() => setStep(3)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Travel Mode */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Travel Mode</h2>
          {["driving", "bike", "walk"].map((mode) => (
            <button
              key={mode}
              onClick={() => handleChange("travelMode", mode)}
              className={`block w-full mb-2 p-2 rounded border ${
                formData.travelMode === mode ? "bg-blue-500 text-white" : ""
              }`}
            >
              {mode}
            </button>
          ))}
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(2)} className="bg-gray-300 px-4 py-2 rounded">
              Prev
            </button>
            <button onClick={() => setStep(4)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Travel With */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Who are you traveling with?</h2>
          {["adults only", "Family"].map((group) => (
            <button
              key={group}
              onClick={() => handleChange("travelWith", group)}
              className={`block w-full mb-2 p-2 rounded border ${
                formData.travelWith === group ? "bg-blue-500 text-white" : ""
              }`}
            >
              {group}
            </button>
          ))}
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(3)} className="bg-gray-300 px-4 py-2 rounded">
              Prev
            </button>
            <button onClick={() => setStep(5)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Activities */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pick up to 4 activities</h2>
          {["museum", "sightseeing", "shopping", "beach", "hiking", "nightlife", "art", "nature", "spa", "theater"].map(
            (activity) => (
              <button
                key={activity}
                onClick={() => toggleArrayValue("activities", activity, 4)}
                className={`block w-full mb-2 p-2 rounded border ${
                  formData.activities.includes(activity) ? "bg-blue-500 text-white" : ""
                }`}
              >
                {activity}
              </button>
            )
          )}
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(4)} className="bg-gray-300 px-4 py-2 rounded">
              Prev
            </button>
            <button onClick={() => setStep(6)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Food */}
      {step === 6 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pick up to 2 food preferences</h2>
          {["restaurant", "dining", "fast_food", "street_food", "cafe", "local"].map((food) => (
            <button
              key={food}
              onClick={() => toggleArrayValue("food", food, 2)}
              className={`block w-full mb-2 p-2 rounded border ${
                formData.food.includes(food) ? "bg-blue-500 text-white" : ""
              }`}
            >
              {food}
            </button>
          ))}
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(5)} className="bg-gray-300 px-4 py-2 rounded">
              Prev
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Let’s Go!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripForm;
