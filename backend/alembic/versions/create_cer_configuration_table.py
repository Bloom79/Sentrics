"""create_cer_configuration_table

Revision ID: 01_create_cer_configuration
Revises: 
Create Date: 2024-02-07 09:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '01_create_cer_configuration'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'cer_configuration',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('type', sa.String(), nullable=False),  # residential, commercial, industrial
        sa.Column('version', sa.String(), nullable=False),
        sa.Column('status', sa.String(), server_default='draft', nullable=False),  # draft, active, inactive
        
        # Energy related fields
        sa.Column('energy_source', sa.String(), nullable=False),  # solar, wind, etc.
        sa.Column('capacity', sa.Float(), nullable=True),  # in kW
        
        # Location fields
        sa.Column('address', sa.String(), nullable=False),
        sa.Column('location', sa.JSON(), nullable=False),
        sa.Column('region', sa.String(), nullable=False),
        sa.Column('primary_substation_id', sa.String(), nullable=False),
        
        # Configuration settings
        sa.Column('legal_type', sa.String(), nullable=False),
        sa.Column('features', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('restrictions', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('technical_info', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('simulation_settings', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('billing_settings', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('member_limits', sa.JSON(), nullable=False, server_default='{}'),
        
        # Metadata
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        
        sa.PrimaryKeyConstraint('id'),
        sa.Index('ix_cer_configuration_id', 'id')
    )


def downgrade() -> None:
    op.drop_index('ix_cer_configuration_id')
    op.drop_table('cer_configuration') 