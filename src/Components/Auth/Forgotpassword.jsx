import { useState } from "react";
import { Mail, ArrowRight, Shield, ArrowLeft } from "lucide-react";
import BASE_URL from "../../utils/api.js";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [typemessage, settypeMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                `${BASE_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to send reset link.");
                settypeMessage("error");
                return;
            }

            setMessage(
                "Password reset code has been sent to your email."
            );
            navigation("/reset-password");
            settypeMessage("success");
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
            settypeMessage("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:wght@600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .fp-page {
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

        .fp-blob1 {
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
          pointer-events: none;
        }

        .fp-blob2 {
          position: fixed;
          bottom: -120px;
          left: -80px;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: rgba(16,185,129,0.07);
          pointer-events: none;
        }

        .fp-card {
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

        .fp-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .fp-back {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #065f46;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 24px;
          width: fit-content;
        }

        .fp-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .fp-logo-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, #064e3b, #065f46);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(6,78,59,0.25);
        }

        .fp-logo-cross {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          font-family: 'Playfair Display', serif;
        }

        .fp-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #064e3b;
          text-align: center;
          letter-spacing: -0.3px;
          margin-bottom: 8px;
        }

        .fp-subtitle {
          text-align: center;
          font-size: 13.5px;
          color: #9ca3af;
          font-weight: 300;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .fp-field {
          margin-bottom: 22px;
        }

        .fp-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 7px;
        }

        .fp-input-wrap {
          position: relative;
        }

        .fp-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #10b981;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .fp-input {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid #d1fae5;
          border-radius: 14px;
          font-size: 14px;
          color: #064e3b;
          background: #f9fefb;
          outline: none;
          transition: 0.2s;
        }

        .fp-input::placeholder {
          color: #adb5bd;
          font-weight: 300;
        }

        .fp-input:focus {
          border-color: #10b981;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }

        .fp-btn {
          font-family: 'DM Sans', sans-serif;
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
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          padding: 14px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(6,78,59,0.25);
          transition: 0.2s;
        }

        .fp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(6,78,59,0.3);
        }

        .fp-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .fp-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .fp-message {
          margin-top: 16px;
          padding: 11px 16px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          text-align: center;
        }

        .fp-message.success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .fp-message.error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .fp-trust {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 28px;
          font-size: 12px;
          color: #9ca3af;
        }

        .fp-trust svg {
          color: #10b981;
        }
      `}</style>

            <div className="fp-page">
                <div className="fp-blob1" />
                <div className="fp-blob2" />

                <div className="fp-card">
                    <div
                        className="fp-back"
                        onClick={() => navigation("/login")}
                    >
                        <ArrowLeft size={15} />
                        Retour connexion
                    </div>

                    <div className="fp-logo-wrap">
                        <div className="fp-logo-icon">
                            <span className="fp-logo-cross">✚</span>
                        </div>
                    </div>

                    <h1 className="fp-title">Mot de passe oublié ?</h1>

                    <p className="fp-subtitle">
                        Entrez votre adresse e-mail pour recevoir
                        un lien de réinitialisation sécurisé.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="fp-field">
                            <label className="fp-label">
                                Adresse e-mail
                            </label>

                            <div className="fp-input-wrap">
                                <span className="fp-input-icon">
                                    <Mail size={15} />
                                </span>

                                <input
                                    className="fp-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="exemple@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="fp-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="fp-spinner" />
                            ) : (
                                <>
                                    Envoyer le lien
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        {message && (
                            <div className={`fp-message ${typemessage}`}>
                                {typemessage === "success" ? "✓" : "✕"} {message}
                            </div>
                        )}
                    </form>

                    <div className="fp-trust">
                        <Shield size={13} />
                        Réinitialisation sécurisée — healthMax
                    </div>
                </div>
            </div>
        </>
    );
}