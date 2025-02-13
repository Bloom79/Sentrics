# Project File Structure

## Root Directory
```
sentrics/
├── frontend/           # Frontend application
├── backend/           # Backend application
├── docs/              # Documentation
├── tools/             # Development tools
└── project_doc_sources/ # Project documentation sources
```

## Frontend Structure
```
frontend/
├── node_modules/      # Dependencies
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   │   ├── ui/      # UI components
│   │   ├── charts/  # Visualization components
│   │   ├── maps/    # Map components
│   │   └── forms/   # Form components
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── types/       # TypeScript types
│   ├── utils/       # Utility functions
│   └── styles/      # Global styles
├── supabase/        # Supabase configuration
├── package.json     # Dependencies and scripts
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
├── tailwind.config.ts # Tailwind configuration
└── index.html       # Entry point
```

## Backend Structure
```
backend/
├── __pycache__/     # Python cache
├── data/           # Data files
│   ├── raw/       # Raw input data
│   └── processed/ # Processed data
├── venv/          # Python virtual environment
├── main.py        # Main FastAPI application
├── simulation.py  # Simulation engine
├── requirements.txt # Python dependencies
└── .env          # Environment variables
```

## Documentation Structure
```
docs/
├── prd/           # Product Requirements Documents
│   ├── template.md
│   ├── architecture.md
│   └── simulation_system.md
├── imgs/          # Documentation images
├── App-flow.md    # Application flow
├── Backend-structure.md
├── File-structure.md
├── frontend-guidelines.md
├── Tech-stack.md
└── project description.md
```

## Tools Directory
```
tools/
├── docs_generator.py  # Documentation tools
├── doc_converter.py   # File conversion tools
└── requirements.txt   # Tool dependencies
```

## Configuration Files
```
Root Level Configuration:
├── .gitignore        # Git ignore rules
├── .env              # Environment variables
├── .cursorrules      # Editor configuration
└── README.md         # Project documentation
```

## Data Files
```
data/
├── raw/             # Raw input files
│   ├── measurements/
│   └── configurations/
├── processed/       # Processed data
│   ├── simulations/
│   └── reports/
└── exports/        # Exported results
```

## Source Control
```
Version Control:
├── .git/           # Git repository
├── .gitignore      # Ignore rules
└── .gitattributes  # Git attributes
```

## Build Outputs
```
Build Directories:
├── frontend/dist/  # Frontend build
└── backend/__pycache__/ # Backend bytecode
```

## File Naming Conventions

### Frontend
- Components: PascalCase.tsx
- Hooks: useHookName.ts
- Utils: camelCase.ts
- Styles: kebab-case.css
- Tests: *.test.tsx

### Backend
- Modules: snake_case.py
- Classes: PascalCase
- Functions: snake_case
- Constants: UPPER_CASE

### Documentation
- Markdown: Kebab-case.md
- Images: descriptive-name.png
- PRDs: feature_name.md

## Important Files

### Configuration Files
- package.json
- tsconfig.json
- vite.config.ts
- requirements.txt
- .env files

### Entry Points
- frontend/index.html
- backend/main.py
- backend/run_local.py

### Documentation
- README.md
- docs/project description.md
- docs/prd/*.md

## File Organization Rules

### 1. Component Organization
- Group by feature
- Separate UI components
- Include related tests
- Keep styles close

### 2. Documentation Organization
- Group by topic
- Use consistent naming
- Include images in imgs/
- Maintain hierarchy

### 3. Data Organization
- Separate raw and processed
- Use clear naming
- Include metadata
- Maintain versioning

## Access Patterns

### 1. Frontend Access
- Component imports
- Asset loading
- API calls
- Style imports

### 2. Backend Access
- Module imports
- Data file access
- Configuration loading
- Database connections

### 3. Documentation Access
- Markdown linking
- Image references
- Cross-referencing
- Version tracking 