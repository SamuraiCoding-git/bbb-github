from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.repo.balls import BallsRepo
from infrastructure.database.repo.beta import BetaRepo
from infrastructure.database.repo.users import UserRepo


@dataclass
class RequestsRepo:
    """
    Repository for handling database operations. This class holds all the repositories for the database models.

    You can add more repositories as properties to this class, so they will be easily accessible.
    """

    session: AsyncSession

    @property
    def users(self) -> UserRepo:
        """
        The User repository sessions are required to manage user operations.
        """
        return UserRepo(self.session)

    @property
    def beta_game(self) -> BetaRepo:
        return BetaRepo(self.session)

    @property
    async def balls(self) -> BallsRepo:
        return BallsRepo(self.session)
