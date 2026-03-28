import { useEffect, useState, useMemo } from "react"; // Added useMemo for performance

import { useNavigate } from "react-router-dom";

import { Search, Phone, Mail, ArrowRight, User, LayoutGrid, List } from "lucide-react";

import BASE_URL from "../utils/api.js";



const ShowMedecin = () => {

  const [specialites, setSpecialites] = useState([]);

  const [selectedSpecialite, setSelectedSpecialite] = useState("");

  const [selectedSpecialiteLabel, setSelectedSpecialiteLabel] = useState("");

  const [searchTerm, setSearchTerm] = useState(""); // 1. Added state for search input

  const [message, setmessage] = useState("");

  const [medecins, setMedecins] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();



  useEffect(() => {

    const fetchSpecialites = async () => {

      try {

        const response = await fetch(`${BASE_URL}/api/specialites`, {

          method: "GET",

          headers: { "Content-Type": "application/json" },

          credentials: "include",

        });

        const data = await response.json();

        setSpecialites(data);

      } catch (err) {

        alert(err.message);

      }

    };

    fetchSpecialites();

  }, []);



  const fetchMedecins = async (id) => {

    setLoading(true);

    try {

      const res = await fetch(`${BASE_URL}/api/medecins/specialite/${id}`, {

        credentials: "include",

      });

      const data = await res.json();

      if (data.length === 0) {

        setmessage("Aucun médecin trouvé pour cette spécialité");

        setMedecins([]);

      } else {

        setmessage("");

        setMedecins(data);

      }

    } catch (err) {

      setmessage("Erreur lors du chargement des médecins");

    } finally {

      setLoading(false);

    }

  };



  // 2. Filter logic: This filters the doctors list based on the name typed

  const filteredMedecins = useMemo(() => {

    return medecins.filter((m) => {

      const fullName = `${m.nom} ${m.prenom}`.toLowerCase();

      return fullName.includes(searchTerm.toLowerCase());

    });

  }, [medecins, searchTerm]);



  const handleChange = (e) => {

    const value = e.target.value;

    const label = e.target.options[e.target.selectedIndex].text;

    setSelectedSpecialite(value);

    setSelectedSpecialiteLabel(label);



    if (value) fetchMedecins(value);

    else {

        setMedecins([]);

        setmessage("");

    }

  };



  return (

    <>

      <style>{`

        /* ... keeping your existing CSS ... */

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .page { background: #f8faf9; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 50px; }

        .container { max-width: 1100px; margin: auto; padding: 20px; }

        .hero { background: #064232; border-radius: 40px; padding: 60px 50px; color: white; margin-top: 20px; margin-bottom: 40px; position: relative; overflow: hidden; }

        .hero h1 { font-size: 42px; font-weight: 500; margin-bottom: 15px; letter-spacing: -0.5px; }

        .hero p { font-size: 16px; opacity: 0.7; max-width: 450px; line-height: 1.5; margin-bottom: 35px; }

        .search-container { display: flex; gap: 12px; max-width: 600px; }

        .input-group { position: relative; flex: 1; }

        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #888; }

        .search-input, .select-input { width: 100%; padding: 16px 16px 16px 45px; border-radius: 12px; border: none; font-size: 14px; background: #e9eeeb; color: #333; outline: none; }

        .select-input { padding-left: 45px; appearance: none; cursor: pointer; }

        .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding: 0 5px; }

        .results-header h2 { font-size: 22px; color: #1a1a1a; font-weight: 500; }

        .view-options { display: flex; gap: 10px; }

        .view-btn { padding: 8px; border-radius: 8px; border: 1px solid #eee; background: white; color: #666; cursor: pointer; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }

        .card { background: white; border-radius: 24px; padding: 24px; border: 1px solid #f0f0f0; position: relative; transition: all 0.3s ease; }

        .card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.04); }

        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }

        .avatar-wrapper { position: relative; }

        .avatar { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; }

        .status-dot { width: 12px; height: 12px; background: #4ade80; border: 2px solid white; border-radius: 50%; position: absolute; bottom: 5px; right: 2px; }

        .specialty-tag { background: #dcfce7; color: #166534; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }

        .card-body { margin-bottom: 25px; }

        .dr-name { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }

        .contact-info { display: flex; flex-direction: column; gap: 6px; }

        .info-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #666; }

        .book-btn { width: 100%; background: #064232; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 500; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.2s; }

        .book-btn:hover { background: #085a44; }

        .help-card { background: #f0f7f4; border: 2px dashed #d1e2da; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 30px; }

        .help-icon { background: white; padding: 12px; border-radius: 12px; margin-bottom: 15px; color: #064232; }

      `}</style>



      <div className="page">

        <div className="container">

          <div className="hero">

            <h1>Trouvez votre expert de santé.</h1>

            <p>Accédez à un réseau de praticiens sélectionnés pour leur excellence.</p>



            <div className="search-container">

              <div className="input-group">

                <Search className="search-icon" size={18} />

                <input

                  type="text"

                  placeholder="Nom du médecin..."

                  className="search-input"

                  value={searchTerm}

                  onChange={(e) => setSearchTerm(e.target.value)} // 3. Binding input to state

                />

              </div>



              <div className="input-group">

                <LayoutGrid className="search-icon" size={18} />

                <select

                  value={selectedSpecialite}

                  onChange={handleChange}

                  className="select-input"

                >

                  <option value="">Toutes les spécialités</option>

                  {specialites.map((s) => (

                    <option key={s.id} value={s.id}>{s.nomspecialite}</option>

                  ))}

                </select>

              </div>

            </div>

          </div>



          <div className="results-header">

            <h2>Praticiens disponibles aujourd'hui</h2>

            <div className="view-options">

              <button className="view-btn"><LayoutGrid size={18} /></button>

              <button className="view-btn"><List size={18} /></button>

            </div>

          </div>



          {loading && <p style={{textAlign: 'center', padding: '20px'}}>Chargement...</p>}

          {message && !loading && <p style={{textAlign: 'center', color: '#666'}}>{message}</p>}



          <div className="grid">

            {/* 4. Mapping over filteredMedecins instead of medecins */}

            {filteredMedecins.map((m) => (

              <div key={m.id} className="card">

                <div className="card-header">

                  <div className="avatar-wrapper">

                    <div className="avatar" style={{background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                      <User size={30} color="#999" />

                    </div>

                    <div className="status-dot"></div>

                  </div>

                  <span className="specialty-tag">{selectedSpecialiteLabel || "Spécialiste"}</span>

                </div>



                <div className="card-body">

                  <div className="dr-name">Dr. {m.nom} {m.prenom}</div>

                  <div className="contact-info">

                    <div className="info-item"><Mail size={14} /> {m.email}</div>

                    <div className="info-item"><Phone size={14} /> {m.telephone}</div>

                  </div>

                </div>



                <button className="book-btn" onClick={() => navigate(`/Takeapointement/${m.id}`, { state: { specialiteId: selectedSpecialite, specialite: selectedSpecialiteLabel } })}>

                  Prendre rendez-vous <ArrowRight size={18} />

                </button>

              </div>

            ))}



            <div className="card help-card">

               <div className="help-icon"><Search size={24} /></div>

               <h3 style={{fontSize: '18px', marginBottom: '10px'}}>Besoin d'aide ?</h3>

               <p style={{fontSize: '13px', color: '#666', marginBottom: '20px'}}>Notre équipe vous aide à trouver le praticien adapté.</p>

               <a href="#" style={{color: '#064232', fontWeight: '600', fontSize: '14px', textDecoration: 'underline'}}>Contacter le support</a>

            </div>

          </div>

        </div>

      </div>

    </>

  );

};



export default ShowMedecin;