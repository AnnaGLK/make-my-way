import React, { useEffect, useState } from "react";
import TripCard from "../components/TripCard";
import { getUserTrips, getSharedTrips } from "../services/api.js";

const TripResults = () => {
  const [ownTrips, setOwnTrips] = useState([]);
  const [sharedTrips, setSharedTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const ownT = await getUserTrips();
        setOwnTrips(ownT);
        const sharedT = await getSharedTrips();
        setSharedTrips(sharedT);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="container">
      <h1>My Trips</h1>
      {ownTrips.length === 0 ? (
        <p>You have no saved trips yet.</p>
      ) : (
        ownTrips.map((trip) => <TripCard key={trip.id} trip={trip} isOwner={true} />)
      )}

      <h1 style={{ marginTop: "2rem" }}>Shared With Me</h1>
      {sharedTrips.length === 0 ? (
        <p>No trips have been shared with you yet.</p>
      ) : (
        sharedTrips.map((trip) => <TripCard key={trip.id} trip={trip} isOwner={false} />)
      )}
    </div>
  );
};

export default TripResults;
