"""create participation requests table

Revision ID: 2024021402
Revises: c52897d2542b
Create Date: 2024-02-14 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '2024021402'
down_revision: Union[str, None] = 'c52897d2542b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Create participation_requests table
    op.create_table(
        'participation_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('configuration_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='pending'),
        sa.Column('request_date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('processed_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('notes', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['configuration_id'], ['cer_configuration.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_participation_requests_id'), 'participation_requests', ['id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_participation_requests_id'), table_name='participation_requests')
    op.drop_table('participation_requests') 