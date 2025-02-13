import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

from app.database import SessionLocal
from app.models.cer import EnergyCommunity, CommunityMember, CommunityAsset
from datetime import datetime
from geoalchemy2.shape import from_shape
from shapely.geometry import Polygon, Point
import random

db = SessionLocal()

try:
    # Create a sample community in Lombardia
    community = EnergyCommunity(
        name="Comunità Energetica Milano Sud",
        legal_type="cooperative",
        status="active",
        primary_substation_id="PS001",
        boundary=from_shape(Polygon([(9.1, 45.4), (9.2, 45.4), (9.2, 45.5), (9.1, 45.5), (9.1, 45.4)])),
        total_capacity=150.0,
        created_at=datetime.utcnow(),
        extra_data={
            "address": "Via Roma 123, Milano",
            "contact_email": "info@cemilano.it",
            "website": "https://cemilano.it"
        }
    )
    db.add(community)
    db.flush()  # Get the community ID

    # Create sample members
    members_data = [
        {
            "member_type": "PRODUCER",
            "pod_id": "IT001E12345",
            "smart_meter_id": "SM001",
            "status": "active",
            "location": from_shape(Point(9.15, 45.45)),
            "region": "Lombardia",
            "bank_account": "IT60X0542811101000000123456",
            "payment_method": "bank_transfer",
            "is_low_income": False,
            "tax_id": "RSSMRA80A01F205X",
            "billing_address": {
                "street": "Via Vittorio Veneto 1",
                "city": "Milano",
                "postal_code": "20121",
                "country": "Italy"
            }
        },
        {
            "member_type": "CONSUMER",
            "pod_id": "IT001E12346",
            "smart_meter_id": "SM002",
            "status": "active",
            "location": from_shape(Point(9.16, 45.46)),
            "region": "Lombardia",
            "bank_account": "IT60X0542811101000000123457",
            "payment_method": "bank_transfer",
            "is_low_income": True,
            "tax_id": "VRDGPP75B02F205Y",
            "billing_address": {
                "street": "Via Dante 2",
                "city": "Milano",
                "postal_code": "20121",
                "country": "Italy"
            }
        },
        {
            "member_type": "PROSUMER",
            "pod_id": "IT001E12347",
            "smart_meter_id": "SM003",
            "status": "active",
            "location": from_shape(Point(9.17, 45.47)),
            "region": "Lombardia",
            "bank_account": "IT60X0542811101000000123458",
            "payment_method": "bank_transfer",
            "is_low_income": False,
            "tax_id": "BNCNNA82C43F205Z",
            "billing_address": {
                "street": "Via Montenapoleone 3",
                "city": "Milano",
                "postal_code": "20121",
                "country": "Italy"
            }
        }
    ]

    for member_data in members_data:
        member = CommunityMember(
            community_id=community.id,
            **member_data
        )
        db.add(member)
        db.flush()

        # Add assets for producers and prosumers
        if member.member_type in ["PRODUCER", "PROSUMER"]:
            asset = CommunityAsset(
                community_id=community.id,
                member_id=member.id,
                asset_type="SOLAR",
                capacity=random.uniform(5, 20),
                installation_date=datetime.utcnow(),
                status="active",
                gse_registration_id=f"GSE{random.randint(1000, 9999)}",
                extra_data={
                    "panel_type": "monocrystalline",
                    "inverter_model": "SolarEdge SE5000H",
                    "orientation": "south",
                    "tilt_angle": 30
                }
            )
            db.add(asset)

    db.commit()
    print("Successfully created sample community with members and assets")

except Exception as e:
    print(f"Error: {str(e)}")
    db.rollback()
finally:
    db.close() 