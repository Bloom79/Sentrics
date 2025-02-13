"""add community user association

Revision ID: add_community_user_association
Revises: 
Create Date: 2024-02-07 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector

# revision identifiers, used by Alembic.
revision = 'add_community_user_association'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Get database connection and inspector
    connection = op.get_bind()
    inspector = Inspector.from_engine(connection)
    
    # Check if community_users table exists
    if 'community_users' not in inspector.get_table_names():
        # Create community_users table
        op.create_table(
            'community_users',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('email', sa.String(), nullable=False),
            sa.Column('full_name', sa.String(), nullable=False),
            sa.Column('role', sa.String(), nullable=False),
            sa.Column('status', sa.String(), nullable=False),
            sa.Column('organization_id', sa.Integer(), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('email')
        )
        op.create_index(op.f('ix_community_users_email'), 'community_users', ['email'], unique=True)
        op.create_index(op.f('ix_community_users_id'), 'community_users', ['id'], unique=False)

    # Check if community_user_id column exists in users table
    has_column = False
    for column in inspector.get_columns('users'):
        if column['name'] == 'community_user_id':
            has_column = True
            break
    
    if not has_column:
        # Add community_user_id to users table
        op.add_column('users', sa.Column('community_user_id', sa.Integer(), nullable=True))
        op.create_foreign_key(
            'fk_users_community_user',
            'users', 'community_users',
            ['community_user_id'], ['id'],
            ondelete='SET NULL'
        )

def downgrade():
    # Remove foreign key and column from users table
    try:
        op.drop_constraint('fk_users_community_user', 'users', type_='foreignkey')
        op.drop_column('users', 'community_user_id')
    except Exception as e:
        print(f"Error dropping constraints/columns from users table: {e}")

    # Drop community_users table
    try:
        op.drop_index(op.f('ix_community_users_id'), table_name='community_users')
        op.drop_index(op.f('ix_community_users_email'), table_name='community_users')
        op.drop_table('community_users')
    except Exception as e:
        print(f"Error dropping community_users table: {e}") 