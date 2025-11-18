import React, { useState } from "react";
import Header from "./components/Header";
import FileUploader from "./components/FileUploader";
import ErrorMessage from "./components/ErrorMessage";
import LoadingToast from "./components/LoadingToast";
import ActionButtons from "./components/Results/ActionButtons";
import SummaryCards from "./components/Results/SummaryCards";
import ReportTable from "./components/Results/ReportTable";
import { API_ENDPOINT } from "./utils/constants";
import { groupByHeading } from "./utils/helpers";

function App() {
  const [file, setFile] = useState(null);
  const [groupedResults, setGroupedResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // HANDLES FILE UPLOAD AND EXTRACTION
  const handleExtract = async (fileToUpload) => {
    const uploadFile = fileToUpload || file;
    if (!uploadFile) return setError("Please select a file first.");

    setIsLoading(true);
    setError("");
    setGroupedResults({}); 

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const grouped = groupByHeading(data.data.results || []);
      setGroupedResults(grouped);
      
    } catch (err) {
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
    
    if (selected) {
      handleExtract(selected);
    }
  };

  // EDIT CELL
  const handleCellChange = (e, heading, index, key) => {
    const updated = { ...groupedResults };
    if (updated[heading] && updated[heading][index]) {
        updated[heading][index][key] = e.target.textContent;
        setGroupedResults(updated);
    }
  };

  // UPLOAD NEW REPORT
  const handleUploadNew = () => {
    setFile(null);
    setGroupedResults({});
    setError("");
    const fileInput = document.getElementById("fileElem");
    if (fileInput) fileInput.value = "";
  };

  const hasResults = Object.keys(groupedResults).length > 0;
  
  const totalEntries = Object.values(groupedResults).reduce((sum, rows) => sum + rows.length, 0);
  const totalSections = Object.keys(groupedResults).length;

  return (
    <div className={`min-h-screen transition-colors duration-500 font-montserrat ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Initial Upload Screen */}
        {!hasResults && !isLoading && (
          <>
            <FileUploader 
              isDarkMode={isDarkMode} 
              file={file} 
              handleFileChange={handleFileChange}
              isLoading={isLoading} 
            />
            <ErrorMessage 
              error={error} 
              onRetry={handleUploadNew} 
              isDarkMode={isDarkMode} 
            />
          </>
        )}

        {/* Loading Screen / Toast */}
        <LoadingToast isLoading={isLoading} isDarkMode={isDarkMode} />

        {/* Results Screen */}
        {hasResults && (
          <>
            <ActionButtons 
              onUploadNew={handleUploadNew} 
              onPrint={() => window.print()} 
              isDarkMode={isDarkMode} 
            />
            
            <SummaryCards 
              totalEntries={totalEntries} 
              totalSections={totalSections} 
              isDarkMode={isDarkMode} 
            />
            
            <ReportTable 
              groupedResults={groupedResults} 
              isDarkMode={isDarkMode} 
              handleCellChange={handleCellChange} 
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;