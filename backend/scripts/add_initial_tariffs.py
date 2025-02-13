import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

from app.database import SessionLocal
from app.models.billing import TariffRate
from datetime import datetime, timedelta

db = SessionLocal()

# Regional tariff configurations based on GSE's 20-year incentive tables
# and ARERA's latest deliberations (585/2024)
tariffs = [
    # Northern Italy
    {
        'region': 'Lombardia',
        'base_rate': 0.10,  # Lower base rate due to established grid infrastructure
        'regional_bonus': 0.02,  # Standard northern bonus
        'capacity_bonus_small': 0.05,  # Enhanced for <10kW installations
        'capacity_bonus_medium': 0.03,  # 10-50kW installations
        'capacity_bonus_large': 0.02,  # >50kW installations
        'social_bonus': 0.03,  # Support for vulnerable households
        'valid_from': datetime.utcnow(),
        'valid_to': datetime.utcnow() + timedelta(days=365)  # 1-year validity
    },
    {
        'region': 'Piemonte',
        'base_rate': 0.105,  # Slightly higher for mountain areas
        'regional_bonus': 0.025,
        'capacity_bonus_small': 0.055,  # Enhanced for alpine regions
        'capacity_bonus_medium': 0.035,
        'capacity_bonus_large': 0.025,
        'social_bonus': 0.035,
        'valid_from': datetime.utcnow(),
        'valid_to': datetime.utcnow() + timedelta(days=365)
    },
    # Central Italy
    {
        'region': 'Lazio',
        'base_rate': 0.11,
        'regional_bonus': 0.03,
        'capacity_bonus_small': 0.045,
        'capacity_bonus_medium': 0.03,
        'capacity_bonus_large': 0.02,
        'social_bonus': 0.04,
        'valid_from': datetime.utcnow(),
        'valid_to': datetime.utcnow() + timedelta(days=365)
    },
    # Southern Italy (higher incentives as per Decree 199/2021)
    {
        'region': 'Puglia',
        'base_rate': 0.12,  # Higher base rate for solar-rich regions
        'regional_bonus': 0.05,  # Enhanced southern bonus
        'capacity_bonus_small': 0.06,
        'capacity_bonus_medium': 0.04,
        'capacity_bonus_large': 0.03,
        'social_bonus': 0.045,
        'valid_from': datetime.utcnow(),
        'valid_to': datetime.utcnow() + timedelta(days=365)
    },
    # Islands (highest incentives due to grid costs)
    {
        'region': 'Sicilia',
        'base_rate': 0.15,  # Highest base rate for island regions
        'regional_bonus': 0.06,  # Enhanced island bonus
        'capacity_bonus_small': 0.07,
        'capacity_bonus_medium': 0.05,
        'capacity_bonus_large': 0.04,
        'social_bonus': 0.05,
        'valid_from': datetime.utcnow(),
        'valid_to': datetime.utcnow() + timedelta(days=365)
    },
    {
        'region': 'Sardegna',
        'base_rate': 0.15,  # Aligned with Sardinia 2025 program
        'regional_bonus': 0.065,  # Additional bonus for island sustainability
        'capacity_bonus_small': 0.075,
        'capacity_bonus_medium': 0.055,
        'capacity_bonus_large': 0.045,
        'social_bonus': 0.055,
        'valid_from': datetime.utcnow(),
        'valid_to': datetime.utcnow() + timedelta(days=365)
    }
]

try:
    # Clear existing tariffs to avoid duplicates
    db.query(TariffRate).delete()

    # Add new tariffs
    for tariff in tariffs:
        db_tariff = TariffRate(**tariff)
        db.add(db_tariff)

    db.commit()
    print(f"Added {len(tariffs)} regional tariff configurations")
except Exception as e:
    print(f"Error: {str(e)}")
    db.rollback()
finally:
    db.close() 