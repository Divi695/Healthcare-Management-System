import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, cancelAppointment } from "../features/appointments/appointmentsSlice";
import Navbar from "../components/Navbar";

export default function AppointmentsPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <main className="page-content">
        <h2>Appointments</h2>
        {status === "loading" && <p>Loading...</p>}
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Start</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.patient_name}</td>
                <td>{a.doctor_name}</td>
                <td>{new Date(a.scheduled_start).toLocaleString()}</td>
                <td>{a.status}</td>
                <td>
                  {a.status !== "cancelled" && (
                    <button onClick={() => dispatch(cancelAppointment(a.id))}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
