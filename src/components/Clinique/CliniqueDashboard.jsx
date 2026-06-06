import { useMemo, useState } from "react";
import { Building2, RefreshCw, Shield, Stethoscope, ToggleLeft, Trash2, UserPlus, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAction, useFetch } from "../../hooks/useFetch";

const getClinicId = (user) => user?.cliniqueId ?? (user?.role === "CLINIQUE" ? user?.id : null);

const getFullName = (user) =>
  [user?.prenom, user?.nom].filter(Boolean).join(" ") || user?.nomClinique || user?.email || "Utilisateur";

const CliniqueDashboard = () => {
  const { user } = useAuth();
  const cliniqueId = getClinicId(user);

  const [activeTab, setActiveTab] = useState("medecins");
  const [adminForm, setAdminForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
  });
  const [medecinForm, setMedecinForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    adresse: "",
    specialiteIds: [],
  });

  const cliniqueQuery = useFetch(cliniqueId ? `/api/cliniques/${cliniqueId}` : null);
  const medecinsQuery = useFetch(cliniqueId ? `/api/cliniques/${cliniqueId}/medecins` : null);
  const adminsQuery = useFetch(cliniqueId ? `/api/cliniques/${cliniqueId}/admins` : null);
  const specialitesQuery = useFetch("/api/specialites");

  const createAdmin = useAction();
  const createMedecin = useAction();
  const toggleMedecin = useAction();
  const removeMedecin = useAction();

  const medecins = useMemo(() => (Array.isArray(medecinsQuery.data) ? medecinsQuery.data : []), [medecinsQuery.data]);
  const admins = useMemo(() => (Array.isArray(adminsQuery.data) ? adminsQuery.data : []), [adminsQuery.data]);
  const specialites = useMemo(() => (Array.isArray(specialitesQuery.data) ? specialitesQuery.data : []), [specialitesQuery.data]);

  const refreshAll = () => {
    cliniqueQuery.refetch();
    medecinsQuery.refetch();
    adminsQuery.refetch();
    specialitesQuery.refetch();
  };

  const handleAdminSubmit = async (event) => {
    event.preventDefault();
    createAdmin.reset();
    const result = await createAdmin.execute(`/api/cliniques/${cliniqueId}/admins`, {
      method: "POST",
      body: adminForm,
    });

    if (result !== null) {
      setAdminForm({ nom: "", prenom: "", email: "", password: "", telephone: "" });
      adminsQuery.refetch();
    }
  };

  const handleMedecinSubmit = async (event) => {
    event.preventDefault();
    createMedecin.reset();
    const result = await createMedecin.execute(`/api/cliniques/${cliniqueId}/medecins`, {
      method: "POST",
      body: medecinForm,
    });

    if (result !== null) {
      setMedecinForm({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        telephone: "",
        adresse: "",
        specialiteIds: [],
      });
      medecinsQuery.refetch();
    }
  };

  const handleSpecialiteToggle = (specialiteId) => {
    const id = Number(specialiteId);
    const current = medecinForm.specialiteIds;
    setMedecinForm((prev) => ({
      ...prev,
      specialiteIds: current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    }));
  };

  const handleToggleMedecin = async (medecinId) => {
    const result = await toggleMedecin.execute(`/api/cliniques/${cliniqueId}/medecins/${medecinId}/toggle`, {
      method: "PATCH",
    });
    if (result !== null) {
      medecinsQuery.refetch();
    }
  };

  const handleRemoveMedecin = async (medecinId) => {
    if (!window.confirm("Retirer ce medecin de la clinique ?")) return;
    const result = await removeMedecin.execute(`/api/cliniques/${cliniqueId}/medecins/${medecinId}`, {
      method: "DELETE",
    });
    if (result !== null) {
      medecinsQuery.refetch();
    }
  };

  if (!cliniqueId) {
    return <div style={{ padding: 24 }}>Impossible de charger la clinique pour ce compte.</div>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .cd-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 32%),
            linear-gradient(180deg, #f4fbf6 0%, #eefaf3 100%);
          padding: 40px 24px 72px;
          color: #064e3b;
        }

        .cd-shell {
          max-width: 1180px;
          margin: 0 auto;
        }

        .cd-hero {
          display: grid;
          grid-template-columns: 1.3fr 0.9fr;
          gap: 18px;
          margin-bottom: 24px;
        }

        .cd-hero-card,
        .cd-stat,
        .cd-panel,
        .cd-meta {
          background: rgba(255,255,255,0.92);
          border: 1px solid #d1fae5;
          border-radius: 22px;
          box-shadow: 0 18px 45px rgba(6, 78, 59, 0.08);
        }

        .cd-hero-card {
          padding: 28px;
          position: relative;
          overflow: hidden;
        }

        .cd-hero-card::after {
          content: "";
          position: absolute;
          inset: auto -40px -60px auto;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(16,185,129,0.14), transparent 65%);
          pointer-events: none;
        }

        .cd-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 8px 12px;
          background: #ecfdf5;
          color: #047857;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .cd-title {
          margin: 18px 0 8px;
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          line-height: 1.08;
        }

        .cd-copy {
          margin: 0;
          color: #4b8070;
          font-size: 14px;
          max-width: 46ch;
          line-height: 1.7;
        }

        .cd-meta-wrap {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .cd-meta {
          padding: 20px;
        }

        .cd-meta__label {
          margin: 0 0 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #4b8070;
        }

        .cd-meta__value {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #064e3b;
        }

        .cd-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .cd-stat {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .cd-stat__icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #064e3b, #059669);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cd-stat__value {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          line-height: 1;
        }

        .cd-stat__label {
          margin: 4px 0 0;
          font-size: 12px;
          color: #4b8070;
          font-weight: 600;
        }

        .cd-panel { overflow: hidden; }

        .cd-tabs {
          padding: 16px;
          border-bottom: 1px solid #d1fae5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          background: #f7fdf9;
          flex-wrap: wrap;
        }

        .cd-tab-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cd-tab,
        .cd-btn {
          border-radius: 14px;
          min-height: 40px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.14s, opacity 0.14s;
        }

        .cd-tab {
          border: 1px solid #d1fae5;
          background: #fff;
          color: #065f46;
          padding: 10px 14px;
        }

        .cd-tab--active {
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #fff;
          border-color: transparent;
        }

        .cd-btn {
          border: none;
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #fff;
          padding: 10px 14px;
        }

        .cd-btn--ghost {
          background: #fff;
          border: 1px solid #d1fae5;
          color: #065f46;
        }

        .cd-btn--danger {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .cd-btn:hover:not(:disabled),
        .cd-tab:hover {
          transform: translateY(-1px);
        }

        .cd-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .cd-body {
          padding: 22px;
        }

        .cd-section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .cd-section-title {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 24px;
        }

        .cd-section-copy {
          margin: 5px 0 0;
          color: #4b8070;
          font-size: 13px;
        }

        .cd-form {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          padding: 16px;
          border: 1px solid #d1fae5;
          border-radius: 18px;
          background: #f8fffb;
          margin-bottom: 18px;
        }

        .cd-form--medecin {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .cd-input,
        .cd-select {
          width: 100%;
          min-height: 40px;
          border: 1px solid #d1fae5;
          border-radius: 14px;
          padding: 10px 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #064e3b;
          background: #fff;
          outline: none;
        }

        .cd-input:focus,
        .cd-select:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.12);
        }

        .cd-specialites {
          border: 1px solid #d1fae5;
          border-radius: 16px;
          background: #fff;
          padding: 14px;
          margin-bottom: 18px;
        }

        .cd-specialites__title {
          margin: 0 0 10px;
          font-size: 13px;
          font-weight: 700;
          color: #065f46;
        }

        .cd-specialites__grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .cd-check {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 10px;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          background: #f8fffb;
          font-size: 13px;
          color: #1f3d35;
        }

        .cd-check input {
          accent-color: #059669;
        }

        .cd-table-wrap {
          border: 1px solid #d1fae5;
          border-radius: 18px;
          overflow: auto;
        }

        .cd-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        .cd-table th {
          background: #ecfdf5;
          color: #065f46;
          text-align: left;
          padding: 13px 16px;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .cd-table td {
          padding: 14px 16px;
          border-top: 1px solid #d1fae5;
          font-size: 13px;
          color: #1f3d35;
        }

        .cd-name {
          font-weight: 700;
          color: #064e3b;
        }

        .cd-muted {
          color: #6b8f85;
          font-size: 12px;
        }

        .cd-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #d1fae5;
        }

        .cd-badge--off {
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fecaca;
        }

        .cd-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cd-error,
        .cd-loading,
        .cd-empty {
          border: 1px solid #d1fae5;
          border-radius: 18px;
          padding: 24px 18px;
          text-align: center;
          font-size: 14px;
          background: #fff;
        }

        .cd-error {
          color: #b91c1c;
          background: #fef2f2;
          border-color: #fecaca;
        }

        @media (max-width: 980px) {
          .cd-hero,
          .cd-stats {
            grid-template-columns: 1fr;
          }

          .cd-form,
          .cd-form--medecin,
          .cd-specialites__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .cd-root {
            padding: 28px 16px 56px;
          }

          .cd-title {
            font-size: 31px;
          }

          .cd-body {
            padding: 16px;
          }

          .cd-form,
          .cd-form--medecin,
          .cd-specialites__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="cd-root">
        <div className="cd-shell">
          <section className="cd-hero">
            <div className="cd-hero-card">
              <span className="cd-kicker">
                <Building2 size={14} />
                Espace clinique
              </span>
              <h1 className="cd-title">{cliniqueQuery.data?.nomClinique || user?.nomClinique || "Clinique"}</h1>
              <p className="cd-copy">
                Gereons vos medecins, vos admins internes et l'organisation du compte clinique depuis un seul espace.
              </p>
            </div>

            <div className="cd-meta-wrap">
              <div className="cd-meta">
                <p className="cd-meta__label">Compte connecte</p>
                <p className="cd-meta__value">{getFullName(user)}</p>
              </div>
              <div className="cd-meta">
                <p className="cd-meta__label">Role</p>
                <p className="cd-meta__value">{user?.role || "-"}</p>
              </div>
              <div className="cd-meta">
                <p className="cd-meta__label">Description</p>
                <p className="cd-meta__value">{cliniqueQuery.data?.description || "Aucune description renseignee."}</p>
              </div>
            </div>
          </section>

          <section className="cd-stats">
            <div className="cd-stat">
              <div className="cd-stat__icon"><Stethoscope size={20} /></div>
              <div>
                <p className="cd-stat__value">{medecins.length}</p>
                <p className="cd-stat__label">Medecins rattaches</p>
              </div>
            </div>
            <div className="cd-stat">
              <div className="cd-stat__icon"><Users size={20} /></div>
              <div>
                <p className="cd-stat__value">{admins.length}</p>
                <p className="cd-stat__label">Admins de clinique</p>
              </div>
            </div>
            <div className="cd-stat">
              <div className="cd-stat__icon"><Shield size={20} /></div>
              <div>
                <p className="cd-stat__value">{medecins.filter((medecin) => medecin.active !== false).length}</p>
                <p className="cd-stat__label">Medecins actifs</p>
              </div>
            </div>
          </section>

          <section className="cd-panel">
            <div className="cd-tabs">
              <div className="cd-tab-list">
                <button className={`cd-tab${activeTab === "medecins" ? " cd-tab--active" : ""}`} onClick={() => setActiveTab("medecins")}>
                  <Stethoscope size={16} /> Medecins
                </button>
                <button className={`cd-tab${activeTab === "admins" ? " cd-tab--active" : ""}`} onClick={() => setActiveTab("admins")}>
                  <Shield size={16} /> Admins
                </button>
              </div>
              <button className="cd-btn cd-btn--ghost" onClick={refreshAll}>
                <RefreshCw size={15} /> Actualiser
              </button>
            </div>

            <div className="cd-body">
              {activeTab === "medecins" && (
                <section>
                  <div className="cd-section-head">
                    <div>
                      <h2 className="cd-section-title">Equipe medicale</h2>
                      <p className="cd-section-copy">Creer, activer, suspendre ou retirer les medecins de votre clinique.</p>
                    </div>
                  </div>

                  <form className="cd-form cd-form--medecin" onSubmit={handleMedecinSubmit}>
                    <input className="cd-input" type="text" placeholder="Nom" value={medecinForm.nom} onChange={(e) => setMedecinForm({ ...medecinForm, nom: e.target.value })} required />
                    <input className="cd-input" type="text" placeholder="Prenom" value={medecinForm.prenom} onChange={(e) => setMedecinForm({ ...medecinForm, prenom: e.target.value })} />
                    <input className="cd-input" type="email" placeholder="Email" value={medecinForm.email} onChange={(e) => setMedecinForm({ ...medecinForm, email: e.target.value })} required />
                    <input className="cd-input" type="password" placeholder="Mot de passe" value={medecinForm.password} onChange={(e) => setMedecinForm({ ...medecinForm, password: e.target.value })} required />
                    <input className="cd-input" type="text" placeholder="Telephone" value={medecinForm.telephone} onChange={(e) => setMedecinForm({ ...medecinForm, telephone: e.target.value })} />
                    <input className="cd-input" type="text" placeholder="Adresse" value={medecinForm.adresse} onChange={(e) => setMedecinForm({ ...medecinForm, adresse: e.target.value })} />
                    <button className="cd-btn" type="submit" disabled={createMedecin.loading}>
                      <UserPlus size={15} /> Creer medecin
                    </button>
                  </form>

                  <div className="cd-specialites">
                    <p className="cd-specialites__title">Specialites</p>
                    <div className="cd-specialites__grid">
                      {specialites.map((specialite) => (
                        <label key={specialite.id} className="cd-check">
                          <input
                            type="checkbox"
                            checked={medecinForm.specialiteIds.includes(specialite.id)}
                            onChange={() => handleSpecialiteToggle(specialite.id)}
                          />
                          <span>{specialite.nomspecialite}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {createMedecin.error && <div className="cd-error">{createMedecin.error}</div>}

                  {medecinsQuery.loading ? (
                    <div className="cd-loading">Chargement des medecins...</div>
                  ) : medecinsQuery.error ? (
                    <div className="cd-error">{medecinsQuery.error}</div>
                  ) : medecins.length === 0 ? (
                    <div className="cd-empty">Aucun medecin rattache pour le moment.</div>
                  ) : (
                    <div className="cd-table-wrap">
                      <table className="cd-table">
                        <thead>
                          <tr>
                            <th>Medecin</th>
                            <th>Email</th>
                            <th>Telephone</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medecins.map((medecin) => (
                            <tr key={medecin.id}>
                              <td>
                                <div className="cd-name">{getFullName(medecin)}</div>
                                <div className="cd-muted">ID #{medecin.id}</div>
                              </td>
                              <td>{medecin.email || "-"}</td>
                              <td>{medecin.telephone || "-"}</td>
                              <td>
                                <span className={`cd-badge${medecin.active === false ? " cd-badge--off" : ""}`}>
                                  {medecin.active === false ? "Suspendu" : "Actif"}
                                </span>
                              </td>
                              <td>
                                <div className="cd-actions">
                                  <button className="cd-btn cd-btn--ghost" onClick={() => handleToggleMedecin(medecin.id)} disabled={toggleMedecin.loading}>
                                    <ToggleLeft size={14} /> {medecin.active === false ? "Activer" : "Suspendre"}
                                  </button>
                                  <button className="cd-btn cd-btn--danger" onClick={() => handleRemoveMedecin(medecin.id)} disabled={removeMedecin.loading}>
                                    <Trash2 size={14} /> Retirer
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

              {activeTab === "admins" && (
                <section>
                  <div className="cd-section-head">
                    <div>
                      <h2 className="cd-section-title">Admins de clinique</h2>
                      <p className="cd-section-copy">Ajoutez les personnes qui peuvent gerer les medecins et l'espace clinique.</p>
                    </div>
                  </div>

                  <form className="cd-form" onSubmit={handleAdminSubmit}>
                    <input className="cd-input" type="text" placeholder="Nom" value={adminForm.nom} onChange={(e) => setAdminForm({ ...adminForm, nom: e.target.value })} required />
                    <input className="cd-input" type="text" placeholder="Prenom" value={adminForm.prenom} onChange={(e) => setAdminForm({ ...adminForm, prenom: e.target.value })} />
                    <input className="cd-input" type="email" placeholder="Email" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} required />
                    <input className="cd-input" type="password" placeholder="Mot de passe" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} required />
                    <input className="cd-input" type="text" placeholder="Telephone" value={adminForm.telephone} onChange={(e) => setAdminForm({ ...adminForm, telephone: e.target.value })} />
                    <button className="cd-btn" type="submit" disabled={createAdmin.loading}>
                      <UserPlus size={15} /> Creer admin
                    </button>
                  </form>

                  {createAdmin.error && <div className="cd-error">{createAdmin.error}</div>}

                  {adminsQuery.loading ? (
                    <div className="cd-loading">Chargement des admins...</div>
                  ) : adminsQuery.error ? (
                    <div className="cd-error">{adminsQuery.error}</div>
                  ) : admins.length === 0 ? (
                    <div className="cd-empty">Aucun admin de clinique pour le moment.</div>
                  ) : (
                    <div className="cd-table-wrap">
                      <table className="cd-table">
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Telephone</th>
                            <th>Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.map((admin) => (
                            <tr key={admin.id}>
                              <td>
                                <div className="cd-name">{getFullName(admin)}</div>
                                <div className="cd-muted">ID #{admin.id}</div>
                              </td>
                              <td>{admin.email || "-"}</td>
                              <td>{admin.telephone || "-"}</td>
                              <td><span className="cd-badge">{admin.role || "CLINIQUE_ADMIN"}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default CliniqueDashboard;
