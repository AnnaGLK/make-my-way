import axios from "axios";

// const BASE_URL = process.env.GEO_URL
const API_BASE_URL = process.env.REACT_APP_RAPID_API_BASE_URL;
const API_KEY = process.env.REACT_APP_GEO_API_KEY

// const geoDB = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "X-RapidAPI-Key": API_KEY,
//     "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
//   },
// });

// search cities by name
// export const searchCities = async (query) => {
//   if (!query) return [];
//   try {
//     const res = await geoDB.get("/cities", {
//       params: { namePrefix: query, limit: 10 },
//     });
//     return res.data.data.map((c) => ({
//       id: c.id,
//       city: c.city,
//       country: c.country,
//     }));
//   } catch (err) {
//     console.error("GeoDB error:", err);
//     return [];
//   }
// };
// const options = {
//   method: 'GET',
//   url: BASE_URL,
//   params: {toPlaceId: 'Q60'},
//   headers: {
//     'x-rapidapi-key': API_KEY,
//     'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
//   }
// };
// export const searchCities = async (query) => {
//   if (!query) return [];
// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }};


export async function searchCities(prefix) {
    const options = {
        method: "GET",
        url: API_BASE_URL + "/geo/cities",
        params: {namePrefix: prefix},  // <-- send the prefix here
        headers: {
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            "x-rapidapi-key": API_KEY,
        },
    };

    try {
        const response = await axios(options);
        console.log(response.data.data); // list of matching places
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}
