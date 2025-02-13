# Edge Server PoC Implementation Guide

## Overview
This guide outlines the implementation steps for creating a Proof of Concept (PoC) edge server that simulates data collection from various plant components and exposes standardized APIs.

## Implementation Steps

### 1. Development Environment Setup
```bash
# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Install required packages
pip install fastapi uvicorn python-dotenv paho-mqtt asyncua pymodbus
pip install pytest pytest-asyncio httpx  # For testing
```

### 2. Project Structure
```
edge_server/
├── src/
│   ├── protocols/
│   │   ├── __init__.py
│   │   ├── modbus_handler.py
│   │   ├── mqtt_handler.py
│   │   ├── opcua_handler.py
│   │   └── iec61850_handler.py
│   ├── simulators/
│   │   ├── __init__.py
│   │   ├── solar_simulator.py
│   │   └── wind_simulator.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── solar.py
│   │   └── wind.py
│   └── main.py
├── tests/
│   └── test_simulators.py
├── docker/
│   └── Dockerfile
└── docker-compose.yml
```

### 3. Mock Data Specifications

#### Solar Plant Components
```python
# Example mock data structure for solar components
SOLAR_INVERTER_DATA = {
    "id": "INV001",
    "power_output": 100.5,  # kW
    "efficiency": 0.98,
    "temperature": 45.2,    # Celsius
    "status": "operational"
}

SOLAR_PANEL_DATA = {
    "string_id": "STR001",
    "panels": [
        {
            "id": "PNL001",
            "voltage": 24.5,
            "current": 8.2,
            "temperature": 42.3
        }
    ]
}
```

#### Wind Plant Components
```python
# Example mock data structure for wind components
WIND_TURBINE_DATA = {
    "id": "WTG001",
    "rotor_speed": 15.2,    # RPM
    "power_output": 2000.0, # kW
    "wind_speed": 12.5,     # m/s
    "nacelle_position": 145.5 # degrees
}

WEATHER_DATA = {
    "wind_speed": 12.5,
    "wind_direction": 180.0,
    "temperature": 22.5,
    "pressure": 1013.2
}
```

### 4. API Implementation

#### FastAPI Setup
```python
from fastapi import FastAPI, HTTPException
from typing import Dict, List

app = FastAPI(title="Edge Server API")

@app.get("/api/solar/inverter/status/{inverter_id}")
async def get_inverter_status(inverter_id: str) -> Dict:
    try:
        return SOLAR_INVERTER_DATA
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 5. Protocol Handlers Implementation

#### Modbus TCP Handler
```python
from pymodbus.client import ModbusTcpClient

class ModbusHandler:
    def __init__(self, host: str, port: int):
        self.client = ModbusTcpClient(host, port)
    
    async def read_inverter_data(self, unit_id: int) -> dict:
        # Simulate reading from Modbus device
        return SOLAR_INVERTER_DATA
```

### 6. Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 7. Testing Strategy

#### Unit Tests
```python
import pytest
from src.simulators.solar_simulator import SolarSimulator

def test_solar_inverter_simulation():
    simulator = SolarSimulator()
    data = simulator.generate_inverter_data()
    assert "power_output" in data
    assert "efficiency" in data
```

## Running the PoC
1. Start the edge server:
```bash
docker-compose up
```

2. Access the API documentation:
```
http://localhost:8000/docs
```

3. Test the endpoints:
```bash
curl http://localhost:8000/api/solar/inverter/status/INV001
```

## Next Steps
1. Implement real-time data updates
2. Add authentication and authorization
3. Implement data persistence
4. Add monitoring and logging
5. Integrate with Azure services 