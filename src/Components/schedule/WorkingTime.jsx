import { useState, useEffect } from "react";
import { Clock, Calendar, Save, CheckCircle } from "lucide-react";
import BASE_URL from "../../utils/api.js";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getNextDateForDay = (dayName) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const target = days.indexOf(dayName);
  const today = new Date();
  const current = today.getDay();
  const diff = (target - current + 7) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + (diff === 0 ? 0 : diff));
  return result.toISOString().split("T")[0];
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const WorkingHours = () => {
  const medecinId = Number(localStorage.getItem("user_id"));
  

  const [schedule, setSchedule] = useState(
    daysOfWeek.map((day) => ({
      day,
      idHoraire: null,
      enabled: false,
      start: "09:00",
      end: "17:00",
      status: "INACTIVE",
      date: getNextDateForDay(day),
    }))
  );

  const fetchSchedule = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/horaires/medecin/${medecinId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch schedule");
      const data = await response.json();

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
          date: targetDate,
        };
      });

      setSchedule(updatedSchedule);
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  useEffect(() => { fetchSchedule(); }, []);

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    if (field === "enabled") updated[index].status = value ? "ACTIVE" : "INACTIVE";
    setSchedule(updated);
  };

  const handleSubmit = async () => {
    const payload = schedule.map((d) => ({
      idHoraire: d.idHoraire,
      date: d.date,
      heureDebut: d.start,
      heureFin: d.end,
      status: d.status,
      medecinId,
    }));
    try {
      const response = await fetch(`${BASE_URL}/api/horaires`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials: "include" ,
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save schedule");
      alert("Working hours saved successfully!");
      fetchSchedule();
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  const activeDaysCount = schedule.filter((d) => d.enabled).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:wght@600;700&display=swap');

        .wh-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0faf4;
          min-height: 100vh;
          padding: 48px 24px;
        }

        .wh-container {
          max-width: 700px;
          margin: 0 auto;
        }

        /* ── Page header ── */
        .wh-page-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 10px;
        }

        .wh-page-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 4vw, 32px);
          color: #064e3b;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .wh-page-sub {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: #6b7280;
          font-weight: 300;
          margin-bottom: 32px;
        }

        /* ── Stat pills ── */
        .wh-pills {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .wh-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #065f46;
        }

        .wh-pill strong { color: #064e3b; font-weight: 600; }

        /* ── Card ── */
        .wh-card {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(16,185,129,0.07);
          transition: box-shadow 0.25s;
        }

        .wh-card:hover {
          box-shadow: 0 8px 40px rgba(16,185,129,0.13);
        }

        /* Card top bar — matches hp-hero gradient */
        .wh-card-top {
          background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%);
          padding: 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .wh-card-top::after {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
        }

        .wh-card-top-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wh-card-icon-wrap {
          width: 38px; height: 38px;
          border-radius: 11px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
        }

        .wh-card-top-title {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 2px;
        }

        .wh-card-top-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          font-weight: 300;
          margin: 0;
        }

        /* matches hp-badge style */
        .wh-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: #a7f3d0;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 5px 13px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }

        .wh-count-dot {
          width: 6px; height: 6px;
          background: #34d399;
          border-radius: 50%;
          animation: wh-pulse 2s infinite;
        }

        @keyframes wh-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }

        /* ── Day rows ── */
        .wh-rows { padding: 6px 0; }

        .wh-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 28px;
          border-bottom: 1px solid #f0fdf4;
          transition: background 0.15s;
        }

        .wh-row:last-child { border-bottom: none; }
        .wh-row:hover      { background: #f0fdf4; }
        .wh-row.is-active  { background: #f0fdf4; }

        /* custom checkbox */
        .wh-cb-wrap {
          position: relative;
          width: 20px; height: 20px;
          flex-shrink: 0;
        }

        .wh-cb-wrap input {
          position: absolute;
          opacity: 0;
          inset: 0;
          cursor: pointer;
          margin: 0;
        }

        .wh-cb-box {
          width: 20px; height: 20px;
          border-radius: 6px;
          border: 2px solid #d1fae5;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          pointer-events: none;
        }

        .wh-row.is-active .wh-cb-box {
          background: linear-gradient(135deg, #065f46, #10b981);
          border-color: transparent;
        }

        .wh-cb-tick {
          display: none;
        }

        .wh-row.is-active .wh-cb-tick {
          display: block;
        }

        /* day name */
        .wh-day-name {
          width: 94px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          flex-shrink: 0;
        }

        .wh-row.is-active .wh-day-name {
          color: #064e3b;
          font-weight: 600;
        }

        /* open / off badge — matches hp-card status pill style */
        .wh-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
          flex-shrink: 0;
          min-width: 42px;
          text-align: center;
        }

        .wh-badge.open { background: #d1fae5; color: #065f46; }
        .wh-badge.off  { background: #f3f4f6; color: #9ca3af; }

        /* time inputs */
        .wh-times {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .wh-time {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #064e3b;
          background: #f0fdf4;
          border: 1px solid #d1fae5;
          border-radius: 10px;
          padding: 7px 10px;
          width: 96px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }

        .wh-time:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }

        .wh-time:disabled {
          background: #f9fafb;
          border-color: #e5e7eb;
          color: #d1d5db;
          cursor: not-allowed;
        }

        .wh-sep { font-size: 13px; color: #9ca3af; font-weight: 300; }

        /* date label */
        .wh-date {
          font-size: 11.5px;
          color: #9ca3af;
          flex-shrink: 0;
          min-width: 72px;
          text-align: right;
        }

        .wh-row.is-active .wh-date { color: #6b7280; }

        /* ── Card footer ── */
        .wh-card-footer {
          border-top: 1px solid #d1fae5;
          padding: 18px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .wh-footer-note {
          font-size: 13px;
          color: #6b7280;
          font-weight: 300;
        }

        .wh-footer-note strong { color: #065f46; font-weight: 600; }

        /* save button — matches hp-btn-primary inverted */
        .wh-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%);
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 11px 24px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(6,79,58,0.28);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .wh-save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(6,79,58,0.35);
        }

        .wh-save-btn:active { transform: translateY(0); }
      `}</style>

      <div className="wh-root">
        <div className="wh-container">

          {/* Page header */}
          <p className="wh-page-label">Availability</p>
          <h1 className="wh-page-title">Working Hours</h1>
          <p className="wh-page-sub">
            <Calendar size={14} color="#10b981" />
            Week of {formatDisplayDate(getNextDateForDay("Monday"))}
          </p>

          {/* Stat pills */}
          <div className="wh-pills">
            <div className="wh-pill">
              <CheckCircle size={14} color="#10b981" />
              <span><strong>{activeDaysCount}</strong> active days</span>
            </div>
            <div className="wh-pill">
              <Clock size={14} color="#10b981" />
              <span><strong>{7 - activeDaysCount}</strong> days off</span>
            </div>
          </div>

          {/* Card */}
          <div className="wh-card">

            {/* Card hero bar */}
            <div className="wh-card-top">
              <div className="wh-card-top-left">
                <div className="wh-card-icon-wrap">
                  <Clock size={18} color="#ffffff" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="wh-card-top-title">Weekly Schedule</p>
                  <p className="wh-card-top-desc">Toggle days and set consultation hours</p>
                </div>
              </div>
              <div className="wh-count-badge">
                <span className="wh-count-dot" />
                {activeDaysCount} / 7 active
              </div>
            </div>

            {/* Rows */}
            <div className="wh-rows">
              {schedule.map((item, index) => (
                <div key={item.day} className={`wh-row${item.enabled ? " is-active" : ""}`}>

                  {/* Checkbox */}
                  <div className="wh-cb-wrap">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => handleChange(index, "enabled", e.target.checked)}
                    />
                    <div className="wh-cb-box">
                      <svg className="wh-cb-tick" width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Day name */}
                  <span className="wh-day-name">{item.day}</span>

                  {/* Status badge */}
                  <span className={`wh-badge ${item.enabled ? "open" : "off"}`}>
                    {item.enabled ? "Open" : "Off"}
                  </span>

                  {/* Times */}
                  <div className="wh-times">
                    <input
                      type="time"
                      value={item.start}
                      disabled={!item.enabled}
                      className="wh-time"
                      onChange={(e) => handleChange(index, "start", e.target.value)}
                    />
                    <span className="wh-sep">–</span>
                    <input
                      type="time"
                      value={item.end}
                      disabled={!item.enabled}
                      className="wh-time"
                      onChange={(e) => handleChange(index, "end", e.target.value)}
                    />
                  </div>

                  {/* Date */}
                  <span className="wh-date">{formatDisplayDate(item.date)}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="wh-card-footer">
              <p className="wh-footer-note">
                <strong>{activeDaysCount} day{activeDaysCount !== 1 ? "s" : ""}</strong> visible to patients
              </p>
              <button className="wh-save-btn" onClick={handleSubmit}>
                <Save size={15} />
                Save Working Hours
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default WorkingHours;