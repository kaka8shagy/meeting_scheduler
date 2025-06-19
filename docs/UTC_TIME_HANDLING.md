# UTC Time Handling

This document outlines the UTC time handling approach implemented in the meeting scheduler app to ensure consistency across all time-related operations.

## Overview

All times in the application are stored and handled in UTC to ensure consistency across different timezones and prevent timezone-related issues.

## Backend (Rails) Configuration

### Application Configuration
- **File**: `config/application.rb`
- **Settings**:
  ```ruby
  config.time_zone = "UTC"
  config.active_record.default_timezone = :utc
  ```

### Model Configuration
- **File**: `app/models/Booking.rb`
- **Features**:
  - Automatic UTC conversion before save/update
  - Validation for time ranges
  - Callbacks to ensure UTC storage

### Controller Configuration
- **File**: `app/controllers/bookings_controller.rb`
- **Features**:
  - UTC parsing of incoming datetime parameters
  - Consistent UTC handling in API responses

## Frontend (JavaScript) Configuration

### Time Utility Functions
- **File**: `app/javascript/components/utils/timeUtils.js`
- **Functions**:
  - `toUTCISO()`: Convert local datetime to UTC ISO format
  - `fromUTCToLocal()`: Convert UTC datetime to local format for display
  - `fromUTCToDate()`: Convert UTC datetime to Date object for calendar
  - `formatUTCDateTime()`: Format UTC datetime for display
  - `getCurrentUTC()`: Get current UTC datetime
  - `isValidTimeRange()`: Validate time ranges

### Component Updates
- **Calendar Component**: Uses UTC for all date operations
- **MeetingForm Component**: Converts between local display and UTC storage
- **Moment.js Configuration**: Set to UTC mode by default

## Database Storage

All datetime fields in the database are stored in UTC:
- `start_time` (UTC)
- `end_time` (UTC)
- `created_at` (UTC)
- `updated_at` (UTC)

## API Endpoints

### Request Format
When sending datetime data to the API:
```javascript
// Convert local datetime to UTC ISO string
const startTimeUTC = toUTCISO(startDateTime);
const endTimeUTC = toUTCISO(endDateTime);

// Send to API
{
  start_time: startTimeUTC,  // "2024-01-15T10:00:00.000Z"
  end_time: endTimeUTC       // "2024-01-15T11:00:00.000Z"
}
```

### Response Format
API responses include UTC datetime strings:
```json
{
  "id": 1,
  "title": "Meeting",
  "start_time": "2024-01-15T10:00:00.000Z",
  "end_time": "2024-01-15T11:00:00.000Z"
}
```

## Display Considerations

### Calendar Display
- Calendar component displays times in UTC
- All date calculations use UTC to prevent timezone shifts

### Form Inputs
- Datetime-local inputs show times in user's local timezone
- Conversion happens transparently between local display and UTC storage

## Benefits

1. **Consistency**: All times stored in the same timezone
2. **Reliability**: No timezone conversion errors
3. **Scalability**: Works across different user timezones
4. **Simplicity**: Single source of truth for time handling

## Migration Notes

If migrating from a non-UTC system:
1. Update application configuration
2. Convert existing data to UTC
3. Update frontend components to use UTC utilities
4. Test across different timezones

## Testing

To test UTC handling:
1. Create bookings in different timezones
2. Verify consistent storage in UTC
3. Check display consistency across timezones
4. Validate API request/response formats 