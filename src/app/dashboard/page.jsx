"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch leads");
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setLeads(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching leads:", err);
        setError("Failed to load data.");
        setLeads([]);
      });
  }, []);

  // Function to format date and time
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString(); // Format: MM/DD/YYYY
  };

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Function to download Excel file
  const downloadExcel = () => {
    if (!leads || leads.length === 0) {
      alert("No data to export.");
      return;
    }

    const formattedData = leads.map((lead, index) => ({
      ID: index + 1, // Sequential ID
      Name: lead.name,
      Phone: lead.mobile,
      Email: lead.email,
      Model: lead.model,
      Date: formatDate(lead.createdAt),
      Time: formatTime(lead.createdAt),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads Data");

    XLSX.writeFile(wb, "leads_data.xlsx");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden border-r bg-black text-white md:flex flex-col p-4">
        <h1 className="text-lg font-bold">BHARATH HYUNDAI</h1>
        <nav className="mt-6">
          <Link href="#" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800">
            <Home className="h-5 w-5" />
            All Data
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col p-6">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Generals</h2>
            {/* ✅ Download Button Next to "Generals" */}
            <button
              onClick={downloadExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Download className="h-5 w-5" />
              Download Data
            </button>
          </div>
          <input type="text" placeholder="Search" className="p-2 border rounded-md" />
        </header>

        {/* Table */}
        <div className="mt-4 bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Model</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {/* Loading State */}
              {error ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-red-500">{error}</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center">No data available</td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <tr key={index} className="border-b hover:bg-gray-200">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.mobile}</td>
                    <td className="p-3">{lead.email}</td>
                    <td className="p-3">{lead.model}</td>
                    <td className="p-3">{formatDate(lead.createdAt)}</td>
                    <td className="p-3">{formatTime(lead.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
