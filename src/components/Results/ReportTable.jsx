import React from "react";
import { TABLE_HEADERS } from "../../utils/constants";

const ReportTable = ({ groupedResults, isDarkMode, handleCellChange }) => {
  return (
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
                          contentEditable={h.key !== 'test_name' && h.key !== 'biological_reference_interval'} 
                          suppressContentEditableWarning
                          onBlur={(e) => handleCellChange(e, heading, index, h.key)}
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
      
      {/* Print Footer */}
      <div className="mt-12 hidden print:block text-center text-xs text-gray-500">
          Data extracted by Medical Report Summarizer. Note: Values are editable and should be verified against the original document.
      </div>
    </>
  );
};

export default ReportTable;