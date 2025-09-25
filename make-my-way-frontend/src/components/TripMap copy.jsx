import React, { useMemo } from "react"
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api"
import polyline from "@mapbox/polyline"

const TripMap = ({ path, origin }) => {
  const decodedPath = useMemo(() => {
    if (!path) return []
    return polyline.decode(path).map(([lat, lng]) => ({ lat, lng }))
  }, [path])

  const center = origin
    ? { lat: origin.latitude, lng: origin.longitude }
    : decodedPath[0] || { lat: 0, lng: 0 }

  const mapContainerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "8px",
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={10}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {decodedPath.length > 0 && (
        <Polyline
          path={decodedPath}
          options={{
            strokeColor: "#00c16d",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      )}
    </GoogleMap>
  )
}

export default TripMap
