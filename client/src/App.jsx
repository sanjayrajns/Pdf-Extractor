import React, { useState } from "react";
import { Upload, FileText, Layers, Printer, Moon, Sun } from "lucide-react";

const TABLE_HEADERS = [
  { key: "test_name", label: "Test Name" },
  { key: "result", label: "Result" },
  { key: "unit", label: "Unit" },
  { key: "biological_reference_interval", label: "Reference Interval" },
];

function App() {
  const [file, setFile] = useState(null);
  const [groupedResults, setGroupedResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // NOTE: This URL must match your backend server address
  const API_ENDPOINT = "http://localhost:3000/extract";

  // GROUP BY HEADING
  const groupByHeading = (results) => {
    const grouped = {};
    results.forEach((item) => {
      // Use a fallback heading if none is provided by the AI
      const heading = item.heading && item.heading.trim() !== '' ? item.heading : "Miscellaneous Tests";
      if (!grouped[heading]) grouped[heading] = [];
      grouped[heading].push(item);
    });
    return grouped;
  };

  // HANDLES FILE UPLOAD AND EXTRACTION
  const handleExtract = async (fileToUpload) => {
    const uploadFile = fileToUpload || file;
    if (!uploadFile) return setError("Please select a file first.");

    setIsLoading(true);
    setError("");
    setGroupedResults({}); // Clear previous results

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // If the backend returns an error (like the 415 from the preliminary check)
        const errData = await res.json();
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      // Successful extraction
      const data = await res.json();
      const grouped = groupByHeading(data.data.results || []);
      setGroupedResults(grouped);
      
    } catch (err) {
      // Catch error thrown above or network errors
      console.error("Extraction error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // FILE CHANGE
  const handleFileChange = async (event) => {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    setError("");
    
    // Auto-extract when a new file is selected
    if (selected) {
      handleExtract(selected);
    }
  };


  // EDIT CELL
  const handleCellChange = (e, heading, index, key) => {
    const updated = { ...groupedResults };
    // Check if the heading and index exist before modifying
    if (updated[heading] && updated[heading][index]) {
        updated[heading][index][key] = e.target.textContent;
        setGroupedResults(updated);
    }
  };

  // CALCULATE TOTALS
  const getTotalEntries = () => {
    return Object.values(groupedResults).reduce((sum, rows) => sum + rows.length, 0);
  };

  const getTotalSections = () => {
    return Object.keys(groupedResults).length;
  };

  // PRINT REPORT
  const handlePrint = () => {
    window.print();
  };

  // UPLOAD NEW REPORT
  const handleUploadNew = () => {
    setFile(null);
    setGroupedResults({});
    setError("");
    // Manually reset the file input field
    const fileInput = document.getElementById("fileElem");
    if (fileInput) fileInput.value = "";
  };

  // RENDER TABLES
  const renderTables = () => (
    <>
      {Object.entries(groupedResults).map(([heading, rows]) => (
        <div key={heading} className="mb-8">
          <div className={`rounded-xl overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-lg'}`}>
            <div className={`px-6 py-4 border-b transition-colors duration-500 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{heading}</h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tests: {rows.length}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-sm transition-colors duration-500 ${isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-cyan-50 text-gray-700'}`}>
                    {TABLE_HEADERS.map((h) => (
                      <th key={h.key} className="py-3 px-6 text-left font-semibold whitespace-nowrap">
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b transition-colors duration-500 ${isDarkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-cyan-50'}`}
                    >
                      {TABLE_HEADERS.map((h) => (
                        <td
                          key={h.key}
                          className={`py-4 px-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}
                          contentEditable={h.key !== 'test_name' && h.key !== 'biological_reference_interval'} // Allow editing only results and units
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleCellChange(e, heading, index, h.key)
                          }
                        >
                          {row[h.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  const hasResults = Object.keys(groupedResults).length > 0;

  return (
    // Applied font-montserrat class
    <div className={`min-h-screen transition-colors duration-500 font-montserrat ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      
      {/* HEADER */}
      <div className={`py-6 px-8 shadow-lg transition-colors duration-500 print:hidden ${isDarkMode ? 'bg-gradient-to-r from-gray-900 via-black to-gray-900' : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              {/* Reduced font weight from 'font-bold' to 'font-semibold' */}
              <h1 className="text-2xl font-semibold text-white">Medical Report Summarizer</h1>
              <p className="text-sm text-cyan-50">Extract, edit, and print structured data from any lab report</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {!hasResults && !isLoading ? (
          <div className="max-w-2xl mx-auto">
            {/* UPLOAD SECTION */}
            <div className={`rounded-xl p-12 text-center mb-6 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-lg'}`}>
              <label htmlFor="fileElem" className="cursor-pointer block">
                <div className="flex justify-center mb-6">
                  <div className="bg-cyan-500 p-6 rounded-full">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                {/* Reduced font weight from 'font-bold' to 'font-semibold' */}
                <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upload Your Medical Report</h2>
                <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Drop your PDF or image document here or click to browse
                </p>

                <input
                  type="file"
                  accept="image/*,application/pdf"
                  id="fileElem"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {file && (
                  <div className={`rounded-lg p-4 mb-4 transition-colors duration-500 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-cyan-50'}`} onClick={(e) => e.preventDefault()}>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
                
              </label>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className={`border p-4 rounded-xl shadow-md ${isDarkMode ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-red-100 border-red-500 text-red-800'}`}>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                    🚨 Extraction Error
                </h3>
                <p>{error}</p>
                <button
                    onClick={handleUploadNew}
                    className="mt-3 text-sm font-semibold underline hover:no-underline"
                >
                    Clear File and Try Again
                </button>
              </div>
            )}

            {/* SUPPORTED TYPES */}
            <div className="mt-12">
              <h3 className={`text-xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Supported Medical Report Types
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {["CBP/CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Thyroid Panel", "Urine Analysis"].map((type) => (
                  <span
                    key={type}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-cyan-300 border border-cyan-500/50' : 'bg-white text-cyan-700 shadow border border-cyan-200'}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* The main loading area is now hidden when the dedicated toast is shown */}
            {isLoading && (
              <div className="max-w-2xl mx-auto">
                <div className={`rounded-xl p-12 text-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-lg'}`}>
                  <div className="flex justify-center mb-6">
                    <div className="bg-cyan-500 p-6 rounded-full animate-pulse">
                      <FileText className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  {/* Reduced font weight from 'font-bold' to 'font-semibold' */}
                  <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Awaiting Results...</h2>
                  <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Document sent for AI analysis.
                  </p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
                  </div>
                </div>
              </div>
            )}

            {hasResults && (
              <>
                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-3 mb-6 print:hidden">
                  <button
                    onClick={handleUploadNew}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${isDarkMode ? 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 shadow-md' : 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200'}`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload New Report
                  </button>
                  <button
                    onClick={handlePrint}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md' : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg'}`}
                  >
                    <Printer className="w-4 h-4" />
                    Print/Export PDF
                  </button>
                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:hidden">
                  <div className={`rounded-xl p-6 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-lg'}`}>
                    <div className="flex items-center gap-4">
                      <div className="bg-cyan-500 p-4 rounded-lg">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Entries</p>
                        {/* Reduced font weight from 'font-extrabold' to 'font-bold' */}
                        <p className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getTotalEntries()}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Extracted test results</p>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-xl p-6 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-lg'}`}>
                    <div className="flex items-center gap-4">
                      <div className="bg-cyan-500 p-4 rounded-lg">
                        <Layers className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sections Found</p>
                        {/* Reduced font weight from 'font-extrabold' to 'font-bold' */}
                        <p className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getTotalSections()}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Data categories (e.g., Lipid, CBC)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TABLES */}
                {renderTables()}

                {/* Print Footer */}
                <div className="mt-12 hidden print:block text-center text-xs text-gray-500">
                    Data extracted by Medical Report Summarizer. Note: Values are editable and should be verified against the original document.
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* TOAST / POPUP MESSAGE (Fixed Position) */}
      {isLoading && (
          <div className="fixed bottom-6 right-6 z-50 print:hidden">
              <div className={`flex items-center gap-4 p-4 rounded-xl shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white border border-cyan-500' : 'bg-white text-gray-900 shadow-cyan-500/50'}`}>
                  <div className="animate-spin rounded-full h-6 w-6 border-4 border-cyan-500 border-t-transparent"></div>
                  <p className="font-semibold">Extracting the data. Please wait for some time...</p>
              </div>
          </div>
      )}

      {/* Global Font and Print Styles */}
      <style>{`
        /* Import Montserrat Font (Added 300 and 500 weights for flexibility) */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        /* Apply Montserrat to the custom font-montserrat class */
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        @media print {
            body {
                background-color: white !important;
                color: black !important;
            }
            .print\\:hidden {
                display: none !important;
            }
            .py-8 {
                padding-top: 0;
            }
            .bg-white {
                background-color: white !important;
            }
            .shadow-lg, .shadow-md, .shadow {
                box-shadow: none !important;
            }
            .border {
                border-color: #e5e7eb !important; /* light gray border */
            }
            h2, th, td {
                color: black !important;
            }
            table {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
      `}</style>
    </div>
  );
}

export default App;