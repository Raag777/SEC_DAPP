import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Producers", path: "/producers" },
    { name: "Companies", path: "/companies" },
    { name: "Admin Panel", path: "/admin" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          🔆 SEC DApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium hover:text-blue-600 transition ${
                location.pathname === link.path
                  ? "text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 pb-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block py-2 text-lg ${
                location.pathname === link.path
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
