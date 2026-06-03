import React from "react";
import { useEffect, useState } from "react";
import { User, Mail, Lock, Phone, MapPin, Calendar, Stethoscope, ArrowRight, Shield, Upload, X } from "lucide-react";
import BASE_URL from "../../utils/api.js";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    adresse: "", password: "", role: "", dateNaissance: "", specialites: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [typemessage, setTypeMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [specdata, setSpecdata] = useState([]);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setMessage(""); };
  const handleRoleSelect = (r) => { setFormData({ ...formData, role: r }); setMessage(""); };
  const handleSpecialityToggle = (specId) => {
    const id = Number(specId);
    const list = [...formData.specialites];
    setFormData({ ...formData, specialites: list.includes(id) ? list.filter(x => x !== id) : [...list, id] });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMessage("Please select a valid image file"); setTypeMessage("error"); e.target.value = ""; return; }
    if (file.size > 5 * 1024 * 1024) { setMessage("Image size must be less than 5MB"); setTypeMessage("error"); e.target.value = ""; return; }
    setImageFile(file);
    setMessage("");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImageFile(null); setImagePreview(null);
    const fi = document.getElementById("imageInput");
    if (fi) fi.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    for (let f of ["nom", "prenom", "email", "telephone", "password", "role"]) {
      if (!formData[f]) { setMessage(`Please fill the ${f} field`); setTypeMessage("error"); return; }
    }
    if (formData.role === "PATIENT" && !formData.dateNaissance) { setMessage("Please fill the date of birth"); setTypeMessage("error"); return; }
    if (formData.role === "MEDECIN" && formData.specialites.length === 0) { setMessage("Please select at least one speciality"); setTypeMessage("error"); return; }
    setLoading(true);
    try {
      const formToSend = new FormData();
      formToSend.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));
      if (imageFile) formToSend.append("image", imageFile);
      const response = await fetch(`${BASE_URL}/api/auth/register`, { method: "POST", credentials: "include", body: formToSend });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Compte créé avec succès !");
        setTypeMessage("success");
        setTimeout(() => { window.location.href = "/auth"; }, 1500); // ✅ corrigé /signin → /auth
      } else {
        setMessage(data.error || "Échec de l'inscription");
        setTypeMessage("error");
      }
    } catch (error) {
      setTypeMessage("error");
      setMessage("Erreur serveur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/specialites`, { method: "GET", headers: { "Content-Type": "application/json" } })
      .then(r => r.json()).then(setSpecdata).catch(console.error);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:wght@600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .rf-page { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #f0faf4; display: flex; align-items: flex-start; justify-content: center; padding: 40px 24px; position: relative; overflow-x: hidden; }
        .rf-blob1 { position: fixed; top: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: linear-gradient(145deg, rgba(6,78,59,0.08), rgba(16,185,129,0.06)); pointer-events: none; }
        .rf-blob2 { position: fixed; bottom: -120px; left: -80px; width: 350px; height: 350px; border-radius: 50%; background: rgba(16,185,129,0.07); pointer-events: none; }
        .rf-card { background: #ffffff; border: 1px solid #d1fae5; border-radius: 28px; padding: 44px 40px; width: 100%; max-width: 520px; box-shadow: 0 8px 40px rgba(6,78,59,0.08); position: relative; overflow: hidden; }
        .rf-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #10b981, #34d399); }
        .rf-logo-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
        .rf-logo-icon { width: 60px; height: 60px; border-radius: 18px; background: linear-gradient(135deg, #064e3b, #065f46); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(6,78,59,0.25); }
        .rf-logo-cross { color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1; font-family: 'Playfair Display', serif; }
        .rf-title { font-family: 'Playfair Display', serif; font-size: 26px; color: #064e3b; text-align: center; letter-spacing: -0.3px; margin-bottom: 6px; }
        .rf-subtitle { text-align: center; font-size: 13.5px; color: #9ca3af; font-weight: 300; margin-bottom: 32px; }
        .rf-section-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #10b981; margin-bottom: 14px; text-align: center; }
        .rf-roles { display: flex; gap: 14px; margin-bottom: 28px; }
        .rf-role-card { flex: 1; border: 1.5px solid #d1fae5; border-radius: 18px; padding: 20px 14px; text-align: center; cursor: pointer; background: #f9fefb; transition: all 0.2s; position: relative; overflow: hidden; }
        .rf-role-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #10b981, #34d399); opacity: 0; transition: opacity 0.2s; }
        .rf-role-card:hover { border-color: #a7f3d0; box-shadow: 0 4px 16px rgba(16,185,129,0.1); transform: translateY(-2px); }
        .rf-role-card.active { border-color: #10b981; background: #ecfdf5; box-shadow: 0 4px 20px rgba(16,185,129,0.15); }
        .rf-role-card.active::before { opacity: 1; }
        .rf-role-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; transition: transform 0.2s; }
        .rf-role-card.active .rf-role-icon { background: linear-gradient(135deg, #064e3b, #065f46); transform: scale(1.05); }
        .rf-role-card.active .rf-role-icon svg { color: #ffffff !important; }
        .rf-role-name { font-size: 14px; font-weight: 600; color: #064e3b; }
        .rf-role-desc { font-size: 12px; color: #9ca3af; font-weight: 300; margin-top: 4px; }
        .rf-avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 24px; }
        .rf-avatar-ring { width: 88px; height: 88px; border-radius: 50%; border: 2px dashed #a7f3d0; display: flex; align-items: center; justify-content: center; background: #f9fefb; cursor: pointer; transition: border-color 0.2s, background 0.2s; position: relative; overflow: hidden; }
        .rf-avatar-ring:hover { border-color: #10b981; background: #ecfdf5; }
        .rf-avatar-ring img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .rf-avatar-btn { margin-top: 10px; font-size: 12.5px; font-weight: 600; color: #10b981; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
        .rf-avatar-btn:hover { color: #064e3b; }
        .rf-avatar-remove { font-size: 12px; color: #ef4444; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; margin-top: 4px; font-weight: 500; display: flex; align-items: center; gap: 4px; transition: color 0.2s; }
        .rf-avatar-remove:hover { color: #b91c1c; }
        .rf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .rf-field { margin-bottom: 14px; }
        .rf-label { display: block; font-size: 13px; font-weight: 600; color: #064e3b; margin-bottom: 7px; }
        .rf-input-wrap { position: relative; }
        .rf-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #10b981; pointer-events: none; display: flex; align-items: center; }
        .rf-input { font-family: 'DM Sans', sans-serif; width: 100%; padding: 11px 14px 11px 42px; border: 1.5px solid #d1fae5; border-radius: 14px; font-size: 14px; color: #064e3b; background: #f9fefb; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
        .rf-input::placeholder { color: #adb5bd; font-weight: 300; }
        .rf-input:focus { border-color: #10b981; background: #ffffff; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
        .rf-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .rf-spec-box { border: 1.5px solid #d1fae5; border-radius: 14px; padding: 14px; max-height: 180px; overflow-y: auto; background: #f9fefb; scrollbar-width: thin; scrollbar-color: #a7f3d0 transparent; }
        .rf-spec-item { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: 10px; cursor: pointer; transition: background 0.15s; }
        .rf-spec-item:hover { background: #ecfdf5; }
        .rf-spec-item input[type="checkbox"] { width: 16px; height: 16px; accent-color: #10b981; cursor: pointer; }
        .rf-spec-item label { font-size: 13.5px; color: #374151; cursor: pointer; font-weight: 400; }
        .rf-spec-count { margin-top: 8px; font-size: 12.5px; color: #10b981; font-weight: 600; display: flex; align-items: center; gap: 5px; }
        .rf-message { margin-bottom: 20px; padding: 11px 16px; border-radius: 12px; font-size: 13.5px; font-weight: 500; text-align: center; display: flex; align-items: center; justify-content: center; gap: 7px; }
        .rf-message.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .rf-message.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .rf-btn { font-family: 'DM Sans', sans-serif; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #064e3b, #065f46 60%, #047857); color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px; border-radius: 14px; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(6,78,59,0.25); transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; margin-top: 24px; }
        .rf-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(6,78,59,0.3); }
        .rf-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .rf-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #ffffff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .rf-trust { display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 28px; font-size: 12px; color: #9ca3af; }
        .rf-trust svg { color: #10b981; }
      `}</style>

      <div className="rf-page">
        <div className="rf-blob1" />
        <div className="rf-blob2" />
        <div className="rf-card">
          <div className="rf-logo-wrap">
            <div className="rf-logo-icon"><span className="rf-logo-cross">✚</span></div>
          </div>
          <h1 className="rf-title">Créer un compte</h1>
          <p className="rf-subtitle">Rejoignez des milliers de patients et médecins sur healthMax</p>

          <p className="rf-section-label">Vous êtes ?</p>
          <div className="rf-roles">
            <div className={`rf-role-card ${formData.role === "MEDECIN" ? "active" : ""}`} onClick={() => handleRoleSelect("MEDECIN")}>
              <div className="rf-role-icon"><Stethoscope size={24} color="#065f46" strokeWidth={1.8} /></div>
              <p className="rf-role-name">Médecin</p>
              <p className="rf-role-desc">Professionnel de santé</p>
            </div>
            <div className={`rf-role-card ${formData.role === "PATIENT" ? "active" : ""}`} onClick={() => handleRoleSelect("PATIENT")}>
              <div className="rf-role-icon"><User size={24} color="#065f46" strokeWidth={1.8} /></div>
              <p className="rf-role-name">Patient</p>
              <p className="rf-role-desc">Je cherche un médecin</p>
            </div>
          </div>

          {message && (
            <div className={`rf-message ${typemessage}`}>
              {typemessage === "success" ? "✓" : "✕"} {message}
            </div>
          )}

          <div className="rf-avatar-section">
            <div className="rf-avatar-ring" onClick={() => !imagePreview && document.getElementById("imageInput").click()}>
              {imagePreview ? <img src={imagePreview} alt="Preview" /> : <Upload size={22} color="#10b981" strokeWidth={1.8} />}
            </div>
            {!imagePreview
              ? <button type="button" className="rf-avatar-btn" onClick={() => document.getElementById("imageInput").click()}>Choisir une photo</button>
              : <button type="button" className="rf-avatar-remove" onClick={removeImage} disabled={loading}><X size={13} /> Supprimer la photo</button>
            }
            <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} disabled={loading} style={{ display: "none" }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rf-grid-2">
              <div className="rf-field">
                <label className="rf-label">Nom *</label>
                <div className="rf-input-wrap"><span className="rf-input-icon"><User size={14} /></span>
                  <input className="rf-input" type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Dupont" disabled={loading} required />
                </div>
              </div>
              <div className="rf-field">
                <label className="rf-label">Prénom *</label>
                <div className="rf-input-wrap"><span className="rf-input-icon"><User size={14} /></span>
                  <input className="rf-input" type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Marie" disabled={loading} required />
                </div>
              </div>
            </div>

            <div className="rf-field">
              <label className="rf-label">Adresse e-mail *</label>
              <div className="rf-input-wrap"><span className="rf-input-icon"><Mail size={15} /></span>
                <input className="rf-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemple@email.com" disabled={loading} required />
              </div>
            </div>

            <div className="rf-field">
              <label className="rf-label">Téléphone *</label>
              <div className="rf-input-wrap"><span className="rf-input-icon"><Phone size={15} /></span>
                <input className="rf-input" type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+212 6XX XXX XXX" disabled={loading} required />
              </div>
            </div>

            <div className="rf-field">
              <label className="rf-label">Adresse</label>
              <div className="rf-input-wrap"><span className="rf-input-icon"><MapPin size={15} /></span>
                <input className="rf-input" type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Casablanca, Maroc" disabled={loading} />
              </div>
            </div>

            {formData.role === "PATIENT" && (
              <div className="rf-field">
                <label className="rf-label">Date de naissance *</label>
                <div className="rf-input-wrap"><span className="rf-input-icon"><Calendar size={15} /></span>
                  <input className="rf-input" type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} disabled={loading} />
                </div>
              </div>
            )}

            {formData.role === "MEDECIN" && (
              <div className="rf-field">
                <label className="rf-label">Spécialités *</label>
                <div className="rf-spec-box">
                  {specdata.map((spec) => (
                    <div key={spec.id} className="rf-spec-item">
                      <input type="checkbox" id={`spec-${spec.id}`}
                        checked={formData.specialites.includes(spec.id)}
                        onChange={() => handleSpecialityToggle(spec.id)} disabled={loading} />
                      <label htmlFor={`spec-${spec.id}`}>{spec.nomspecialite}</label>
                    </div>
                  ))}
                </div>
                {formData.specialites.length > 0 && (
                  <p className="rf-spec-count">✓ {formData.specialites.length} spécialité{formData.specialites.length > 1 ? "s" : ""} sélectionnée{formData.specialites.length > 1 ? "s" : ""}</p>
                )}
              </div>
            )}

            <div className="rf-field">
              <label className="rf-label">Mot de passe *</label>
              <div className="rf-input-wrap"><span className="rf-input-icon"><Lock size={15} /></span>
                <input className="rf-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" disabled={loading} required />
              </div>
            </div>

            <button type="submit" className="rf-btn" disabled={loading}>
              {loading ? <span className="rf-spinner" /> : <> Créer mon compte <ArrowRight size={16} /> </>}
            </button>
          </form>

          <div className="rf-trust"><Shield size={13} /> Inscription sécurisée — healthMax</div>
        </div>
      </div>
    </>
  );
}