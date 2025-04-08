import { format, parseISO, isWithinInterval, subDays, subMonths } from 'date-fns';

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Get a date filter function based on the selected timeframe
 * @param {string} timeframe - 'week', 'month', '3months', 'all'
 * @returns {Function} A filter function that takes a date string and returns boolean
 */
export const getDateFilter = (timeframe) => {
  const now = new Date();
  
  switch (timeframe) {
    case 'week':
      const weekAgo = subDays(now, 7);
      return (dateString) => isWithinInterval(parseISO(dateString), { start: weekAgo, end: now });
      
    case 'month':
      const monthAgo = subDays(now, 30);
      return (dateString) => isWithinInterval(parseISO(dateString), { start: monthAgo, end: now });
      
    case '3months':
      const threeMonthsAgo = subMonths(now, 3);
      return (dateString) => isWithinInterval(parseISO(dateString), { start: threeMonthsAgo, end: now });
      
    case 'all':
    default:
      return () => true;
  }
};

/**
 * Group dates by time periods
 * @param {Array} items - Array of objects containing date properties
 * @param {string} dateProperty - The property name containing the date string
 * @param {string} groupBy - 'day', 'week', 'month'
 * @returns {Object} Object with date groups as keys and arrays of items as values
 */
export const groupByDate = (items, dateProperty, groupBy = 'day') => {
  if (!items || !Array.isArray(items)) return {};
  
  return items.reduce((groups, item) => {
    if (!item[dateProperty]) return groups;
    
    const date = parseISO(item[dateProperty]);
    let groupKey;
    
    switch (groupBy) {
      case 'day':
        groupKey = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        groupKey = `Week of ${format(date, 'MMM dd, yyyy')}`;
        break;
      case 'month':
        groupKey = format(date, 'MMM yyyy');
        break;
      default:
        groupKey = format(date, 'yyyy-MM-dd');
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(item);
    return groups;
  }, {});
}; 