import moment from 'moment';

// Configure moment to use UTC by default
moment.utc();

/**
 * Convert a local datetime string to UTC ISO format for storage
 * @param {string} localDateTimeString - Local datetime string (e.g., from datetime-local input)
 * @returns {string} UTC ISO string
 */
export const toUTCISO = (localDateTimeString) => {
  if (!localDateTimeString) return null;
  // Create moment in local time, then convert to UTC for storage
  return moment(localDateTimeString).utc().format();
};

/**
 * Convert a UTC datetime string to local datetime-local format for display
 * @param {string} utcDateTimeString - UTC datetime string
 * @returns {string} Local datetime string for datetime-local input
 */
export const fromUTCToLocal = (utcDateTimeString) => {
  if (!utcDateTimeString) return '';
  // Parse as UTC, then convert to local time for display
  return moment.utc(utcDateTimeString).local().format('YYYY-MM-DDTHH:mm');
};

/**
 * Convert a UTC datetime string to a local Date object for calendar display
 * @param {string} utcDateTimeString - UTC datetime string
 * @returns {Date} Local Date object
 */
export const fromUTCToDate = (utcDateTimeString) => {
  if (!utcDateTimeString) return null;
  // Parse as UTC, then convert to local time
  return moment.utc(utcDateTimeString).local().toDate();
};

/**
 * Format a UTC datetime string for display in local time
 * @param {string} utcDateTimeString - UTC datetime string
 * @param {string} format - Moment format string (default: 'YYYY-MM-DD HH:mm')
 * @returns {string} Formatted local datetime string
 */
export const formatUTCDateTime = (utcDateTimeString, format = 'YYYY-MM-DD HH:mm') => {
  if (!utcDateTimeString) return '';
  // Parse as UTC, then convert to local time for display
  return moment.utc(utcDateTimeString).local().format(format);
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
 * @param {string} startTime - Start time in local format
 * @param {string} endTime - End time in local format
 * @returns {boolean} True if end time is after start time
 */
export const isValidTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  // Compare in local time since inputs are in local time
  const start = moment(startTime);
  const end = moment(endTime);
  return end.isAfter(start);
}; 