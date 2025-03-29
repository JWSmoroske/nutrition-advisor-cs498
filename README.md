# nutrition-advisor-cs498
Nutrition advising web application for CS498 project.

Current/Potential Directory Structure:
nutrition-app/
├── frontend/                  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│
├── backend/                 # Node.js/Express Backend
│   ├── server.js (currently just has the openai stuff)
│   ├── package.json
│   ├── .env.example
│
├── scripts/                # Python Nutrition Analysis
│   ├── nutrition_analysis/
│   │   ├── processing/    # Image processing scripts
│   │   ├── main.py        # Main script entry point
│   │   └── utils.py       # Helper functions
│   ├── requirements.txt
│   
│
├── database/               # MySQL Database
│   ├── migrations/        # Database migration scripts
│   ├── seeds/             # Seed data (if needed)
│   └── schema.sql         # Initial database schema
│
├── .gitignore
└── README.md              # Main project documentation


SETUP
Install Node.js-
        https://www.geeksforgeeks.org/install-node-js-on-windows/
For client (frontend):
    Run npm install-
        Installs all the necessary packages to run
    Run npm start-
        Locally runs the frontend on port 3000

For server (backend):
    Run npm install-
        Installs all the necessary packages to run
    Create a .env file by doing "cp env.example .env"
    Change the API key value with the actualy value of the OpenAI API key in the .env file
    Run npm start-
        Locally runs the backend on port 5000
    
Frontend
    -Uses Node.js (I installed with v10.2.3)
    -React.js
    -Used react bootstrap to help with some designing components
Backend
    -Uses Node.js (I installed with v10.2.3)
    -Express.js

NOTES
    - We are using a monorepo structure, an alternative could be separating the parts (frontend, backend, etc.) into microservices and their own repositories.

