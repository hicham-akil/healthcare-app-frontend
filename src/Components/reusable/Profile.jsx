import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
const [data, setData] = useState({
  name: "",
  prenom: "",
  email: "",
  phone: "",
  date_naissance: "",
  role: "",
  profileImageUrl: "", 
});


  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await response.json();
setData({
  name: userData.nom,
  prenom: userData.prenom,
  email: userData.email,
  phone: userData.telephone,
  date_naissance: userData.dateNaissance,
  role: userData.role,
  profileImageUrl: userData.profileImageUrl || "", // <-- fixed
});

      console.log("Fetched profile data:", userData);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user_id]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <Card className="max-w-md w-full">
        {data && (
          <CardContent className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
           {data.profileImageUrl ? (
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

            <h2 className="text-2xl font-bold">{data.name} {data.prenom}</h2>
            <p className="text-gray-500 mb-4">{data.email}</p>

            <div className="flex flex-col gap-2 mb-4 text-gray-700">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" /> 
                <span>{data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" /> 
                <span>{data.phone}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => alert("Edit Profile clicked")}>Edit Profile</Button>
              <Button onClick={() => alert("Log Out clicked")}>Log Out</Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
