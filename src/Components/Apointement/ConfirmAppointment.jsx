import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const ConfirmAppointment = () => {
  const { idHoraire } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Read all state correctly
  const { horaire, patientId, doctorid,specialite } = state || {};

  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(""); // 60 or 120
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!horaire || !patientId || !doctorid) {
    return <div className="text-center mt-10">No appointment selected</div>;
  }

  // 🧠 Helpers
  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (minutes) => {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const calculateEndTime = () => {
    if (!startTime || !duration) return null;
    return toTime(toMinutes(startTime) + Number(duration));
  };

  const endTime = calculateEndTime();

  const handleConfirm = async () => {
    setError(null);

    if (!startTime || !duration) {
      setError("Please select start time and duration");
      return;
    }

    // Validate inside doctor hours
    if (
      toMinutes(startTime) < toMinutes(horaire.heureDebut) ||
      toMinutes(endTime) > toMinutes(horaire.heureFin)
    ) {
      setError("Selected time exceeds doctor's working hours");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/rendezvous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          horaireId: idHoraire,
          patientId: patientId,
          medecinId: doctorid,
          heureDebut: startTime,
          specialiteId: specialite, 
          heureFin: endTime,
           date: horaire.date ?? new Date().toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Appointment failed");
      }

      alert("Appointment confirmed ✅");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Confirm Appointment</h2>

      <p className="mb-2">
        <strong>Day:</strong> {horaire.joursSemaine}
      </p>

      <p className="mb-4 text-sm text-gray-600">
        Available: {horaire.heureDebut} → {horaire.heureFin}
      </p>

      {/* START TIME */}
      <label className="block font-medium mb-1">Start Time</label>
      <input
        type="time"
        min={horaire.heureDebut}
        max={horaire.heureFin}
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />

      {/* DURATION */}
      <label className="block font-medium mb-1">Duration</label>
      <select
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      >
        <option value="">Select duration</option>
        <option value="60">1 hour</option>
        <option value="120">2 hours</option>
      </select>

      {/* AUTO END TIME */}
      {endTime && (
        <p className="mb-4 text-sm text-gray-700">
          <strong>End Time:</strong> {endTime}
        </p>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded-lg w-full"
      >
        {loading ? "Confirming..." : "Confirm Appointment"}
      </button>

      <p className="text-xs text-gray-500 mt-3">
        ℹ Appointment duration must be 1 or 2 hours
      </p>
    </div>
  );
};

export default ConfirmAppointment;