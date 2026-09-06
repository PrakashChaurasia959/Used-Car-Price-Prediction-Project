"""
Launcher that adds the venv site-packages to sys.path before starting uvicorn.
Usage:  python run.py
"""
import sys
import os

# Add venv site-packages so packages are available when running system Python
BASE = os.path.dirname(os.path.abspath(__file__))
VENV_SP = os.path.join(BASE, "..", ".venv", "Lib", "site-packages")
if os.path.isdir(VENV_SP) and VENV_SP not in sys.path:
    sys.path.insert(0, VENV_SP)

# Add backend dir to path so `app` and `ml` packages resolve
if BASE not in sys.path:
    sys.path.insert(0, BASE)

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
