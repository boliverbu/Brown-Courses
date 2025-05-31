#!/bin/bash

echo "📦 Setting up virtual environment and dependencies..."

# Step 1: Create virtual environment (if not already created)
if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo "Virtual environment created in ./venv"
else
  echo "ℹVirtual environment already exists."
fi

# Step 2: Activate the venv and install dependencies
source ./venv/bin/activate

# Step 3: Install dependencies from requirements.txt
if [ -f "requirements.txt" ]; then
  pip install --upgrade pip
  pip install -r requirements.txt
  echo "Dependencies installed."
else
  echo "⚠️ No requirements.txt found. Creating one with FastAPI and Uvicorn."
  pip install fastapi uvicorn
  pip freeze > requirements.txt
  echo "Created requirements.txt with FastAPI and Uvicorn."
fi

# Step 4: Done
echo "Setup complete. To activate your environment later, run:"
echo "    source venv/bin/activate"
