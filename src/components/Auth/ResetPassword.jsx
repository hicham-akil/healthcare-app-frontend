// ResetPassword.jsx
import React from "react";
import { useState } from "react";
import {
    Mail,
    Lock,
    Shield,
    KeyRound,
    ArrowRight,
} from "lucide-react";

import BASE_URL from "../../utils/api.js";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {

    const [formData, setFormData] = useState({
        email: "",
        code: "",
        newPassword: "",
    });

    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                `${BASE_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || "Reset failed");
                setTypeMessage("error");
                return;
            }

            setMessage("Password reset successfully");
            setTypeMessage("success");

            setTimeout(() => {
                navigate("/auth");
            }, 2000);

        } catch {
            setMessage("Something went wrong");
            setTypeMessage("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .rp-page {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 68px);
          background:
            radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 32%),
            linear-gradient(180deg, #f6fdf8 0%, #edf9f2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden auto;
        }

        .rp-blob1 {
          position: fixed;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: linear-gradient(
            145deg,
            rgba(6,78,59,0.08),
            rgba(16,185,129,0.06)
          );
        }

        .rp-blob2 {
          position: fixed;
          bottom: -120px;
          left: -80px;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: rgba(16,185,129,0.07);
        }

        .rp-card {
          background: rgba(255,255,255,0.96);
          border: 1px solid #d1fae5;
          border-radius: 24px;
          padding: 44px 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 24px 60px rgba(6,78,59,0.11);
          position: relative;
          overflow: hidden;
          z-index: 1;
          backdrop-filter: blur(10px);
        }

        .rp-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .rp-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .rp-logo-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, #064e3b, #065f46);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(6,78,59,0.25);
        }

        .rp-logo-cross {
          color: white;
          font-size: 28px;
          font-weight: 700;
          font-family: 'Playfair Display', serif;
        }

        .rp-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #064e3b;
          text-align: center;
          margin-bottom: 8px;
        }

        .rp-subtitle {
          text-align: center;
          font-size: 13px;
          color: #667085;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .rp-field {
          margin-bottom: 18px;
        }

        .rp-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 7px;
        }

        .rp-input-wrap {
          position: relative;
        }

        .rp-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #10b981;
        }

        .rp-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid #d1fae5;
          border-radius: 14px;
          font-size: 14px;
          background: #f9fefb;
          outline: none;
          transition: 0.2s;
        }

        .rp-input:focus {
          border-color: #10b981;
          background: white;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }

        .rp-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(
            135deg,
            #064e3b,
            #065f46 60%,
            #047857
          );
          color: white;
          font-size: 15px;
          font-weight: 600;
          padding: 14px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          margin-top: 8px;
          box-shadow: 0 4px 20px rgba(6,78,59,0.22);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }

        .rp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(6,78,59,0.3);
        }

        .rp-btn:focus-visible {
          outline: 3px solid rgba(16,185,129,0.28);
          outline-offset: 3px;
        }

        .rp-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .rp-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .rp-message {
          margin-top: 16px;
          padding: 12px;
          border-radius: 12px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
        }

        .rp-message.success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .rp-message.error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .rp-trust {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 28px;
          font-size: 12px;
          color: #9ca3af;
        }
        @media (max-width: 520px) {
          .rp-card { padding: 36px 22px; border-radius: 22px; }
        }
      `}</style>

            <div className="rp-page">

                <div className="rp-blob1" />
                <div className="rp-blob2" />

                <div className="rp-card">

                    <div className="rp-logo-wrap">
                        <div className="rp-logo-icon">
                            <span className="rp-logo-cross">✚</span>
                        </div>
                    </div>

                    <h1 className="rp-title">
                        Réinitialiser
                    </h1>

                    <p className="rp-subtitle">
                        Entrez le code reçu par email
                        ainsi que votre nouveau mot de passe.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="rp-field">
                            <label className="rp-label">
                                Adresse e-mail
                            </label>

                            <div className="rp-input-wrap">
                                <span className="rp-input-icon">
                                    <Mail size={15} />
                                </span>

                                <input
                                    className="rp-input"
                                    type="email"
                                    name="email"
                                    placeholder="exemple@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="rp-field">
                            <label className="rp-label">
                                Code de vérification
                            </label>

                            <div className="rp-input-wrap">
                                <span className="rp-input-icon">
                                    <KeyRound size={15} />
                                </span>

                                <input
                                    className="rp-input"
                                    type="text"
                                    name="code"
                                    placeholder="123456"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="rp-field">
                            <label className="rp-label">
                                Nouveau mot de passe
                            </label>

                            <div className="rp-input-wrap">
                                <span className="rp-input-icon">
                                    <Lock size={15} />
                                </span>

                                <input
                                    className="rp-input"
                                    type="password"
                                    name="newPassword"
                                    placeholder="••••••••"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="rp-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="rp-spinner" />
                            ) : (
                                <>
                                    Réinitialiser
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        {message && (
                            <div className={`rp-message ${typeMessage}`}>
                                {message}
                            </div>
                        )}

                    </form>

                    <div className="rp-trust">
                        <Shield size={13} />
                        Réinitialisation sécurisée — healthMax
                    </div>

                </div>
            </div>
        </>
    );
}
