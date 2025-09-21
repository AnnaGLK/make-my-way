import axios from "axios";

const API = axios.create({
  baseURL: "https://map-my-way-backend.onrender.com", 
  headers: {
    "Content-Type": "application/json",
  },
});

// --- AUTH ---
export const register = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);

  if (data.token) {
    // localStorage.setItem("token", data.token);
    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  }
  return data;
};

export const logout = async () => {
    const { data } = await API.post("/auth/logout");
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    return data;
};

export const refresh = async () => {
    const { data } = await API.post("/auth/refresh");
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

