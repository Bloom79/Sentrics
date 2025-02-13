# Edge Server Architecture

## Overview
The edge server acts as a central data aggregator and processor for both solar and wind plant components, providing standardized APIs for the Azure cloud infrastructure. It handles multiple protocols and data sources while maintaining real-time processing capabilities.

## System Components

### 1. Protocol Handlers
- **Modbus TCP Handler**
  - Manages connections with inverters, battery storage, and tracking systems
  - Implements polling and event-driven data collection
  - Handles device registration and connection management

- **MQTT Handler**
  - Manages IoT sensor data from solar panels and weather stations
  - Implements pub/sub message patterns
  - Handles QoS levels and message persistence

- **OPC UA Handler**
  - Manages wind turbine connections
  - Implements secure channel communication
  - Handles subscription management

- **IEC 61850 Handler**
  - Manages transformer connections
  - Implements GOOSE messaging
  - Handles substation automation protocols

### 2. Data Processing Layer
- Real-time data processing pipeline
- Historical data aggregation
- Data validation and cleaning
- Protocol translation and normalization

### 3. API Layer
#### Solar Plant APIs
- `/api/solar/inverter/status`
- `/api/solar/panels/performance`
- `/api/solar/scada/system`
- `/api/solar/substation/status`
- `/api/solar/weather/data`
- `/api/solar/battery/status`

#### Wind Plant APIs
- `/api/wind/turbine/status`
- `/api/wind/iot/sensors`
- `/api/wind/scada/system`
- `/api/wind/substation/status`
- `/api/wind/weather/data`

### 4. SCADA Integration
- Data aggregation from SCADA systems
- Protocol translation
- Real-time monitoring interface

## Data Flow
1. Physical assets send data via their respective protocols
2. Protocol handlers process and validate incoming data
3. Data processing layer normalizes and aggregates information
4. API layer exposes standardized endpoints
5. Azure services consume data through defined APIs

## Security Considerations
- Protocol-specific security measures
- API authentication and authorization
- Data encryption in transit and at rest
- Access control and monitoring

## Deployment Architecture
- Docker containerization
- Kubernetes orchestration
- Scalability and redundancy
- Monitoring and logging 