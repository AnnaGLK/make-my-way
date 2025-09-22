import { create } from "zustand"

export const useTripStore = create((set) => ({
  origin: null,
  destination: null,
  startDay: null,
  endDay: null,
  totalDays: 0,
  waypoints: [],
  overviewPolyline: "",
  pdfUrl: null,

  travelStyle: "",
  travelMode: "",
  travelWith: "",
  activities: [],
  food: [],

  setOrigin: (origin) => set(() => ({ origin })),
  setDestination: (destination) => set(() => ({ destination })),
  setStartDay: (startDay) => set(() => ({ startDay })),
  setEndDay: (endDay) => set(() => ({ endDay })),

  countDays: () =>
    set((state) => {
      if (state.startDay && state.endDay) {
        const start = new Date(state.startDay)
        const end = new Date(state.endDay)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        return { totalDays: diffDays }
      }
      return { totalDays: 0 }
    }),

  addWaypoint: (waypoint) =>
    set((state) => ({
      waypoints: [...state.waypoints, waypoint],
    })),

  setWaypoints: (waypoints) => set(() => ({ waypoints })),
  setPdfUrl: (pdfUrl) => set(() => ({ pdfUrl })),
  setOverviewPolyline: (overviewPolyline) => set(() => ({ overviewPolyline })),

  setTravelStyle: (travelStyle) => set(() => ({ travelStyle })),
  setTravelMode: (travelMode) => set(() => ({ travelMode })),
  setTravelWith: (travelWith) => set(() => ({ travelWith })),
  setActivities: (activities) => set(() => ({ activities })),
  setFood: (food) => set(() => ({ food })),
}))
