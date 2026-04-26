import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, ArrowRight, Stethoscope, AlertCircle } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

const TakeAppointment = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { specialiteId, specialite } = state || {};

  // Standardized Fetch Hook
  const { data, loading, error } = useFetch(id ? `/api/horaires/medecin/${id}/available-slots` : null);

  // Logic: Filter active slots
  const schedule = Array.isArray(data) ? data.filter((h) => h.status === "ACTIVE") : [];

  const handleSelectSlot = (horaire) => {
    navigate(`/confirm-appointment/${horaire.idHoraire}`, {
      state: {
        horaire,
        patientId: parseInt(localStorage.getItem("user_id")),
        doctorid: parseInt(id),
        specialite,
        specialiteId: parseInt(specialiteId),
      },
    });
  };

  const formatDay = (d) => !d ? "" : new Date(d).toLocaleDateString("en-US", { weekday: "short" });
  const formatDayNum = (d) => !d ? "" : new Date(d).toLocaleDateString("en-US", { day: "numeric" });
  const formatMonth = (d) => !d ? "" : new Date(d).toLocaleDateString("en-US", { month: "short" });
  const formatDate = (d) => !d ? "" : new Date(d).toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric", year: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:wght@600;700&display=swap');
        .ta-root { font-family: 'DM Sans', sans-serif; background: #f0faf4; min-height: 100vh; padding: 48px 24px; }
        .ta-container { max-width: 680px; margin: 0 auto; }
        .ta-page-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #10b981; margin-bottom: 10px; }
        .ta-page-title { font-family: 'Playfair Display', serif; font-size: clamp(24px, 4vw, 32px); color: #064e3b; letter-spacing: -0.3px; margin-bottom: 6px; }
        .ta-page-sub { display: flex; align-items: center; gap: 6px; font-size: 13.5px; color: #6b7280; font-weight: 300; margin-bottom: 32px; }
        .ta-spec-pill { display: inline-flex; align-items: center; gap: 7px; background: #ffffff; border: 1px solid #d1fae5; border-radius: 12px; padding: 8px 16px; font-size: 13px; font-weight: 500; color: #065f46; margin-bottom: 28px; }
        .ta-card { background: #ffffff; border: 1px solid #d1fae5; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(16,185,129,0.07); transition: box-shadow 0.25s; }
        .ta-card:hover { box-shadow: 0 8px 40px rgba(16,185,129,0.13); }
        .ta-card-top { background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%); padding: 20px 28px; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; }
        .ta-card-top::after { content: ''; position: absolute; top: -40px; right: -40px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.05); pointer-events: none; }
        .ta-card-top-left { display: flex; align-items: center; gap: 12px; }
        .ta-card-icon-wrap { width: 38px; height: 38px; border-radius: 11px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; }
        .ta-card-top-title { font-size: 15px; font-weight: 600; color: #ffffff; margin: 0 0 2px; }
        .ta-card-top-desc { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 300; margin: 0; }
        .ta-count-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #a7f3d0; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; padding: 5px 13px; border-radius: 20px; }
        .ta-count-dot { width: 6px; height: 6px; background: #34d399; border-radius: 50%; animation: ta-pulse 2s infinite; }
        @keyframes ta-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.4); } }
        .ta-slots { padding: 8px 0; }
        .ta-slot { display: flex; align-items: center; gap: 16px; padding: 16px 28px; border-bottom: 1px solid #f0fdf4; transition: background 0.15s; }
        .ta-slot:last-child { border-bottom: none; }
        .ta-slot:hover { background: #f0fdf4; }
        .ta-date-block { display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #a7f3d0; border-radius: 14px; padding: 10px 14px; min-width: 58px; flex-shrink: 0; text-align: center; }
        .ta-date-day { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #10b981; }
        .ta-date-num { font-family: 'Playfair Display', serif; font-size: 24px; color: #064e3b; line-height: 1.1; }
        .ta-date-month { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-top: 1px; }
        .ta-slot-info { flex: 1; min-width: 0; }
        .ta-slot-date-full { font-size: 14px; font-weight: 600; color: #064e3b; margin-bottom: 4px; }
        .ta-queue-info { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #6b7280; font-weight: 400; }
        .ta-book-btn { display: inline-flex; align-items: center; gap: 7px; background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%); color: #ffffff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(6,79,58,0.25); transition: transform 0.2s, box-shadow 0.2s; white-space: nowrap; flex-shrink: 0; }
        .ta-book-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(6,79,58,0.32); }
        .ta-book-btn:active { transform: translateY(0); }
        .ta-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 56px 24px; color: #9ca3af; }
        .ta-empty-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); display: flex; align-items: center; justify-content: center; }
        .ta-empty p { font-size: 14px; font-weight: 400; margin: 0; }
        .ta-state { font-family: 'DM Sans', sans-serif; background: #f0faf4; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .ta-state-box { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
        .ta-spinner { width: 36px; height: 36px; border: 3px solid #d1fae5; border-top-color: #10b981; border-radius: 50%; animation: ta-spin 0.8s linear infinite; }
        @keyframes ta-spin { to { transform: rotate(360deg); } }
        .ta-state-text { font-size: 14px; color: #6b7280; font-weight: 400; }
        .ta-error-icon { width: 44px; height: 44px; border-radius: 50%; background: #fef2f2; border: 1px solid #fecaca; display: flex; align-items: center; justify-content: center; }
        .ta-error-text { font-size: 14px; color: #dc2626; font-weight: 400; }
      `}</style>

      {loading && (
        <div className="ta-state">
          <div className="ta-state-box">
            <div className="ta-spinner" />
            <p className="ta-state-text">Loading available slots…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="ta-state">
          <div className="ta-state-box">
            <div className="ta-error-icon"><AlertCircle size={20} color="#dc2626" /></div>
            <p className="ta-error-text">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="ta-root">
          <div className="ta-container">
            <p className="ta-page-label">Book a Visit</p>
            <h1 className="ta-page-title">Available Days</h1>
            <p className="ta-page-sub">
              <Calendar size={14} color="#10b981" />
              Pick a day — you'll be added to the queue automatically
            </p>

            {specialite && (
              <div className="ta-spec-pill">
                <Stethoscope size={14} color="#10b981" />
                {specialite}
              </div>
            )}

            <div className="ta-card">
              <div className="ta-card-top">
                <div className="ta-card-top-left">
                  <div className="ta-card-icon-wrap">
                    <Calendar size={18} color="#ffffff" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="ta-card-top-title">Doctor's Schedule</p>
                    <p className="ta-card-top-desc">Select a day to join the queue</p>
                  </div>
                </div>
                <div className="ta-count-badge">
                  <span className="ta-count-dot" />
                  {schedule.length} day{schedule.length !== 1 ? "s" : ""} available
                </div>
              </div>

              {schedule.length === 0 ? (
                <div className="ta-empty">
                  <div className="ta-empty-icon">
                    <Calendar size={24} color="#10b981" strokeWidth={1.8} />
                  </div>
                  <p>No available days at the moment</p>
                </div>
              ) : (
                <div className="ta-slots">
                  {schedule.map((horaire) => (
                    <div key={horaire.idHoraire} className="ta-slot">
                      <div className="ta-date-block">
                        <span className="ta-date-day">{formatDay(horaire.date)}</span>
                        <span className="ta-date-num">{formatDayNum(horaire.date)}</span>
                        <span className="ta-date-month">{formatMonth(horaire.date)}</span>
                      </div>
                      <div className="ta-slot-info">
                        <p className="ta-slot-date-full">{formatDate(horaire.date)}</p>
                        <div className="ta-queue-info">
                          <Users size={12} color="#10b981" />
                          Join the queue for this day
                        </div>
                      </div>
                      <button className="ta-book-btn" onClick={() => handleSelectSlot(horaire)}>
                        Join Queue
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TakeAppointment;