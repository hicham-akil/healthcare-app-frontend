import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TakeAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // ✅ Use /available-slots which returns ALL active horaires (no date filter)
        const res = await fetch(
          `http://localhost:8080/api/horaires/medecin/${id}/available-slots`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to load schedule");

        const data = await res.json();
        // ✅ Only show ACTIVE ones
        const active = data.filter((h) => h.status === "ACTIVE");
        setSchedule(active);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id, token]);

  const handleSelectSlot = (horaire) => {
    navigate(`/confirm-appointment/${horaire.idHoraire}`, {
      state: {
        horaire,
        patientId: parseInt(localStorage.getItem("user_id")),
        doctorid: parseInt(id),
      },
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6">Doctor Available Slots</h2>

      {schedule.length === 0 ? (
        <p className="text-gray-500 text-center">No available slots</p>
      ) : (
        <div className="space-y-4">
          {schedule.map((horaire) => (
            <div
              key={horaire.idHoraire}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                {/* ✅ Show real date instead of joursSemaine */}
                <p className="font-semibold">{formatDate(horaire.date)}</p>
                <p className="text-sm text-gray-600">
                  {horaire.heureDebut} → {horaire.heureFin}
                </p>
                {horaire.partiallyBooked && (
                  <span className="text-xs text-orange-500">Partially booked</span>
                )}
              </div>

              <button
                onClick={() => handleSelectSlot(horaire)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Take appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TakeAppointment;