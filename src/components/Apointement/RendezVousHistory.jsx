import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";

const statusConfig = {
  COMPLETED: { label: "Terminé", color: "#1e40af", bg: "#dbeafe", dot: "#2563eb", ring: "#bfdbfe" },
  ANNULE: { label: "Annulé", color: "#991b1b", bg: "#fee2e2", dot: "#dc2626", ring: "#fca5a5" },
};

const getStatus = (status) =>
  statusConfig[status?.toUpperCase()] || {
    label: status || "—", color: "#374151", bg: "#f3f4f6", dot: "#9ca3af", ring: "#e5e7eb",
  };

const RendezVousHistory = () => {
  const { user } = useAuth();
  const isMedecin = user?.role === "MEDECIN";
  const userId = user?.id;

  const endpoint = isMedecin
    ? `/api/rendezvous/medecin/${userId}`
    : `/api/rendezvous/patient/${userId}`;

  const { data, loading, error } = useFetch(userId ? endpoint : null);
  
  // Filter for history (COMPLETED or ANNULE)
  const history = Array.isArray(data) 
    ? data.filter(r => ["COMPLETED", "ANNULE"].includes(r.status?.toUpperCase())) 
    : [];
  console.log("Rendez-vous history data:", history);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Lora:wght@600;700&display=swap');
        .hist-root { font-family: 'Outfit', sans-serif; background: linear-gradient(180deg, #f6fdf8 0%, #edf9f2 100%); min-height: 100vh; padding: 36px 20px; color: #111827; }
        .hist-card { max-width: 1040px; margin: 0 auto; background: #fff; border: 1px solid #d1fae5; border-radius: 24px; box-shadow: 0 24px 60px rgba(4,120,87,0.10); overflow: hidden; }
        .hist-header { background: linear-gradient(130deg, #064e3b, #047857); padding: 32px 40px; color: white; position: relative; overflow: hidden; }
        .hist-header::after { content: ""; position: absolute; right: -60px; top: -80px; width: 220px; height: 220px; border-radius: 50%; background: rgba(255,255,255,0.08); pointer-events: none; }
        .hist-header-row { display: flex; align-items: center; gap: 16px; }
        .hist-header-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.12); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .hist-title { font-family: 'Lora', serif; font-size: 24px; font-weight: 700; }
        .hist-body { padding: 28px 32px; }
        .hist-table-wrap { border-radius: 16px; overflow: auto; border: 1px solid #d1fae5; }
        .hist-table { width: 100%; border-collapse: collapse; }
        .hist-table th { background: #ecfdf5; padding: 13px 18px; text-align: left; font-size: 11px; color: #065f46; text-transform: uppercase; letter-spacing: 0.06em; }
        .hist-table td { padding: 15px 18px; border-bottom: 1px solid #ecfdf5; }
        .hist-table tbody tr { transition: background 0.14s; }
        .hist-table tbody tr:hover { background: #f8fffb; }
        .hist-status { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid transparent; }
        .hist-status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .hist-empty { text-align: center; padding: 60px 20px; color: #64748b; }
        .hist-empty-icon { font-size: 48px; margin-bottom: 16px; display: block; }
        @media (max-width: 640px) {
          .hist-root { padding: 28px 16px; }
          .hist-header { padding: 28px 24px; }
          .hist-body { padding: 20px 16px; }
          .hist-table { min-width: 620px; }
        }
      `}</style>

      <div className="hist-root">
        <div className="hist-card">
          <div className="hist-header">
            <div className="hist-header-row">
              <div className="hist-header-icon">📜</div>
              <div className="hist-header-text">
                <h1 className="hist-title">Historique des Rendez-vous</h1>
                <p>Consultez vos rendez-vous passés et annulés</p>
              </div>
            </div>
          </div>

          <div className="hist-body">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>{error}</div>
            ) : history.length === 0 ? (
              <div className="hist-empty">
                <span className="hist-empty-icon">📂</span>
                <p>Aucun historique disponible pour le moment.</p>
              </div>
            ) : (
              <div className="hist-table-wrap">
                <table className="hist-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>{isMedecin ? "Patient" : "Médecin"}</th>
                      <th>Spécialité</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((rdv) => {
                      const st = getStatus(rdv.status);
                      return (
                        <tr key={rdv.id}>
                          <td>{rdv.rendezvousdate ? new Date(rdv.rendezvousdate).toLocaleDateString() : "—"}</td>
                          <td>{isMedecin ? rdv.patientnom : rdv.medecinNom}</td>
                          <td>{rdv.specialite}</td>
                          <td>
                            <span className="hist-status" style={{ background: st.bg, color: st.color, borderColor: st.ring }}>
                              <span className="hist-status-dot" style={{ background: st.dot }} />
                              {st.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RendezVousHistory;
