import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Building2, Check, Lock, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { getOffersForAudience, getOfferViewerContext } from "../utils/offers";

const formatPrice = (price) => {
  if (price === 0) return "Gratuit";
  if (price == null) return "Prix sur demande";
  return `${price} MAD/mois`;
};

const getOfferHighlights = (offer) => {
  const highlights = [];

  if (offer.maxMedecins === 1) {
    highlights.push("1 medecin");
  } else if (offer.maxMedecins && offer.maxMedecins > 1 && offer.maxMedecins < 999) {
    highlights.push(`Jusqu'a ${offer.maxMedecins} medecins`);
  } else if (offer.maxMedecins && offer.maxMedecins >= 999) {
    highlights.push("Plusieurs medecins");
  }

  if (offer.dureeEssaiJours > 0) {
    highlights.push(`${offer.dureeEssaiJours} jours d'essai`);
  }

  if (offer.hasAdminDashboard) {
    highlights.push("Admins de clinique");
  }

  if (offer.hasRealTimeQueue) {
    highlights.push("Gestion en temps reel");
  }

  if (offer.hasStats) {
    highlights.push("Statistiques");
  }

  return highlights;
};

export default function OffersPage() {
  const { user } = useAuth();
  const plansQuery = useFetch("/api/abonnements/plans");
  const profileQuery = useFetch(user?.id ? `/api/users/${user.id}` : null);

  const viewerContext = useMemo(
    () => getOfferViewerContext(user, profileQuery.data),
    [profileQuery.data, user]
  );

  const [selectedAudience, setSelectedAudience] = useState(viewerContext.audience);

  useEffect(() => {
    setSelectedAudience(viewerContext.audience);
  }, [viewerContext.audience]);

  const offers = useMemo(
    () => getOffersForAudience(plansQuery.data, selectedAudience),
    [plansQuery.data, selectedAudience]
  );

  const audienceLabel = selectedAudience === "CLINIQUE" ? "Clinique" : "Medecin";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .of-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 28%),
            linear-gradient(180deg, #f3fbf5 0%, #eef9f2 100%);
          color: #064e3b;
          padding: 44px 24px 72px;
        }

        .of-shell {
          max-width: 1180px;
          margin: 0 auto;
        }

        .of-hero {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 18px;
          margin-bottom: 28px;
        }

        .of-card,
        .of-side,
        .of-plan,
        .of-state {
          background: rgba(255,255,255,0.94);
          border: 1px solid #d1fae5;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(6,78,59,0.08);
        }

        .of-card {
          padding: 30px;
          position: relative;
          overflow: hidden;
        }

        .of-card::after {
          content: "";
          position: absolute;
          width: 240px;
          height: 240px;
          right: -70px;
          top: -70px;
          background: radial-gradient(circle, rgba(16,185,129,0.16), transparent 60%);
        }

        .of-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ecfdf5;
          color: #047857;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 999px;
          padding: 8px 12px;
        }

        .of-title {
          margin: 18px 0 10px;
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          line-height: 1.08;
        }

        .of-copy {
          margin: 0;
          max-width: 48ch;
          color: #4b8070;
          font-size: 15px;
          line-height: 1.7;
        }

        .of-side {
          padding: 22px;
          display: grid;
          gap: 14px;
          align-content: start;
        }

        .of-side__label {
          margin: 0 0 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #4b8070;
        }

        .of-side__value {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
        }

        .of-toggle {
          display: inline-flex;
          gap: 10px;
          background: #fff;
          border: 1px solid #d1fae5;
          border-radius: 18px;
          padding: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .of-toggle button {
          min-height: 44px;
          border: none;
          border-radius: 14px;
          padding: 0 16px;
          background: transparent;
          color: #065f46;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .of-toggle button.active {
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #fff;
        }

        .of-toggle button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .of-info {
          margin: 0 0 24px;
          color: #4b8070;
          font-size: 14px;
        }

        .of-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
        }

        .of-plan {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }

        .of-plan:hover {
          transform: translateY(-3px);
          border-color: #a7f3d0;
          box-shadow: 0 24px 58px rgba(6,78,59,0.12);
        }

        .of-plan--featured {
          border-color: #6ee7b7;
          box-shadow: 0 24px 58px rgba(6,78,59,0.12);
          transform: translateY(-4px);
        }

        .of-badge {
          align-self: flex-start;
          border-radius: 999px;
          padding: 6px 10px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .of-plan__title {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 30px;
        }

        .of-plan__price {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #065f46;
        }

        .of-plan__desc {
          margin: 0;
          color: #6b8f85;
          font-size: 14px;
          line-height: 1.65;
        }

        .of-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }

        .of-list li {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          color: #1f3d35;
        }

        .of-cta,
        .of-cta-disabled {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 46px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
        }

        .of-cta {
          text-decoration: none;
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #fff;
          box-shadow: 0 10px 22px rgba(6,78,59,0.16);
          transition: transform 0.18s, box-shadow 0.18s;
        }

        .of-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(6,78,59,0.22);
        }

        .of-toggle button:focus-visible,
        .of-cta:focus-visible {
          outline: 3px solid rgba(16,185,129,0.28);
          outline-offset: 3px;
        }

        .of-cta-disabled {
          background: #ecfdf5;
          color: #4b8070;
          border: 1px solid #d1fae5;
        }

        .of-empty,
        .of-state {
          padding: 28px;
          text-align: center;
          color: #4b8070;
        }

        .of-empty {
          border: 1px dashed #a7f3d0;
          border-radius: 18px;
          background: rgba(255,255,255,0.65);
        }

        .of-state {
          display: grid;
          gap: 12px;
          justify-items: center;
        }

        .of-state__title {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          color: #064e3b;
        }

        .of-state__copy {
          margin: 0;
          max-width: 54ch;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .of-hero {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .of-root {
            padding: 28px 16px 56px;
          }

          .of-title {
            font-size: 34px;
          }
        }
      `}</style>

      <main className="of-root">
        <div className="of-shell">
          <section className="of-hero">
            <div className="of-card">
              <span className="of-kicker">
                {selectedAudience === "CLINIQUE" ? <Building2 size={14} /> : <Stethoscope size={14} />}
                Offres healthMax
              </span>
              <h1 className="of-title">Des abonnements clairs selon votre type de compte.</h1>
              <p className="of-copy">
                Consultez uniquement les offres qui correspondent a votre situation: medecin solo, clinique,
                ou compte deja rattache a une clinique.
              </p>
            </div>

            <aside className="of-side">
              <div>
                <p className="of-side__label">Type visible</p>
                <p className="of-side__value">{audienceLabel}</p>
              </div>
              <div>
                <p className="of-side__label">Compte connecte</p>
                <p className="of-side__value">{user?.role || "Visiteur"}</p>
              </div>
              <div>
                <p className="of-side__label">Remarque</p>
                <p className="of-side__value">{viewerContext.infoMessage}</p>
              </div>
            </aside>
          </section>

          <div className="of-toggle">
            <button
              className={selectedAudience === "MEDECIN" ? "active" : ""}
              onClick={() => setSelectedAudience("MEDECIN")}
              disabled={!viewerContext.canSwitchAudience}
            >
              <Stethoscope size={15} /> Offres medecin
            </button>
            <button
              className={selectedAudience === "CLINIQUE" ? "active" : ""}
              onClick={() => setSelectedAudience("CLINIQUE")}
              disabled={!viewerContext.canSwitchAudience}
            >
              <Building2 size={15} /> Offres clinique
            </button>
          </div>

          <p className="of-info">
            {plansQuery.loading
              ? "Chargement des offres depuis le backend..."
              : "Les cartes ci-dessous utilisent les plans du backend quand ils existent, sinon elles affichent vos offres par defaut."}
          </p>

          {plansQuery.error && (
            <p className="of-info">
              Le backend n'a pas repondu pour les plans, donc la page affiche les offres par defaut.
            </p>
          )}

          {viewerContext.hideOffers ? (
            <section className="of-state">
              <Lock size={28} color="#059669" />
              <h2 className="of-state__title">Offres non disponibles pour ce compte</h2>
              <p className="of-state__copy">{viewerContext.infoMessage}</p>
            </section>
          ) : offers.length === 0 ? (
            <div className="of-empty">Aucune offre visible pour ce type de compte.</div>
          ) : (
            <section className="of-grid">
              {offers.map((offer) => {
                const highlights = getOfferHighlights(offer);
                const isFeatured = offer.key === "CLINIQUE" || offer.key === "CABINET_SOLO";

                return (
                  <article
                    key={offer.key}
                    className={`of-plan${isFeatured ? " of-plan--featured" : ""}`}
                  >
                    <span className="of-badge">
                      {offer.key === "GRATUIT" ? "Essai" : offer.audience === "CLINIQUE" ? "Equipe" : "Cabinet"}
                    </span>
                    <div>
                      <h2 className="of-plan__title">{offer.nom}</h2>
                      <p className="of-plan__price">{formatPrice(offer.prix)}</p>
                    </div>
                    <p className="of-plan__desc">
                      {offer.description || "Offre disponible pour votre type de compte."}
                    </p>

                    <ul className="of-list">
                      {highlights.map((item) => (
                        <li key={item}>
                          <Check size={15} color="#059669" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {viewerContext.canApply ? (
                      <a className="of-cta" href="/auth">
                        Choisir cette offre
                        <ArrowRight size={15} />
                      </a>
                    ) : (
                      <div className="of-cta-disabled">
                        <Lock size={14} />
                        Souscription non disponible
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
