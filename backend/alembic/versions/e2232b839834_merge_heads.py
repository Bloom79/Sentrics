"""merge heads

Revision ID: e2232b839834
Revises: add_community_user_association, 2024021502
Create Date: 2025-02-13 15:03:06.862712

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e2232b839834'
down_revision: Union[str, None] = ('add_community_user_association', '2024021502')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
