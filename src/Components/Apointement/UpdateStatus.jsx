import React, { useState } from "react";

const STATUS_OPTIONS = [
  {
    value: "CONFIRMED",
    label: "Confirmé",
    icon: "✓",
    color: "#065f46",
    bg: "#d1fae5",
    border: "#6ee7b7",
    dot: "#10b981",
    desc: "Le rendez-vous est confirmé",
  },
  {
    value: "PENDING",
    label: "En attente",
    icon: "⏳",
    color: "#92400e",
    bg: "#fef3c7",
    border: "#fcd34d",
    dot: "#f59e0b",
    desc: "En attente de confirmation",
  },
  {
    value: "COMPLETED",
    label: "Terminé",
    icon: "✔✔",
    color: "#1e3a5f",
    bg: "#dbeafe",
    border: "#93c5fd",
    dot: "#3b82f6",
    desc: "La consultation est terminée",
  },
  {
    value: "CANCELLED",
    label: "Annulé",
    icon: "✕",
    color: "#991b1b",
    bg: "#fee2e2",
    border: "#fca5a5",
    dot: "#ef4444",
    desc: "Le rendez-vous est annulé",
  },
];

const UpdateStatusModal = ({ rdv, onClose, onSuccess }) => {
  const [selected, setSelected] = useState(rdv?.status?.toUpperCase() || "PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!rdv) return null;

  const handleSubmit = async () => {
    if (selected === rdv.status?.toUpperCase()) {
      onClose();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/rendezvous/${rdv.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: selected }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      onSuccess && onSuccess(rdv.id, selected);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const patientName = rdv.patientnom || rdv.patientNom || "—";
  const dateStr = new Date(rdv.dateHeureDebut).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = `${new Date(rdv.dateHeureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} – ${new Date(rdv.dateHeureFin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

        .usm-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(6, 78, 59, 0.18);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: usm-fade-in 0.2s ease;
        }
        @keyframes usm-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .usm-modal {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 24px 80px rgba(6, 78, 59, 0.18), 0 4px 16px rgba(0,0,0,0.06);
          width: 100%; max-width: 480px;
          overflow: hidden;
          animation: usm-slide-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes usm-slide-up {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        .usm-header {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%);
          padding: 28px 32px 24px;
          position: relative;
        }
        .usm-header-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .usm-icon-wrap {
          width: 46px; height: 46px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; backdrop-filter: blur(4px);
        }
        .usm-close-btn {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.12);
          border: none; border-radius: 8px; cursor: pointer;
          color: rgba(255,255,255,0.7); font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .usm-close-btn:hover { background: rgba(255,255,255,0.25); color: #fff; }

        .usm-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; color: #ffffff;
          margin: 12px 0 4px; letter-spacing: -0.2px;
        }
        .usm-patient-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
        .usm-patient-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #fff;
        }
        .usm-patient-info { display: flex; flex-direction: column; gap: 1px; }
        .usm-patient-name { color: #ffffff; font-size: 13.5px; font-weight: 500; }
        .usm-patient-time { color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 300; }

        .usm-body { padding: 28px 32px 32px; }

        .usm-section-label {
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1px;
          color: #6b7280; margin-bottom: 14px;
        }

        .usm-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }

        .usm-option {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 14px;
          border: 1.5px solid #e5e7eb;
          cursor: pointer; transition: all 0.18s ease;
          background: #fafafa;
          position: relative; overflow: hidden;
        }
        .usm-option:hover { border-color: #a7f3d0; background: #f0fdf4; transform: translateX(2px); }
        .usm-option.selected { border-width: 2px; transform: translateX(2px); }

        .usm-option-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; flex-shrink: 0;
        }
        .usm-option-text { flex: 1; }
        .usm-option-label { font-size: 14px; font-weight: 500; color: #1a2e1a; line-height: 1.2; }
        .usm-option-desc { font-size: 12px; color: #6b7280; margin-top: 2px; }

        .usm-radio {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.15s;
        }
        .usm-radio-inner {
          width: 8px; height: 8px; border-radius: 50%;
          background: transparent; transition: all 0.15s;
        }
        .usm-option.selected .usm-radio { border-color: currentColor; }
        .usm-option.selected .usm-radio-inner { background: currentColor; }

        .usm-error {
          display: flex; align-items: center; gap: 10px;
          background: #fee2e2; border: 1px solid #fca5a5;
          border-radius: 10px; padding: 12px 16px;
          color: #991b1b; font-size: 13px; margin-bottom: 20px;
        }

        .usm-actions { display: flex; gap: 12px; }

        .usm-btn-cancel {
          flex: 1; padding: 13px; border-radius: 12px;
          border: 1.5px solid #e5e7eb; background: #ffffff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #374151; cursor: pointer; transition: all 0.15s;
        }
        .usm-btn-cancel:hover { background: #f9fafb; border-color: #d1d5db; }

        .usm-btn-confirm {
          flex: 2; padding: 13px; border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #065f46, #047857);
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #ffffff; cursor: pointer; transition: all 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }
        .usm-btn-confirm:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        .usm-btn-confirm:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .usm-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: usm-spin 0.7s linear infinite;
        }
        @keyframes usm-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="usm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="usm-modal">
          {/* Header */}
          <div className="usm-header">
            <div className="usm-header-top">
              <div className="usm-icon-wrap">📋</div>
              <button className="usm-close-btn" onClick={onClose}>✕</button>
            </div>
            <h2 className="usm-title">Modifier le statut</h2>
            <div className="usm-patient-row">
              <div className="usm-patient-avatar">
                {patientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="usm-patient-info">
                <span className="usm-patient-name">{patientName}</span>
                <span className="usm-patient-time">{dateStr} · {timeStr}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="usm-body">
            <p className="usm-section-label">Choisir le nouveau statut</p>

            <div className="usm-options">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = selected === opt.value;
                return (
                  <div
                    key={opt.value}
                    className={`usm-option${isSelected ? " selected" : ""}`}
                    style={isSelected ? {
                      borderColor: opt.border,
                      background: opt.bg,
                      color: opt.color,
                    } : {}}
                    onClick={() => setSelected(opt.value)}
                  >
                    <div
                      className="usm-option-icon"
                      style={{ background: isSelected ? opt.bg : "#f3f4f6", color: opt.color }}
                    >
                      {opt.icon}
                    </div>
                    <div className="usm-option-text">
                      <div className="usm-option-label">{opt.label}</div>
                      <div className="usm-option-desc">{opt.desc}</div>
                    </div>
                    <div
                      className="usm-radio"
                      style={isSelected ? { borderColor: opt.dot, color: opt.dot } : {}}
                    >
                      <div
                        className="usm-radio-inner"
                        style={isSelected ? { background: opt.dot } : {}}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="usm-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="usm-actions">
              <button className="usm-btn-cancel" onClick={onClose}>Annuler</button>
              <button
                className="usm-btn-confirm"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <><div className="usm-spinner" /> Mise à jour…</>
                ) : (
                  <>✓ Confirmer le statut</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStatusModal;