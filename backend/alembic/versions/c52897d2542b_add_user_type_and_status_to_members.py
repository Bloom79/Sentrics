"""add_user_type_and_status_to_members

Revision ID: c52897d2542b
Revises: 4f1c4c385feb
Create Date: 2025-02-13 10:44:14.069545

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c52897d2542b'
down_revision: Union[str, None] = '4f1c4c385feb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create the enum types if they don't exist
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    
    # Check if enum types exist
    existing_enums = connection.execute(
        sa.text("SELECT typname FROM pg_type WHERE typname IN ('usertype', 'memberstatus')")
    ).fetchall()
    existing_enum_names = [enum[0] for enum in existing_enums]
    
    if 'usertype' not in existing_enum_names:
        usertype = sa.Enum('REAL', 'SIMULATED', name='usertype')
        usertype.create(connection)
    
    if 'memberstatus' not in existing_enum_names:
        memberstatus = sa.Enum('ACTIVE', 'INACTIVE', 'PENDING', name='memberstatus')
        memberstatus.create(connection)
    
    # Add columns as nullable first
    op.add_column('members', sa.Column('user_type', sa.Enum('REAL', 'SIMULATED', name='usertype'), nullable=True))
    op.add_column('members', sa.Column('status', sa.Enum('ACTIVE', 'INACTIVE', 'PENDING', name='memberstatus'), nullable=True))
    
    # Set default values for existing records
    op.execute(sa.text("UPDATE members SET user_type = 'REAL' WHERE user_type IS NULL"))
    op.execute(sa.text("UPDATE members SET status = 'ACTIVE' WHERE status IS NULL"))
    
    # Now make the columns non-nullable
    op.alter_column('members', 'user_type', nullable=False)
    op.alter_column('members', 'status', nullable=False)


def downgrade() -> None:
    # Drop columns first
    op.drop_column('members', 'status')
    op.drop_column('members', 'user_type')
    
    # Drop enum types with CASCADE
    op.execute(sa.text('DROP TYPE IF EXISTS memberstatus CASCADE'))
    op.execute(sa.text('DROP TYPE IF EXISTS usertype CASCADE'))
