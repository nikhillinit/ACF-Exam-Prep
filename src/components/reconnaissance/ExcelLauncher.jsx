import React from 'react';

const ExcelLauncher = ({ excelTab }) => {
  const handleLaunch = () => {
    // In a real implementation, this would open the Excel file at the specific tab
    alert(`Launch Excel: ${excelTab}\n\nIn production, this would open your Corporate_Finance_Templates.xlsx file at the ${excelTab} worksheet.`);
  };

  return (
    <button onClick={handleLaunch} className="btn btn-primary">
      📊 Open Excel: {excelTab}
    </button>
  );
};

export default ExcelLauncher;
