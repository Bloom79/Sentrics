"""update_user_type_columns

Revision ID: 4f1c4c385feb
Revises: 640c63f6a294
Create Date: 2025-02-07 15:12:15.455031

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '4f1c4c385feb'
down_revision: Union[str, None] = '640c63f6a294'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create new enum type
    membertype = postgresql.ENUM('CONSUMER', 'PRODUCER', 'PROSUMER', name='membertype')
    membertype.create(op.get_bind())

    # Add user_type column
    op.add_column('users', sa.Column('user_type', sa.Enum('REAL', 'SIMULATED', name='usertype'), nullable=True))
    
    # Update existing rows to set user_type based on current type
    op.execute("UPDATE users SET user_type = type::text::usertype")
    
    # Add temporary column for type conversion
    op.add_column('users', sa.Column('type_new', membertype, nullable=True))
    
    # Set default values for type_new
    op.execute("UPDATE users SET type_new = 'CONSUMER'::membertype")
    
    # Drop old type column and rename new one
    op.drop_column('users', 'type')
    op.alter_column('users', 'type_new', new_column_name='type')
    
    # Make columns non-nullable
    op.alter_column('users', 'type', nullable=False)
    op.alter_column('users', 'user_type', nullable=False)


def downgrade() -> None:
    # Create temporary column
    op.add_column('users', sa.Column('type_old', sa.Enum('REAL', 'SIMULATED', name='usertype'), nullable=True))
    
    # Copy user_type to type_old
    op.execute("UPDATE users SET type_old = user_type")
    
    # Drop new columns
    op.drop_column('users', 'type')
    op.drop_column('users', 'user_type')
    
    # Rename type_old back to type
    op.alter_column('users', 'type_old', new_column_name='type')
    op.alter_column('users', 'type', nullable=False)
    
    # Drop membertype enum
    op.execute('DROP TYPE membertype')
