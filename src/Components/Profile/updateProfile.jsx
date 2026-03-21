import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { logout } from "../../utils/logout";
import { useLocation } from "react-router-dom";
import BASE_URL from "../../utils/api.js";

export default function EditProfileForm() {
  const location = useLocation();
  const userData = location.state?.user_data;
  console.log("Received user data in EditProfileForm:", userData);
  
  const [data, setData] = useState({
    name: "",
    prenom: "",
    email: "",
    telephone: "",
    date_naissance: "",
    profileImageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState("success");

  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setData(userData);
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
      formData.append("data", jsonBlob);

      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(`${BASE_URL}/api/users/${user_id}`, {
        method: "PUT", 
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Profile updated successfully!");
        setTypeMessage("success");
        // Removed fetchProfileData() - data is already in state
      } else {
        setMessage(result.error || "Update failed");
        setTypeMessage("error");
      }
    } catch (error) {
      setMessage("Server error: " + error.message);
      setTypeMessage("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

          {message && (
            <div
              className={`mb-4 px-4 py-2 rounded ${
                typeMessage === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : data.profileImageUrl ? (
                  <img
                    src={data.profileImageUrl}
                    alt={`${data.name} ${data.prenom}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                    <span className="text-white font-bold">No Image</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <input
              type="text"
              placeholder="First Name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={data.prenom}
              onChange={(e) => setData({ ...data, prenom: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="telephone"
              value={data.telephone}
              onChange={(e) => setData({ ...data, telephone: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={data.date_naissance}
              onChange={(e) => setData({ ...data, date_naissance: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-4 justify-center">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
              <Button type="button" onClick={logout}>
                Log Out
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}