import {
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Bell,
  LogOut,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    prenom: "",
    email: "",
    telephone: "",
    address: "",
    date_naissance: "",
    role: "",
    profileImageUrl: "",
  });

  const user_id = user?.id;

  const {
    data: profileData,
    loading,
    error,
    refetch,
  } = useFetch(user_id ? `/api/users/${user_id}` : null);

  useEffect(() => {
    if (profileData) {
      setData({
        name: profileData.nom,
        prenom: profileData.prenom,
        email: profileData.email,
        telephone: profileData.telephone,
        address: profileData.adresse || "",
        date_naissance: profileData.dateNaissance,
        role: profileData.role,
        profileImageUrl: profileData.profileImageUrl || "",
      });
    }
  }, [profileData]);

  const initials = `${data.name?.[0] || ""}${data.prenom?.[0] || ""
    }`.toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        .pf-root { font-family:'DM Sans',sans-serif; background:#f0faf4; min-height:100vh; padding:40px 24px; }
        .pf-main { max-width:1000px; margin:0 auto; }
        .pf-page-title { font-family:'Playfair Display',serif; font-size:32px; color:#064e3b; margin:0 0 8px; }
        .pf-page-sub { font-size:14px; color:#6b7280; font-weight:300; margin:0 0 32px; max-width:400px; line-height:1.6; }
        .pf-grid { display:grid; grid-template-columns:260px 1fr; gap:20px; }
        @media(max-width:640px){ .pf-grid { grid-template-columns:1fr; } }
        .pf-card { background:#fff; border:1px solid #d1fae5; border-radius:16px; padding:24px; position: relative; min-height: 400px; }
        .pf-avatar-section { display:flex; flex-direction:column; align-items:center; text-align:center; min-height: auto; }
        .pf-avatar { width:100px; height:100px; border-radius:50%; overflow:hidden; border:2px solid #d1fae5; margin-bottom:14px; position:relative; }
        .pf-avatar img { width:100%; height:100%; object-fit:cover; }
        .pf-avatar-placeholder { width:100%; height:100%; background:#ecfdf5; display:flex; align-items:center; justify-content:center; color:#064e3b; font-size:28px; font-weight:500; }
        .pf-name { font-family:'Playfair Display',serif; font-size:18px; color:#064e3b; margin:0 0 4px; }
        .pf-role { font-size:12px; color:#6b7280; margin:0 0 18px; }
        .pf-divider { border:none; border-top:1px solid #d1fae5; margin:0 0 18px; width:100%; }
        .pf-logout-btn { display:flex; align-items:center; gap:8px; font-size:13px; color:#dc2626; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; }
        .pf-verified { background:#ecfdf5; border:1px solid #d1fae5; border-radius:12px; padding:14px; margin-top:14px; display:flex; gap:10px; align-items:flex-start; }
        .pf-verified-icon { width:30px; height:30px; background:#064e3b; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pf-verified-title { font-size:13px; font-weight:500; color:#064e3b; margin:0 0 3px; }
        .pf-verified-text { font-size:12px; color:#6b7280; margin:0; line-height:1.5; }
        .pf-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:480px){ .pf-form-grid { grid-template-columns:1fr; } }
        .pf-field { display:flex; flex-direction:column; gap:5px; }
        .pf-field label { font-size:11px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; }
        .pf-input-wrap { position:relative; }
        .pf-input-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#10b981; pointer-events:none; display:flex; }
        .pf-input { font-family:'DM Sans',sans-serif; font-size:14px; background:#f9fefb; border:1px solid #d1fae5; border-radius:10px; padding:10px 14px 10px 38px; color:#064e3b; outline:none; width:100%; box-sizing:border-box; }
        .pf-actions { display:flex; gap:12px; margin-top:22px; }
        .pf-btn-primary { background:#064e3b; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; padding:12px 28px; border-radius:10px; border:none; cursor:pointer; flex:1; transition: opacity 0.2s; }
        .pf-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .pf-btn-secondary { background:#fff; color:#374151; font-family:'DM Sans',sans-serif; font-size:14px; padding:12px 24px; border-radius:10px; border:1px solid #d1fae5; cursor:pointer; }
        .pf-bottom-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:20px; }
        @media(max-width:480px){ .pf-bottom-grid { grid-template-columns:1fr; } }
        .pf-info-card { background:#fff; border:1px solid #d1fae5; border-radius:12px; padding:18px; }
        .pf-info-icon { width:30px; height:30px; background:#ecfdf5; border-radius:8px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
        .pf-info-title { font-size:14px; font-weight:500; color:#064e3b; margin:0 0 4px; }
        .pf-info-text { font-size:12px; color:#6b7280; margin:0 0 12px; line-height:1.5; }
        .pf-info-link { font-size:11px; font-weight:600; color:#064e3b; text-transform:uppercase; letter-spacing:0.8px; text-decoration:none; cursor:pointer; background:none; border:none; font-family:'DM Sans',sans-serif; }
        
        .pf-loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; border-radius: 16px; }
        .pf-error-msg { color: #dc2626; background: #fef2f2; padding: 10px; border-radius: 8px; font-size: 12px; margin-bottom: 15px; border: 1px solid #fecaca; }
      `}</style>

      <div className="pf-root">
        <div className="pf-main">
          <h1 className="pf-page-title">Mon Profil</h1>

          <p className="pf-page-sub">
            Consultez vos informations personnelles et gérez votre compte
            healthMax.
          </p>

          <div className="pf-grid">
            {/* Left column */}
            <div>
              <div className="pf-card pf-avatar-section">
                <div className="pf-avatar">
                  {data.profileImageUrl ? (
                    <img
                      src={data.profileImageUrl}
                      alt={`${data.name} ${data.prenom}`}
                    />
                  ) : (
                    <div className="pf-avatar-placeholder">
                      {initials || "?"}
                    </div>
                  )}
                </div>

                <h3 className="pf-name">
                  {data.name} {data.prenom}
                </h3>

                <p className="pf-role">
                  {data.role === "PATIENT" ? "Patient" : "Médecin"}
                </p>

                <hr className="pf-divider" />

                <button
                  className="pf-logout-btn"
                  onClick={logout}
                >
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </div>

              <div className="pf-verified">
                <div className="pf-verified-icon">
                  <Shield size={14} color="#fff" />
                </div>

                <div>
                  <p className="pf-verified-title">
                    Compte Vérifié
                  </p>

                  <p className="pf-verified-text">
                    Vos données sont chiffrées et stockées en toute
                    sécurité.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="pf-card">
              {error && (
                <div className="pf-error-msg">
                  ✕ {error}
                </div>
              )}

              {loading && (
                <div className="pf-loading-overlay">
                  Chargement...
                </div>
              )}

              <div
                className="pf-form-grid"
                style={{ marginTop: "50px" }}
              >
                <div className="pf-field">
                  <label>Nom Complet</label>

                  <div className="pf-input-wrap">
                    <span className="pf-input-icon">
                      <User size={13} />
                    </span>

                    <input
                      className="pf-input"
                      type="text"
                      value={`${data.name} ${data.prenom}`}
                      readOnly
                    />
                  </div>
                </div>

                <div className="pf-field">
                  <label>Adresse Email</label>

                  <div className="pf-input-wrap">
                    <span className="pf-input-icon">
                      <Mail size={13} />
                    </span>

                    <input
                      className="pf-input"
                      type="email"
                      value={data.email}
                      readOnly
                    />
                  </div>
                </div>

                <div className="pf-field">
                  <label>Téléphone</label>

                  <div className="pf-input-wrap">
                    <span className="pf-input-icon">
                      <Phone size={13} />
                    </span>

                    <input
                      className="pf-input"
                      type="tel"
                      value={data.telephone || ""}
                      readOnly
                    />
                  </div>
                    <div className="pf-field">
                      <label>Adresse</label>

                      <div className="pf-input-wrap">
                        <span className="pf-input-icon">
                        <MapPin size={13} />
                        </span>

                        <input
                          className="pf-input"
                          type="text"
                          value={data.address || ""}
                          readOnly
                        />
                      </div>
                      </div>
                </div>

                <div className="pf-field">
                  <label>Date de Naissance</label>

                  <div className="pf-input-wrap">
                    <span className="pf-input-icon">
                      <Calendar size={13} />
                    </span>

                    <input
                      className="pf-input"
                      type="text"
                      value={data.date_naissance ? new Date(data.date_naissance).toLocaleDateString() : ""}
                      readOnly
                    />
                  </div>
                </div>

                <div style={{ height: "80px" }}></div>
              </div>

              <div className="pf-actions">
                <button
                  className="pf-btn-primary"
                  disabled={loading}
                  onClick={() =>
                    navigate("/edit-profile", {
                      state: { user_data: data },
                    })
                  }
                >
                  Mettre à jour le profil
                </button>

                <button
                  className="pf-btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>

          {/* Bottom cards */}
          <div className="pf-bottom-grid">
            <div className="pf-info-card">
              <div className="pf-info-icon">
                <Shield size={15} color="#064e3b" />
              </div>

              <p className="pf-info-title">Sécurité</p>

              <p className="pf-info-text">
                Double authentification activée pour votre
                protection.
              </p>

              <button className="pf-info-link">
                Modifier les accès
              </button>
            </div>

            <div className="pf-info-card">
              <div className="pf-info-icon">
                <Bell size={15} color="#064e3b" />
              </div>

              <p className="pf-info-title">Notifications</p>

              <p className="pf-info-text">
                Recevez vos rappels par SMS et Email.
              </p>

              <button className="pf-info-link">
                Gérer les alertes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
