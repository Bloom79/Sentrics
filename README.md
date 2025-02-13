# SentricS Energy Management Platform

A comprehensive platform for managing energy communities and monitoring energy production/consumption.

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL 15 with PostGIS extension
- Docker and Docker Compose

## Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── alembic/            # Database migrations
│   ├── app/                # Application code
│   ├── docker-compose.yml  # PostgreSQL setup
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/               # Source code
│   └── package.json       # Node.js dependencies
└── run_local_dev.py       # Development setup script
```

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sentrics.git
   cd sentrics
   ```

2. Start the PostgreSQL database:
   ```bash
   cd backend
   docker-compose up -d
   ```

3. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv backend/venv
   backend/venv/Scripts/activate

   # Linux/Mac
   python -m venv backend/venv
   source backend/venv/bin/activate
   ```

4. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

7. Start development servers:
   ```bash
   # Option 1: Run both servers with the development script
   python run_local_dev.py

   # Option 2: Run servers separately
   # Terminal 1 (Backend)
   cd backend
   python run_local.py

   # Terminal 2 (Frontend)
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Default Credentials

Administrator account:
- Email: admin@sentrics.com
- Password: Admin123!

## Development

### Database Migrations

To create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "description of changes"
```

To apply migrations:
```bash
alembic upgrade head
```

### Environment Variables

Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/sentrics
SECRET_KEY=your-secret-key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 