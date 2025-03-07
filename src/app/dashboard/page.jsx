"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Download, LogOut } from "lucide-react";
import * as XLSX from "xlsx";

export default function Dashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(""); // ⬅️ Start Date
  const [endDate, setEndDate] = useState(""); // ⬅️ End Date

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeads(data);
        } else {
          setLeads([]);
        }
      })
      .catch(() => {
        setError("Failed to load data.");
        setLeads([]);
      });
  }, []);

  // ✅ Format Date and Time
  const formatDate = (isoString) => (isoString ? new Date(isoString).toISOString().split("T")[0] : "N/A");
  const formatTime = (isoString) => (isoString ? new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : "N/A");

  // ✅ Filtered Excel Download
  const downloadExcel = () => {
    if (!leads || leads.length === 0) {
      alert("No data to export.");
      return;
    }

    // Convert input dates to Date objects
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Filter leads based on date range
    const filteredLeads = leads.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      return (!start || leadDate >= start) && (!end || leadDate <= end);
    });

    if (filteredLeads.length === 0) {
      alert("No data found for selected date range.");
      return;
    }

    // Format data for Excel
    const formattedData = filteredLeads.map((lead, index) => ({
      ID: index + 1,
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

    XLSX.writeFile(wb, "Hyundai-Leads.xlsx");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col justify-between border-r bg-black text-white p-4 h-screen">
        <div>
          <h1 className="text-lg font-bold flex justify-center">
            <img src="https://bharathyundai.com/wp-content/uploads/2024/06/wss-1.png" alt="Logo" className="h-12" />
          </h1>
          <nav className="mt-8 space-y-2">
            <Link href="#" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition">
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">All Data</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col p-6">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Generals</h2>
          </div>
        </header>

        {/* Date Filters */}
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md flex items-center gap-2 hover:bg-green-700 transition"
          >
            <Download className="h-5 w-5" />
            Download Data
          </button>
        </div>

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
                  <td colSpan="7" className="p-4 text-center">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-red-500">{error}</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center">No data available</td>
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
