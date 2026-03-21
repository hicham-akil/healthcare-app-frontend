import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Calendar, User, Stethoscope, Hash, CheckCircle, AlertCircle } from "lucide-react";
import BASE_URL from "../../utils/api.js";
const ConfirmAppointment = () => {
  const { idHoraire } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { horaire, patientId, doctorid, specialite, specialiteId } = state || {};
 console.log(specialiteId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [queueNumber, setQueueNumber] = useState(null); // ✅ show after booking

  if (!horaire || !patientId || !doctorid) {
    return (
      <div style={{ textAlign: "center", marginTop: 40, fontFamily: "DM Sans, sans-serif", color: "#6b7280" }}>
        No appointment selected.
      </div>
    );
  }

  const formatDate = (d) => !d ? "" : new Date(d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const handleConfirm = async () => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/rendezvous`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          horaireId: parseInt(idHoraire),
          patientId,
          medecinId: doctorid,
          specialiteId,
          date: horaire.date ?? new Date().toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Booking failed");
      }

      const data = await res.json();
      setQueueNumber(data.queueNumber); // ✅ show queue number to patient
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@600;700&display=swap');

        .ca-root { font-family: 'DM Sans', sans-serif; background: #f0faf4; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 32px 24px; }
        .ca-card { background: #ffffff; border: 1px solid #d1fae5; border-radius: 24px; overflow: hidden; width: 100%; max-width: 480px; box-shadow: 0 8px 40px rgba(16,185,129,0.1); }

        /* Header */
        .ca-header { background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%); padding: 28px 32px; position: relative; overflow: hidden; }
        .ca-header::after { content: ''; position: absolute; top: -50px; right: -50px; width: 160px; height: 160px; border-radius: 50%; background: rgba(255,255,255,0.05); pointer-events: none; }
        .ca-header-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #6ee7b7; margin-bottom: 6px; }
        .ca-header-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #ffffff; margin: 0 0 4px; }
        .ca-header-sub { font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 300; margin: 0; }

        /* Body */
        .ca-body { padding: 28px 32px; }

        /* Info rows */
        .ca-info-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f0fdf4; }
        .ca-info-row:last-of-type { border-bottom: none; }
        .ca-info-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #a7f3d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ca-info-label { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9ca3af; margin-bottom: 2px; }
        .ca-info-value { font-size: 14px; font-weight: 500; color: #064e3b; }

        /* Confirm button */
        .ca-btn { width: 100%; background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%); color: #ffffff; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; padding: 14px; border-radius: 14px; border: none; cursor: pointer; margin-top: 24px; box-shadow: 0 4px 16px rgba(6,79,58,0.25); transition: transform 0.2s, box-shadow 0.2s; }
        .ca-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(6,79,58,0.32); }
        .ca-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .ca-error { display: flex; align-items: center; gap: 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 10px 14px; margin-top: 16px; font-size: 13px; color: #dc2626; }

        /* Success state */
        .ca-success { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px 32px; text-align: center; }
        .ca-success-icon { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #6ee7b7; display: flex; align-items: center; justify-content: center; }
        .ca-success-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #064e3b; margin: 0; }
        .ca-success-sub { font-size: 13.5px; color: #6b7280; font-weight: 300; margin: 0; }
        .ca-queue-badge { display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #064e3b, #047857); color: #ffffff; border-radius: 16px; padding: 16px 28px; margin-top: 8px; }
        .ca-queue-num { font-family: 'Playfair Display', serif; font-size: 48px; color: #6ee7b7; line-height: 1; }
        .ca-queue-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8); text-align: left; }
        .ca-queue-label strong { display: block; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #6ee7b7; margin-bottom: 2px; }
        .ca-home-btn { margin-top: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: #10b981; background: none; border: 1px solid #d1fae5; border-radius: 12px; padding: 10px 24px; cursor: pointer; transition: background 0.15s; }
        .ca-home-btn:hover { background: #f0fdf4; }
      `}</style>

      <div className="ca-root">
        <div className="ca-card">
          <div className="ca-header">
            <p className="ca-header-label">Almost there</p>
            <h2 className="ca-header-title">Confirm Appointment</h2>
            <p className="ca-header-sub">Review your details and join the queue</p>
          </div>

          {/* ── SUCCESS STATE ── */}
          {queueNumber ? (
            <div className="ca-success">
              <div className="ca-success-icon">
                <CheckCircle size={36} color="#10b981" strokeWidth={1.8} />
              </div>
              <h3 className="ca-success-title">You're in the queue!</h3>
              <p className="ca-success-sub">The doctor will call you when it's your turn.</p>

              <div className="ca-queue-badge">
                <div className="ca-queue-num">#{queueNumber}</div>
                <div className="ca-queue-label">
                  <strong>Your queue number</strong>
                  Wait for the doctor to call you
                </div>
              </div>

              <button className="ca-home-btn" onClick={() => navigate("/")}>
                Back to Home
              </button>
            </div>
          ) : (
            /* ── CONFIRM FORM ── */
            <div className="ca-body">
              <div className="ca-info-row">
                <div className="ca-info-icon"><Calendar size={16} color="#10b981" /></div>
                <div>
                  <p className="ca-info-label">Date</p>
                  <p className="ca-info-value">{formatDate(horaire.date)}</p>
                </div>
              </div>

              <div className="ca-info-row">
                <div className="ca-info-icon"><Stethoscope size={16} color="#10b981" /></div>
                <div>
                  <p className="ca-info-label">Speciality</p>
                  <p className="ca-info-value">{specialite || "—"}</p>
                </div>
              </div>

              <div className="ca-info-row">
                <div className="ca-info-icon"><User size={16} color="#10b981" /></div>
                <div>
                  <p className="ca-info-label">How it works</p>
                  <p className="ca-info-value">You'll receive a queue number. The doctor calls patients in order.</p>
                </div>
              </div>

              {error && (
                <div className="ca-error">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button className="ca-btn" onClick={handleConfirm} disabled={loading}>
                {loading ? "Booking…" : "Confirm & Join Queue"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmAppointment;