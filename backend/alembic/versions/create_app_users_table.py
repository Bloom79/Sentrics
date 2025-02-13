"""create app users table

Revision ID: 2024021501
Revises: 2024021402
Create Date: 2024-02-15 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '2024021501'
down_revision: Union[str, None] = '2024021402'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Create app_users table
    op.create_table(
        'app_users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_app_users_email'), 'app_users', ['email'], unique=True)
    op.create_index(op.f('ix_app_users_id'), 'app_users', ['id'], unique=False)
    op.create_index(op.f('ix_app_users_username'), 'app_users', ['username'], unique=True)

def downgrade() -> None:
    op.drop_index(op.f('ix_app_users_username'), table_name='app_users')
    op.drop_index(op.f('ix_app_users_id'), table_name='app_users')
    op.drop_index(op.f('ix_app_users_email'), table_name='app_users')
    op.drop_table('app_users') 