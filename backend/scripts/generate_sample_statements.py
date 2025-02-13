import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

from app.database import SessionLocal
from app.models.billing import BillingStatement
from app.models.cer import CommunityMember, EnergyCommunity
from datetime import datetime, timedelta
import random

db = SessionLocal()

try:
    # Get all active community members
    members = db.query(CommunityMember).filter(CommunityMember.status == 'active').all()
    
    if not members:
        print("No active community members found. Please add members first.")
        sys.exit(1)
    
    # Generate statements for the last 3 months
    current_date = datetime.utcnow()
    for month in range(3):
        period = (current_date - timedelta(days=30 * month)).strftime('%Y-%m')
        
        for member in members:
            # Generate random but realistic values
            energy_shared = random.uniform(100, 1000)  # kWh
            base_rate = 0.15  # €/kWh
            regional_bonus = 0.02
            capacity_bonus = 0.01
            
            # Calculate financial values
            total_incentive = energy_shared * (base_rate + regional_bonus + capacity_bonus)
            grid_fees = energy_shared * 0.03  # 3 cents per kWh for grid fees
            community_fund = total_incentive * 0.20  # 20% goes to community fund
            taxes = total_incentive * 0.22  # 22% VAT
            net_payment = total_incentive - grid_fees - community_fund - taxes
            
            # Create billing statement
            statement = BillingStatement(
                member_id=member.id,
                community_id=member.community_id,
                period=period,
                energy_shared=energy_shared,
                base_rate=base_rate,
                regional_bonus=regional_bonus,
                capacity_bonus=capacity_bonus,
                total_incentive=total_incentive,
                grid_fees=grid_fees,
                community_fund=community_fund,
                taxes=taxes,
                net_payment=net_payment,
                status='pending',
                created_at=datetime.utcnow() - timedelta(days=30 * month),
                metadata={
                    'peak_hours_percentage': random.uniform(0.3, 0.5),
                    'carbon_offset': energy_shared * 0.4  # kg of CO2 saved
                }
            )
            db.add(statement)
    
    db.commit()
    print("Successfully generated sample billing statements")

except Exception as e:
    print(f"Error: {str(e)}")
    db.rollback()
finally:
    db.close() 