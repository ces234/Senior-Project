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
Use a virtual environment for Python dependencies. Run the commands:

python -m venv env

Activate the virtual environment:
On Windows:
env\Scripts\activate
on macOS/Linux:
source env/bin/activate

Install Python Dependencies: run the following commands

pip install -r backend/requirements.txt

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

Backend should be running on port 8000 and frontend on port 3000. open http://localhost:3000/ in your browser. 