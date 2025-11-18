export const groupByHeading = (results) => {
    const grouped = {};
    results.forEach((item) => {
      // Use a fallback heading if none is provided
      const heading = item.heading && item.heading.trim() !== '' 
        ? item.heading 
        : "Miscellaneous Tests";
        
      if (!grouped[heading]) grouped[heading] = [];
      grouped[heading].push(item);
    });
    return grouped;
  };