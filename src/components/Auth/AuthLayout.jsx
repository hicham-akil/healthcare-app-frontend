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
          min-height: 100vh;
          background: #f0faf4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
          overflow: hidden;
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
          border-radius: 16px;
          padding: 5px;
          gap: 4px;
          margin-bottom: 20px;
          box-shadow: 0 4px 16px rgba(6,78,59,0.07);
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
          color: #9ca3af;
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
