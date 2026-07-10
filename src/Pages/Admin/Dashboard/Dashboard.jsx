import React, { useState, useRef } from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useChartData } from "@/Utils/Hooks/useChart";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const PIE_COLORS = ["#2563eb", "#ec4899"]; // Blue for Male, Pink/Pinkish-Purple for Female

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md text-xs sm:text-sm">
        <p className="font-semibold text-slate-300 mb-1">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex justify-between items-center gap-4 py-0.5">
            <span style={{ color: item.color }} className="font-medium">
              {item.name}:
            </span>
            <span className="font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { data = {}, isLoading } = useChartData();
  const dashboardRef = useRef(null);

  // States for interactive filter
  const [minStudents, setMinStudents] = useState(0);
  const [selectedGrades, setSelectedGrades] = useState({ A: true, B: true, C: true });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const {
    students = [],
    genderRatio = [],
    registrations = [],
    gradeDistribution = [],
    lecturerRanks = [],
  } = data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  // Calculate summary metrics
  const totalStudents = students.reduce((acc, curr) => acc + curr.count, 0);
  const totalRegistrations = registrations.reduce((acc, curr) => acc + curr.total, 0);
  const totalLecturers = lecturerRanks.reduce((acc, curr) => acc + curr.count, 0);

  // Filter students based on range input
  const filteredStudents = students.filter(s => s.count >= minStudents);

  // Toggle Radar Grades
  const toggleGrade = (grade) => {
    setSelectedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };

  // Export to PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    const element = dashboardRef.current;
    
    // Add temporary class to make it fit nice in PDF page size
    const opt = {
      scale: 2,
      useCORS: true,
      logging: false
    };

    try {
      const canvas = await html2canvas(element, opt);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 size page width in mm
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("Dashboard_Akademik_Report.pdf");
    } catch (error) {
      console.error("Failed to export PDF", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`transition-colors duration-300 p-2 sm:p-4 rounded-2xl ${isDarkMode ? "bg-slate-950 text-white" : "bg-transparent text-gray-800"}`} ref={dashboardRef}>
      
      {/* Top Banner and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Dashboard Visualisasi Data
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            Sistem Informasi Akademik Terintegrasi (TanStack & Recharts)
          </p>
        </div>

        {/* Buttons / Controls */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto no-print">
          {/* Dark Mode Switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm border transition-all duration-200 cursor-pointer ${
              isDarkMode 
                ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" 
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {isDarkMode ? "☀️ Mode Terang" : "🌙 Mode Gelap"}
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-200 cursor-pointer ${
              isExporting 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95"
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <span>📥</span> Export PDF
              </>
            )}
          </button>

          {/* Native Print Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>🖨️</span> Cetak Laporan (Print)
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPI 1 */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
          isDarkMode 
            ? "bg-slate-900 border-slate-800 hover:border-slate-750" 
            : "bg-white border-gray-100 hover:border-gray-200"
        }`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
              Total Mahasiswa Aktif
            </span>
            <span className="text-2xl">🎓</span>
          </div>
          <p className="text-3xl font-extrabold mt-2 tracking-tight">{totalStudents} orang</p>
          <div className="mt-2 text-xs text-green-500 font-medium flex items-center gap-1">
            <span>↑ 8.2%</span> <span className={isDarkMode ? "text-slate-500" : "text-gray-400"}>vs semester lalu</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
          isDarkMode 
            ? "bg-slate-900 border-slate-800 hover:border-slate-750" 
            : "bg-white border-gray-100 hover:border-gray-200"
        }`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
              Total Pendaftar (2020-2023)
            </span>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-extrabold mt-2 tracking-tight">{totalRegistrations} pendaftar</p>
          <div className="mt-2 text-xs text-blue-500 font-medium flex items-center gap-1">
            <span>↑ 42%</span> <span className={isDarkMode ? "text-slate-500" : "text-gray-400"}>pertumbuhan tahunan</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
          isDarkMode 
            ? "bg-slate-900 border-slate-800 hover:border-slate-750" 
            : "bg-white border-gray-100 hover:border-gray-200"
        }`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
              Tenaga Dosen Aktif
            </span>
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <p className="text-3xl font-extrabold mt-2 tracking-tight">{totalLecturers} dosen</p>
          <div className="mt-2 text-xs text-indigo-500 font-medium flex items-center gap-1">
            <span>Rasio 1:15</span> <span className={isDarkMode ? "text-slate-500" : "text-gray-400"}>mahasiswa per dosen</span>
          </div>
        </div>
      </div>

      {/* Grid Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart A: Bar Chart (Mahasiswa per Fakultas) */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-sm"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold">Mahasiswa per Fakultas</h2>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Perbandingan jumlah per fakultas</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto no-print">
              <span className="text-xs font-semibold whitespace-nowrap">Filter Min:</span>
              <input 
                type="range" 
                min="0" 
                max="350" 
                value={minStudents} 
                onChange={(e) => setMinStudents(Number(e.target.value))}
                className="w-24 sm:w-32 h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer" 
              />
              <span className="text-xs font-bold w-8 text-right">{minStudents}</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredStudents} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                <XAxis dataKey="faculty" stroke={isDarkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 11 }} />
                <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#blueGradient)" radius={[4, 4, 0, 0]}>
                  {filteredStudents.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Pie Chart (Rasio Gender Mahasiswa) */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold">Rasio Gender Mahasiswa</h2>
            <p className={`text-xs mb-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Proporsi gender di universitas</p>
          </div>
          <div className="h-72 flex flex-col sm:flex-row items-center justify-around">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderRatio}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {genderRatio.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend & Details */}
            <div className="flex flex-col gap-3 w-full sm:w-1/3">
              {genderRatio.map((entry, index) => {
                const total = genderRatio.reduce((sum, g) => sum + g.count, 0);
                const percent = ((entry.count / total) * 100).toFixed(1);
                return (
                  <div key={entry.id} className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                      <span className="text-sm font-semibold">{entry.gender}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold block">{entry.count}</span>
                      <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart C: Line Chart (Tren Pendaftaran Mahasiswa) */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold">Tren Pendaftaran Mahasiswa Baru</h2>
            <p className={`text-xs mb-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Pertumbuhan tahunan pendaftar mahasiswa baru</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                <XAxis dataKey="year" stroke={isDarkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 11 }} />
                <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={{ r: 4, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart D: Radar Chart (Nilai Mahasiswa per Jurusan) */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-sm"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold">Sebaran Nilai per Jurusan</h2>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Distribusi nilai mutu mahasiswa</p>
            </div>
            {/* Grade Switch Filters */}
            <div className="flex items-center gap-2 flex-wrap no-print">
              {["A", "B", "C"].map((grade) => (
                <button
                  key={grade}
                  onClick={() => toggleGrade(grade)}
                  className={`px-3 py-1 text-xs font-bold rounded-full border transition-all duration-200 ${
                    selectedGrades[grade]
                      ? grade === "A" ? "bg-blue-100 border-blue-400 text-blue-800" :
                        grade === "B" ? "bg-emerald-100 border-emerald-400 text-emerald-800" :
                        "bg-amber-100 border-amber-400 text-amber-800"
                      : "bg-gray-100 border-gray-200 text-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500"
                  }`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={gradeDistribution}>
                <PolarGrid stroke={isDarkMode ? "#475569" : "#e2e8f0"} />
                <PolarAngleAxis dataKey="subject" stroke={isDarkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 12 }} />
                <PolarRadiusAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} angle={30} domain={[0, 150]} tick={{ fontSize: 10 }} />
                
                {selectedGrades.A && (
                  <Radar name="Grade A" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                )}
                {selectedGrades.B && (
                  <Radar name="Grade B" dataKey="B" stroke="#059669" fill="#10b981" fillOpacity={0.3} />
                )}
                {selectedGrades.C && (
                  <Radar name="Grade C" dataKey="C" stroke="#d97706" fill="#f59e0b" fillOpacity={0.2} />
                )}
                <Legend iconType="circle" />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart E: Area Chart (Pangkat Akademik Dosen) */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md lg:col-span-2 ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-sm"
        }`}>
          <div>
            <h2 className="text-lg font-bold">Pangkat Akademik Dosen</h2>
            <p className={`text-xs mb-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Hierarki jabatan akademik fungsional dosen</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lecturerRanks} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                <XAxis dataKey="rank" stroke={isDarkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 11 }} />
                <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#areaColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default Dashboard;