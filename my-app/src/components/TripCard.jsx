export default function TripCard({ trip }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <h3 className="font-bold text-lg mb-2">
        {trip.destination} Trip
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        {trip.startDate} → {trip.endDate}
      </p>
      {trip.activities && trip.activities.length > 0 && (
        <ul className="text-sm text-gray-700 list-disc list-inside">
          {trip.activities.slice(0, 3).map((act, idx) => (
            <li key={idx}>{act}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
