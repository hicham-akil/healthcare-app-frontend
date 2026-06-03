import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Clock, Calendar, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useAction } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const getTodayName = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
};

const getNextDateForDay = (dayName) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const target = days.indexOf(dayName);
  if (target === -1) return null;
  const today = new Date();
  const current = today.getDay();
  let diff = (target - current + 7) % 7;
  if (diff === 0) diff = 7;
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return result.toISOString().split("T")[0];
};

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const WorkingHours = () => {
  const { user } = useAuth();
  const medecinId = Number(parseInt(user?.id));
  const { execute: apiCall, loading, error, reset } = useAction();
  const [success, setSuccess] = useState(false);
  const todayName = getTodayName();

  const [schedule, setSchedule] = useState(
    daysOfWeek.map((day) => {
      const isToday = day === todayName;
      return {
        day,
        idHoraire: null,
        enabled: false,
        start: "09:00",
        end: "17:00",
        status: "INACTIVE",
        date: isToday ? getTodayDate() : getNextDateForDay(day),
        isToday,
      };
    })
  );

  const fetchSchedule = useCallback(async () => {
    if (!medecinId) return;

    const data = await apiCall(`/api/horaires/medecin/${medecinId}`, {
      method: "GET",
    });

    if (data) {
      const updated = daysOfWeek.map((day) => {
        const isToday = day === todayName;
        const targetDate = isToday ? getTodayDate() : getNextDateForDay(day);
        const match = data.find((d) => d.date === targetDate);

        return {
          day,
          idHoraire: match ? match.idHoraire : null,
          enabled: match ? match.status === "ACTIVE" : false,
          start: match ? match.heureDebut : "09:00",
          end: match ? match.heureFin : "17:00",
          status: match ? match.status : "INACTIVE",
          date: targetDate,
          isToday,
        };
      });
      setSchedule(updated);
    }
  }, [apiCall, medecinId, todayName]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    if (field === "enabled") {
      updated[index].status = value ? "ACTIVE" : "INACTIVE";
    }
    setSchedule(updated);
    if (error) reset();
    if (success) setSuccess(false);
  };

  const handleSubmit = async () => {
    setSuccess(false);
    const payload = schedule.map((d) => ({
      idHoraire: d.idHoraire,
      date: d.date,
      heureDebut: d.start,
      heureFin: d.end,
      status: d.status,
      medecinId,
    }));

    const result = await apiCall("/api/horaires", {
      method: "POST",
      body: payload,
    });

    if (result) {
      setSuccess(true);
      fetchSchedule();
    }
  };

  const activeDaysCount = schedule.filter((d) => d.enabled).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');

        .wh-root {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(180deg, #f3fbf7 0%, #f8fffc 100%);
          min-height: 100vh;
          padding: 64px 24px;
        }

        .wh-container {
          max-width: 920px;
          margin: 0 auto;
        }

        .wh-page-label {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #10b981;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .wh-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          color: #064e3b;
          margin-bottom: 8px;
        }

        .wh-page-sub {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 30px;
        }

        .wh-pills {
          display: flex;
          gap: 14px;
          margin-bottom: 26px;
          flex-wrap: wrap;
        }

        .wh-pill {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid #d1fae5;
          border-radius: 16px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(16,185,129,0.08);
          font-size: 13px;
          color: #065f46;
        }

        .wh-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #ecfdf5;
          box-shadow: 0 18px 50px rgba(16,185,129,0.12);
        }

        .wh-card-top {
          background: linear-gradient(135deg, #064e3b, #065f46, #047857);
          padding: 26px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .wh-card-top::after {
          content: "";
          position: absolute;
          width: 240px;
          height: 240px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
          top: -90px;
          right: -90px;
        }

        .wh-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 10px 16px;
          padding: 16px 18px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #f0fdf4;
          transition: all 0.2s ease;
        }

        .wh-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16,185,129,0.10);
        }

        .wh-row.is-active {
          background: #f0fdf4;
          border-color: #a7f3d0;
        }

        .wh-row.is-today {
          border: 2px solid #10b981;
          background: #f0fdf4;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.08);
        }

        .wh-row.is-today.is-active {
          background: #ecfdf5;
          border-color: #10b981;
        }

        .wh-today-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.1); }
        }

        .wh-today-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #10b981;
          background: #dcfce7;
          padding: 2px 8px;
          border-radius: 999px;
          margin-left: 4px;
        }

        .wh-day-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 130px;
        }

        .wh-switch {
          width: 46px;
          height: 26px;
          background: #e5e7eb;
          border-radius: 999px;
          position: relative;
          cursor: pointer;
          transition: 0.25s ease;
          flex-shrink: 0;
        }

        .wh-switch-knob {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: 0.25s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .wh-switch.active {
          background: #10b981;
        }

        .wh-switch.active .wh-switch-knob {
          transform: translateX(20px);
        }

        .wh-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .wh-badge.open {
          background: #dcfce7;
          color: #065f46;
        }

        .wh-badge.off {
          background: #f3f4f6;
          color: #9ca3af;
        }

        .wh-time {
          border-radius: 12px;
          background: #f9fffc;
          border: 1px solid #d1fae5;
          padding: 8px 12px;
          font-size: 13px;
          color: #065f46;
        }

        .wh-time:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .wh-save-btn {
          background: linear-gradient(135deg, #064e3b, #047857);
          border-radius: 14px;
          padding: 12px 22px;
          font-weight: 600;
          color: white;
          border: none;
          cursor: pointer;
        }

        .wh-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wh-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 12px 16px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
        }

        .wh-alert-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .wh-alert-success {
          background: #f0fdf4;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .wh-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="wh-root">
        <div className="wh-container">
          <p className="wh-page-label">Availability</p>
          <h1 className="wh-page-title">Working Hours</h1>

          <p className="wh-page-sub">
            <Calendar size={14} color="#10b981" />
            Week of {formatDisplayDate(getTodayDate())}
          </p>

          <div className="wh-pills">
            <div className="wh-pill">
              <CheckCircle size={14} />
              {activeDaysCount} active days
            </div>
            <div className="wh-pill">
              <Clock size={14} />
              Today: {todayName}
            </div>
          </div>

          <div className="wh-card">
            <div className="wh-card-top">
              <div style={{ color: "white" }}>
                <h3 style={{ margin: 0 }}>Weekly Schedule</h3>
                <small>Manage availability</small>
              </div>
            </div>

            {error && (
              <div className="wh-alert wh-alert-error">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {success && (
              <div className="wh-alert wh-alert-success">
                <CheckCircle size={14} /> Working hours saved successfully!
              </div>
            )}

            {schedule.map((item, index) => (
              <div
                key={item.day}
                className={`wh-row ${item.enabled ? "is-active" : ""} ${item.isToday ? "is-today" : ""}`}
              >
                <div
                  className={`wh-switch ${item.enabled ? "active" : ""}`}
                  onClick={() => handleChange(index, "enabled", !item.enabled)}
                >
                  <div className="wh-switch-knob"></div>
                </div>

                <div className="wh-day-wrapper">
                  {item.isToday && <span className="wh-today-dot" />}
                  <strong>{item.day}</strong>
                  {item.isToday && <span className="wh-today-label">Today</span>}
                </div>

                <span className={`wh-badge ${item.enabled ? "open" : "off"}`}>
                  {item.enabled ? "Open" : "Off"}
                </span>

                <input
                  type="time"
                  className="wh-time"
                  value={item.start}
                  disabled={!item.enabled}
                  onChange={(e) => handleChange(index, "start", e.target.value)}
                />

                <input
                  type="time"
                  className="wh-time"
                  value={item.end}
                  disabled={!item.enabled}
                  onChange={(e) => handleChange(index, "end", e.target.value)}
                />

                <span style={{ marginLeft: "auto", color: item.isToday ? "#10b981" : "#9ca3af", fontWeight: item.isToday ? 600 : 400 }}>
                  {item.isToday ? "Today" : formatDisplayDate(item.date)}
                </span>
              </div>
            ))}

            <div style={{ padding: 20, textAlign: "right" }}>
              <button
                className="wh-save-btn"
                onClick={handleSubmit}
                disabled={loading}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                {loading ? <div className="wh-spinner" /> : <Save size={16} />}
                {loading ? "Saving..." : "Save Working Hours"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkingHours;
