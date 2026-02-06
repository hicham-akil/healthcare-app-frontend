import { useState } from "react";
export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [message, setMessage] = useState("");
  const [typemessage, settypeMessage] = useState("");
  const handleSubmit = async (e) => {
    try{

    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user_id", data.id);
    localStorage.setItem("role", data.role);
    setMessage("Login successful!");
    settypeMessage("success");
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
    } catch(error){
      setMessage("Login failed. Please try again.");
      settypeMessage("error");
      return;
    }
}
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={handleChange}
          name="email"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
           value={formData.password}
          onChange={handleChange}
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700"
      >
        Sign In
      </button>
      {message && <p className={`text-center text-sm ${typemessage === "success" ? "text-green-500" : "text-red-500"}`}>{message}</p>}
    </form>
  );
}
