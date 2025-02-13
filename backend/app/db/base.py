# Import all the models, so that Base has them before being imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.configuration import Configuration  # noqa
from app.models.member import Member  # noqa
from app.models.user import User  # noqa

# Import all models here that are needed by SQLAlchemy
# This avoids circular dependencies while still making sure all models are registered 