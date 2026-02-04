import { Calendar, User, Stethoscope, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "../Components/reusable/Navbar";

export default function HomePage() {
  return (
    <>
    <div className="min-h-screen bg-gray-50 p-6">
      <section className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Plateforme de Rendez-vous Médicaux
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Prenez rendez-vous avec des médecins qualifiés rapidement et en toute sécurité.
        </p>
        <div className="flex justify-center gap-4">
          <Button className="px-6">Prendre un rendez-vous</Button>
          <Button variant="outline" className="px-6">Voir les médecins</Button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 text-center">
            <User className="mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Patients</h3>
            <p className="text-sm text-gray-600">Gérez votre profil et vos rendez-vous facilement.</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 text-center">
            <Stethoscope className="mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Médecins</h3>
            <p className="text-sm text-gray-600">Consultez des professionnels certifiés.</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 text-center">
            <Calendar className="mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Rendez-vous</h3>
            <p className="text-sm text-gray-600">Planification simple et rapide.</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 text-center">
            <Clock className="mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Disponibilité</h3>
            <p className="text-sm text-gray-600">Horaires mis à jour en temps réel.</p>
          </CardContent>
        </Card>
      </section>
    </div>
    </>
  );
}
