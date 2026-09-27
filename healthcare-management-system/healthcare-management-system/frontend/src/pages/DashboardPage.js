import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <main className="page-content">
        <h2>Welcome{user ? `, ${user.first_name || user.username}` : ""}</h2>
        <p>Role: {user?.role || "..."}</p>
        <div className="dashboard-grid">
          <a href="/patients" className="dashboard-card">Patients</a>
          <a href="/appointments" className="dashboard-card">Appointments</a>
          <a href="/prescriptions" className="dashboard-card">Prescriptions</a>
          <a href="/reports" className="dashboard-card">Medical Reports</a>
        </div>
      </main>
    </div>
  );
}
