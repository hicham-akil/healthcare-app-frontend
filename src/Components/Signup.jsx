import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    role: "", 
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (!formData[key]) {
        setMessage(`Please fill the ${key} field`);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message || "Account created successfully!");
    } catch (error) {
      setMessage("Server error: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Role selection */}
      <h2 className="text-xl font-bold mb-4 text-center">Who are you?</h2>
      <div className="flex justify-center gap-6 mb-6">
        <div
          onClick={() => handleRoleSelect("MEDECIN")}
          className={`cursor-pointer p-4 rounded-lg border-2 ${
            formData.role === "MEDECIN" ? "border-blue-600" : "border-gray-300"
          } hover:border-blue-600 transition text-center`}
        >
          <img
            src="/images/doctor.png" // replace with your doctor image
            alt="Doctor"
            className="w-20 h-20 mx-auto mb-2"
          />
          <p className="font-medium">Doctor</p>
        </div>

        {/* Patient */}
        <div
          onClick={() => handleRoleSelect("PATIENT")}
          className={`cursor-pointer p-4 rounded-lg border-2 ${
            formData.role === "PATIENT" ? "border-blue-600" : "border-gray-300"
          } hover:border-blue-600 transition text-center`}
        >
          <img
            src="/images/patient.png" // replace with your patient image
            alt="Patient"
            className="w-20 h-20 mx-auto mb-2"
          />
          <p className="font-medium">Patient</p>
        </div>
      </div>

      {/* Signup form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700"
        >
          Create Account
        </button>

        {message && <p className="mt-2 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
}
