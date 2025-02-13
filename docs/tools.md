# Database Tools Documentation

This document describes the tools available for interacting with the database. These tools are located in the `tools/` directory.

## Tools Overview

### 1. Database Query Tool (`tools.py`)

A general-purpose tool for querying the Supabase database.

```python
from tools import query_supabase

# Example usage
result = query_supabase('assets', 'count')
result = query_supabase('assets', '*', {'limit': 1})
```

#### Features:
- Execute SELECT queries on any table
- Apply filters and limits
- Format results for easy reading
- Error handling and reporting

#### Functions:

##### `query_supabase(table_name: str, select_query: str = "*", filters: Optional[Dict[str, Any]] = None)`
- **Parameters:**
  - `table_name`: Name of the table to query
  - `select_query`: Fields to select (default: "*")
  - `filters`: Optional dictionary of filters
- **Returns:** Dict containing query results and metadata

##### `list_tables()`
- Lists all available tables in the database
- **Returns:** Dict containing list of found tables

### 2. Database Migration Tool (`db_migrator.py`)

Tool for managing database schema changes.

```python
from db_migrator import update_assets_table

# Example usage
result = update_assets_table()
```

#### Features:
- Schema validation
- Column addition
- Safe schema updates
- Error handling

#### Functions:

##### `update_assets_table()`
- Updates the assets table schema
- Checks for existing columns
- Adds missing columns safely
- **Returns:** Dict containing success status and messages

## Usage Guidelines

### 1. General Query Guidelines
```python
# Count records
python -c "import tools; tools.query_supabase('assets', 'count')"

# Get specific fields
python -c "import tools; tools.query_supabase('assets', 'id,name,type_id')"

# Apply filters
python -c "import tools; tools.query_supabase('assets', '*', {'limit': 10})"
```

### 2. Migration Guidelines
```python
# Run migration tool
python tools/db_migrator.py

# Check migration status
python -c "import tools; tools.query_supabase('assets', 'site_id', {'limit': 1})"
```

## Best Practices

1. **Error Handling**
   - Always check the `success` field in returned dictionaries
   - Log errors appropriately
   - Handle database connection issues gracefully

2. **Performance**
   - Use specific field selection instead of "*" when possible
   - Apply appropriate limits to queries
   - Use indexes for frequently queried fields

3. **Security**
   - Never expose database credentials in code
   - Use environment variables for sensitive data
   - Follow the principle of least privilege

4. **Maintenance**
   - Keep tools updated with schema changes
   - Document new functions and parameters
   - Test tools after database modifications

## Tool Development

When creating new database tools:

1. Follow the existing pattern in `tools.py`
2. Add proper error handling
3. Include documentation
4. Add type hints
5. Test thoroughly before deployment

## Future Improvements

1. Add batch operation support
2. Implement transaction management
3. Add data validation tools
4. Create backup/restore utilities
5. Add performance monitoring 