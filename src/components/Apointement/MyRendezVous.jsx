import React, { useEffect, useState } from "react";
import UpdateStatusModal from "./UpdateStatus";
import { useFetch, useAction } from "../../hooks/useFetch";
import { useQueueSocket } from "../../hooks/useQueueSocket";
import { useAuth } from "../../context/AuthContext";

/* ─── Helpers ─────────────────────────────────────────────── */
const isToday = (dateStr) => {
  if (!dateStr) return false;
  const dateOnly = dateStr.toString().substring(0, 10); // "2026-05-29"
  const today = new Date().toLocaleDateString("en-CA"); // "2026-05-29" (ISO format)
  return dateOnly === today;
};

const fmtDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) return "";
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

const STATUS_MAP = {
  EN_ATTENTE: { label: "En attente", cls: "s-wait" },
  EN_COURS: { label: "En cours", cls: "s-active" },
  ON_HOLD: { label: "En pause", cls: "s-hold" },
  COMPLETED: { label: "Terminé", cls: "s-done" },
  ANNULE: { label: "Annulé", cls: "s-cancel" },
};
const STATUS_ORDER = { EN_COURS: 0, EN_ATTENTE: 1, ON_HOLD: 2, COMPLETED: 3, ANNULE: 4 };
const getStatus = (s) =>
  STATUS_MAP[s?.toUpperCase()] || { label: s || "—", cls: "s-default" };
const initials = (name) =>
  (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

const firstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim())?.trim() || "";

const getPatientName = (rdv) =>
  firstText(
    rdv?.patientNom,
    rdv?.patientnom,
    rdv?.patientName,
    rdv?.patient?.nomComplet,
    rdv?.patient?.fullName,
    [rdv?.patient?.prenom, rdv?.patient?.nom].filter(Boolean).join(" ")
  );

const getMedecinName = (rdv) =>
  firstText(
    rdv?.medecinNom,
    rdv?.medecinnom,
    rdv?.medecinName,
    rdv?.medecin?.nomComplet,
    rdv?.medecin?.fullName,
    [rdv?.medecin?.prenom, rdv?.medecin?.nom].filter(Boolean).join(" ")
  );

const getDisplayName = (rdv, isMedecin) =>
  isMedecin ? getPatientName(rdv) : getMedecinName(rdv);

/* ─── Queue Banner (patient) ──────────────────────────────── */
const PatientQueueBanner = ({ patientId, medecinId }) => {
  const { position, calledNow, waitMinutes, message, connected, loading } =
    useQueueSocket(patientId, medecinId);

  return (
    <div className={`queue-banner${calledNow ? " queue-banner--called" : ""}`}>
      <span className={`pulse-dot${connected ? " pulse-dot--on" : " pulse-dot--off"}`} />
      <div className="queue-banner__body">
        {loading ? (
          <span className="queue-banner__msg muted">Connexion à la file d'attente…</span>
        ) : (
          <>
            <span className="queue-banner__msg">
              {message ?? "Aucun rendez-vous actif aujourd'hui."}
            </span>
            {!calledNow && waitMinutes > 0 && (
              <span className="queue-banner__sub">
                Temps d'attente estimé : ~{waitMinutes} min
              </span>
            )}
          </>
        )}
      </div>
      {!loading && position !== null && !calledNow && (
        <div className="queue-pos">
          <span className="queue-pos__num">{position === 0 ? "→" : position}</span>
          {position > 0 && <span className="queue-pos__label">avant vous</span>}
        </div>
      )}
      {calledNow && <span className="queue-badge">C'est votre tour</span>}
    </div>
  );
};

/* ─── RDV Card ────────────────────────────────────────────── */
const RdvCard = ({ rdv, isMedecin, isToday: today, onRecall, onCancel, onUpdate, cancelLoading }) => {
  const st = getStatus(rdv.status);
  const isActive = rdv.status?.toUpperCase() === "EN_COURS";
  const isHold = rdv.status?.toUpperCase() === "ON_HOLD";
  const canCancel = !isMedecin && rdv.status?.toUpperCase() === "EN_ATTENTE";
  const personName = getDisplayName(rdv, isMedecin);
  const time = fmtTime(rdv.rendezvousdate);

  return (
    <div className={`rdv-card${isActive ? " rdv-card--active" : ""}${today ? " rdv-card--today" : ""}`}>
      {today && <span className="today-ribbon">Aujourd'hui</span>}

      {/* Left: avatar + name */}
      <div className="rdv-card__left">
        <div className={`rdv-avatar${isActive ? " rdv-avatar--active" : ""}`}>
          {initials(personName)}
        </div>
        <div className="rdv-card__info">
          <span className="rdv-card__name">{personName || "—"}</span>
          <span className="rdv-card__spec">{rdv.specialite || "Généraliste"}</span>
        </div>
      </div>

      {/* Mid: date + time */}
      <div className="rdv-card__mid">
        <div className="rdv-meta">
          <IconCalendar />
          {fmtDate(rdv.rendezvousdate)}
        </div>
        {time && (
          <div className="rdv-meta">
            <IconClock />
            {time}
          </div>
        )}
      </div>

      {/* Queue number */}
      <div className="rdv-card__queue">
        <span className={`queue-num${isActive ? " queue-num--active" : isHold ? " queue-num--hold" : ""}`}>
          #{rdv.queueNumber ?? "—"}
        </span>
      </div>

      {/* Status */}
      <div className="rdv-card__status">
        <span className={`status-badge ${st.cls}`}>{st.label}</span>
      </div>

      {/* Actions */}
      <div className="rdv-card__actions">
        {isMedecin && isHold && (
          <button className="btn btn-ghost btn-sm" onClick={() => onRecall(rdv.id)}>
            Rappeler
          </button>
        )}
        {isMedecin ? (
          <UpdateStatusModal
            rendezVousId={rdv.id}
            currentStatus={rdv.status}
            onUpdate={onUpdate}
          />
        ) : canCancel ? (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onCancel(rdv.id)}
            disabled={cancelLoading}
          >
            Annuler
          </button>
        ) : null}
      </div>
    </div>
  );
};

/* ─── Tiny inline icons ───────────────────────────────────── */
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ─── Main Component ──────────────────────────────────────── */
const MyRendezVous = () => {
  const { user } = useAuth();
  const isMedecin = user?.role === "MEDECIN";
  const userId = user?.id;
  const [filter, setFilter] = useState("ALL");

  const endpoint = isMedecin
    ? `/api/rendezvous/medecin/${userId}`
    : `/api/rendezvous/patient/${userId}`;

  const { data, loading, error, refetch } = useFetch(userId ? endpoint : null);
  const allRdv = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (!Array.isArray(data)) return;

    const rendezVous = data;
    const missingNames = rendezVous.filter((rdv) => !getDisplayName(rdv, isMedecin));
    console.debug("[MyRendezVous] rendez-vous loaded", {
      role: user?.role,
      endpoint,
      count: rendezVous.length,
      sample: rendezVous[0],
    });

    if (missingNames.length > 0) {
      console.warn(
        "[MyRendezVous] Missing display name for rendez-vous. Check backend field names.",
        missingNames.map((rdv) => ({
          id: rdv.id,
          patientNom: rdv.patientNom,
          patientnom: rdv.patientnom,
          patientName: rdv.patientName,
          patient: rdv.patient,
          medecinNom: rdv.medecinNom,
          medecinnom: rdv.medecinnom,
          medecinName: rdv.medecinName,
          medecin: rdv.medecin,
        }))
      );
    }
  }, [data, endpoint, isMedecin, user?.role]);
  /* ── Sort: today first (active→waiting→hold→done→cancel), then others desc ── */
  const todayRdv = allRdv
    .filter((r) => isToday(r.rendezvousdate))
    .sort(
      (a, b) =>
        (STATUS_ORDER[a.status?.toUpperCase()] ?? 9) -
        (STATUS_ORDER[b.status?.toUpperCase()] ?? 9)
    );

  const otherRdv = allRdv
    .filter((r) => !isToday(r.rendezvousdate))
    .sort((a, b) => new Date(b.rendezvousdate) - new Date(a.rendezvousdate));
   
  const applyFilter = (list) =>
    filter === "ALL" ? list : list.filter((r) => r.status?.toUpperCase() === filter);

  const todayFiltered = applyFilter(todayRdv);
  const otherFiltered = applyFilter(otherRdv);

  /* ── Doctor: current patient ── */
  const currentPatient = isMedecin
    ? allRdv.find((r) => r.status?.toUpperCase() === "EN_COURS") || null
    : null;
  const currentPatientName = currentPatient ? getPatientName(currentPatient) : "";
  /* ── Patient: active rdv ── */
  const activeRdv = !isMedecin
    ? allRdv.find((r) =>
      ["EN_ATTENTE", "EN_COURS", "ON_HOLD"].includes(r.status?.toUpperCase())
    )
    : null;

  /* ── Actions ── */
  const { execute: callNext, loading: nextLoading, reset: resetNextError } = useAction();
  const { execute: holdAction, loading: holdLoading } = useAction();
  const { execute: recallAction } = useAction();
  const { execute: cancelRdv, loading: cancelLoading } = useAction();

  const handleNextPatient = async () => {
    resetNextError?.();

    const result = await callNext(
      `/api/rendezvous/medecin/${userId}/next`,
      { method: "POST" }
    );

    if (result?.message === "No patient left") {
      alert("Aucun patient restant.");
    }

    refetch();
  };
  const handleHoldAndNext = async () => {
    if (!window.confirm("Mettre ce patient en pause (Hold) et appeler le suivant ?")) return;
    await holdAction(`/api/rendezvous/medecin/${userId}/hold-next`, { method: "POST" });
    refetch();
  };
  const handleRecall = async (id) => {
    await recallAction(`/api/rendezvous/${id}/recall`, { method: "POST" });
    refetch();
  };
  const handleCancel = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) return;
    await cancelRdv(`/api/rendezvous/${id}/cancel`, { method: "PUT" });
    refetch();
  };

  /* ── Stats ── */
  const todayTotal = todayRdv.length;
  const stats = [
    { num: allRdv.length, label: "Total RDV", cls: "stat-total" },
    { num: todayTotal, label: "Aujourd'hui", cls: "stat-today" },
    { num: allRdv.filter((r) => r.status?.toUpperCase() === "EN_ATTENTE").length, label: "En attente", cls: "stat-wait" },
    { num: allRdv.filter((r) => r.status?.toUpperCase() === "COMPLETED").length, label: "Terminés", cls: "stat-done" },
  ];

  const filterOptions = [
    { key: "ALL", label: "Tous" },
    { key: "EN_ATTENTE", label: "En attente" },
    { key: "EN_COURS", label: "En cours" },
    { key: "ON_HOLD", label: "En pause" },
    { key: "COMPLETED", label: "Terminés" },
    { key: "ANNULE", label: "Annulés" },
  ];

  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  /* ── Render ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rv-root {
          font-family: 'DM Sans', sans-serif;
          background:
            radial-gradient(circle at top right, rgba(16,185,129,0.10), transparent 30%),
            linear-gradient(180deg, #f6fdf8 0%, #edf9f2 100%);
          min-height: 100vh;
          padding: 36px 20px 72px;
          color: #193d34;
        }

        .rv-shell { max-width: 980px; margin: 0 auto; }

        /* ── Page header ── */
        .rv-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .rv-page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 38px;
          font-weight: 400;
          line-height: 1.1;
          color: #064e3b;
        }
        .rv-page-sub {
          font-size: 14px;
          color: #78786e;
          margin-top: 5px;
          line-height: 1.5;
        }
        .rv-role-pill {
          background: #064e3b;
          color: #f4fdf8;
          padding: 7px 18px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          flex-shrink: 0;
          align-self: flex-start;
        }

        /* ── Stats ── */
        .rv-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        @media (max-width: 640px) { .rv-stats { grid-template-columns: repeat(2, 1fr); } }

        .rv-stat {
          background: #fff;
          border-radius: 14px;
          padding: 18px 20px 16px;
          border: 1px solid #d1fae5;
          box-shadow: 0 12px 32px rgba(6,78,59,0.06);
          position: relative;
          overflow: hidden;
        }
        .rv-stat::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 14px 14px 0 0;
        }
        .stat-total::after { background: #064e3b; }
        .stat-today::after { background: #2b6b4e; }
        .stat-wait::after  { background: #c2601d; }
        .stat-done::after  { background: #3a70bb; }

        .rv-stat__num {
          font-family: 'DM Serif Display', serif;
          font-size: 34px;
          font-weight: 400;
          line-height: 1;
          color: #19191a;
        }
        .rv-stat__label {
          font-size: 12px;
          color: #78786e;
          margin-top: 5px;
        }

        /* ── Doctor control bar ── */
        .rv-ctrl {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #d1fae5;
          box-shadow: 0 12px 32px rgba(6,78,59,0.06);
          margin-bottom: 16px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .rv-ctrl--active { border: 1.5px solid #2b6b4e; }
        .rv-ctrl__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .rv-ctrl__patient { display: flex; align-items: center; gap: 14px; }
        .rv-ctrl__avatar {
          width: 46px; height: 46px; border-radius: 50%;
          background: #d0ece0; color: #2b6b4e;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 600; flex-shrink: 0;
        }
        .rv-ctrl__meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #78786e; margin-bottom: 2px; }
        .rv-ctrl__name       { font-size: 16px; font-weight: 600; color: #19191a; }
        .rv-ctrl__qnum       { font-size: 12px; color: #78786e; margin-top: 1px; }
        .rv-ctrl__empty      { font-size: 14px; color: #78786e; }
        .rv-ctrl__btns       { display: flex; gap: 10px; flex-wrap: wrap; }

        /* ── Patient queue banner ── */
        .queue-banner {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #d1fae5;
          box-shadow: 0 12px 32px rgba(6,78,59,0.06);
          margin-bottom: 16px;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .queue-banner--called {
          border: 1.5px solid #2b6b4e;
          background: #f2faf6;
        }
        .queue-banner__body { flex: 1; min-width: 0; }
        .queue-banner__msg  { font-size: 14px; font-weight: 500; color: #19191a; display: block; }
        .queue-banner__sub  { font-size: 12px; color: #78786e; margin-top: 3px; display: block; }
        .muted              { color: #78786e !important; }

        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .pulse-dot--on  { background: #2b6b4e; animation: rv-pulse 2s infinite; }
        .pulse-dot--off { background: #cc4444; }
        @keyframes rv-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(43,107,78,0.35); }
          50%       { box-shadow: 0 0 0 5px rgba(43,107,78,0); }
        }

        .queue-pos          { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; min-width: 44px; }
        .queue-pos__num     { font-family: 'DM Serif Display', serif; font-size: 26px; color: #19191a; line-height: 1; }
        .queue-pos__label   { font-size: 10px; color: #78786e; text-align: center; margin-top: 2px; }
        .queue-badge        { background: #2b6b4e; color: #fff; padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 500; white-space: nowrap; flex-shrink: 0; }

        /* ── Filter pills ── */
        .rv-filters {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .rv-fpill {
          padding: 6px 16px;
          border-radius: 100px;
          border: 1px solid #e6e5e0;
          background: #fff;
          color: #78786e;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.14s;
          line-height: 1.4;
        }
        .rv-fpill:hover         { border-color: #047857; color: #064e3b; background: #ecfdf5; }
        .rv-fpill--on           { background: #064e3b; color: #f4fdf8; border-color: #064e3b; }
        .rv-fpill:focus-visible, .btn:focus-visible { outline: 3px solid rgba(16,185,129,0.28); outline-offset: 3px; }

        /* ── Section divider ── */
        .rv-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 10px;
        }
        .rv-section + .rv-section { margin-top: 28px; }
        .rv-section__text {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #78786e;
          white-space: nowrap;
          font-weight: 500;
        }
        .rv-section__text--today { color: #2b6b4e; }
        .rv-section__line { flex: 1; height: 1px; background: #e6e5e0; }

        /* ── RDV Card ── */
        .rdv-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e6e5e0;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 7px;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .rdv-card:hover            { box-shadow: 0 12px 30px rgba(6,78,59,0.08); border-color: #a7f3d0; }
        .rdv-card--active          { border: 1.5px solid #2b6b4e; background: #f8fdfb; }
        .rdv-card--today:not(.rdv-card--active) { border-color: #c8dfd3; }

        .today-ribbon {
          position: absolute;
          top: 0; right: 0;
          background: #2b6b4e;
          color: #fff;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 3px 12px 3px 18px;
          clip-path: polygon(10px 0%, 100% 0%, 100% 100%, 0% 100%);
        }

        .rdv-card__left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1 1 200px;
          min-width: 0;
        }

        .rdv-avatar {
          width: 40px; height: 40px;
          border-radius: 11px;
          background: #eceae4;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: #58584e;
          flex-shrink: 0;
          letter-spacing: 0.03em;
        }
        .rdv-avatar--active { background: #d0ece0; color: #2b6b4e; }

        .rdv-card__info { min-width: 0; }
        .rdv-card__name {
          font-size: 14px;
          font-weight: 600;
          color: #19191a;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rdv-card__spec {
          font-size: 12px;
          color: #78786e;
          display: block;
          margin-top: 2px;
        }

        .rdv-card__mid {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex-shrink: 0;
        }
        .rdv-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #78786e;
          white-space: nowrap;
        }

        .rdv-card__queue { flex-shrink: 0; }
        .queue-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 38px; height: 34px;
          border-radius: 9px;
          background: #eceae4;
          font-size: 13px; font-weight: 600;
          color: #58584e;
          padding: 0 8px;
        }
        .queue-num--active { background: #d0ece0; color: #2b6b4e; }
        .queue-num--hold   { background: #fde8d1; color: #b84d14; }

        .rdv-card__status { flex-shrink: 0; }
        .rdv-card__actions { display: flex; gap: 7px; align-items: center; flex-shrink: 0; }

        /* Status badges */
        .status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: 100px;
          font-size: 12px; font-weight: 500; white-space: nowrap;
        }
        .status-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .s-wait    { background: #fef0e6; color: #b84d14; }
        .s-wait::before    { background: #c2601d; }
        .s-active  { background: #e5f5ed; color: #2b6b4e; }
        .s-active::before  { background: #2b6b4e; }
        .s-hold    { background: #fde8d1; color: #a84410; }
        .s-hold::before    { background: #b84d14; }
        .s-done    { background: #e7effa; color: #285e9a; }
        .s-done::before    { background: #3a70bb; }
        .s-cancel  { background: #fde9e9; color: #9e2020; }
        .s-cancel::before  { background: #cc4444; }
        .s-default { background: #eceae4; color: #58584e; }
        .s-default::before { background: #a0a098; }

        /* Buttons */
        .btn {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 9px; border: 1px solid; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          transition: opacity 0.13s, transform 0.1s;
          line-height: 1;
        }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn:active:not(:disabled) { transform: scale(0.97); }
        .btn-primary { background: #064e3b; color: #f4fdf8; border-color: #064e3b; }
        .btn-primary:hover:not(:disabled) { background: #047857; }
        .btn-success { background: #e5f5ed; color: #2b6b4e; border-color: #aad4be; }
        .btn-success:hover:not(:disabled) { background: #d0ece0; }
        .btn-warning { background: #fef0e6; color: #b84d14; border-color: #f5c598; }
        .btn-warning:hover:not(:disabled) { background: #fde8d1; }
        .btn-ghost   { background: #f4f3ef; color: #19191a; border-color: #e6e5e0; }
        .btn-ghost:hover:not(:disabled)   { background: #eceae4; }
        .btn-danger  { background: #fde9e9; color: #9e2020; border-color: #f4b4b4; }
        .btn-danger:hover:not(:disabled)  { background: #fbdada; }
        .btn-lg { padding: 10px 20px; font-size: 14px; }
        .btn-md { padding: 8px 16px;  font-size: 13px; }
        .btn-sm { padding: 5px 12px;  font-size: 12px; }

        /* Empty state */
        .rv-empty {
          text-align: center;
          padding: 60px 0;
          color: #78786e;
          font-size: 14px;
        }
        .rv-empty svg { display: block; margin: 0 auto 14px; opacity: 0.25; }

        /* Responsive */
        @media (max-width: 720px) {
          .rdv-card__mid  { display: none; }
          .rv-page-title  { font-size: 28px; }
          .rv-ctrl__inner { flex-direction: column; align-items: flex-start; }
          .queue-banner { align-items: flex-start; flex-wrap: wrap; }
        }
        @media (max-width: 480px) {
          .rdv-card       { flex-wrap: wrap; }
          .rdv-card__queue, .rdv-card__status { flex: 1; }
        }
      `}</style>

      <div className="rv-root">
        <div className="rv-shell">

          {/* ── Page header ── */}
          <div className="rv-page-header">
            <div>
              <h1 className="rv-page-title">Mes Rendez-vous</h1>
              <p className="rv-page-sub">
                {isMedecin
                  ? "Gérez votre file d'attente et vos consultations"
                  : "Suivez vos rendez-vous et votre position dans la file"}
              </p>
            </div>
            <span className="rv-role-pill">{isMedecin ? "Médecin" : "Patient"}</span>
          </div>

          {loading ? (
            <div className="rv-empty">Chargement des rendez-vous…</div>
          ) : error ? (
            <div className="rv-empty" style={{ color: "#9e2020" }}>
              Une erreur est survenue. Veuillez réessayer.
            </div>
          ) : (
            <>
              {/* ── Stats ── */}
              <div className="rv-stats">
                {stats.map((s) => (
                  <div key={s.label} className={`rv-stat ${s.cls}`}>
                    <div className="rv-stat__num">{s.num}</div>
                    <div className="rv-stat__label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* ── Médecin control bar ── */}
              {isMedecin && (
                <div className={`rv-ctrl${currentPatient ? " rv-ctrl--active" : ""}`}>
                  <div className="rv-ctrl__inner">
                    {currentPatient ? (
                      <div className="rv-ctrl__patient">
                        <div className="rv-ctrl__avatar">{initials(currentPatientName)}</div>
                        <div>
                          <p className="rv-ctrl__meta-label">Patient en cours</p>
                              <p className="rv-ctrl__name">{currentPatientName || "—"}</p>
                          <p className="rv-ctrl__qnum">#{currentPatient.queueNumber}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="rv-ctrl__empty">Aucun patient en cours de consultation.</p>
                    )}
                    <div className="rv-ctrl__btns">
                      {currentPatient && (
                        <button
                          className="btn btn-warning btn-lg"
                          onClick={handleHoldAndNext}
                          disabled={holdLoading}
                        >
                          {holdLoading ? "…" : "⏸ Hold / Absent"}
                        </button>
                      )}
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={handleNextPatient}
                        disabled={nextLoading}
                      >
                        {nextLoading
                          ? "…"
                          : currentPatient
                            ? "✓ Terminer & Suivant"
                            : "▶ Appeler le premier"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Patient queue banner ── */}
              {!isMedecin && activeRdv && (
                <PatientQueueBanner patientId={Number(userId)} medecinId={activeRdv.medecinId} />
              )}

              {/* ── Filters ── */}
              <div className="rv-filters">
                {filterOptions.map((f) => (
                  <button
                    key={f.key}
                    className={`rv-fpill${filter === f.key ? " rv-fpill--on" : ""}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* ── TODAY section ── */}
              {todayFiltered.length > 0 && (
                <>
                  <div className="rv-section">
                    <span className="rv-section__text rv-section__text--today">
                      Aujourd'hui · {todayLabel}
                    </span>
                    <span className="rv-section__line" />
                  </div>
                  {todayFiltered.map((rdv) => (
                    <RdvCard
                      key={rdv.id}
                      rdv={rdv}
                      isMedecin={isMedecin}
                      isToday={true}
                      onRecall={handleRecall}
                      onCancel={handleCancel}
                      onUpdate={refetch}
                      cancelLoading={cancelLoading}
                    />
                  ))}
                </>
              )}

              {/* ── OTHER section ── */}
              {otherFiltered.length > 0 && (
                <>
                  <div className="rv-section" style={{ marginTop: todayFiltered.length > 0 ? 28 : 0 }}>
                    <span className="rv-section__text">Autres rendez-vous</span>
                    <span className="rv-section__line" />
                  </div>
                  {otherFiltered.map((rdv) => (
                    <RdvCard
                      key={rdv.id}
                      rdv={rdv}
                      isMedecin={isMedecin}
                      isToday={false}
                      onRecall={handleRecall}
                      onCancel={handleCancel}
                      onUpdate={refetch}
                      cancelLoading={cancelLoading}
                    />
                  ))}
                </>
              )}

              {/* ── Empty state ── */}
              {todayFiltered.length === 0 && otherFiltered.length === 0 && (
                <div className="rv-empty">
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <p>Aucun rendez-vous trouvé.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyRendezVous;
