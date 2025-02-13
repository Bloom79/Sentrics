import random
import string
from typing import Dict

def random_lower_string(length: int = 32) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=length))

def random_email() -> str:
    return f"{random_lower_string()}@{random_lower_string()}.com"

def random_dict() -> Dict:
    return {random_lower_string(5): random_lower_string(5) for _ in range(3)} 