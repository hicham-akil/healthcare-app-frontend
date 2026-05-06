import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const role = user?.role;

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "#" },
    { label: "Services", href: "#" },
    { label: "Connexion", href: "/auth" },
    { label: "Mes Rendez-vous", href: "/myapoin" },
    ...(role === "PATIENT" ? [{ label: "Médecins", href: "/ShowMed" }] : []),
    { label: "Profil", href: "/profile" },
    ...(role === "MEDECIN" ? [{ label: "Horaires", href: "/workinghours" }] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid #d1fae5;
          box-shadow: 0 2px 16px rgba(16, 185, 129, 0.08);
        }

        .nav-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .nav-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #065f46, #10b981);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(16,185,129,0.3);
        }

        .nav-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #064e3b;
          letter-spacing: -0.3px;
        }

        .nav-logo-text span {
          color: #10b981;
        }

        /* Desktop links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0; padding: 0;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
        }

        .nav-links a {
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
          padding: 6px 13px;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }

        .nav-links a:hover {
          background: #ecfdf5;
          color: #065f46;
        }

        .nav-links a.active {
          background: #d1fae5;
          color: #065f46;
        }

        /* CTA link (Auth/Connexion) */
        .nav-links a.nav-cta {
          background: #065f46;
          color: #ffffff;
          padding: 7px 16px;
          border-radius: 20px;
          margin-left: 6px;
          font-weight: 600;
        }

        .nav-links a.nav-cta:hover {
          background: #047857;
          color: #ffffff;
        }

        /* Role badge */
        .nav-role {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          margin-left: 8px;
        }

        /* Hamburger */
        .nav-hamburger {
          display: none;
          background: none;
          border: 1px solid #d1fae5;
          border-radius: 8px;
          width: 40px; height: 40px;
          align-items: center; justify-content: center;
          cursor: pointer;
          color: #065f46;
          font-size: 18px;
          transition: background 0.15s;
        }

        .nav-hamburger:hover {
          background: #ecfdf5;
        }

        @media (max-width: 768px) {
          .nav-hamburger { display: flex; }
        }

        /* Mobile drawer */
        .nav-mobile {
          display: none;
          flex-direction: column;
          background: #ffffff;
          border-top: 1px solid #d1fae5;
          padding: 12px 16px 20px;
          gap: 2px;
        }

        .nav-mobile.open {
          display: flex;
        }

        .nav-mobile a {
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          padding: 11px 14px;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-mobile a:hover {
          background: #ecfdf5;
          color: #065f46;
        }

        .nav-mobile a.nav-cta-mobile {
          background: #065f46;
          color: #ffffff;
          margin-top: 8px;
          justify-content: center;
          font-weight: 600;
          border-radius: 12px;
        }

        .nav-mobile a.nav-cta-mobile:hover {
          background: #047857;
        }

        .nav-divider {
          height: 1px;
          background: #d1fae5;
          margin: 8px 0;
        }
      `}</style>

      <nav className="nav-root">
        <div className="nav-inner">
          {/* Logo */}
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon">✚</div>
            <span className="nav-logo-text">health<span>Max</span></span>
          </a>

          {/* Desktop Nav */}
          <ul className="nav-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="#">À propos</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="/myapoin">Mes Rendez-vous</a></li>
            {role === "PATIENT" && <li><a href="/ShowMed">Médecins</a></li>}
            {role === "MEDECIN" && <li><a href="/workinghours">Horaires</a></li>}
            <li><a href="/profile">Profil</a></li>
            <li><a href="/auth" className="nav-cta">Connexion</a></li>
            {role && (
              <li>
                <span className="nav-role">
                  {role === "MEDECIN" ? "🩺" : "👤"} {role}
                </span>
              </li>
            )}
          </ul>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`nav-mobile ${isOpen ? "open" : ""}`}>
          <a href="/">🏠 Accueil</a>
          <a href="#">ℹ️ À propos</a>
          <a href="#">⚕️ Services</a>
          <a href="/myapoin">📅 Mes Rendez-vous</a>
          {role === "PATIENT" && <a href="/ShowMed">👨‍⚕️ Médecins</a>}
          {role === "MEDECIN" && <a href="/workinghours">🕐 Horaires</a>}
          <div className="nav-divider" />
          <a href="/profile">👤 Profil</a>
          <a href="/auth" className="nav-cta-mobile">Connexion →</a>
        </div>
      </nav>
    </>
  );
}