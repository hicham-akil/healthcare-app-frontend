import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const role = localStorage.getItem("role");
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          
          <div className="text-xl font-bold text-blue-600">
            healthMax
          </div>

          <div className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Services
            </a>
            <a href="/auth" className="text-gray-700 hover:text-blue-600">
              Auth
            </a>
            <a href="/myapoin" className="text-gray-700 hover:text-blue-600">
              My Appointments
            </a>
            {
              role === "PATIENT" && (
            <a href="/ShowMed" className="text-gray-700 hover:text-blue-600">
              Show Doctors
            </a>
              )}
            <a href="/profile" className="text-gray-700 hover:text-blue-600">
              profile
            </a>
            {role === "MEDECIN" && (
            <a href="/workinghours" className="text-gray-700 hover:text-blue-600">
              Working Hours
            </a>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Home
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            About
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Services
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
