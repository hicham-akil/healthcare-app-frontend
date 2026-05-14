import React from "react";
import UpdateStatusModal from "./UpdateStatus";
import { useFetch, useAction } from "../../hooks/useFetch";
import { useQueueSocket } from "../../hooks/useQueueSocket";
import { useAuth } from "../../context/AuthContext";

const statusConfig = {
  EN_ATTENTE: { label: "En attente", color: "#92400e", bg: "#fef9c3", dot: "#ca8a04", ring: "#fde68a" },
  EN_COURS: { label: "En cours", color: "#065f46", bg: "#dcfce7", dot: "#16a34a", ring: "#bbf7d0" },
  ON_HOLD: { label: "En pause", color: "#9a3412", bg: "#ffedd5", dot: "#ea580c", ring: "#fed7aa" },
  COMPLETED: { label: "Terminé", color: "#1e40af", bg: "#dbeafe", dot: "#2563eb", ring: "#bfdbfe" },
  ANNULE: { label: "Annulé", color: "#991b1b", bg: "#fee2e2", dot: "#dc2626", ring: "#fca5a5" },
};

const getStatus = (status) =>
  statusConfig[status?.toUpperCase()] || {
    label: status || "—", color: "#374151", bg: "#f3f4f6", dot: "#9ca3af", ring: "#e5e7eb",
  };

const PatientQueueBanner = ({ patientId, medecinId }) => {
  const { position, calledNow, waitMinutes, message, connected, loading } =
    useQueueSocket(patientId, medecinId);

  const bannerStyle = calledNow
    ? { background: "linear-gradient(135deg, #064e3b, #047857)", borderColor: "#a7f3d0" }
    : { background: "#f0fdf4", borderColor: "#d1fae5" };

  return (
    <div style={{
      borderRadius: 16, border: "1px solid", marginBottom: 24, overflow: "hidden", ...bannerStyle,
    }}>
      <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
          background: connected ? "#34d399" : "#f87171",
          boxShadow: connected ? "0 0 0 3px rgba(52,211,153,0.25)" : "none",
        }} />

        {loading ? (
          <span style={{ fontSize: 13, color: "#6b7280" }}>Connexion à la file d'attente…</span>
        ) : (
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: 15, fontWeight: 700, color: calledNow ? "#fff" : "#064e3b", marginBottom: 4,
            }}>
              {calledNow ? "🔔 " : position === 0 ? "⏭ " : "🕐 "}
              {message ?? "Aucun rendez-vous actif aujourd'hui."}
            </p>
            {!calledNow && waitMinutes > 0 && (
              <p style={{ fontSize: 12, color: "#059669", fontWeight: 400 }}>
                ⏱ Temps d'attente estimé : ~{waitMinutes} min
              </p>
            )}
          </div>
        )}

        {!loading && !calledNow && position !== null && (
          <div style={{
            minWidth: 48, height: 48, borderRadius: 14,
            background: position === 0 ? "linear-gradient(135deg,#064e3b,#047857)" : "linear-gradient(135deg,#ecfdf5,#d1fae5)",
            border: "1px solid", borderColor: position === 0 ? "#047857" : "#a7f3d0",
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          }}>
            <span style={{ fontSize: position === 0 ? 18 : 20, fontWeight: 700, color: position === 0 ? "#6ee7b7" : "#064e3b", lineHeight: 1 }}>
              {position === 0 ? "→" : position}
            </span>
            {position > 0 && <span style={{ fontSize: 9, color: "#059669", fontWeight: 600, marginTop: 2 }}>avant</span>}
          </div>
        )}

        {calledNow && (
          <div style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 12, padding: "8px 16px", color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
            C'est votre tour
          </div>
        )}
      </div>
    </div>
  );
};

const MyRendezVous = () => {
  const { user } = useAuth();
  const isMedecin = user?.role === "MEDECIN";
  const userId = user?.id;

  const endpoint = isMedecin
    ? `/api/rendezvous/medecin/${userId}`
    : `/api/rendezvous/patient/${userId}`;

  const { data, loading, error, refetch } = useFetch(userId ? endpoint : null);
  const rendezVous = Array.isArray(data) ? data : [];

  const currentPatient = isMedecin
    ? (rendezVous.find((r) => r.status?.toUpperCase() === "EN_COURS") || null)
    : null;

  const activeRdv = !isMedecin
    ? rendezVous.find((r) => ["EN_ATTENTE", "EN_COURS", "ON_HOLD"].includes(r.status?.toUpperCase()))
    : null;

  const { execute: callNext, loading: nextLoading, error: nextError, reset: resetNextError } = useAction();
  const { execute: holdAction, loading: holdLoading } = useAction();
  const { execute: recallAction, loading: recallLoading } = useAction();
  const { execute: cancelRdv, loading: cancelLoading } = useAction();

  const handleNextPatient = async () => {
    resetNextError();
    await callNext(`/api/rendezvous/medecin/${userId}/next`, { method: "POST" });
    refetch();
  };

  const handleHoldAndNext = async () => {
    if (!window.confirm("Mettre ce patient en pause (Hold) et appeler le suivant ?")) return;
    await holdAction(`/api/rendezvous/medecin/${userId}/hold-next`, { method: "POST" });
    refetch();
  };

  const handleRecall = async (rdvId) => {
    await recallAction(`/api/rendezvous/${rdvId}/recall`, { method: "POST" });
    refetch();
  };

  const handleCancel = async (rdvId) => {
    if (!window.confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) return;
    await cancelRdv(`/api/rendezvous/${rdvId}/cancel`, { method: "PUT" });
    refetch();
  };

  const stats = [
    { num: rendezVous.length, label: "Total", icon: "📋", color: "#065f46", bg: "#f0fdf4", border: "#bbf7d0" },
    { num: rendezVous.filter((r) => r.status?.toUpperCase() === "EN_ATTENTE").length, label: "En attente", icon: "⏳", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
    { num: rendezVous.filter((r) => r.status?.toUpperCase() === "ON_HOLD").length, label: "En pause", icon: "⏸", color: "#9a3412", bg: "#ffedd5", border: "#fed7aa" },
    { num: rendezVous.filter((r) => r.status?.toUpperCase() === "COMPLETED").length, label: "Terminés", icon: "✔", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Lora:wght@600;700&display=swap');
        .rv-root { font-family: 'Outfit', sans-serif; background: #f8fffe; min-height: 100vh; padding: 36px 20px; color: #111827; }
        .rv-card { max-width: 1040px; margin: 0 auto; background: #fff; border-radius: 24px; box-shadow: 0 12px 40px rgba(4,120,87,0.08); overflow: hidden; }
        .rv-header { background: linear-gradient(130deg, #022c22, #065f46); padding: 32px 40px; color: white; position: relative; }
        .rv-header-row { display: flex; align-items: center; gap: 16px; }
        .rv-header-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.12); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .rv-title { font-family: 'Lora', serif; font-size: 24px; font-weight: 700; }
        .rv-role-chip { margin-left: auto; background: rgba(255,255,255,0.12); padding: 5px 14px; border-radius: 20px; font-size: 12px; }
        .rv-body { padding: 28px 32px; }
        .rv-next-banner { border-radius: 16px; overflow: hidden; margin-bottom: 24px; border: 1px solid #d1fae5; }
        .rv-next-banner-top { background: linear-gradient(135deg, #064e3b, #047857); padding: 16px 22px; display: flex; align-items: center; justify-content: space-between; }
        .rv-next-info { display: flex; align-items: center; gap: 12px; }
        .rv-next-avatar { width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
        .rv-next-name { font-size: 15px; font-weight: 600; color: white; }
        .rv-next-btn { display: inline-flex; align-items: center; gap: 8px; background: white; color: #064e3b; padding: 10px 18px; border-radius: 12px; border: none; cursor: pointer; font-weight: 700; font-size: 13px; transition: 0.2s; }
        .rv-next-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .rv-next-btn.hold-btn { background: #ffedd5; color: #9a3412; }
        .rv-next-empty { padding: 16px 22px; background: #f0fdf4; display: flex; align-items: center; justify-content: space-between; }
        .rv-row-active { background: #f0fdf4 !important; }
        .rv-row-hold { background: #fffaf0 !important; }
        .rv-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .rv-stat { border-radius: 14px; padding: 16px; border: 1px solid; text-align: center; }
        .rv-stat-num { font-size: 24px; font-weight: 700; }
        .rv-table-wrap { border-radius: 16px; overflow: hidden; border: 1px solid #e7f5ef; }
        .rv-table { width: 100%; border-collapse: collapse; }
        .rv-table th { background: #f0fdf4; padding: 13px 18px; text-align: left; font-size: 11px; color: #059669; text-transform: uppercase; }
        .rv-table td { padding: 15px 18px; border-bottom: 1px solid #f0fdf4; }
        .rv-queue-block { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: #ecfdf5; font-weight: 700; color: #064e3b; }
        .rv-queue-block.active { background: #064e3b; color: #6ee7b7; }
        .rv-queue-block.hold { background: #ea580c; color: white; }
        .rv-status { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid transparent; }
        .rv-status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .rv-recall-btn { background: #064e3b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; cursor: pointer; font-weight: 600; }
        .rv-cancel-btn { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
      `}</style>

      <div className="rv-root">
        <div className="rv-card">
          <div className="rv-header">
            <div className="rv-header-row">
              <div className="rv-header-icon">🩺</div>
              <div className="rv-header-text">
                <h1 className="rv-title">Mes Rendez-vous</h1>
                <p>{isMedecin ? "Gérez la file d'attente" : "Suivez votre position"}</p>
              </div>
              <div className="rv-role-chip">{isMedecin ? "Médecin" : "Patient"}</div>
            </div>
          </div>

          <div className="rv-body">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
            ) : (
              <>
                {isMedecin && (
                  <div className="rv-next-banner">
                    {currentPatient ? (
                      <div className="rv-next-banner-top">
                        <div className="rv-next-info">
                          <div className="rv-next-avatar">{currentPatient.patientNom?.[0]}</div>
                          <div>
                            <p className="rv-next-name">{currentPatient.patientNom}</p>
                            <p style={{ color: '#a7f3d0', fontSize: '12px' }}>#{currentPatient.queueNumber} · En cours</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="rv-next-btn hold-btn" onClick={handleHoldAndNext} disabled={holdLoading}>
                            {holdLoading ? "..." : "⏸ Hold / Absent"}
                          </button>
                          <button className="rv-next-btn" onClick={handleNextPatient} disabled={nextLoading}>
                            {nextLoading ? "..." : "✓ Terminer & Suivant"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rv-next-empty">
                        <p>Aucun patient en cours.</p>
                        <button className="rv-next-btn" onClick={handleNextPatient} style={{ background: '#064e3b', color: 'white' }}>
                          ▶ Appeler Premier
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!isMedecin && activeRdv && (
                  <PatientQueueBanner patientId={Number(userId)} medecinId={activeRdv.medecinId} />
                )}

                <div className="rv-stats">
                  {stats.map((s) => (
                    <div key={s.label} className="rv-stat" style={{ background: s.bg, borderColor: s.border, color: s.color }}>
                      <div className="rv-stat-num">{s.num}</div>
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="rv-table-wrap">
                  <table className="rv-table">
                    <thead>
                      <tr><th>#</th><th>Date</th><th>{isMedecin ? "Patient" : "Médecin"}</th><th>Spécialité</th><th>Statut</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {rendezVous.map((rdv) => {
                        const st = getStatus(rdv.status);
                        const isActive = rdv.status?.toUpperCase() === "EN_COURS";
                        const isHold = rdv.status?.toUpperCase() === "ON_HOLD";
                        return (
                          <tr key={rdv.id} className={isActive ? "rv-row-active" : isHold ? "rv-row-hold" : ""}>
                            <td>
                              <span className={`rv-queue-block ${isActive ? "active" : isHold ? "hold" : ""}`}>
                                {rdv.queueNumber}
                              </span>
                            </td>
                            <td>{rdv.rendezvousdate ? new Date(rdv.rendezvousdate).toLocaleDateString() : "—"}</td>
                            <td>{isMedecin ? rdv.patientNom : rdv.medecinNom}</td>
                            <td>{rdv.specialite}</td>
                            <td>
                              <span className="rv-status" style={{ background: st.bg, color: st.color, borderColor: st.ring }}>
                                <span className="rv-status-dot" style={{ background: st.dot }} />
                                {st.label}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                {isMedecin && isHold && (
                                  <button className="rv-recall-btn" onClick={() => handleRecall(rdv.id)}>Rappeler</button>
                                )}
                                {isMedecin ? (
                                  <UpdateStatusModal rendezVousId={rdv.id} currentStatus={rdv.status} onUpdate={refetch} />
                                ) : rdv.status === "EN_ATTENTE" && (
                                  <button className="rv-cancel-btn" onClick={() => handleCancel(rdv.id)}>Annuler</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRendezVous;