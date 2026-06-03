import React from "react";
import { Calendar, User, Stethoscope, Clock, ArrowRight, Shield, Star } from "lucide-react";
import Navbar from "../components/reusable/Navbar";

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hp-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0faf4;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hp-hero {
          position: relative;
          background: linear-gradient(145deg, #064e3b 0%, #065f46 45%, #047857 100%);
          padding: 90px 24px 100px;
          text-align: center;
          overflow: hidden;
        }

        .hp-hero-blob1 {
          position: absolute; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
        }

        .hp-hero-blob2 {
          position: absolute; bottom: -100px; left: -60px;
          width: 280px; height: 280px; border-radius: 50%;
          background: rgba(16,185,129,0.12);
          pointer-events: none;
        }

        .hp-hero-blob3 {
          position: absolute; top: 30%; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .hp-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: #a7f3d0;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 28px;
          backdrop-filter: blur(4px);
        }

        .hp-badge-dot {
          width: 6px; height: 6px;
          background: #34d399;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .hp-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 56px);
          color: #ffffff;
          line-height: 1.18;
          letter-spacing: -0.5px;
          max-width: 680px;
          margin: 0 auto 20px;
        }

        .hp-hero h1 em {
          font-style: italic;
          color: #6ee7b7;
        }

        .hp-hero p {
          color: rgba(255,255,255,0.7);
          font-size: 16px;
          font-weight: 300;
          max-width: 520px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }

        .hp-hero-btns {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #065f46;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 13px 26px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }

        .hp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.2);
        }

        .hp-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 13px 26px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.35);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-decoration: none;
          backdrop-filter: blur(4px);
        }

        .hp-btn-outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.6);
        }

        /* ── STATS STRIP ── */
        .hp-stats {
          background: #ffffff;
          border-bottom: 1px solid #d1fae5;
          padding: 24px;
        }

        .hp-stats-inner {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }

        .hp-stat-item {
          flex: 1;
          min-width: 140px;
          text-align: center;
          padding: 12px 24px;
          border-right: 1px solid #d1fae5;
        }

        .hp-stat-item:last-child { border-right: none; }

        .hp-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #065f46;
          line-height: 1;
        }

        .hp-stat-label {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 4px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ── FEATURES ── */
        .hp-features {
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 24px;
        }

        .hp-section-label {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 12px;
        }

        .hp-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3vw, 36px);
          color: #064e3b;
          text-align: center;
          margin-bottom: 56px;
          letter-spacing: -0.3px;
        }

        .hp-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .hp-card {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }

        .hp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #10b981, #34d399);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .hp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(16,185,129,0.12);
          border-color: #a7f3d0;
        }

        .hp-card:hover::before {
          opacity: 1;
        }

        .hp-card-icon {
          width: 60px; height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          transition: transform 0.25s;
        }

        .hp-card:hover .hp-card-icon {
          transform: scale(1.1) rotate(-4deg);
        }

        .hp-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #064e3b;
          margin-bottom: 10px;
        }

        .hp-card p {
          font-size: 13.5px;
          color: #6b7280;
          line-height: 1.65;
          font-weight: 300;
        }

        /* ── CTA BANNER ── */
        .hp-cta {
          margin: 0 24px 72px;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 72px;
          background: linear-gradient(135deg, #064e3b, #065f46 60%, #047857);
          border-radius: 24px;
          padding: 56px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hp-cta::after {
          content: '✚';
          position: absolute;
          font-size: 200px;
          color: rgba(255,255,255,0.03);
          right: -20px; top: -40px;
          pointer-events: none;
          line-height: 1;
        }

        .hp-cta h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3vw, 32px);
          color: #ffffff;
          margin-bottom: 12px;
        }

        .hp-cta p {
          color: rgba(255,255,255,0.65);
          font-size: 15px;
          font-weight: 300;
          margin-bottom: 32px;
        }

        .hp-trust {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 32px;
        }

        .hp-trust-item {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,0.65);
          font-size: 13px;
          font-weight: 400;
        }

        .hp-trust-item svg {
          color: #34d399;
          flex-shrink: 0;
        }

        /* ── FOOTER ── */
        .hp-footer {
          background: #ffffff;
          border-top: 1px solid #d1fae5;
          padding: 24px;
          text-align: center;
          color: #9ca3af;
          font-size: 13px;
        }

        .hp-footer span { color: #10b981; }
      `}</style>

      <div className="hp-root">

        <section className="hp-hero">
          <div className="hp-hero-blob1" />
          <div className="hp-hero-blob2" />
          <div className="hp-hero-blob3" />

          <div className="hp-badge">
            <span className="hp-badge-dot" />
            Plateforme médicale certifiée
          </div>

          <h1>
            Votre santé, <em>simplifiée</em> et à portée de main
          </h1>
          <p>
            Prenez rendez-vous avec des médecins qualifiés rapidement et en toute sécurité — depuis n'importe où.
          </p>

          <div className="hp-hero-btns">
            <a href="/myapoin" className="hp-btn-primary">
              <Calendar size={16} />
              Mes rendez-vous
            </a>
            <a href="/ShowMed" className="hp-btn-outline">
              Voir les médecins
              <ArrowRight size={15} />
            </a>
          </div>
        </section>

        {/* Stats */}
        <div className="hp-stats">
          <div className="hp-stats-inner">
            <div className="hp-stat-item">
              <div className="hp-stat-num">1 200+</div>
              <div className="hp-stat-label">Médecins</div>
            </div>
            <div className="hp-stat-item">
              <div className="hp-stat-num">48 000+</div>
              <div className="hp-stat-label">Patients</div>
            </div>
            <div className="hp-stat-item">
              <div className="hp-stat-num">98%</div>
              <div className="hp-stat-label">Satisfaction</div>
            </div>
            <div className="hp-stat-item">
              <div className="hp-stat-num">24/7</div>
              <div className="hp-stat-label">Disponible</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <section className="hp-features">
          <p className="hp-section-label">Ce que nous offrons</p>
          <h2 className="hp-section-title">Tout ce dont vous avez besoin</h2>

          <div className="hp-cards">
            <div className="hp-card">
              <div className="hp-card-icon">
                <User size={26} color="#065f46" strokeWidth={1.8} />
              </div>
              <h3>Patients</h3>
              <p>Gérez votre profil, consultez vos antécédents et vos rendez-vous en un seul endroit.</p>
            </div>

            <div className="hp-card">
              <div className="hp-card-icon">
                <Stethoscope size={26} color="#065f46" strokeWidth={1.8} />
              </div>
              <h3>Médecins</h3>
              <p>Consultez des professionnels certifiés dans toutes les spécialités médicales.</p>
            </div>

            <div className="hp-card">
              <div className="hp-card-icon">
                <Calendar size={26} color="#065f46" strokeWidth={1.8} />
              </div>
              <h3>Rendez-vous</h3>
              <p>Planification simple, rapide et sans paperasse. Confirmez en quelques secondes.</p>
            </div>

            <div className="hp-card">
              <div className="hp-card-icon">
                <Clock size={26} color="#065f46" strokeWidth={1.8} />
              </div>
              <h3>Disponibilité</h3>
              <p>Horaires mis à jour en temps réel. Ne manquez plus jamais un créneau disponible.</p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="hp-cta">
          <h2>Prêt à prendre soin de votre santé ?</h2>
          <p>Rejoignez des milliers de patients qui font confiance à healthMax.</p>
          <a href="/auth" className="hp-btn-primary">
            Commencer maintenant
            <ArrowRight size={15} />
          </a>

          <div className="hp-trust">
            <div className="hp-trust-item">
              <Shield size={14} />
              Données sécurisées
            </div>
            <div className="hp-trust-item">
              <Star size={14} />
              Médecins certifiés
            </div>
            <div className="hp-trust-item">
              <Clock size={14} />
              Disponible 24h/24
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="hp-footer">
          © 2025 <span>healthMax</span> — Tous droits réservés
        </footer>
      </div>
    </>
  );
}