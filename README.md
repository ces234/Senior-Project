# Senior-Project

## Installations
Ensure that you have the following software installed:
- Python 3.8 +
- Node.js
- Git
- A virtual environment tool (venv)

## Setup Instructions
1. Clone the repository
run the command: git clone https://github.com/ces234/Senior-Project.git
Navigate to the project directory: cd Senior-Project

2. Backend Setup (Django)
Use a virtual environment for Python dependencies.
If you already see a backend/env/ folder, delete it and run the following command to create a virtual environment compliant to your OS:

python -m venv env


Activate the virtual environment:
    On Windows:
    .\env\Scripts\Activate.ps1

    On macOS/Linux:
    source env/bin/activate

Install Python Dependencies: run the following commands (we don't have this yet so skip this step but should add it later)

pip install -r backend/requirements.txt

Within the activated virtual environment run:
    pip install django
    pip install djongo
    pip install pytz


Run Django Migrations: set up the database and apply Django migrations
python backend/manage.py migrate

Start the backend Server:
python backend/manage.py runserver

3. Frontend Setup (React)
Navigate to the frontend directory: 
cd frontend

Install Node.js Dependencies
npm install

Start the React Development Server
npm start

Backend should be running on port 8000 and frontend on port 3000. Open http://127.0.0.1:8000/ and http://localhost:3000/ in your browser. 


IF THE DB POPULATION STOPS MIDWAY THROUGH: 
if(topicHtml != "Tacos" and topicHtml != "Tailgating Recipes" and topicHtml != "Tamales" and topicHtml != "Tapas Recipes" and topicHtml != "Tater Tot Casserole" and topicHtml != "Tempeh Recipes" and .....)

^^ADD THIS IF STATEMENT AT LINE 185 
(replace with headings you haven't populated yet)