import { useEffect, useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    password: "",
    role: "",
    dateNaissance: "",
    specialites: [], 
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [typemessage, setTypeMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [specdata, setSpecdata] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    setMessage("");
  };

  const handleSpecialityToggle = (specId) => {
    const numericId = Number(specId);
    const currentSpecialites = [...formData.specialites];
    
    if (currentSpecialites.includes(numericId)) {
      // Remove if already selected
      setFormData({ 
        ...formData, 
        specialites: currentSpecialites.filter(id => id !== numericId) 
      });
    } else {
      // Add if not selected
      setFormData({ 
        ...formData, 
        specialites: [...currentSpecialites, numericId] 
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file");
      setTypeMessage("error");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB");
      setTypeMessage("error");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setMessage("");

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById("imageInput");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const requiredFields = ["nom", "prenom", "email", "telephone", "password", "role"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setMessage(`Please fill the ${field} field`);
        setTypeMessage("error");
        return;
      }
    }

    if (formData.role === "PATIENT" && !formData.dateNaissance) {
      setMessage("Please fill the date of birth");
      setTypeMessage("error");
      return;
    }

    // Add validation for specialities
    if (formData.role === "MEDECIN" && formData.specialites.length === 0) {
      setMessage("Please select at least one speciality");
      setTypeMessage("error");
      return;
    }

    setLoading(true);

    try {
      const formToSend = new FormData();

      const jsonBlob = new Blob([JSON.stringify(formData)], { type: "application/json" });
      formToSend.append("data", jsonBlob);

      if (imageFile) formToSend.append("image", imageFile);

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: formToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Account created successfully!");
        setTypeMessage("success");

        setTimeout(() => {
          window.location.href = "/signin";
        }, 1500);
      } else {
        setMessage(data.error || "Registration failed");
        setTypeMessage("error");
      }
    } catch (error) {
      setTypeMessage("error");
      setMessage("Server error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialities = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/specialites", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setSpecdata(data);
    } catch (error) {
      console.error("Error fetching specialities:", error);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us today</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Who are you?</h3>
          <div className="flex justify-center gap-6">
            <div
              onClick={() => handleRoleSelect("MEDECIN")}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                formData.role === "MEDECIN"
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
              }`}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">Doctor</p>
              </div>
            </div>

            <div
              onClick={() => handleRoleSelect("PATIENT")}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                formData.role === "PATIENT"
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
              }`}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">Patient</p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              typemessage === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <p className="text-sm font-medium text-center">{message}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image</label>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            {imagePreview && (
              <div className="mt-4 text-center">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-200" />
                <button type="button" onClick={removeImage} disabled={loading} className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50">
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <input type="text" name="nom" placeholder="Nom *" value={formData.nom} onChange={handleChange} disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

          <input type="text" name="prenom" placeholder="Prénom *" value={formData.prenom} onChange={handleChange} disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

          <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

          <input type="tel" name="telephone" placeholder="Téléphone *" value={formData.telephone} onChange={handleChange} disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

          <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

          {formData.role === "PATIENT" && (
            <input type="date" name="dateNaissance" placeholder="Date de naissance" value={formData.dateNaissance} onChange={handleChange} disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
          )}

          {formData.role === "MEDECIN" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialities *
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                {specdata.map((spec) => (
                  <div key={spec.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`spec-${spec.id}`}
                      checked={formData.specialites.includes(spec.id)}
                      onChange={() => handleSpecialityToggle(spec.id)}
                      disabled={loading}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`spec-${spec.id}`}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {spec.nomspecialite}
                    </label>
                  </div>
                ))}
              </div>
              {formData.specialites.length > 0 && (
                <p className="mt-2 text-sm text-green-600">
                  {formData.specialites.length} specialit{formData.specialites.length > 1 ? 'ies' : 'y'} selected
                </p>
              )}
            </div>
          )}

          <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/signin" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</a>
        </p>
      </div>
    </div>
  );
}