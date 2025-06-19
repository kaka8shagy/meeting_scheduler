import moment from 'moment';

// Configure moment to use UTC by default
moment.utc();

/**
 * Convert a datetime string to UTC ISO format
 * @param {string} datetimeString - Local datetime string (e.g., from datetime-local input)
 * @returns {string} UTC ISO string
 */
export const toUTCISO = (datetimeString) => {
  if (!datetimeString) return null;
  return moment(datetimeString).utc().format();
};

/**
 * Convert a UTC datetime string to local datetime-local format for display
 * @param {string} utcDateTimeString - UTC datetime string
 * @returns {string} Local datetime string for datetime-local input
 */
export const fromUTCToLocal = (utcDateTimeString) => {
  if (!utcDateTimeString) return '';
  return moment.utc(utcDateTimeString).format('YYYY-MM-DDTHH:mm');
};

/**
 * Convert a UTC datetime string to a Date object for calendar display
 * @param {string} utcDateTimeString - UTC datetime string
 * @returns {Date} Date object
 */
export const fromUTCToDate = (utcDateTimeString) => {
  if (!utcDateTimeString) return null;
  return moment.utc(utcDateTimeString).toDate();
};

/**
 * Format a UTC datetime string for display
 * @param {string} utcDateTimeString - UTC datetime string
 * @param {string} format - Moment format string (default: 'YYYY-MM-DD HH:mm UTC')
 * @returns {string} Formatted datetime string
 */
export const formatUTCDateTime = (utcDateTimeString, format = 'YYYY-MM-DD HH:mm UTC') => {
  if (!utcDateTimeString) return '';
  return moment.utc(utcDateTimeString).format(format);
};

/**
 * Get current UTC datetime string
 * @returns {string} Current UTC datetime string
 */
export const getCurrentUTC = () => {
  return moment().utc().format();
};

/**
 * Validate that end time is after start time
 * @param {string} startTime - Start time in any format
 * @param {string} endTime - End time in any format
 * @returns {boolean} True if end time is after start time
 */
export const isValidTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  const start = moment(startTime);
  const end = moment(endTime);
  return end.isAfter(start);
}; 