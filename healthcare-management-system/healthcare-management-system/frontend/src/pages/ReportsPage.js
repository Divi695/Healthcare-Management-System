import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports, uploadReport } from "../features/reports/reportsSlice";
import Navbar from "../components/Navbar";

export default function ReportsPage() {
  const dispatch = useDispatch();
  const { items, status, uploadStatus } = useSelector((state) => state.reports);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file || !patientId) return;
    dispatch(uploadReport({ patient: patientId, title, report_type: "other", file }));
  };

  return (
    <div>
      <Navbar />
      <main className="page-content">
        <h2>Medical Reports</h2>

        <form onSubmit={handleUpload} className="upload-form">
          <input placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
          <input placeholder="Report title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          <button type="submit" disabled={uploadStatus === "loading"}>
            {uploadStatus === "loading" ? "Uploading..." : "Upload securely"}
          </button>
        </form>

        {status === "loading" && <p>Loading...</p>}
        <ul>
          {items.map((r) => (
            <li key={r.id}>
              {r.title} ({r.report_type}) — uploaded by {r.uploaded_by_name}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
