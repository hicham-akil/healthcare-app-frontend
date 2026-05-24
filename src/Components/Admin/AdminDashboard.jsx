import { useMemo, useState } from "react";
import { Calendar, CheckCircle, RefreshCw, Search, Shield, Stethoscope, Trash2, UserPlus, Users } from "lucide-react";
import { useFetch, useAction } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";

const getPageItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getTotalPages = (data) => data?.totalPages ?? data?.page?.totalPages ?? 1;

const getUserName = (user) =>
  [user?.prenom, user?.nom].filter(Boolean).join(" ") || user?.name || user?.email || "Utilisateur";

const getUserRole = (user) => user?.role || user?.type || "USER";

const getUserStatus = (user) => {
  if (typeof user?.active === "boolean") return user.active;
  if (typeof user?.enabled === "boolean") return user.enabled;
  if (typeof user?.isActive === "boolean") return user.isActive;
  return true;
};

const fmtDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({ icon, label, value }) => (
  <div className="ad-stat">
    <div className="ad-stat__icon">{icon}</div>
    <div>
      <p className="ad-stat__num">{value ?? 0}</p>
      <p className="ad-stat__label">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [page, setPage] = useState(0);
  const [rdvDate, setRdvDate] = useState("");
  const [rdvStatus, setRdvStatus] = useState("");
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    nom: "",
    prenom: "",
  });

  const statsQuery = useFetch("/api/admin/stats");
  const usersQuery = useFetch(`/api/admin/users?page=${page}&size=10`);
  const medecinsQuery = useFetch("/api/admin/users?page=0&size=100");
  const rendezVousQuery = useFetch(
    `/api/admin/rendezvous?date=${encodeURIComponent(rdvDate)}&status=${encodeURIComponent(rdvStatus)}`
  );

  const deleteUser = useAction();
  const toggleMedecin = useAction();
  const createAdmin = useAction();

  const users = useMemo(() => getPageItems(usersQuery.data), [usersQuery.data]);
  const medecins = useMemo(
    () => getPageItems(medecinsQuery.data).filter((item) => getUserRole(item) === "MEDECIN"),
    [medecinsQuery.data]
  );
  const rendezVous = useMemo(() => getPageItems(rendezVousQuery.data), [rendezVousQuery.data]);
  const totalPages = Math.max(getTotalPages(usersQuery.data), 1);

  const refreshAll = () => {
    statsQuery.refetch();
    usersQuery.refetch();
    medecinsQuery.refetch();
    rendezVousQuery.refetch();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    const result = await deleteUser.execute(`/api/admin/users/${id}`, { method: "DELETE" });
    if (result !== null) {
      usersQuery.refetch();
      medecinsQuery.refetch();
      statsQuery.refetch();
    }
  };

  const handleToggleMedecin = async (id) => {
    const result = await toggleMedecin.execute(`/api/admin/medecins/${id}/toggle`, { method: "PATCH" });
    if (result !== null) {
      medecinsQuery.refetch();
      usersQuery.refetch();
    }
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    createAdmin.reset();
    const result = await createAdmin.execute("/api/auth/admin/init", {
      method: "POST",
      body: adminForm,
    });

    if (result !== null) {
      setAdminForm({ email: "", password: "", nom: "", prenom: "" });
      usersQuery.refetch();
      statsQuery.refetch();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ad-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0faf4;
          color: #064e3b;
          min-height: 100vh;
          padding: 40px 24px 72px;
        }

        .ad-shell {
          max-width: 1180px;
          margin: 0 auto;
        }

        .ad-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 18px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .ad-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          line-height: 1.08;
          margin: 0 0 8px;
          color: #064e3b;
        }

        .ad-subtitle {
          margin: 0;
          color: #4b8070;
          font-size: 14px;
        }

        .ad-user-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 999px;
          color: #065f46;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 12px 30px rgba(6, 78, 59, 0.06);
        }

        .ad-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .ad-stat {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 14px 35px rgba(6, 78, 59, 0.06);
        }

        .ad-stat__icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ad-stat__num {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          line-height: 1;
          color: #064e3b;
        }

        .ad-stat__label {
          margin: 5px 0 0;
          color: #4b8070;
          font-size: 12px;
          font-weight: 600;
        }

        .ad-panel {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 24px;
          box-shadow: 0 18px 45px rgba(6, 78, 59, 0.07);
          overflow: hidden;
        }

        .ad-tabs {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 16px;
          border-bottom: 1px solid #d1fae5;
          background: #f8fffb;
          flex-wrap: wrap;
        }

        .ad-tab-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ad-tab {
          border: 1px solid #d1fae5;
          background: #ffffff;
          color: #065f46;
          border-radius: 14px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.14s, background 0.14s, color 0.14s;
        }

        .ad-tab:hover { transform: translateY(-1px); }

        .ad-tab--active {
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #ffffff;
          border-color: transparent;
        }

        .ad-btn {
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #ffffff;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          transition: opacity 0.14s, transform 0.14s;
        }

        .ad-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .ad-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .ad-btn--ghost {
          background: #ffffff;
          color: #065f46;
          border: 1px solid #d1fae5;
        }

        .ad-btn--danger {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .ad-body {
          padding: 22px;
        }

        .ad-section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .ad-section-title {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #064e3b;
        }

        .ad-section-copy {
          margin: 4px 0 0;
          color: #4b8070;
          font-size: 13px;
        }

        .ad-table-wrap {
          border: 1px solid #d1fae5;
          border-radius: 18px;
          overflow: auto;
          background: #ffffff;
        }

        .ad-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        .ad-table th {
          background: #ecfdf5;
          color: #065f46;
          text-align: left;
          padding: 13px 16px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .ad-table td {
          padding: 14px 16px;
          border-top: 1px solid #d1fae5;
          color: #1f3d35;
          font-size: 13px;
          vertical-align: middle;
        }

        .ad-name {
          font-weight: 700;
          color: #064e3b;
        }

        .ad-muted {
          color: #6b8f85;
          font-size: 12px;
        }

        .ad-badge {
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
          white-space: nowrap;
        }

        .ad-badge--off {
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fecaca;
        }

        .ad-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .ad-filters {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .ad-input {
          border: 1px solid #d1fae5;
          border-radius: 14px;
          background: #ffffff;
          color: #064e3b;
          padding: 10px 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          min-height: 40px;
          outline: none;
        }

        .ad-input:focus {
          border-color: #047857;
          box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.12);
        }

        .ad-form {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          padding: 16px;
          border: 1px solid #d1fae5;
          border-radius: 18px;
          background: #f8fffb;
          margin-bottom: 18px;
        }

        .ad-empty,
        .ad-error,
        .ad-loading {
          border: 1px solid #d1fae5;
          border-radius: 18px;
          background: #ffffff;
          padding: 34px 18px;
          text-align: center;
          color: #4b8070;
          font-size: 14px;
        }

        .ad-error {
          color: #b91c1c;
          background: #fef2f2;
          border-color: #fecaca;
        }

        .ad-pager {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          color: #4b8070;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .ad-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .ad-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 560px) {
          .ad-root { padding: 28px 16px 56px; }
          .ad-title { font-size: 30px; }
          .ad-stats { grid-template-columns: 1fr; }
          .ad-body { padding: 16px; }
          .ad-form { grid-template-columns: 1fr; }
          .ad-btn { width: 100%; }
          .ad-filters { width: 100%; }
          .ad-input { width: 100%; }
        }
      `}</style>

      <main className="ad-root">
        <div className="ad-shell">
          <header className="ad-header">
            <div>
              <h1 className="ad-title">Admin healthMax</h1>
              <p className="ad-subtitle">Gestion des utilisateurs, rendez-vous et médecins.</p>
            </div>
            <span className="ad-user-pill">
              <Shield size={16} />
              {getUserName(user)}
            </span>
          </header>

          {statsQuery.error ? (
            <div className="ad-error">{statsQuery.error}</div>
          ) : (
            <section className="ad-stats">
              <StatCard icon={<Users size={20} />} label="Patients" value={statsQuery.data?.totalPatients} />
              <StatCard icon={<Stethoscope size={20} />} label="Médecins" value={statsQuery.data?.totalMedecins} />
              <StatCard icon={<Calendar size={20} />} label="RDV aujourd'hui" value={statsQuery.data?.totalRendezVousToday} />
              <StatCard icon={<CheckCircle size={20} />} label="RDV ce mois" value={statsQuery.data?.totalRendezVousThisMonth} />
            </section>
          )}

          <section className="ad-panel">
            <div className="ad-tabs">
              <div className="ad-tab-list">
                <button className={`ad-tab${activeTab === "users" ? " ad-tab--active" : ""}`} onClick={() => setActiveTab("users")}>
                  <Users size={16} /> Users
                </button>
                <button className={`ad-tab${activeTab === "rendezvous" ? " ad-tab--active" : ""}`} onClick={() => setActiveTab("rendezvous")}>
                  <Calendar size={16} /> Rendez-vous
                </button>
                <button className={`ad-tab${activeTab === "medecins" ? " ad-tab--active" : ""}`} onClick={() => setActiveTab("medecins")}>
                  <Stethoscope size={16} /> Médecins
                </button>
              </div>

              <button className="ad-btn ad-btn--ghost" onClick={refreshAll}>
                <RefreshCw size={15} /> Actualiser
              </button>
            </div>

            <div className="ad-body">
              {activeTab === "users" && (
                <section>
                  <div className="ad-section-head">
                    <div>
                      <h2 className="ad-section-title">Utilisateurs</h2>
                      <p className="ad-section-copy">Liste paginée des comptes healthMax.</p>
                    </div>
                  </div>

                  <form className="ad-form" onSubmit={handleCreateAdmin}>
                    <input className="ad-input" type="text" placeholder="Prénom" value={adminForm.prenom} onChange={(e) => setAdminForm({ ...adminForm, prenom: e.target.value })} required />
                    <input className="ad-input" type="text" placeholder="Nom" value={adminForm.nom} onChange={(e) => setAdminForm({ ...adminForm, nom: e.target.value })} required />
                    <input className="ad-input" type="email" placeholder="Email admin" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} required />
                    <input className="ad-input" type="password" placeholder="Mot de passe" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} required />
                    <button className="ad-btn" type="submit" disabled={createAdmin.loading}>
                      <UserPlus size={15} /> Créer admin
                    </button>
                  </form>

                  {createAdmin.error && <div className="ad-error">{createAdmin.error}</div>}

                  {usersQuery.loading ? (
                    <div className="ad-loading">Chargement des utilisateurs...</div>
                  ) : usersQuery.error ? (
                    <div className="ad-error">{usersQuery.error}</div>
                  ) : users.length === 0 ? (
                    <div className="ad-empty">Aucun utilisateur trouvé.</div>
                  ) : (
                    <>
                      <div className="ad-table-wrap">
                        <table className="ad-table">
                          <thead>
                            <tr>
                              <th>Nom</th>
                              <th>Email</th>
                              <th>Rôle</th>
                              <th>Statut</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <div className="ad-name">{getUserName(item)}</div>
                                  <div className="ad-muted">ID #{item.id}</div>
                                </td>
                                <td>{item.email || "-"}</td>
                                <td><span className="ad-badge">{getUserRole(item)}</span></td>
                                <td>
                                  <span className={`ad-badge${getUserStatus(item) ? "" : " ad-badge--off"}`}>
                                    {getUserStatus(item) ? "Actif" : "Inactif"}
                                  </span>
                                </td>
                                <td>
                                  <button className="ad-btn ad-btn--danger" onClick={() => handleDeleteUser(item.id)} disabled={deleteUser.loading}>
                                    <Trash2 size={14} /> Supprimer
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="ad-pager">
                        <button className="ad-btn ad-btn--ghost" disabled={page === 0} onClick={() => setPage((value) => Math.max(value - 1, 0))}>Précédent</button>
                        <span>Page {page + 1} / {totalPages}</span>
                        <button className="ad-btn ad-btn--ghost" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)}>Suivant</button>
                      </div>
                    </>
                  )}
                </section>
              )}

              {activeTab === "rendezvous" && (
                <section>
                  <div className="ad-section-head">
                    <div>
                      <h2 className="ad-section-title">Rendez-vous</h2>
                      <p className="ad-section-copy">Filtrez les rendez-vous par date et statut.</p>
                    </div>
                    <div className="ad-filters">
                      <input className="ad-input" type="date" value={rdvDate} onChange={(e) => setRdvDate(e.target.value)} />
                      <select className="ad-input" value={rdvStatus} onChange={(e) => setRdvStatus(e.target.value)}>
                        <option value="">Tous les statuts</option>
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="ON_HOLD">En pause</option>
                        <option value="COMPLETED">Terminés</option>
                        <option value="ANNULE">Annulés</option>
                      </select>
                    </div>
                  </div>

                  {rendezVousQuery.loading ? (
                    <div className="ad-loading">Chargement des rendez-vous...</div>
                  ) : rendezVousQuery.error ? (
                    <div className="ad-error">{rendezVousQuery.error}</div>
                  ) : rendezVous.length === 0 ? (
                    <div className="ad-empty">Aucun rendez-vous trouvé.</div>
                  ) : (
                    <div className="ad-table-wrap">
                      <table className="ad-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Médecin</th>
                            <th>Spécialité</th>
                            <th>Statut</th>
                            <th>File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rendezVous.map((rdv) => (
                            <tr key={rdv.id}>
                              <td>{fmtDate(rdv.rendezvousdate || rdv.date)}</td>
                              <td>{rdv.patientNom || rdv.patientnom || rdv.patientName || "-"}</td>
                              <td>{rdv.medecinNom || rdv.medecinnom || rdv.medecinName || "-"}</td>
                              <td>{rdv.specialite || "-"}</td>
                              <td><span className="ad-badge">{rdv.status || "-"}</span></td>
                              <td>{rdv.queueNumber ? `#${rdv.queueNumber}` : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

              {activeTab === "medecins" && (
                <section>
                  <div className="ad-section-head">
                    <div>
                      <h2 className="ad-section-title">Médecins</h2>
                      <p className="ad-section-copy">Activation et suspension des comptes médecins.</p>
                    </div>
                  </div>

                  {medecinsQuery.loading ? (
                    <div className="ad-loading">Chargement des médecins...</div>
                  ) : medecinsQuery.error ? (
                    <div className="ad-error">{medecinsQuery.error}</div>
                  ) : medecins.length === 0 ? (
                    <div className="ad-empty">Aucun médecin trouvé.</div>
                  ) : (
                    <div className="ad-table-wrap">
                      <table className="ad-table">
                        <thead>
                          <tr>
                            <th>Médecin</th>
                            <th>Email</th>
                            <th>Spécialité</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medecins.map((medecin) => (
                            <tr key={medecin.id}>
                              <td>
                                <div className="ad-name">{getUserName(medecin)}</div>
                                <div className="ad-muted">ID #{medecin.id}</div>
                              </td>
                              <td>{medecin.email || "-"}</td>
                              <td>{medecin.specialite || medecin.speciality || "-"}</td>
                              <td>
                                <span className={`ad-badge${getUserStatus(medecin) ? "" : " ad-badge--off"}`}>
                                  {getUserStatus(medecin) ? "Actif" : "Suspendu"}
                                </span>
                              </td>
                              <td>
                                <button className="ad-btn" onClick={() => handleToggleMedecin(medecin.id)} disabled={toggleMedecin.loading}>
                                  <Search size={14} /> {getUserStatus(medecin) ? "Désactiver" : "Activer"}
                                </button>
                              </td>
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

export default AdminDashboard;
