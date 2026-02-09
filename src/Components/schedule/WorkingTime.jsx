import { useState, useEffect } from "react";

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
  const currentDate = new Date();
  const fixedMonth = currentDate.getMonth() + 1; // 1-12
  const fixedYear = currentDate.getFullYear();

  const [schedule, setSchedule] = useState(
    daysOfWeek.map((day) => ({
      day,
      idHoraire: null,
      enabled: false,
      start: "09:00",
      end: "17:00",
      status: "INACTIVE",
      month: fixedMonth,
      year: fixedYear,
    }))
  );

  // Fetch schedule from backend
  const fetchSchedule = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/horaires/medecin/${medecinId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch schedule");

      const data = await response.json();
      console.log("Fetched schedule data:", data);

      const updatedSchedule = daysOfWeek.map((day) => {
        const matching = data.find(
          (d) => d && d.joursSemaine && d.joursSemaine.toLowerCase() === day.toLowerCase()
        );

        return {
          day,
          idHoraire: matching ? matching.idHoraire : null,
          enabled: matching ? matching.status === "ACTIVE" : false,
          start: matching ? matching.heureDebut : "09:00",
          end: matching ? matching.heureFin : "17:00",
          status: matching ? matching.status : "INACTIVE",
          month: fixedMonth,
          year: fixedYear,
        };
      });

      setSchedule(updatedSchedule);
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Handle checkbox or time changes
  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;

    // Automatically update status based on checkbox
    if (field === "enabled") {
      updated[index].status = value ? "ACTIVE" : "INACTIVE";
    }

    setSchedule(updated);
  };

  // Submit schedule to backend
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const payload = schedule.map((d) => ({
      idHoraire: d.idHoraire,
      joursSemaine: d.day.toUpperCase(),
      heureDebut: d.start,
      heureFin: d.end,
      status: d.status,
      medecinId: medecinId,
      month: d.month,
      year: d.year,
    }));

    try {
      const response = await fetch("http://localhost:8080/api/horaires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save schedule");

      alert("Working hours saved successfully!");
      fetchSchedule(); // Refresh schedule after save
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
              onChange={(e) => handleChange(index, "start", e.target.value)}
            />

            <span>–</span>

            <input
              type="time"
              value={item.end}
              disabled={!item.enabled}
              className="border rounded-md px-2 py-1 disabled:bg-gray-100"
              onChange={(e) => handleChange(index, "end", e.target.value)}
            />

            {/* Display month and year (not editable) */}
            <span className="ml-4 text-gray-600">
              {item.month}/{item.year}
            </span>
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
