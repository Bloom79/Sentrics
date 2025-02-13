# Application Users Credentials

This document contains the credentials and details for all application users. **Keep this document secure and do not share it publicly.**

## Global Administrator

The superuser has full access to all features and tenants in the system.

```
Email: admin@sentrics.com
Username: admin
Password: Admin123!
Role: superuser
Permissions: ["*"] (all permissions)
```

**Capabilities:**
- Access and manage all tenants
- Create new tenants and tenant administrators
- Full system configuration access
- User management across all tenants
- Access to all features and functionalities

## Tenant 1 Organization

### Tenant Administrator

The tenant administrator has full access to manage their specific tenant.

```
Email: tenant1.admin@sentrics.com
Username: tenant1_admin
Password: Tenant123!
Role: admin
Tenant ID: 1
Organization: Tenant 1 Organization
Permissions: ["manage_users", "manage_configurations", "view_all"]
```

**Capabilities:**
- Manage users within their tenant
- Configure tenant settings
- View all tenant data
- Manage tenant configurations
- Cannot access other tenants' data

### Regular User

Basic user with standard permissions within their tenant.

```
Email: user1@tenant1.com
Username: tenant1_user1
Password: User123!
Role: user
Tenant ID: 1
Organization: Tenant 1 Organization
Permissions: ["view_own", "edit_own"]
```

**Capabilities:**
- View own profile and data
- Edit own information
- Access basic features
- Cannot manage other users
- Cannot access administrative functions

## Permission Levels

### Role-Based Permissions

1. **Superuser**
   - All permissions (`"*"`)
   - Cross-tenant access
   - System administration

2. **Tenant Admin**
   - `manage_users`: Create, edit, and deactivate tenant users
   - `manage_configurations`: Manage tenant configurations
   - `view_all`: View all data within the tenant

3. **Regular User**
   - `view_own`: View own profile and data
   - `edit_own`: Edit own information

4. **Viewer** (Template for future use)
   - `view_all`: View all tenant data
   - No edit permissions

5. **Manager** (Template for future use)
   - `view_all`: View all tenant data
   - `manage_users`: User management capabilities

## Security Notes

1. **Password Policy**
   - Minimum 8 characters
   - Must contain uppercase and lowercase letters
   - Must contain at least one number
   - Must contain at least one special character

2. **Access Control**
   - All users are bound by tenant isolation
   - Cross-tenant access is only available to superusers
   - Email and username uniqueness is enforced per tenant

3. **Session Management**
   - JWT-based authentication
   - Token expiration configured in settings
   - Last login timestamp is tracked

## Adding New Users

New users can be added using the command-line tool:

```bash
# For superusers
python -m app.tools.init_app_users create-superuser

# For tenant admins
python -m app.tools.init_app_users create-tenant-admin

# For regular users
python -m app.tools.init_app_users create-tenant-user
```

## Tenant Structure

Each tenant is isolated and has its own:
- User base
- Configurations
- Data access controls
- Organization settings

## Emergency Access

In case of emergency access requirements:
1. Use the superuser account
2. Contact system administrator
3. Check logs for access patterns

---

**IMPORTANT**: Keep this document secure and share credentials only with authorized personnel. Regularly update passwords and audit access patterns. 