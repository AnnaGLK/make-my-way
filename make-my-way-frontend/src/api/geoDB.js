import axios from "axios";

const BASE_URL = process.env.GEO_URL
const API_KEY = process.env.GEO_API_KEY

const geoDB = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
});

// search cities by name
export const searchCities = async (query) => {
  if (!query) return [];
  try {
    const res = await geoDB.get("/cities", {
      params: { namePrefix: query, limit: 10 },
    });
    return res.data.data.map((c) => ({
      id: c.id,
      city: c.city,
      country: c.country,
    }));
  } catch (err) {
    console.error("GeoDB error:", err);
    return [];
  }
};
