import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescriptions } from "../features/prescriptions/prescriptionsSlice";
import Navbar from "../components/Navbar";

export default function PrescriptionsPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.prescriptions);

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <main className="page-content">
        <h2>Prescriptions</h2>
        {status === "loading" && <p>Loading...</p>}
        {items.map((rx) => (
          <div key={rx.id} className="card">
            <h3>{rx.diagnosis} — {rx.patient_name}</h3>
            <p>Prescribed by Dr. {rx.doctor_name} on {new Date(rx.issued_at).toLocaleDateString()}</p>
            <ul>
              {rx.medications?.map((m) => (
                <li key={m.id}>{m.name} — {m.dosage}, {m.frequency} for {m.duration_days} days</li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
}
