import sys
import os

# Add project root to Python path so 'backend' package is importable
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root not in sys.path:
    sys.path.insert(0, root)

from backend.main import app
