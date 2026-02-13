// Convert date from YYYY-MM-DDTHH:MM:SS to DD/MM/YYYY (UK format)
export const formatDateUK = (dateString) => {
  if (!dateString) return '';
  
  // Handle if already in DD/MM/YYYY format
  if (dateString.includes('/')) return dateString;
  
  // Handle ISO format (YYYY-MM-DDTHH:MM:SS) by extracting date part
  let datePart = dateString;
  if (dateString.includes('T')) {
    datePart = dateString.split('T')[0];
  }
  
  // Convert from YYYY-MM-DD
  const parts = datePart.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
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
