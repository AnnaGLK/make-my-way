import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// --- AUTH ---
export const signup = async (userData) => {
  const { data } = await API.post("/auth/signup", userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);

  if (data.token) {
    localStorage.setItem("token", data.token);
    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  }
  return data;
};

// --- TRIP PLANNING ---
export const planTrip = async (tripData) => {
  const { data } = await API.post("/trip/plan", tripData);
  return data;
};

export const getUserTrips = async () => {
  const { data } = await API.get("/trip");
  return data;
};

export const getTripById = async (id) => {
  const { data } = await API.get(`/trip/${id}`);
  return data;
};

export const deleteTrip = async (id) => {
  const { data } = await API.delete(`/trip/${id}`);
  return data;
};

// LOCATIONS
export const getLocations = async () => {
  const { data } = await API.get("/locations"); // LOCATIONS (for origin/destination dropdown) ---Need to expose this
  return data;
};

