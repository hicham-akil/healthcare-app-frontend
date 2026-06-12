import React from "react"; 
import { useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";

export default function AuthLayout() {
  const [mode, setMode] = useState("signin");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .al-page {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 68px);
          background:
            radial-gradient(circle at 10% 10%, rgba(16,185,129,0.12), transparent 30%),
            linear-gradient(180deg, #f6fdf8 0%, #edf9f2 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          position: relative;
          overflow: hidden auto;
        }

        .al-blob1 {
          position: fixed; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: linear-gradient(145deg, rgba(6,78,59,0.08), rgba(16,185,129,0.06));
          pointer-events: none;
        }

        .al-blob2 {
          position: fixed; bottom: -120px; left: -80px;
          width: 350px; height: 350px; border-radius: 50%;
          background: rgba(16,185,129,0.07);
          pointer-events: none;
        }

        /* ── Tab switcher ── */
        .al-tabs {
          display: flex;
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 18px;
          padding: 5px;
          gap: 4px;
          margin-bottom: 22px;
          box-shadow: 0 14px 34px rgba(6,78,59,0.09);
          position: relative;
          z-index: 1;
        }

        .al-tab {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 32px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.22s;
          color: #64748b;
          background: transparent;
          letter-spacing: 0.1px;
        }

        .al-tab.active {
          background: linear-gradient(135deg, #064e3b, #065f46 60%, #047857);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(6,78,59,0.28);
        }

        .al-tab:not(.active):hover {
          color: #065f46;
          background: #ecfdf5;
        }

        .al-tab:focus-visible {
          outline: 3px solid rgba(16,185,129,0.28);
          outline-offset: 2px;
        }

        /* ── Content wrapper ── */
        .al-content {
          width: 100%;
          max-width: 520px;
          position: relative;
          z-index: 1;
        }

        .al-offers-link {
          margin-top: 14px;
          font-size: 13px;
          color: #4b8070;
          text-align: center;
        }

        .al-offers-link a {
          color: #047857;
          font-weight: 700;
          text-decoration: none;
        }

        .al-offers-link a:hover {
          color: #065f46;
          text-decoration: underline;
        }

        /* strip the inner page shells from Signin / Signup
           since AuthLayout provides the background */
        .al-content .si-page,
        .al-content .rf-page {
          min-height: unset !important;
          background: transparent !important;
          padding: 0 !important;
        }

        /* hide the blobs rendered inside child components */
        .al-content .si-blob1,
        .al-content .si-blob2,
        .al-content .rf-blob1,
        .al-content .rf-blob2 {
          display: none !important;
        }

        @media (max-width: 560px) {
          .al-page { padding: 32px 16px; justify-content: flex-start; }
          .al-tabs { width: 100%; max-width: 420px; }
          .al-tab { flex: 1; padding: 10px 12px; }
        }
      `}</style>

      <div className="al-page">
        <div className="al-blob1" />
        <div className="al-blob2" />

        <div className="al-tabs">
          <button
            className={`al-tab ${mode === "signin" ? "active" : ""}`}
            onClick={() => setMode("signin")}
          >
            Se connecter
          </button>
          <button
            className={`al-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Créer un compte
          </button>
        </div>

        <div className="al-content">
          {mode === "signin" ? <Signin /> : <Signup />}
          <p className="al-offers-link">
            Vous voulez comparer les abonnements ? <a href="/offres">Voir les offres</a>
          </p>
        </div>
      </div>
    </>
  );
}
