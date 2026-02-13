// Convert date from YYYY-MM-DD to DD/MM/YYYY (UK format)
export const formatDateUK = (dateString) => {
  if (!dateString) return '';
  
  // Handle if already in DD/MM/YYYY format
  if (dateString.includes('/')) return dateString;
  
  // Convert from YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  return dateString;
};

// Convert date from DD/MM/YYYY to YYYY-MM-DD for storage
export const formatDateISO = (dateString) => {
  if (!dateString) return '';
  
  // Handle if already in YYYY-MM-DD format
  if (dateString.includes('-')) return dateString;
  
  // Convert from DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return dateString;
};
