import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TripInfo from "../components/TripInfo";
import { getTripById } from "../services/api";

const TripDetails = ({ currentUserEmail }) => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getTripById(tripId);
        const owner = data.members?.find((m) => m.role === "owner");
        data.isOwner = owner?.email === currentUserEmail;
        setTrip(data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };
    fetchTrip();
  }, [tripId, currentUserEmail]);

  if (!trip) return <p>Loading trip details...</p>;

  return <TripInfo trip={trip} isOwner={trip.isOwner} />;
};

export default TripDetails;
