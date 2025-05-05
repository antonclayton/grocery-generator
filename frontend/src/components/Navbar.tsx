import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      logout(); // clear context
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="navbar bg-base-100 shadow-sm h-16">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Grocery List Generator
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <details>
              <summary>Pages</summary>
              <ul className="bg-base-100 rounded-t-none p-2">
                <li>
                  <Link to="recipes">Recipes</Link>
                </li>
                <li>
                  <Link to="/list">Grocery List</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            {isAuthenticated ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <button onClick={handleLogin}>Login</button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
