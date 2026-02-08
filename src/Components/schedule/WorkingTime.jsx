import { useState } from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WorkingHours = () => {
  const medecinId = Number(localStorage.getItem("user_id"));

  const [schedule, setSchedule] = useState(
    daysOfWeek.map((day) => ({
      day, // for UI
      enabled: !["Saturday", "Sunday"].includes(day),
      start: "09:00",
      end: "17:00",
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const payload = schedule
      .filter((d) => d.enabled)
      .map((d) => ({
         joursSemaine: d.day.toUpperCase(),
    heureDebut: d.start,
    heureFin: d.end,
    status: "ACTIVE",
    medecinId: medecinId
      }));
    console.log("Submitting schedule:", payload);
    console.log("Submitting schedule:", token);

    try {
      const response = await fetch(
        "http://localhost:8080/api/horaires",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload), 
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save schedule");
      }

      alert("Working hours saved successfully!");
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Working Hours</h2>

      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div key={item.day} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) =>
                handleChange(index, "enabled", e.target.checked)
              }
            />

            <span className="w-24 font-medium">{item.day}</span>

            <input
              type="time"
              value={item.start}
              disabled={!item.enabled}
              className="border rounded-md px-2 py-1 disabled:bg-gray-100"
              onChange={(e) =>
                handleChange(index, "start", e.target.value)
              }
            />

            <span>–</span>

            <input
              type="time"
              value={item.end}
              disabled={!item.enabled}
              className="border rounded-md px-2 py-1 disabled:bg-gray-100"
              onChange={(e) =>
                handleChange(index, "end", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Save Working Hours
      </button>
    </div>
  );
};

export default WorkingHours;
