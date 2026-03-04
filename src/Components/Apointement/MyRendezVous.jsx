import React, { useEffect, useState } from "react";

const MyRendezVous = () => {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const patientId = localStorage.getItem("user_id"); // patient ID

  useEffect(() => {
    if (!patientId) {
      setError("Patient non connecté");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/rendezvous/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => {
        setRendezVous(data);
        console.log("Rendez-vous chargés:", data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mes Rendez-vous</h2>

      {rendezVous.length === 0 ? (
        <p>Aucun rendez-vous trouvé</p>
      ) : (
        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Médecin</th>
              <th>Spécialité</th>
              <th>Statut</th>
            </tr>
          </thead>
            <tbody>
  {rendezVous.map((rdv) => (
    <tr key={rdv.id}>
      <td>{new Date(rdv.dateHeureDebut).toLocaleDateString()}</td>
      <td>
        {new Date(rdv.dateHeureDebut).toLocaleTimeString()} -{" "}
        {new Date(rdv.dateHeureFin).toLocaleTimeString()}
      </td>
      <td>{rdv.medecinNom}</td> 
      <td>{rdv.specialite}</td> 
      <td>{rdv.status}</td>
    </tr>
  ))}
</tbody>
        </table>
      )}
    </div>
  );
};

export default MyRendezVous;