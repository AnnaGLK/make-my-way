import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TripMap from "./TripMap.jsx";
import polyline from "@mapbox/polyline";
import {useTripStore} from "../stores/tripStore.js"
import "./TripCard.css";

const TripCard = ({ trip }) => {
  const {setPdfUrl} = useTripStore()
  const navigate = useNavigate();
  const handleClick = () => {
    setPdfUrl(trip.pdfUrl)
    navigate(`/trip/${trip.id || trip._id}`);
  };

  const decodedPath = useMemo(() => {
    if (!trip.tripPath) return [];
    return polyline.decode(trip.tripPath).map(([lat, lng]) => ({ lat, lng }));
  }, [trip.tripPath]);

  const origin = trip.originInfo?.coordinates;

  return (
    <div className="trip-card-small" onClick={handleClick}>
      {/* Mini map on top */}
      {origin && decodedPath.length > 0 && (
        <TripMap
          path={trip.tripPath}
          origin={origin}
          destination={trip.destinationInfo?.coordinates}
          small={true}
        />
      )}

      {/* Trip info */}
      <div className="trip-card-content">
        <h3 className="trip-title">
          {trip.originInfo?.address} → {trip.destinationInfo?.address}
        </h3>
        <p className="trip-mode">Travel mode: {trip.tripInfo?.travelMode}</p>
        {trip.tripInfo?.startDate && trip.tripInfo?.endDate && (
          <p className="trip-dates">
            {new Date(trip.tripInfo.startDate).toLocaleDateString()} —{" "}
            {new Date(trip.tripInfo.endDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default TripCard;
