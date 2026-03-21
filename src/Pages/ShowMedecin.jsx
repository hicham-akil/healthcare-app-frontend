import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Search, Phone, Mail, ArrowRight, User, AlertCircle } from "lucide-react";
import BASE_URL from "../utils/api.js";

const ShowMedecin = () => {
  const [specialites, setSpecialites] = useState([]);
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [selectedSpecialiteLabel, setSelectedSpecialiteLabel] = useState("");
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSpecialites = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/specialites`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to load specialities");
        const data = await response.json();
        setSpecialites(data);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchSpecialites();
  }, []);

  const fetchMedecins = async (specialiteId) => {
    console.log("Fetching doctors for speciality ID:", specialiteId);
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/medecins/specialite/${specialiteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to load doctors");
      const data = await res.json();
      setMedecins(data);
      
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const label = e.target.options[e.target.selectedIndex].text;
    setSelectedSpecialite(value);
    setSelectedSpecialiteLabel(label);
    if (value) fetchMedecins(value);
    else setMedecins([]);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:wght@600;700&display=swap');

        .sm-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0faf4;
          min-height: 100vh;
          padding: 48px 24px;
        }

        .sm-container {
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── Page header ── */
        .sm-page-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 10px;
        }

        .sm-page-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 4vw, 32px);
          color: #064e3b;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .sm-page-sub {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: #6b7280;
          font-weight: 300;
          margin-bottom: 32px;
        }

        /* ── Search card ── */
        .sm-search-card {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(16,185,129,0.07);
          margin-bottom: 24px;
        }

        .sm-search-top {
          background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%);
          padding: 20px 28px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }

        .sm-search-top::after {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
        }

        .sm-search-icon-wrap {
          width: 38px; height: 38px;
          border-radius: 11px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
          flex-shrink: 0;
        }

        .sm-search-top-title {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 2px;
        }

        .sm-search-top-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          font-weight: 300;
          margin: 0;
        }

        .sm-search-body {
          padding: 24px 28px;
        }

        /* Select wrapper */
        .sm-select-wrap {
          position: relative;
        }

        .sm-select-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #10b981;
        }

        .sm-select {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #064e3b;
          background: #f0fdf4;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          padding: 12px 16px 12px 40px;
          width: 100%;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .sm-select:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }

        .sm-select option { color: #374151; background: #ffffff; }

        /* Chevron */
        .sm-chevron {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #9ca3af;
        }

        /* ── Results header ── */
        .sm-results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sm-results-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #10b981;
        }

        .sm-results-count {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #065f46;
        }

        .sm-count-dot {
          width: 6px; height: 6px;
          background: #34d399;
          border-radius: 50%;
          animation: sm-pulse 2s infinite;
        }

        @keyframes sm-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }

        /* ── Doctor cards ── */
        .sm-doctor-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sm-doctor-card {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 18px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }

        .sm-doctor-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #10b981, #34d399);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .sm-doctor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(16,185,129,0.12);
          border-color: #a7f3d0;
        }

        .sm-doctor-card:hover::before { opacity: 1; }

        /* Avatar */
        .sm-avatar {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 1px solid #a7f3d0;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s;
        }

        .sm-doctor-card:hover .sm-avatar {
          transform: scale(1.08) rotate(-3deg);
        }

        /* Doctor info */
        .sm-doctor-info { flex: 1; min-width: 0; }

        .sm-doctor-name {
          font-size: 15px;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 5px;
        }

        .sm-doctor-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sm-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: #6b7280;
          font-weight: 300;
        }

        /* Book button */
        .sm-book-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%);
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(6,79,58,0.25);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sm-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(6,79,58,0.32);
        }

        .sm-book-btn:active { transform: translateY(0); }

        /* ── States ── */
        .sm-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px 24px;
        }

        .sm-spinner {
          width: 32px; height: 32px;
          border: 3px solid #d1fae5;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: sm-spin 0.8s linear infinite;
        }

        @keyframes sm-spin { to { transform: rotate(360deg); } }

        .sm-spinner-text { font-size: 13.5px; color: #6b7280; font-weight: 300; }

        .sm-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px 24px;
          color: #9ca3af;
        }

        .sm-empty-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          display: flex; align-items: center; justify-content: center;
        }

        .sm-empty p { font-size: 13.5px; margin: 0; font-weight: 400; }

        /* Prompt (before selecting) */
        .sm-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px 24px;
          color: #9ca3af;
          text-align: center;
        }

        .sm-prompt-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          display: flex; align-items: center; justify-content: center;
        }

        .sm-prompt p { font-size: 13.5px; margin: 0; font-weight: 300; color: #9ca3af; max-width: 240px; line-height: 1.6; }
      `}</style>

      <div className="sm-root">
        <div className="sm-container">

          {/* Page header */}
          <p className="sm-page-label">Directory</p>
          <h1 className="sm-page-title">Find a Doctor</h1>
          <p className="sm-page-sub">
            <Stethoscope size={14} color="#10b981" />
            Browse by speciality and book your visit
          </p>

          {/* Search card */}
          <div className="sm-search-card">
            <div className="sm-search-top">
              <div className="sm-search-icon-wrap">
                <Search size={18} color="#ffffff" strokeWidth={1.8} />
              </div>
              <div>
                <p className="sm-search-top-title">Search by Speciality</p>
                <p className="sm-search-top-desc">Select a speciality to see available doctors</p>
              </div>
            </div>

            <div className="sm-search-body">
              <div className="sm-select-wrap">
                <span className="sm-select-icon">
                  <Stethoscope size={15} />
                </span>
                <select
                  value={selectedSpecialite}
                  onChange={handleChange}
                  className="sm-select"
                >
                  <option value="">— Select a speciality —</option>
                  {specialites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nomspecialite}
                    </option>
                  ))}
                </select>
                <span className="sm-chevron">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Results */}
          {selectedSpecialite && (
            <div className="sm-results-header">
              <span className="sm-results-label">Results</span>
              {!loading && (
                <span className="sm-results-count">
                  <span className="sm-count-dot" />
                  {medecins.length} doctor{medecins.length !== 1 ? "s" : ""} found
                </span>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="sm-loading">
              <div className="sm-spinner" />
              <p className="sm-spinner-text">Loading doctors…</p>
            </div>
          )}

          {/* No selection yet */}
          {!loading && !selectedSpecialite && (
            <div className="sm-prompt">
              <div className="sm-prompt-icon">
                <Stethoscope size={22} color="#10b981" strokeWidth={1.8} />
              </div>
              <p>Select a speciality above to browse available doctors</p>
            </div>
          )}

          {/* Empty result */}
          {!loading && selectedSpecialite && medecins.length === 0 && (
            <div className="sm-empty">
              <div className="sm-empty-icon">
                <AlertCircle size={22} color="#10b981" strokeWidth={1.8} />
              </div>
              <p>No doctors found for this speciality</p>
            </div>
          )}

          {/* Doctor list */}
          {!loading && medecins.length > 0 && (
            <div className="sm-doctor-list">
              {medecins.map((m) => (
                <div key={m.id} className="sm-doctor-card">
                  <div className="sm-avatar">
                    <User size={22} color="#065f46" strokeWidth={1.8} />
                  </div>

                  <div className="sm-doctor-info">
                    <p className="sm-doctor-name">Dr. {m.nom} {m.prenom}</p>
                    <div className="sm-doctor-meta">
                      <span className="sm-meta-row">
                        <Mail size={11} color="#10b981" />
                        {m.email}
                      </span>
                      <span className="sm-meta-row">
                        <Phone size={11} color="#10b981" />
                        {m.telephone}
                      </span>
                    </div>
                  </div>

                  <button
                    className="sm-book-btn"
                    onClick={() =>
                      navigate(`/Takeapointement/${m.id}`, {
                        state: { specialiteId: selectedSpecialite, specialite: selectedSpecialiteLabel },
                      })
                    }
                  >
                    Book
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ShowMedecin;