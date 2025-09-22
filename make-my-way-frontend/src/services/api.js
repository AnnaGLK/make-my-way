import axios from "axios"
import { act } from "react"

const API = axios.create({
  //baseURL: "https://map-my-way-backend.onrender.com",
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
})

// --- AUTH ---
export const register = async (userData) => {
  console.log(">>> register CALLED", userData)

  const { data } = await API.post("/auth/register", userData)
  return data
}

export const login = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials)

  if (data.token) {
    // localStorage.setItem("token", data.token);
    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
  }
  return data
}

export const logout = async () => {
  const { data } = await API.post("/auth/logout")
  localStorage.removeItem("token")
  delete API.defaults.headers.common["Authorization"]
  return data
}

export const refresh = async () => {
  const { data } = await API.post("/auth/refresh")
  if (data.token) {
    localStorage.setItem("token", data.token)
    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
  }
  return data
}

// --- TRIP PLANNING ---
export const planTrip = async (tripData) => {
  const radiusMap = {
    driving: 3000,
    bike: 1000,
    walk: 500,
  }
  const requestData = {
    origin: tripData.origin.split(",")[0],
    destination: tripData.destination.split(",")[0],
    mode: tripData.travelMode,
    days: tripData.days,
    radius: radiusMap[tripData.travelMode] || 3000,
    preferences: {
      activities: tripData.activities,
      food: tripData.food,
    },
  }

  const { data } = await API.post("/trip/plan", requestData)
  return data
}

export const getTripPath = async (tripPathRequest) => {
  const { data } = await API.post("/trip/path", tripPathRequest)
  return data.overviewPolyline
}

export const saveTrip = async (tripData) => {
  const { data } = await API.post("/trip", tripData)
  return data
}

export const getUserTrips = async () => {
  const { data } = await API.get("/trip")
  return data
}

export const getTripById = async (id) => {
  const { data } = await API.get(`/trip/${id}`)
  return data
}

export const deleteTrip = async (id) => {
  const { data } = await API.delete(`/trip/${id}`)
  return data
}

// LOCATIONS
export const getLocations = async () => {
  const { data } = await API.get("/locations") // LOCATIONS (for origin/destination dropdown) ---Need to expose this
  return data
}
