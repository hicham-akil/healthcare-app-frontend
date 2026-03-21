import { useState } from "react";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import BASE_URL from "../../utils/api.js";
export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [typemessage, settypeMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage("Login failed. Please try again.");
        settypeMessage("error");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.id);
      localStorage.setItem("role", data.role);
      setMessage("Login successful!");
      settypeMessage("success");
      setTimeout(() => { window.location.href = "/"; }, 1500);
    } catch (error) {
      setMessage("Login failed. Please try again.");
      settypeMessage("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .si-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f0faf4;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* background blobs like the hero */
        .si-blob1 {
          position: fixed; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: linear-gradient(145deg, rgba(6,78,59,0.08), rgba(16,185,129,0.06));
          pointer-events: none;
        }
        .si-blob2 {
          position: fixed; bottom: -120px; left: -80px;
          width: 350px; height: 350px; border-radius: 50%;
          background: rgba(16,185,129,0.07);
          pointer-events: none;
        }

        .si-card {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 28px;
          padding: 44px 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 8px 40px rgba(6,78,59,0.08);
          position: relative;
          overflow: hidden;
        }

        /* green top accent bar */
        .si-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        /* ── Header ── */
        .si-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .si-logo-icon {
          width: 60px; height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, #064e3b, #065f46);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px rgba(6,78,59,0.25);
        }

        .si-logo-cross {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          font-family: 'Playfair Display', serif;
        }

        .si-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #064e3b;
          text-align: center;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .si-subtitle {
          text-align: center;
          font-size: 13.5px;
          color: #9ca3af;
          font-weight: 300;
          margin-bottom: 32px;
        }

        /* ── Fields ── */
        .si-field {
          margin-bottom: 18px;
        }

        .si-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 7px;
          letter-spacing: 0.1px;
        }

        .si-input-wrap {
          position: relative;
        }

        .si-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #10b981;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .si-input {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid #d1fae5;
          border-radius: 14px;
          font-size: 14px;
          color: #064e3b;
          background: #f9fefb;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .si-input::placeholder { color: #adb5bd; font-weight: 300; }

        .si-input:focus {
          border-color: #10b981;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }

        /* ── Forgot link ── */
        .si-forgot {
          text-align: right;
          margin-top: -10px;
          margin-bottom: 26px;
        }

        .si-forgot a {
          font-size: 12.5px;
          color: #10b981;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .si-forgot a:hover { color: #065f46; }

        /* ── Button ── */
        .si-btn {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #064e3b, #065f46 60%, #047857);
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          padding: 14px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(6,78,59,0.25);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          letter-spacing: 0.1px;
        }

        .si-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(6,78,59,0.3);
        }

        .si-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ── Spinner ── */
        .si-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Message ── */
        .si-message {
          margin-top: 16px;
          padding: 11px 16px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .si-message.success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .si-message.error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        /* ── Divider & Register ── */
        .si-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 20px;
        }

        .si-divider-line {
          flex: 1;
          height: 1px;
          background: #d1fae5;
        }

        .si-divider span {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 400;
        }

        .si-register {
          text-align: center;
          font-size: 13.5px;
          color: #6b7280;
          font-weight: 300;
        }

        .si-register a {
          color: #10b981;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .si-register a:hover { color: #064e3b; }

        /* ── Trust row ── */
        .si-trust {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 28px;
          font-size: 12px;
          color: #9ca3af;
          font-weight: 400;
        }

        .si-trust svg { color: #10b981; }
      `}</style>

      <div className="si-page">
        <div className="si-blob1" />
        <div className="si-blob2" />

        <div className="si-card">
          {/* Logo */}
          <div className="si-logo-wrap">
            <div className="si-logo-icon">
              <span className="si-logo-cross">✚</span>
            </div>
          </div>

          <h1 className="si-title">Bon retour !</h1>
          <p className="si-subtitle">Connectez-vous à votre espace healthMax</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="si-field">
              <label className="si-label">Adresse e-mail</label>
              <div className="si-input-wrap">
                <span className="si-input-icon">
                  <Mail size={15} />
                </span>
                <input
                  className="si-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="si-field">
              <label className="si-label">Mot de passe</label>
              <div className="si-input-wrap">
                <span className="si-input-icon">
                  <Lock size={15} />
                </span>
                <input
                  className="si-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Forgot */}
            <div className="si-forgot">
              <a href="/forgot-password">Mot de passe oublié ?</a>
            </div>

            {/* Submit */}
            <button type="submit" className="si-btn" disabled={loading}>
              {loading ? (
                <span className="si-spinner" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Message */}
            {message && (
              <div className={`si-message ${typemessage}`}>
                {typemessage === "success" ? "✓" : "✕"} {message}
              </div>
            )}
          </form>

          
          

          <div className="si-trust">
            <Shield size={13} />
            Connexion sécurisée — healthMax
          </div>
        </div>
      </div>
    </>
  );
}