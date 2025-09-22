import { create } from "zustand"
import { devtools } from "zustand/middleware"

export const useTripStore = create(
  devtools((set) => ({
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
    waypoints: [],
    pdfUrl: "",
    overviewPolyline: "",
    totalDays: 0,

    setOrigin: (origin) => set(() => ({ origin }), false, "setOrigin"),
    setDestination: (destination) => set(() => ({ destination }), false, "setDestination"),
    setStartDay: (startDay) => set(() => ({ startDay }), false, "setStartDay"),
    setEndDay: (endDay) => set(() => ({ endDay }), false, "setEndDay"),

    countDays: () =>
      set(
        (state) => {
          if (state.startDay && state.endDay) {
            const start = new Date(state.startDay)
            const end = new Date(state.endDay)
            const diffTime = Math.abs(end - start)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
            return { totalDays: diffDays }
          }
          return { totalDays: 0 }
        },
        false,
        "countDays"
      ),

    addWaypoint: (waypoint) =>
      set(
        (state) => ({
          waypoints: [...state.waypoints, waypoint],
        }),
        false,
        "addWaypoint"
      ),

    setWaypoints: (waypoints) => set(() => ({ waypoints }), false, "setWaypoints"),
    setPdfUrl: (pdfUrl) => set(() => ({ pdfUrl }), false, "setPdfUrl"),
    setOverviewPolyline: (overviewPolyline) =>
      set(() => ({ overviewPolyline }), false, "setOverviewPolyline"),

    setTravelStyle: (travelStyle) => set(() => ({ travelStyle }), false, "setTravelStyle"),
    setTravelMode: (travelMode) => set(() => ({ travelMode }), false, "setTravelMode"),
    setTravelWith: (travelWith) => set(() => ({ travelWith }), false, "setTravelWith"),
    setActivities: (activities) => set(() => ({ activities }), false, "setActivities"),
    setFood: (food) => set(() => ({ food }), false, "setFood"),

    setField: (field, value) => set(() => ({ [field]: value }), false, `set_${field}`),

    toggleArrayValue: (field, value, limit) =>
      set(
        (state) => {
          let arr = Array.isArray(state[field]) ? [...state[field]] : []
          if (arr.includes(value)) arr = arr.filter((v) => v !== value)
          else if (arr.length < limit) arr.push(value)
          return { [field]: arr }
        },
        false,
        `toggle_${field}`
      ),

    countDays: () =>
      set(
        (state) => {
          if (state.startDate && state.endDate) {
            const start = new Date(state.startDate)
            const end = new Date(state.endDate)
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
            return { days: diff > 0 ? diff : 0 }
          }
          return { days: 0 }
        },
        false,
        "countDays"
      ),
  }))
)
