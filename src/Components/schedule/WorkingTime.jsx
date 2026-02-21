import { useState, useEffect } from "react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Get the next occurrence of a weekday from today
const getNextDateForDay = (dayName) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const target = days.indexOf(dayName);
  const today = new Date();
  const current = today.getDay();
  const diff = (target - current + 7) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + (diff === 0 ? 0 : diff));
  return result.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const WorkingHours = () => {
  const medecinId = Number(localStorage.getItem("user_id"));
  const token = localStorage.getItem("token");

  const [schedule, setSchedule] = useState(
    daysOfWeek.map((day) => ({
      day,
      idHoraire: null,
      enabled: false,
      start: "09:00",
      end: "17:00",
      status: "INACTIVE",
      date: getNextDateForDay(day), // ✅ real date instead of month/year
    }))
  );

  const fetchSchedule = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/horaires/medecin/${medecinId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch schedule");

      const data = await response.json();
      console.log("Fetched schedule:", data);

      // ✅ Match by date's day of week instead of joursSemaine string
      const updatedSchedule = daysOfWeek.map((day) => {
        const targetDate = getNextDateForDay(day);
        const matching = data.find((d) => d.date === targetDate);

        return {
          day,
          idHoraire: matching ? matching.idHoraire : null,
          enabled: matching ? matching.status === "ACTIVE" : false,
          start: matching ? matching.heureDebut : "09:00",
          end: matching ? matching.heureFin : "17:00",
          status: matching ? matching.status : "INACTIVE",
          date: targetDate, // ✅ always use the computed date
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

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;

    if (field === "enabled") {
      updated[index].status = value ? "ACTIVE" : "INACTIVE";
    }

    setSchedule(updated);
  };

  const handleSubmit = async () => {
    // ✅ Only send enabled days, with real date field
    const payload = schedule.map((d) => ({
      idHoraire: d.idHoraire,
      date: d.date,           // ✅ "YYYY-MM-DD"
      heureDebut: d.start,    // "HH:mm"
      heureFin: d.end,        // "HH:mm"
      status: d.status,
      medecinId: medecinId,
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
      fetchSchedule();
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Working Hours</h2>
      <p className="text-sm text-gray-500 mb-4">
        Showing schedule for the current week starting {formatDisplayDate(getNextDateForDay("Monday"))}
      </p>

      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div key={item.day} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => handleChange(index, "enabled", e.target.checked)}
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

            {/* ✅ Show real date instead of month/year */}
            <span className="text-xs text-gray-400 ml-2">
              {formatDisplayDate(item.date)}
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