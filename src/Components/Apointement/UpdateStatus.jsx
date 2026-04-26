import React, { useState } from "react";
import { useAction } from "../../hooks/useFetch"; // Standardized Hook

const STATUS_OPTIONS = [
  {
    value: "EN_ATTENTE",
    label: "En attente",
    icon: "⏳",
    color: "#92400e",
    bg: "#fef3c7",
    border: "#fcd34d",
    dot: "#f59e0b",
    desc: "Patient en attente dans la file",
  },
  {
    value: "EN_COURS",
    label: "En cours",
    icon: "🟢",
    color: "#065f46",
    bg: "#d1fae5",
    border: "#6ee7b7",
    dot: "#10b981",
    desc: "Patient en consultation",
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
    value: "ANNULE",
    label: "Annulé",
    icon: "✕",
    color: "#991b1b",
    bg: "#fee2e2",
    border: "#fca5a5",
    dot: "#ef4444",
    desc: "Le rendez-vous est annulé",
  },
];

const UpdateStatusModal = ({ rendezVousId, currentStatus, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentStatus?.toUpperCase() || "EN_ATTENTE");

  // NEW: Use the standardized action hook
  const { execute: updateStatus, loading, error, reset: resetError } = useAction();

  const role = localStorage.getItem("role");
  const isMedecin = role === "MEDECIN";

  if (!isMedecin) return null;

  const handleOpen = () => {
    setSelected(currentStatus?.toUpperCase() || "EN_ATTENTE");
    resetError();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetError();
  };

  const handleSubmit = async () => {
    // If no change, just close
    if (selected === currentStatus?.toUpperCase()) {
      handleClose();
      return;
    }

    // execute() handles the PUT request and uses your new apiFetch logic
    const result = await updateStatus(`/api/rendezvous/${rendezVousId}/status`, {
      method: "PUT",
      body: { status: selected }, // Object passed directly; apiFetch handles stringify
    });

    // Only update UI if the request was successful
    if (result) {
      onUpdate && onUpdate(selected);
      handleClose();
    }
  };

  const currentSt = STATUS_OPTIONS.find(o => o.value === currentStatus?.toUpperCase());

  return (
    <>
      <style>{`
        /* ... Styles remain exactly the same as your original ... */
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        .usm-trigger-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 8px; border: 1.5px solid #d1fae5; background: #f0fdf4; color: #065f46; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .usm-trigger-btn:hover { background: #dcfce7; border-color: #86efac; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(16,185,129,0.15); }
        .usm-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(6, 78, 59, 0.18); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; animation: usm-fade-in 0.2s ease; }
        @keyframes usm-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .usm-modal { font-family: 'DM Sans', sans-serif; background: #ffffff; border-radius: 24px; box-shadow: 0 24px 80px rgba(6, 78, 59, 0.18), 0 4px 16px rgba(0,0,0,0.06); width: 100%; max-width: 460px; overflow: hidden; animation: usm-slide-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes usm-slide-up { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .usm-header { background: linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%); padding: 24px 28px 20px; }
        .usm-header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
        .usm-icon-wrap { width: 42px; height: 42px; background: rgba(255,255,255,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .usm-close-btn { width: 30px; height: 30px; background: rgba(255,255,255,0.12); border: none; border-radius: 8px; cursor: pointer; color: rgba(255,255,255,0.7); font-size: 14px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
        .usm-close-btn:hover { background: rgba(255,255,255,0.25); color: #fff; }
        .usm-title { font-family: 'Playfair Display', serif; font-size: 18px; color: #fff; margin-bottom: 4px; }
        .usm-current { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); border-radius: 20px; padding: 4px 12px; font-size: 12px; color: rgba(255,255,255,0.85); }
        .usm-current-dot { width: 6px; height: 6px; border-radius: 50%; }
        .usm-body { padding: 24px 28px 28px; }
        .usm-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 12px; }
        .usm-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .usm-option { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #e5e7eb; cursor: pointer; transition: all 0.15s; background: #fafafa; }
        .usm-option:hover { border-color: #a7f3d0; background: #f0fdf4; transform: translateX(2px); }
        .usm-option.selected { border-width: 2px; transform: translateX(2px); }
        .usm-option-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
        .usm-option-text { flex: 1; }
        .usm-option-label { font-size: 13px; font-weight: 500; color: #1a2e1a; }
        .usm-option-desc { font-size: 11px; color: #6b7280; margin-top: 1px; }
        .usm-radio { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
        .usm-radio-inner { width: 7px; height: 7px; border-radius: 50%; transition: all 0.15s; }
        .usm-error { display: flex; align-items: center; gap: 8px; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 10px; padding: 10px 14px; color: #991b1b; font-size: 13px; margin-bottom: 16px; }
        .usm-actions { display: flex; gap: 10px; }
        .usm-btn-cancel { flex: 1; padding: 11px; border-radius: 10px; border: 1.5px solid #e5e7eb; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; transition: all 0.15s; }
        .usm-btn-cancel:hover { background: #f9fafb; }
        .usm-btn-confirm { flex: 2; padding: 11px; border-radius: 10px; border: none; background: linear-gradient(135deg, #065f46, #047857); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; justify-content: center; gap: 7px; box-shadow: 0 4px 14px rgba(16,185,129,0.25); }
        .usm-btn-confirm:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,0.35); }
        .usm-btn-confirm:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .usm-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: usm-spin 0.7s linear infinite; }
        @keyframes usm-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Trigger Button */}
      <button className="usm-trigger-btn" onClick={handleOpen}>
        ✏️ Modifier
      </button>

      {/* Modal */}
      {open && (
        <div className="usm-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div className="usm-modal">
            <div className="usm-header">
              <div className="usm-header-top">
                <div className="usm-icon-wrap">📋</div>
                <button className="usm-close-btn" onClick={handleClose}>✕</button>
              </div>
              <h2 className="usm-title">Modifier le statut</h2>
              {currentSt && (
                <div className="usm-current">
                  <span className="usm-current-dot" style={{ background: currentSt.dot }} />
                  Actuel : {currentSt.label}
                </div>
              )}
            </div>

            <div className="usm-body">
              <p className="usm-section-label">Choisir le nouveau statut</p>

              <div className="usm-options">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = selected === opt.value;
                  return (
                    <div
                      key={opt.value}
                      className={`usm-option${isSelected ? " selected" : ""}`}
                      style={isSelected ? { borderColor: opt.border, background: opt.bg } : {}}
                      onClick={() => setSelected(opt.value)}
                    >
                      <div className="usm-option-icon"
                        style={{ background: isSelected ? opt.bg : "#f3f4f6", color: opt.color }}>
                        {opt.icon}
                      </div>
                      <div className="usm-option-text">
                        <div className="usm-option-label">{opt.label}</div>
                        <div className="usm-option-desc">{opt.desc}</div>
                      </div>
                      <div className="usm-radio" style={isSelected ? { borderColor: opt.dot } : {}}>
                        <div className="usm-radio-inner"
                          style={isSelected ? { background: opt.dot } : {}} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* error state now automatically contains backend messages like "Consultation déjà terminée" */}
              {error && (
                <div className="usm-error">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              <div className="usm-actions">
                <button className="usm-btn-cancel" onClick={handleClose}>Annuler</button>
                <button className="usm-btn-confirm" onClick={handleSubmit} disabled={loading}>
                  {loading
                    ? <><div className="usm-spinner" /> Mise à jour…</>
                    : <>✓ Confirmer</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateStatusModal;