import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../utils/api.js";

export default function Profile() {
  const navigate = useNavigate();
const [data, setData] = useState({
  name: "",
  prenom: "",
  email: "",
  telephone: "",
  date_naissance: "",
  role: "",
  profileImageUrl: "", 
});


  const user_id = localStorage.getItem("user_id");
 

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
         credentials: "include",

      });
      const userData = await response.json();
setData({
  name: userData.nom,
  prenom: userData.prenom,
  email: userData.email,
  telephone: userData.telephone,
  date_naissance: userData.dateNaissance,
  role: userData.role,
  profileImageUrl: userData.profileImageUrl || "", 
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
                <span>{data.telephone}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate("/edit-profile",{state: {user_data:data}})}>Edit Profile</Button>
              <Button onClick={logout}>Log Out</Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
