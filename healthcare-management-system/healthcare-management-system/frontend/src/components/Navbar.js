import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/">HMS</Link>
      <div className="nav-links">
        <Link to="/patients">Patients</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/prescriptions">Prescriptions</Link>
        <Link to="/reports">Reports</Link>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
