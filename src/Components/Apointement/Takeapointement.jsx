import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Takeapointement = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/horaires/medecin/${id}/available`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load schedule");

        const data = await res.json();
        console.log("Schedule data:", data);

        setSchedule(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id, token]);

  const handleSelectSlot = (horaire) => {
    console.log("Selected slot:", horaire);
    // TODO: Navigate to booking form or show time slot picker
    // You can pass the horaire data to the next step
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">❌ Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Doctor Working Hours
      </h2>

      {schedule.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">📅 No available schedule at the moment</p>
          <p className="text-gray-400 text-sm mt-2">Please check back later</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((horaire, index) => (
            <div
              key={`${horaire.idHoraire}-${index}`}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-lg">
                    {horaire.joursSemaine}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="inline-block">🕐 {horaire.heureDebut}</span>
                    <span className="mx-2">→</span>
                    <span className="inline-block">{horaire.heureFin}</span>
                  </p>
                  {horaire.partiallyBooked && (
                    <p className="text-xs text-orange-500 mt-1">
                      ⚠️ Partially booked - limited slots available
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectSlot(horaire)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {schedule.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Note:</strong> Times shown are available slots. After selecting a day, you'll choose a specific time.
          </p>
        </div>
      )}
    </div>
  );
};

export default Takeapointement;