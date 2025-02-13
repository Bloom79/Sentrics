"""modify app users for multitenancy

Revision ID: 2024021502
Revises: 2024021501
Create Date: 2024-02-15 11:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2024021502'
down_revision: Union[str, None] = '2024021501'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Create a connection to check if indexes exist
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    indexes = [idx['name'] for idx in inspector.get_indexes('app_users')]
    
    # Drop existing indexes if they exist
    if 'ix_app_users_email' in indexes:
        op.drop_index('ix_app_users_email', table_name='app_users')
    if 'ix_app_users_username' in indexes:
        op.drop_index('ix_app_users_username', table_name='app_users')
    
    # Add new columns if they don't exist
    columns = [col['name'] for col in inspector.get_columns('app_users')]
    
    if 'tenant_id' not in columns:
        op.add_column('app_users', sa.Column('tenant_id', sa.Integer(), nullable=True))
    if 'organization_id' not in columns:
        op.add_column('app_users', sa.Column('organization_id', sa.Integer(), nullable=True))
    if 'organization_name' not in columns:
        op.add_column('app_users', sa.Column('organization_name', sa.String(), nullable=True))
    if 'role' not in columns:
        op.add_column('app_users', sa.Column('role', sa.String(), nullable=False, server_default='user'))
    if 'permissions' not in columns:
        op.add_column('app_users', sa.Column('permissions', postgresql.JSONB(), nullable=False, server_default='{}'))
    
    # Create new indexes
    if 'ix_app_users_tenant_id' not in indexes:
        op.create_index('ix_app_users_tenant_id', 'app_users', ['tenant_id'])
    if 'ix_app_users_organization_id' not in indexes:
        op.create_index('ix_app_users_organization_id', 'app_users', ['organization_id'])
    if 'ix_app_users_tenant_email_unique' not in indexes:
        op.create_index(
            'ix_app_users_tenant_email_unique',
            'app_users',
            ['tenant_id', 'email'],
            unique=True,
            postgresql_where=sa.text("tenant_id IS NOT NULL")
        )
    if 'ix_app_users_tenant_username_unique' not in indexes:
        op.create_index(
            'ix_app_users_tenant_username_unique',
            'app_users',
            ['tenant_id', 'username'],
            unique=True,
            postgresql_where=sa.text("tenant_id IS NOT NULL")
        )
    
    # Create new non-unique indexes for email and username
    if 'ix_app_users_email' not in indexes:
        op.create_index('ix_app_users_email', 'app_users', ['email'])
    if 'ix_app_users_username' not in indexes:
        op.create_index('ix_app_users_username', 'app_users', ['username'])

def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_app_users_tenant_username_unique', table_name='app_users')
    op.drop_index('ix_app_users_tenant_email_unique', table_name='app_users')
    op.drop_index('ix_app_users_tenant_id', table_name='app_users')
    op.drop_index('ix_app_users_organization_id', table_name='app_users')
    op.drop_index('ix_app_users_email', table_name='app_users')
    op.drop_index('ix_app_users_username', table_name='app_users')
    
    # Drop columns
    op.drop_column('app_users', 'tenant_id')
    op.drop_column('app_users', 'organization_id')
    op.drop_column('app_users', 'organization_name')
    op.drop_column('app_users', 'role')
    op.drop_column('app_users', 'permissions') 