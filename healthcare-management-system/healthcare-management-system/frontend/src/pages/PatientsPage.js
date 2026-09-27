import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../features/patients/patientsSlice";
import Navbar from "../components/Navbar";

export default function PatientsPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <main className="page-content">
        <h2>Patients</h2>
        {status === "loading" && <p>Loading...</p>}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood Group</th>
              <th>Primary Doctor</th>
              <th>Allergies</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.full_name}</td>
                <td>{p.blood_group || "—"}</td>
                <td>{p.primary_doctor || "Unassigned"}</td>
                <td>{p.allergies || "None reported"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
