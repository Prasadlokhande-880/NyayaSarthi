import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  className?: string;
}
const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Tour", path: "#" },
    { name: "About", path: "#" },
    { name: "Support", path: "#" },
    { name: "AI", path: "#" },
  ];

  return (
    <header className={`w-full shadow-sm sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex gap-2 items-center text-xl font-bold text-indigo-900">
              <img src='/assets/images/auth/logo.png' alt="logo" className="h-10 w-10 rounded-sm" />
              <span>NyayaSarthi</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-indigo-900 hover:text-indigo-600"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full px-4 py-1 text-sm border border-indigo-600 text-indigo-900 hover:bg-indigo-100"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/sign-up")}
              className="rounded-full px-4 py-1 text-sm border border-indigo-600 text-indigo-900 hover:bg-indigo-100"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-2xl text-indigo-900"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden shadow-md px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="block text-sm font-medium text-indigo-900 hover:text-indigo-600"
            >
              {link.name}
            </a>
          ))}

          <hr className="my-2 border-gray-300" />
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-full py-1 border border-indigo-600 text-indigo-900 hover:bg-indigo-100"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/sign-up")}
            className="w-full rounded-full py-1 border border-indigo-600 text-indigo-900 hover:bg-indigo-100"
          >
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
