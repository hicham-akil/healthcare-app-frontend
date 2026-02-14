import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";

const ShowMedecin = () => {
  const [specialites, setSpecialites] = useState([]);
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSpecialites = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/specialites", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
      });
   
        if(!response.ok) {
            throw new Error("Failed to load specialities");
        } 
       const data = await response.json();
console.log("Specialities data:", data);
setSpecialites(data);

        setSpecialites(data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchSpecialites();
  }, []);

  const fetchMedecins = async (specialiteId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/medecins/specialite/${specialiteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load doctors");
       const data = await res.json();
      setMedecins(data);
      console.log("Doctors data:", data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedSpecialite(value);

    if (value) {
      fetchMedecins(value);
    } else {
      setMedecins([]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Find a Doctor by Speciality
      </h2>

      {/* Speciality select */}
      <select
        value={selectedSpecialite}
        onChange={handleChange}
        className="w-full border rounded-md p-2 mb-6"
      >
        <option value="">-- Select Speciality --</option>
        {specialites.map((s) => (
         <option key={s.id} value={s.id}>
         {s.nomspecialite}
        </option>
   
        ))}
      </select>

      {/* Doctors list */}
      {loading && <p>Loading doctors...</p>}

      {!loading && medecins.length === 0 && selectedSpecialite && (
        <p className="text-gray-500">No doctors found.</p>
      )}

      <div className="space-y-4">
        {medecins.map((m) => (
          <div
            key={m.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                Dr. {m.nom} {m.prenom}
              </p>
              <p className="text-sm text-gray-600">{m.email}</p>
              <p className="text-sm text-gray-600">{m.telephone}</p>
            </div>
            <button onClick={() => navigate(`/Takeapointement/${m.id}`)}className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowMedecin;
