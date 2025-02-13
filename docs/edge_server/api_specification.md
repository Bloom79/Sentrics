# Edge Server API Specification

## Base URL
```
http://localhost:8000/api
```

## Authentication
All API endpoints require authentication using JWT tokens.
```
Authorization: Bearer <token>
```

## Solar Plant APIs

### 1. Inverter Status
```http
GET /solar/inverter/status/{inverter_id}
```

#### Response
```json
{
  "id": "string",
  "power_output": "number",
  "efficiency": "number",
  "temperature": "number",
  "status": "string",
  "last_updated": "string (ISO 8601)",
  "alerts": [
    {
      "type": "string",
      "severity": "string",
      "message": "string"
    }
  ]
}
```

### 2. Panel Performance
```http
GET /solar/panels/performance/{string_id}
```

#### Response
```json
{
  "string_id": "string",
  "total_power": "number",
  "panels": [
    {
      "id": "string",
      "voltage": "number",
      "current": "number",
      "temperature": "number",
      "efficiency": "number",
      "status": "string"
    }
  ]
}
```

### 3. Battery Status
```http
GET /solar/battery/status/{battery_id}
```

#### Response
```json
{
  "id": "string",
  "charge_level": "number",
  "charging_rate": "number",
  "temperature": "number",
  "status": "string",
  "capacity": "number",
  "cycles": "number"
}
```

## Wind Plant APIs

### 1. Turbine Status
```http
GET /wind/turbine/status/{turbine_id}
```

#### Response
```json
{
  "id": "string",
  "rotor_speed": "number",
  "power_output": "number",
  "wind_speed": "number",
  "nacelle_position": "number",
  "blade_pitch": "number",
  "temperature": "number",
  "status": "string",
  "vibration_level": "number"
}
```

### 2. Weather Data
```http
GET /wind/weather/data
```

#### Response
```json
{
  "timestamp": "string (ISO 8601)",
  "wind_speed": "number",
  "wind_direction": "number",
  "temperature": "number",
  "pressure": "number",
  "humidity": "number"
}
```

## SCADA System APIs

### 1. System Status
```http
GET /{plant_type}/scada/system
```

#### Response
```json
{
  "system_status": "string",
  "connected_devices": "number",
  "last_update": "string (ISO 8601)",
  "data_points": "number",
  "alerts": [
    {
      "type": "string",
      "severity": "string",
      "message": "string",
      "timestamp": "string (ISO 8601)"
    }
  ]
}
```

## Common Response Codes

- 200: Successful operation
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Resource not found
- 500: Internal server error

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per API key

## Data Models

### Asset Status
```typescript
enum AssetStatus {
  OPERATIONAL = "operational",
  MAINTENANCE = "maintenance",
  FAULT = "fault",
  OFFLINE = "offline"
}
```

### Alert Severity
```typescript
enum AlertSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical"
}
```

## Websocket Endpoints

### Real-time Updates
```
ws://localhost:8000/ws/{plant_type}/{asset_type}/{asset_id}
```

#### Message Format
```json
{
  "timestamp": "string (ISO 8601)",
  "asset_id": "string",
  "data": {
    // Asset-specific data structure
  }
}
``` 