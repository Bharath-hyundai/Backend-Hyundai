"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export default function Dashboard() {
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        if (Array.isArray(data)) {
          setLeads(data);
        } else {
          setLeads([]);
        }
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
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString(); // Format: MM/DD/YYYY
  };

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    const dateObj = new Date(isoString);
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); // Format: HH:MM AM/PM
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden border-r bg-black text-white md:flex flex-col p-4">
        <h1 className="text-lg font-bold">BHARATH HYUNDAI</h1>
        <nav className="mt-6">
          <Link href="#" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800">
            <Home className="h-5 w-5" />
            AllData
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col p-6">
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Generals</h2>
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
              {leads === null ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-red-500">{error}</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center">No data available</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-200">
                    <td className="p-3">{lead.id}</td>
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
