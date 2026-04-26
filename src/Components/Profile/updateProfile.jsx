import { Mail, Phone, Calendar, User, Upload, X, LogOut, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "../../utils/logout";
import { useLocation, useNavigate } from "react-router-dom";
import { useAction } from "../../hooks/useFetch"; // Use your standardized hook

export default function EditProfileForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.user_data;

  const [data, setData] = useState({
    name: "", prenom: "", email: "",
    telephone: "", date_naissance: "", profileImageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Use the action hook for the PUT request
  const { execute: updateProfile, loading, error, reset: resetStatus } = useAction();

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (userData) setData(userData);
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    resetStatus(); // Clear any previous errors

    const formData = new FormData();
    // Wrap data in a Blob to match your backend's expected application/json part
    const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
    formData.append("data", jsonBlob);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // execute() automatically handles the fetch, credentials, and error extraction
    const result = await updateProfile(`/api/users/${user_id}`, {
      method: "PUT",
      body: formData, // Passing FormData directly; browser sets the correct Boundary
    });

    if (result) {
      setSuccessMessage(result.message || "Profil mis à jour avec succès !");
    }
  };

  const initials = `${data.name?.[0] || ""}${data.prenom?.[0] || ""}`.toUpperCase();

  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : data.profileImageUrl || null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        .ep-root { font-family:'DM Sans',sans-serif; background:#f0faf4; min-height:100vh; padding:40px 24px; }
        .ep-main { max-width:1000px; margin:0 auto; }
        .ep-back-btn { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#6b7280; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; margin-bottom:20px; padding:0; }
        .ep-back-btn:hover { color:#064e3b; }
        .ep-page-title { font-family:'Playfair Display',serif; font-size:32px; color:#064e3b; margin:0 0 8px; }
        .ep-page-sub { font-size:14px; color:#6b7280; font-weight:300; margin:0 0 32px; line-height:1.6; }
        .ep-grid { display:grid; grid-template-columns:260px 1fr; gap:20px; }
        @media(max-width:640px){ .ep-grid { grid-template-columns:1fr; } }
        .ep-card { background:#fff; border:1px solid #d1fae5; border-radius:16px; padding:24px; }

        .ep-avatar-section { display:flex; flex-direction:column; align-items:center; text-align:center; }
        .ep-avatar-wrap { position:relative; margin-bottom:14px; }
        .ep-avatar { width:100px; height:100px; border-radius:50%; overflow:hidden; border:2px solid #d1fae5; }
        .ep-avatar img { width:100%; height:100%; object-fit:cover; }
        .ep-avatar-placeholder { width:100%; height:100%; background:#ecfdf5; display:flex; align-items:center; justify-content:center; color:#064e3b; font-size:28px; font-weight:500; }
        .ep-upload-btn { position:absolute; bottom:4px; right:4px; width:28px; height:28px; background:#064e3b; border-radius:50%; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; }
        .ep-remove-btn { display:flex; align-items:center; gap:5px; font-size:12px; color:#dc2626; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; margin-top:8px; }
        .ep-file-hint { font-size:11px; color:#9ca3af; margin:6px 0 0; }
        .ep-user-name { font-family:'Playfair Display',serif; font-size:18px; color:#064e3b; margin:0 0 4px; }
        .ep-user-sub { font-size:12px; color:#6b7280; margin:0 0 18px; }
        .ep-divider { border:none; border-top:1px solid #d1fae5; margin:0 0 18px; width:100%; }
        .ep-logout-btn { display:flex; align-items:center; gap:8px; font-size:13px; color:#dc2626; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; }

        .ep-alert { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:10px; font-size:13px; font-weight:500; margin-bottom:20px; }
        .ep-alert.success { background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
        .ep-alert.error { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }

        .ep-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:480px){ .ep-form-grid { grid-template-columns:1fr; } }
        .ep-field { display:flex; flex-direction:column; gap:5px; }
        .ep-field label { font-size:11px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; }
        .ep-input-wrap { position:relative; }
        .ep-input-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#10b981; pointer-events:none; display:flex; }
        .ep-input { font-family:'DM Sans',sans-serif; font-size:14px; background:#f9fefb; border:1px solid #d1fae5; border-radius:10px; padding:11px 14px 11px 38px; color:#064e3b; outline:none; width:100%; box-sizing:border-box; transition:border-color .2s, box-shadow .2s; }
        .ep-input:focus { border-color:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,.12); background:#fff; }
        .ep-section-label { font-size:11px; font-weight:700; color:#10b981; text-transform:uppercase; letter-spacing:1px; margin:20px 0 14px; }
        .ep-actions { display:flex; gap:12px; margin-top:24px; }
        .ep-btn-primary { background:#064e3b; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; padding:12px 28px; border-radius:10px; border:none; cursor:pointer; flex:1; display:flex; align-items:center; justify-content:center; gap:8px; transition:opacity .2s; }
        .ep-btn-primary:disabled { opacity:.6; cursor:not-allowed; }
        .ep-btn-secondary { background:#fff; color:#374151; font-family:'DM Sans',sans-serif; font-size:14px; padding:12px 24px; border-radius:10px; border:1px solid #d1fae5; cursor:pointer; }
        .ep-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:ep-spin .7s linear infinite; }
        @keyframes ep-spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="ep-root">
        <div className="ep-main">
          <button className="ep-back-btn" onClick={() => navigate("/profile")}>
            <ArrowLeft size={14} /> Retour au profil
          </button>
          <h1 className="ep-page-title">Modifier mon Profil</h1>
          <p className="ep-page-sub">
            Mettez à jour vos informations personnelles ci-dessous.
          </p>

          <div className="ep-grid">
            {/* Sidebar column */}
            <div>
              <div className="ep-card ep-avatar-section">
                <div className="ep-avatar-wrap">
                  <div className="ep-avatar">
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" />
                    ) : (
                      <div className="ep-avatar-placeholder">{initials || "?"}</div>
                    )}
                  </div>
                  <label className="ep-upload-btn" htmlFor="ep-file-input">
                    <Upload size={13} color="#fff" />
                  </label>
                  <input
                    id="ep-file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>

                {imageFile && (
                  <button className="ep-remove-btn" onClick={() => setImageFile(null)}>
                    <X size={12} /> Supprimer
                  </button>
                )}
                <p className="ep-file-hint">JPG, PNG — max 5 MB</p>

                <h3 className="ep-user-name" style={{ marginTop: "12px" }}>
                  {data.name} {data.prenom}
                </h3>
                <p className="ep-user-sub">Compte healthMax</p>
                <hr className="ep-divider" />
                <button className="ep-logout-btn" onClick={logout}>
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            </div>

            <div className="ep-card">
              {/* Success/Error Messaging via Hook state */}
              {successMessage && (
                <div className="ep-alert success">
                  ✓ {successMessage}
                </div>
              )}
              {error && (
                <div className="ep-alert error">
                  ✕ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <p className="ep-section-label">Informations personnelles</p>
                <div className="ep-form-grid">
                  <div className="ep-field">
                    <label>Prénom</label>
                    <div className="ep-input-wrap">
                      <span className="ep-input-icon"><User size={13} /></span>
                      <input
                        className="ep-input"
                        type="text"
                        placeholder="Votre prénom"
                        value={data.name || ""}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="ep-field">
                    <label>Nom</label>
                    <div className="ep-input-wrap">
                      <span className="ep-input-icon"><User size={13} /></span>
                      <input
                        className="ep-input"
                        type="text"
                        placeholder="Votre nom"
                        value={data.prenom || ""}
                        onChange={(e) => setData({ ...data, prenom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="ep-field">
                    <label>Adresse Email</label>
                    <div className="ep-input-wrap">
                      <span className="ep-input-icon"><Mail size={13} /></span>
                      <input
                        className="ep-input"
                        type="email"
                        placeholder="votre@email.com"
                        value={data.email || ""}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="ep-field">
                    <label>Téléphone</label>
                    <div className="ep-input-wrap">
                      <span className="ep-input-icon"><Phone size={13} /></span>
                      <input
                        className="ep-input"
                        type="tel"
                        placeholder="+212 6XX XXX XXX"
                        value={data.telephone || ""}
                        onChange={(e) => setData({ ...data, telephone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="ep-field" style={{ gridColumn: "span 2" }}>
                    <label>Date de Naissance</label>
                    <div className="ep-input-wrap">
                      <span className="ep-input-icon"><Calendar size={13} /></span>
                      <input
                        className="ep-input"
                        type="date"
                        value={data.date_naissance || ""}
                        onChange={(e) => setData({ ...data, date_naissance: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="ep-actions">
                  <button type="submit" className="ep-btn-primary" disabled={loading}>
                    {loading && <span className="ep-spinner" />}
                    {loading ? "Mise à jour..." : "Mettre à jour le profil"}
                  </button>
                  <button
                    type="button"
                    className="ep-btn-secondary"
                    onClick={() => navigate("/profile")}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}